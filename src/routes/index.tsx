import { createSignal, onMount, Show } from "solid-js";
import Review from "~/components/Review";
import { getNextReview, postRating } from "~/server";

async function getReview() {
  "use server";
  const review = await getNextReview();
  return review;
}

async function _postRating(rating: { reviewId: number; rating: boolean }) {
  "use server";
  const response = await postRating(rating);
  const review = await getNextReview();
  return review;
}

export default function Home() {
  const [review, setReview] =
    createSignal<Awaited<ReturnType<typeof getReview>>>();
  const [error, setError] = createSignal<string>();
  async function getNext(data: { reviewId: number; rating: boolean } | null) {
    // scroll to top
    try {
      if (!data) {
        setReview(await getReview());
        return;
      } else {
        setReview(await _postRating(data));
      }
    } catch (err) {
      setReview(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
    window.scrollTo(0, 0);
  }
  onMount(async () => {
    getNext(null);
  });

  return (
    <main class="text-center w-full text-gray-700">
      <Show when={error()}>
        <div class="text-red-500">{error()}</div>
      </Show>
      <Show when={review()}>
        <Review review={review()!} postRating={getNext} showControls={true} />
      </Show>
    </main>
  );
}
