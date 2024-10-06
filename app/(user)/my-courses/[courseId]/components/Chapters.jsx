"use client";

import { useChapters } from "@/lib/courses/chapter/read";
import { deleteChapter } from "@/lib/courses/chapter/write";
import { Button } from "@nextui-org/react";
import { Edit2, Image, Play, Trash2, Youtube } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Chapters() {
  const { courseId } = useParams();
  const {
    data: chapters,
    error,
    isLoading,
  } = useChapters({ courseId: courseId });
  return (
    <section className="flex flex-col gap-3 w-full md:w-[350px] p-5 rounded-xl border bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Chapters</h1>
        <Link href={`/my-courses/${courseId}/chapter-form`}>
          <button className="bg-indigo-800 text-white px-4 py-1.5 rounded-lg text-sm">
            Create
          </button>
        </Link>
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      await deleteChapter({
        chapterId: chapter?.id,
        courseId: chapter?.courseId,
      });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
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
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            router.push(
              `/my-courses/${chapter?.courseId}/chapter-form?id=${chapter?.id}`
            );
          }}
          size="sm"
          isIconOnly
        >
          <Edit2 size={13} />
        </Button>
        <Button
          onClick={handleDelete}
          isLoading={isLoading}
          isDisabled={isLoading}
          size="sm"
          color="danger"
          isIconOnly
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
}
