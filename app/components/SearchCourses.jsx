import { algoliasearch } from "algoliasearch";
import { CourseCard } from "./CoursesGridView";

const getCourses = async (text) => {
  if (!text) {
    return [];
  }
  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_APP_KEY
  );
  const search = await client.searchForHits({
    requests: [
      {
        indexName: "courses",
        query: text,
        hitsPerPage: 20,
      },
    ],
  });
  const hits = search.results[0]?.hits;
  return hits ?? [];
};

export default async function SearchCourses({ search }) {
  const courses = await getCourses(search);
  return (
    <section className="flex flex-col gap-8 p-7 md:p-10 w-full">
      <h1 className="text-xl font-semibold text-center text-gray-700">
        Result for <span className="text-black">{search}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
          return <CourseCard course={course} key={course?.id} />;
        })}
      </div>
    </section>
  );
}
