"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/lib/courses/read";
import { deleteCourse } from "@/lib/courses/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ListView() {
  const { user } = useAuth();
  const { data, error, isLoading } = useCourses({ uid: user?.uid });

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState();

  const handleDeleteCourse = async () => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      await deleteCourse({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  return (
    <div className="border rounded-xl">
      <img
        className="h-40 rounded-t-lg object-cover object-center w-full"
        src={item?.imageURL}
        alt=""
      />
      <div className="p-3">
        <h1 className="font-semibold line-clamp-2">{item?.title}</h1>
        <h1 className="text-gray-600 text-sm">
          {item?.totalStudents ?? 0} Students Enrolled
        </h1>
        <div className="flex gap-4 w-full mt-2">
          <Button
            onClick={() => {
              router.push(`/my-courses/${item?.id}`);
            }}
            className="w-full"
          >
            <Play size={13} />
            View
          </Button>
          <Button
            onClick={() => {
              router.push(`/my-courses/form?id=${item?.id}`);
            }}
            color="primary"
            isIconOnly
          >
            <Edit2 size={13} />
          </Button>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handleDeleteCourse}
            color="danger"
            isIconOnly
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
