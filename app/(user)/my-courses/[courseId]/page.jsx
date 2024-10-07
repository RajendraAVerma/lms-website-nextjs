"use client";

import { useCourse } from "@/lib/courses/read";
import { CircularProgress } from "@nextui-org/react";
import { useParams } from "next/navigation";
import Chapters from "./components/Chapters";
import { Gem, Languages, TrendingUp } from "lucide-react";

export default function Page() {
  const { courseId } = useParams();
  const { data: course, error, isLoading } = useCourse({ id: courseId });
  if (isLoading) {
    return (
      <div className="flex justify-center w-full py-10">
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">{error?.message}</div>;
  }
  return (
    <main className="flex flex-col md:flex-row gap-3 p-8 min-h-screen bg-gray-50 w-full">
      <div className="flex-1 flex flex-col gap-3 w-full p-5 rounded-xl border bg-white">
        <img
          className="w-full rounded-xl"
          src={course?.imageURL}
          alt={course?.title}
        />
        <h1 className="text-3xl line-clamp-2 font-semibold">{course?.title}</h1>
        <p className="text-gray-600 text-sm line-clamp-3">
          {course?.shortDescription}
        </p>
        <h3 className="text-indigo-900 font-semibold">
          ₹ {course?.salePrice}{" "}
          <span className="line-through text-gray-600 text-sm">
            ₹ {course?.price}
          </span>
        </h3>
        <div className="flex justify-between gap-4">
          <h3 className="flex items-center gap-2">
            <Gem size={12} />
            {course?.category}
          </h3>
          <h3 className="flex items-center gap-2">
            <Languages size={12} /> {course?.language}
          </h3>
          <h3 className="flex items-center gap-2">
            <TrendingUp size={12} /> {course?.level}
          </h3>
        </div>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: course?.description }}
        ></div>
      </div>
      <Chapters />
    </main>
  );
}
