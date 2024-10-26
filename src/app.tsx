import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <div class="flex flex-col h-screen justify-between">
          <Suspense>{props.children}</Suspense>
          <Nav />
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
