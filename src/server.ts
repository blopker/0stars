import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { getRequestIP } from "vinxi/server";
import { addRating, db, getBestReviews, rateLimitTest } from "~/../db/db";
import { places, ratings, reviews } from "~/../db/schema";
import { getUser } from "~/lib/session";

export interface ReviewUI {
  id: number;
  reviewText: string;
  placeName: string | null;
  placeCountry: string | null | undefined;
  placeCity: string | null | undefined;
  reviewerName: string | null | undefined;
  reviewerProfileImage: string | null | undefined;
  googleMapsUrl: string | null | undefined;
}

export async function getNextReview(): Promise<ReviewUI | null> {
  // get the next review from the database where user has not rated it yet, otherwise get a random one.
  const session = await getUser();
  const reviewID = await db
    .select({
      reviewId: reviews.id,
    })
    .from(reviews)
    .leftJoin(
      ratings,
      and(eq(reviews.id, ratings.reviewid), eq(ratings.userid, session.id!))
    )
    .where(isNull(ratings.id)) // Ensures the user hasn't rated it
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!reviewID || reviewID.length === 0) {
    throw new Error(
      "No more reviews. Please try again later. In the meantime, check out the top reviews."
    );
  }

  const review = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewID[0].reviewId))
    .limit(1);
  const place = await db
    .select()
    .from(places)
    .where(eq(places.id, review[0].placeid))
    .limit(1);

  return {
    id: review[0].id,
    reviewText: review[0].reviewtext,
    placeName: place[0].name,
    placeCountry: place[0].country,
    placeCity: place[0].city,
    reviewerName: review[0].reviewername,
    reviewerProfileImage: review[0].profileimage,
    googleMapsUrl: place[0].googlemapsurl,
  };
}

export async function getPlace(id: number) {
  const place = await db
    .select()
    .from(places)
    .where(eq(places.id, id))
    .limit(1);
  return place[0];
}

export async function postRating(rating: {
  reviewId: number;
  rating: boolean;
}) {
  const session = await getUser();
  if (!session.id) {
    return { status: 401, message: "Unauthorized" };
  }
  const ip = getRequestIP();
  const pass = await rateLimitTest(ip);
  if (!pass) {
    console.log(`Rate limit exceeded: ${session.id}`);
    return { status: 429, message: "Rate limit exceeded" };
  }

  await addRating({
    userId: session.id!,
    reviewId: rating.reviewId,
    rating: rating.rating,
    ipAddress: ip!,
  });
}

export async function topReviews(): Promise<ReviewUI[]> {
  const _reviews = await getBestReviews();
  const placeIds = _reviews
    .map((review) => review.placeId)
    .filter((id): id is number => id !== null);
  const reviewIds = _reviews
    .map((review) => review.reviewId)
    .filter((id): id is number => id !== null);
  const _places = await db
    .select()
    .from(places)
    .where(inArray(places.id, placeIds));
  const fullReviews = await db
    .select()
    .from(reviews)
    .where(inArray(reviews.id, reviewIds));
  return _reviews.map((review) => {
    const place = _places.find((p) => p.id === review.placeId);
    const fullReview = fullReviews.find((r) => r.id === review.reviewId);
    return {
      id: review.reviewId,
      reviewText: review.reviewText,
      placeName: review.placeName,
      placeCountry: place?.country,
      placeCity: place?.city,
      reviewerName: fullReview?.reviewername,
      reviewerProfileImage: fullReview?.profileimage,
      googleMapsUrl: place?.googlemapsurl,
    };
  });
}
