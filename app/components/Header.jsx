import { Clapperboard, TvMinimalPlay } from "lucide-react";
import UserLogin from "./UserLogin";
import AuthContextProvider from "@/contexts/AuthContext";

export default function Header() {
  return (
    <header className="border-b px-8 py-3 flex justify-between">
      <img className="h-10" src="/logo.png" alt="" />
      <div className="flex gap-3 items-center">
        <button className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold">
          <TvMinimalPlay /> Subscriptions
        </button>
        <button className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold">
          <Clapperboard /> My Courses
        </button>
        <AuthContextProvider>
          <UserLogin />
        </AuthContextProvider>
      </div>
    </header>
  );
}