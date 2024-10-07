"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useChapters } from "@/lib/courses/chapter/read";
import { useSubscription } from "@/lib/subscriptions/read";
import {
  markChapterAsCompleted,
  markChapterAsInCompleted,
} from "@/lib/subscriptions/write";
import { Image, Play, Youtube } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import toast from "react-hot-toast";

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
          return (
            <ChapterCard
              totalChapter={chapters?.length}
              chapter={chapter}
              key={chapter?.id}
            />
          );
        })}
      </div>
    </section>
  );
}

function ChapterCard({ chapter, totalChapter }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const searchParams = useSearchParams();

  const currentId = searchParams.get("chapterId");

  const { data: subscription } = useSubscription({
    uid: user?.uid,
    id: chapter?.courseId,
  });

  const isCompleted = subscription?.completedChapters?.find(
    (item) => item === chapter?.id
  );

  const handleChecked = async () => {
    try {
      if (!isCompleted) {
        await markChapterAsCompleted({
          chapterId: chapter?.id,
          courseId: chapter?.courseId,
          totalChapter: totalChapter,
          uid: user?.uid,
        });
      } else {
        await markChapterAsInCompleted({
          chapterId: chapter?.id,
          courseId: chapter?.courseId,
          totalChapter: totalChapter,
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };
  return (
    <div
      onClick={() => {
        router.push(`${pathname}?chapterId=${chapter?.id}`);
      }}
      className={`flex justify-between border px-3 py-2 rounded-lg cursor-pointer
        ${
          currentId === chapter?.id
            ? "border-2 border-indigo-300 bg-indigo-50"
            : ""
        }
        `}
    >
      <div className="flex gap-2 items-center">
        <input
          onClick={handleChecked}
          type="checkbox"
          checked={isCompleted ? true : false}
        />
        <h1 className="line-clamp-2">{chapter?.title}</h1>
      </div>
    </div>
  );
}
