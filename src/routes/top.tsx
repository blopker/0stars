import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import Review from "~/components/Review";
import { topReviews } from "~/server";

export default function TopReviews() {
  const _topReviews = createAsync(async () => {
    "use server";
    const reviews = await topReviews();
    return reviews;
  });
  return (
    <main class="text-center w-full text-gray-700">
      <h1 class=" text-6xl uppercase my-16">"Top" Reviews</h1>
      <Show when={_topReviews()}>
        <div>
          <For each={_topReviews()}>
            {(review) => {
              return (
                <Review
                  review={review}
                  postRating={(e) => {}}
                  showControls={false}
                />
              );
            }}
          </For>
        </div>
      </Show>
    </main>
  );
}
