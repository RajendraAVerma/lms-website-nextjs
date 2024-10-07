"use client";

import { useChapters } from "@/lib/courses/chapter/read";
import { Image, Play, Youtube } from "lucide-react";
import { useParams } from "next/navigation";

export default function Chapters() {
  const { courseId } = useParams();
  const { data: chapters } = useChapters({ courseId: courseId });
  return (
    <section className="flex flex-col gap-3 w-full md:w-[350px] p-5 rounded-xl border bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Chapters</h1>
      </div>
      <div className="flex flex-col gap-3">
        {chapters?.map((chapter) => {
          return <ChapterCard chapter={chapter} key={chapter?.id} />;
        })}
      </div>
    </section>
  );
}

function ChapterCard({ chapter }) {
  return (
    <div className="flex justify-between border px-3 py-2 rounded-lg">
      <div className="flex gap-2 items-center">
        {chapter?.fileType === "youtube" && (
          <Youtube size={13} className="text-gray-700" />
        )}
        {chapter?.fileType === "video" && (
          <Play size={13} className="text-gray-700" />
        )}
        {chapter?.fileType === "image" && (
          <Image size={13} className="text-gray-700" />
        )}
        <h1 className="line-clamp-2">{chapter?.title}</h1>
      </div>
    </div>
  );
}
