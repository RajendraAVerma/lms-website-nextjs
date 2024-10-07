"use client";

import UserLogin from "@/app/components/UserLogin";
import { useCourse } from "@/lib/courses/read";
import Link from "next/link";
import Chapters from "./components/Chapters";
import CurrentChapter from "./components/CurrentChapter";

export default function Page({ params }) {
  const { courseId } = params;
  const { data: course } = useCourse({ id: courseId });
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 px-7 py-3 flex justify-between bg-white items-center border-b w-full">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img className="h-10" src="/logo.png" alt="" />
          </Link>
          <Link href={`/subscriptions/${courseId}`}>
            <h1 className="font-semibold text-lg line-clamp-1 hidden md:block">
              {course?.title}
            </h1>
          </Link>
        </div>
        <UserLogin />
      </header>
      <div className="flex flex-col-reverse md:flex-row gap-3 p-5">
        <CurrentChapter />
        <Chapters />
      </div>
    </main>
  );
}
