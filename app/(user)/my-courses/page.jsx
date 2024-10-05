import Link from "next/link";
import ListView from "./components/ListView";

export default function Page() {
  return (
    <main className="flex flex-col gap-3 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">My Courses</h1>
        <Link href="/my-courses/form">
          <button className="bg-indigo-800 text-white px-4 py-2 text-sm rounded-lg">
            Create New Courses
          </button>
        </Link>
      </div>
      <ListView />
    </main>
  );
}
