import { createRoot } from "react-dom/client";
import App from "./App";
// Import CSS normally - Vite will handle it, but we'll defer it via HTML
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
