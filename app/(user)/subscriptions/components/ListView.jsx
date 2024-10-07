"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCourse } from "@/lib/courses/read";
import { useSubscription, useSubscriptions } from "@/lib/subscriptions/read";
import { CircularProgress, Progress } from "@nextui-org/react";
import { Play } from "lucide-react";
import Link from "next/link";

export default function ListView() {
  const { user } = useAuth();
  const { data, error, isLoading } = useSubscriptions({ uid: user?.uid });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div className="text-red-500">{error?.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.map((item) => {
        return <CourseCard item={item} key={item?.id} />;
      })}
    </div>
  );
}

function CourseCard({ item }) {
  const { data: course } = useCourse({ id: item?.courseId });
  const percentage = !item?.totalChapter
    ? 0
    : (item?.completedChapters?.length / item?.totalChapter) * 100;
  return (
    <div className="border rounded-xl">
      <img
        className="h-40 rounded-t-lg object-cover object-center w-full"
        src={course?.imageURL}
        alt=""
      />
      <div className="flex flex-col gap-3 p-3">
        <h1 className="font-semibold line-clamp-2">{course?.title}</h1>
        <Progress value={percentage} className="w-full" />
        <Link href={`/subscriptions/${course?.id}`}>
          <button className="flex justify-center gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm">
            <Play size={16} />
            Learn
          </button>
        </Link>
      </div>
    </div>
  );
}
