import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// Import UI package's global styles first
import "@vernisai/ui/styles/global.css";
import "./style.css";
import typescriptLogo from "/typescript.svg";
import ChatDemo from "./pages/ChatDemo";

const Home = () => (
  <div className="container mx-auto p-8 text-center">
    <h1 className="text-4xl font-bold mb-6">VernisAI Chat Demo</h1>
    <div className="flex justify-center space-x-8 mb-8">
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src="/vite.svg" className="h-24" alt="Vite logo" />
      </a>
      <a
        href="https://www.typescriptlang.org/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={typescriptLogo} className="h-24" alt="TypeScript logo" />
      </a>
    </div>
    <div className="mt-8">
      <Link
        to="/chat"
        className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        Open Chat Demo
      </Link>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatDemo />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("app")!).render(<App />);
