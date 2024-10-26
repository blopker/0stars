import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-gray-800"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="border-t-[1px] w-full divide-gray-200">
      <ul class="container flex items-center p-3 ">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/top")} mx-1.5 sm:mx-6`}>
          <a href="/top">Top</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
  );
}
