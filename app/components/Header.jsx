import { Clapperboard, TvMinimalPlay } from "lucide-react";
import UserLogin from "./UserLogin";
import AuthContextProvider from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b px-8 py-3 flex justify-between">
      <Link href="/">
        <img className="h-10" src="/logo.png" alt="" />
      </Link>
      <div className="flex gap-3 items-center">
        <Link href="/subscriptions">
          <button className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold">
            <TvMinimalPlay /> Subscriptions
          </button>
        </Link>
        <Link href="/my-courses">
          <button className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-indigo-800 font-semibold">
            <Clapperboard /> My Courses
          </button>
        </Link>
        <AuthContextProvider>
          <UserLogin />
        </AuthContextProvider>
      </div>
    </header>
  );
}
