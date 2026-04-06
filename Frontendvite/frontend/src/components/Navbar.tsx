import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar(): JSX.Element {
  const nav = useNavigate();

  return (
    <nav className="bg-white shadow fixed w-full z-50">
      <div className="flex justify-between px-6 py-4">
        <h1 className=""></h1>
        <div className="space-x-4">
          <button onClick={() => nav("/signup")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Signup
          </button>
          <button onClick={() => nav("/login")} className="border px-4 py-2 rounded">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
