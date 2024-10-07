"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const text = searchParams.get("search");

  useEffect(() => {
    setSearch(text);
  }, [text]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/?search=${search}`);
      }}
      className="relative"
    >
      <Search className="absolute top-3 left-4 text-gray-700" />
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        type="text"
        className="text-lg rounded-full px-6 py-2 pl-12 bg-white border shadow-lg focus:outline-none w-full md:w-96"
        placeholder="Search For Anything"
      />
    </form>
  );
}
