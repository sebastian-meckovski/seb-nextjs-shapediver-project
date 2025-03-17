import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ViewerFunctionalComponent } from "./ViewerFunctionalComponent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ViewerFunctionalComponent />
  </StrictMode>
);
