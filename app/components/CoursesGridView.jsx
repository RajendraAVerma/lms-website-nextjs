import { getAllCourses } from "@/lib/courses/read_server";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import CourseButton from "./CourseButton";
import AuthContextProvider from "@/contexts/AuthContext";

export default async function CoursesGridView() {
  const courses = await getAllCourses();
  return (
    <section className="flex flex-col gap-8 p-7 md:p-10 w-full">
      <h1 className="text-3xl font-semibold text-center">
        Explore All Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
          return <CourseCard course={course} key={course?.id} />;
        })}
      </div>
    </section>
  );
}

export function CourseCard({ course }) {
  return (
    <div className="flex flex-col rounded-lg border">
      <Link href={`/courses/${course?.id}`}>
        <img
          src={course?.imageURL}
          className="h-40 rounded-t-lg object-cover object-top w-full"
          alt=""
        />
      </Link>
      <div className="flex flex-col gap-1 p-3 md:p-4">
        <Link href={`/courses/${course?.id}`}>
          <h1 className="line-clamp-2 font-semibold">{course?.title}</h1>
        </Link>
        <div className="flex gap-2">
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={course?.instructorPhotoURL}
            alt=""
          />

          <h3 className="text-gray-700 text-sm">{course?.instructorName}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            ₹ {course?.salePrice}{" "}
            <span className="line-through text-xs text-gray-600">
              ₹ {course?.price}
            </span>{" "}
          </h3>
          <h3 className="text-gray-600 text-xs font-semibold">
            {course?.category}
          </h3>
        </div>
        <AuthContextProvider>
          <CourseButton
            instructorUid={course?.instructorUid}
            courseId={course?.id}
          />
        </AuthContextProvider>
      </div>
    </div>
  );
}
