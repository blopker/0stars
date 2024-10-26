import { Show } from "solid-js";
import { type ReviewUI } from "~/server";

function AiFillStar() {
  return (
    <svg
      fill="currentColor"
      class="fill-yellow-500"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      style="overflow: visible; color: currentcolor; --darkreader-inline-fill: currentColor; --darkreader-inline-color: currentcolor;"
      height="1.2em"
      width="1.2em"
      data-darkreader-inline-fill=""
      data-darkreader-inline-color=""
    >
      <path d="m908.1 353.1-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
    </svg>
  );
}

function AiOutlineStar() {
  return (
    <svg
      fill="currentColor"
      class="fill-yellow-500"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      style="overflow: visible; color: currentcolor; --darkreader-inline-fill: currentColor; --darkreader-inline-color: currentcolor;"
      height="1.2em"
      width="1.2em"
      data-darkreader-inline-fill=""
      data-darkreader-inline-color=""
    >
      <path d="m908.1 353.1-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
    </svg>
  );
}

export default function Review(props: {
  review: ReviewUI;
  postRating: (rating: { reviewId: number; rating: boolean }) => any;
  showControls: boolean;
}) {
  return (
    <div class="bg-white w-full text-left flex-col gap-2 flex divide-y divide-gray-200 overflow-hidden">
      <div class="pt-5 pb-2 px-5">
        <div class="flex gap-2 text-sm">
          <div class="h-10 w-10 shrink-0 rounded-full">
            <Show when={props.review?.reviewerProfileImage}>
              <img
                src={props.review?.reviewerProfileImage!}
                alt=""
                referrerpolicy="no-referrer"
              />
            </Show>
          </div>
          <div class="flex flex-col">
            <div class="font-bold">{props.review?.reviewerName}</div>
            <div class="text-gray-500">
              <a
                class="text-blue-500"
                target="_blank"
                href={props.review?.googleMapsUrl!}
              >
                @{props.review?.placeName}
              </a>
              {/* in {props.review?.placeCity}, {props.review?.placeCountry} */}
            </div>
            <div></div>
          </div>
        </div>
        <div class="pt-2 flex">
          <AiFillStar />
          <AiOutlineStar />
          <AiOutlineStar />
          <AiOutlineStar />
          <AiOutlineStar />
        </div>
      </div>
      <div class="pb-5 px-5 pt-1">
        <div class="indent-8 pt-3  md:text-4xl leading-6 md:leading-10">
          {props.review?.reviewText}
        </div>
        <Show when={props.showControls}>
          <div class="flex justify-between md:gap-10 md:justify-end text-6xl pt-5 items-center">
            <button
              onClick={async () =>
                await props.postRating({
                  reviewId: props.review!.id,
                  rating: false,
                })
              }
            >
              😴
            </button>
            <button
              onClick={async () =>
                await props.postRating({
                  reviewId: props.review!.id,
                  rating: true,
                })
              }
            >
              😆
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
