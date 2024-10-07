"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useChapter } from "@/lib/courses/chapter/read";
import { useCourse } from "@/lib/courses/read";
import { useSubscription } from "@/lib/subscriptions/read";
import { Progress } from "@nextui-org/react";
import { Gem, Languages, TrendingUp } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

export default function CurrentChapter() {
  const searchParams = useSearchParams();
  const { courseId } = useParams();
  const chapterId = searchParams.get("chapterId");
  const { data: chapter } = useChapter({
    courseId: courseId,
    chapterId: chapterId,
  });
  return (
    <section className="flex-1 flex flex-col gap-4 w-full p-5 bg-white border rounded-xl">
      {!chapterId && (
        <div>
          <CourseDetails courseId={courseId} />
        </div>
      )}

      {chapter?.fileType === "youtube" && (
        <div className="w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${chapter?.youtubeId}`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      )}
      {chapter?.fileType === "image" && (
        <img className="w-full rounded-lg" src={chapter?.fileURL} alt="" />
      )}
      {chapter?.fileType === "video" && (
        <div>
          <video
            className="w-full rounded-lg"
            src={chapter?.fileURL}
            controls
          ></video>
        </div>
      )}
      <h1 className="font-semibold text-xl">{chapter?.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: chapter?.content }}
      ></div>
    </section>
  );
}

function CourseDetails({ courseId }) {
  const { user } = useAuth();
  const { data: course } = useCourse({ id: courseId });
  const { data: subscription } = useSubscription({
    id: courseId,
    uid: user?.uid,
  });
  const percentage = !subscription?.totalChapter
    ? 0
    : (subscription?.completedChapters?.length / subscription?.totalChapter) *
      100;
  return (
    <div className="flex-1 flex flex-col gap-3 w-full">
      <img
        className="w-full rounded-xl"
        src={course?.imageURL}
        alt={course?.title}
      />
      <h1 className="text-3xl line-clamp-2 font-semibold">{course?.title}</h1>
      <p className="text-gray-600 text-sm line-clamp-3">
        {course?.shortDescription}
      </p>

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
      <div className="py-3">
        <Progress value={percentage} className="w-full" />
      </div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: course?.description }}
      ></div>
    </div>
  );
}
