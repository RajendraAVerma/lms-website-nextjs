import { getCourse } from "@/lib/courses/read_server";
import { Gem, Languages, ShoppingBag, TrendingUp } from "lucide-react";
import Chapters from "./components/Chapters";
import CourseButton from "./components/CourseButton";
import AuthContextProvider from "@/contexts/AuthContext";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { courseId } = params;
  const course = await getCourse({ id: courseId });

  return {
    title: course?.title,
    description: course?.shortDescription,
    openGraph: {
      images: [course?.imageURL],
    },
  };
}

export default async function Page({ params }) {
  const { courseId } = params;
  const course = await getCourse({ id: courseId });
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
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 w-full p-5 rounded-xl border bg-white">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Total</h2>
            <h3 className="text-indigo-900 font-semibold">
              ₹ {course?.salePrice}{" "}
              <span className="line-through text-gray-600 text-sm">
                ₹ {course?.price}
              </span>
            </h3>
          </div>
          <AuthContextProvider>
            <CourseButton course={course} />
          </AuthContextProvider>
        </div>
        <Suspense>
          <Chapters courseId={course?.id} />
        </Suspense>
      </section>
    </main>
  );
}
