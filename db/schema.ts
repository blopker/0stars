import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// const usersTable = `
// CREATE TABLE users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     uuid TEXT UNIQUE NOT NULL,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP
// ) STRICT;
// `;
export const users = sqliteTable("users", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  sessionid: text({ mode: "text" }).unique().notNull(),
  createdat: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

// const placesTable = `
// CREATE TABLE places (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     address TEXT,
//     country TEXT,
//     city TEXT,
//     cid TEXT NOT NULL UNIQUE,
//     google_maps_url TEXT
// ) STRICT;
// `;

export const places = sqliteTable("places", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  address: text(),
  country: text(),
  city: text(),
  cid: text().unique().notNull(),
  googlemapsurl: text(),
  createdat: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

// const reviewsTable = `
// CREATE TABLE reviews (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     place_id INTEGER NOT NULL,
//     cid TEXT NOT NULL UNIQUE,
//     review_text TEXT NOT NULL,
//     rating INTEGER NOT NULL,
//     reviewer_name TEXT,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (place_id) REFERENCES places(id)
// ) STRICT;
// `;

export const reviews = sqliteTable("reviews", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  placeid: integer()
    .notNull()
    .references(() => places.id),
  reviewtext: text().notNull(),
  rating: integer().notNull(),
  profileimage: text(),
  reviewername: text(),
  // Review CID is the hash of the review_text
  cid: text().notNull().unique(),
  createdat: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

// const ratingsTable = `
// CREATE TABLE ratings (
//     rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     review_id INTEGER NOT NULL,
//     funny_rating INTEGER NOT NULL CHECK(funny_rating BETWEEN 1 AND 5),
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
//     ip_address TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (review_id) REFERENCES reviews(id)
// ) STRICT;
// `;

export const ratings = sqliteTable(
  "ratings",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userid: text().notNull(),
    reviewid: integer()
      .notNull()
      .references(() => reviews.id),
    // boolean
    rating: integer({ mode: "boolean" }).notNull(),
    createdat: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
    ipaddress: text().notNull(),
  },
  (table) => {
    return {
      ipAddressCreatedAt: index("idx_ratings_ip_address_created_at").on(
        table.ipaddress,
        table.createdat
      ),
      userReview: index("idx_ratings_user_review").on(
        table.userid,
        table.reviewid
      ),
    };
  }
);
