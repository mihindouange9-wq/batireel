import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource-variable/manrope";
import "./styles/global.css";
import App from "./App";

// `?scene` : la scène du film de présentation (1920 × 1080), capturée image par image par tools/video-render.mjs
const params = new URLSearchParams(window.location.search);
const isScene = params.has("scene");
const Scene = lazy(() => import("./components/Scene"));
if (isScene) document.documentElement.classList.add("scene");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isScene ? (
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
