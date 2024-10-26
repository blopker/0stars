import parse from "csv-simple-parser";
import { addPlace, addReview, Place, Review } from "db/db";

interface ReviewCSV {
  Name: string;
  ProfilePicture: string;
  Rating: number;
  Description: string;
  When: string;
  Images: string;
}

// Load the CSV file into an array of objects
// const csvFile = "data/7b7dd7d5-379a-4a29-a825-96c26e50d631.csv";

type Rec = {
  input_id: string;
  link: string;
  title: string;
  category: string;
  address: string;
  open_hours: string;
  popular_times: string;
  website: string;
  phone: string;
  plus_code: string;
  review_count: string;
  review_rating: string;
  reviews_per_rating: string;
  latitude: number;
  longitude: number;
  cid: string;
  status: string;
  descriptions: string;
  reviews_link: string;
  thumbnail: string;
  timezone: string;
  price_range: string;
  data_id: string;
  images: string;
  reservations: string;
  order_online: string;
  menu: string;
  owner: string;
  complete_address: string;
  about: string;
  user_reviews: string;
  emails: string;
};

async function parseCSV(csvFile: string) {
  const file = Bun.file(csvFile);
  const csv = parse(await file.text(), { header: true }) as Rec[];
  const reviews_parsed: Review[] = [];
  const places: Map<string, Place> = new Map();
  for (const row of csv) {
    if (!row.user_reviews) {
      continue;
    }
    const reviews = JSON.parse(row.user_reviews) as ReviewCSV[];
    if (!reviews || reviews.length === 0) {
      continue;
    }
    for (const review of reviews) {
      if (review.Rating != 1) {
        continue;
      }
      if (!review.Description) {
        continue;
      }
      const place = places.get(row.data_id);
      if (!place) {
        const address = JSON.parse(row.complete_address);
        places.set(row.cid, {
          name: row.title,
          address: row.address,
          city: address.city,
          country: address.country,
          googlemapsurl: row.link,
          cid: row.cid,
        });
      }
      reviews_parsed.push({
        name: review.Name,
        place_cid: row.cid,
        profile_picture: review.ProfilePicture,
        rating: review.Rating,
        description: review.Description,
        when: review.When,
        // review cid is the hash of the review_text
        cid: Bun.hash(review.Description).toString(),
        images: review.Images,
      });
      // await db.reviews.add(reviewData);
      // console.log(reviews_parsed.at(-1));
      // console.log(`cid: ${row.complete_address}`);
      // console.log(`data_id: ${row.data_id}`);
    }
  }
  // console.log(places);
  return {
    reviews_parsed,
    places,
  };
}

async function addToDB(reviews: Review[], places: Place[]) {
  for (const place of places) {
    await addPlace(place);
  }
  for (const review of reviews) {
    await addReview(review);
  }
}

// get all csv files in the data folder
const glob = new Bun.Glob("*.csv");
const scannedFiles = Array.from(glob.scanSync({ cwd: "./data" }));

for (const csvFile of scannedFiles) {
  console.log(`Parsing ${csvFile}`);
  const { reviews_parsed, places } = await parseCSV(`data/${csvFile}`);
  await addToDB(reviews_parsed, Array.from(places.values()));
}
