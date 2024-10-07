import { Search } from "lucide-react";
import Header from "./components/Header";
import CoursesGridView from "./components/CoursesGridView";
import SearchBar from "./components/SearchBar";
import SearchCourses from "./components/SearchCourses";

export default async function Home({ searchParams }) {
  const { search } = searchParams;
  return (
    <main>
      <Header />
      <section className="bg-[url('/search-banner.jpeg')] bg-fixed bg-cover bg-no-repeat bg-top h-[400px] w-full">
        <div className="flex flex-col justify-center items-center gap-3 w-full h-full bg-black bg-opacity-35">
          <h1 className="text-white text-xl font-bold text-center">
            All the skills you need in one place
          </h1>
          <SearchBar />
        </div>
      </section>
      {search && search != "" && <SearchCourses search={search} />}
      {!search && <CoursesGridView />}
    </main>
  );
}
