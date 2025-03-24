import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import typescriptLogo from "/typescript.svg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
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
}
