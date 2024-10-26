import { Database } from "bun:sqlite";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { places, ratings, reviews } from "./schema";

const _db = new Database(process.env.DB_LOCATION!, { strict: true });
export const db = drizzle({ client: _db });

export interface Review {
  name: string;
  profile_picture: string;
  rating: number;
  description: string;
  when: string;
  images: string;
  cid: string;
  place_cid: string;
}

export interface Place {
  name: string;
  address: string;
  city: string;
  country: string;
  cid: string;
  googlemapsurl: string;
}

// const favoritesTable = `
// CREATE TABLE favorites (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     review_id INTEGER NOT NULL,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (review_id) REFERENCES reviews(id)
// ) STRICT;
// `;

// const indexes = [
//   "CREATE INDEX idx_ratings_ip_address_created_at ON ratings (ip_address, created_at);",
//   "CREATE INDEX idx_ratings_user_review ON ratings (user_id, review_id);",
//   "CREATE INDEX idx_favorites_user_review ON favorites (user_id, review_id);",
// ];

export async function addPlace(place: Place) {
  return await db.insert(places).values(place).onConflictDoNothing();
}

export async function addReview(review: Review) {
  const placeid = await db
    .select({
      id: places.id,
    })
    .from(places)
    .where(eq(places.cid, review.place_cid));
  return await db
    .insert(reviews)
    .values({
      placeid: placeid[0].id,
      reviewtext: review.description,
      rating: review.rating,
      reviewername: review.name,
      profileimage: review.profile_picture,
      cid: review.cid,
    })
    .onConflictDoNothing();
}

export async function addRating(rating: {
  userId: string;
  reviewId: number;
  rating: boolean;
  ipAddress: string;
}) {
  return await db
    .insert(ratings)
    .values({
      userid: rating.userId,
      reviewid: rating.reviewId,
      rating: rating.rating,
      ipaddress: rating.ipAddress,
    })
    .onConflictDoNothing();
}

export async function rateLimitTest(ipAddress: string | undefined) {
  const oneMinuteAgo = new Date(Date.now() - 60000);
  //   SELECT COUNT(*) AS row_count
  // FROM your_table_name
  // WHERE createdat >= (strftime('%s', 'now') - 1200)
  // AND ip_address = 'your_ip_address';
  if (ipAddress == null) {
    return false;
  }
  const result = await db
    .select({
      rowCount: sql<number>`COUNT(*)`,
    })
    .from(ratings)
    .where(
      and(
        gte(ratings.createdat, oneMinuteAgo),
        eq(ratings.ipaddress, ipAddress)
      )
    );
  // console.log(result);
  return result[0].rowCount < 20;
}

export async function getBestReviews() {
  // Query to get the top 10 best reviews
  const topReviews = await db
    .select({
      reviewId: reviews.id,
      reviewText: reviews.reviewtext,
      placeName: places.name,
      placeId: places.id,
      totalRating: sql`SUM(${ratings.rating})`.as("total_rating"),
      ratingCount: sql`COUNT(${ratings.id})`.as("rating_count"),
    })
    .from(reviews)
    .leftJoin(ratings, eq(reviews.id, ratings.reviewid))
    .leftJoin(places, eq(reviews.placeid, places.id))
    .groupBy(reviews.id)
    .orderBy(desc(sql`SUM(${ratings.rating})`), desc(sql`COUNT(${ratings.id})`))
    .limit(10);

  return topReviews;
}
