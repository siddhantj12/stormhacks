import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherAppWith } from "./screens/WeatherAppWith";
import { WeatherDetails } from "./screens/WeatherDetails";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherAppWith />} />
        <Route path="/details" element={<WeatherDetails />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
