"use client";

import { Button } from "@nextui-org/react";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createNewCourses, updateCourse } from "@/lib/courses/write";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourse } from "@/lib/courses/read_server";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: ["extra-small", "small", "medium", "large"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
};

const categoriesList = [
  "Development",
  "Business",
  "Finance & Accounting",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Lifestyle",
  "Photography & Video",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
];

const languagesList = [
  "English",
  "Spanish",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese",
  "French",
  "Russian",
  "German",
  "Japanese",
  "Vietnamese",
  "Afrikaans",
  "Zulu",
];

const levelList = ["Beginner", "Intermediate ", "Advanced"];

export default function Page() {
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const course = await getCourse({ id: id });
      if (course) {
        setData(course);
      } else {
        throw new Error("Course Not Exist");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const { user } = useAuth();

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleData = (key, value) => {
    setData((prevData) => {
      return {
        ...prevData,
        [key]: value,
      };
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewCourses({
        data: data,
        image: image,
        instructorName: user?.displayName,
        instructorEmail: user?.email,
        instructorUid: user?.uid,
        instructorPhotoURL: user?.photoURL,
      });
      toast.success("Course Is Successfully Created");
      router.push("/my-courses");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateCourse({
        data: data,
        image: image,
        instructorName: user?.displayName,
        instructorEmail: user?.email,
        instructorUid: user?.uid,
        instructorPhotoURL: user?.photoURL,
      });
      toast.success("Course Is Successfully Updated");
      router.push("/my-courses");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (id) {
          handleUpdate();
        } else {
          handleCreate();
        }
      }}
      className="p-8 flex flex-col gap-3 bg-gray-50 min-h-screen w-full"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">
          {id ? "Update Course" : "Create New Courses"}
        </h1>
        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </div>
      <div className="flex flex-col gap-4 border bg-white p-5 rounded-lg">
        <input
          type="text"
          value={data?.title}
          onChange={(e) => handleData("title", e.target.value)}
          placeholder="Enter Course Title"
          className="w-full border rounded-lg px-4 py-3 text-xl focus:outline-indigo-800"
          required
        />
        <div className="w-full border-2 border-dashed rounded-lg p-6">
          <input onChange={handleImage} type="file" required={!id} />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="text-sm text-gray-600"
            htmlFor="course-short-description"
          >
            Short Description
          </label>
          <input
            type="text"
            value={data?.shortDescription}
            onChange={(e) => handleData("shortDescription", e.target.value)}
            className="border px-5 py-3 rounded-lg w-full"
            placeholder="Enter Short Description"
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm text-gray-600" htmlFor="course-price">
              Price
            </label>
            <input
              type="number"
              value={data?.price}
              onChange={(e) => handleData("price", parseFloat(e.target.value))}
              className="border px-5 py-3 rounded-lg w-full"
              placeholder="Enter Course Price"
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label
              className="text-sm text-gray-600"
              htmlFor="course-sale-price"
            >
              Sale Price
            </label>
            <input
              type="number"
              value={data?.salePrice}
              onChange={(e) =>
                handleData("salePrice", parseFloat(e.target.value))
              }
              className="border px-5 py-3 rounded-lg w-full"
              placeholder="Enter Sale Price"
              required
            />
          </div>
        </div>
        <div className="flex gap-3 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="select-category">Category</label>
            <select
              name="select-category"
              id="select-category"
              value={data?.category}
              onChange={(e) => handleData("category", e.target.value)}
              className="border px-5 py-3 rounded-lg w-full"
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </div>
          <div className="flex flex-col gap-1  w-full">
            <label htmlFor="select-language">Language</label>
            <select
              name="select-language"
              id="select-language"
              className="border px-5 py-3 rounded-lg w-full"
              value={data?.language}
              onChange={(e) => handleData("language", e.target.value)}
              required
            >
              <option value="">Select Language</option>
              {languagesList.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="select-level">Level</label>
            <select
              name="select-level"
              id="select-level"
              className="border px-5 py-3 rounded-lg w-full"
              value={data?.level}
              onChange={(e) => handleData("level", e.target.value)}
              required
            >
              <option value="">Select Level</option>
              {levelList.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </div>
        </div>
        <ReactQuill
          value={data?.description}
          onChange={(value) => {
            handleData("description", value);
          }}
          modules={modules}
          placeholder="Enter your description here..."
          required
        />
      </div>
    </form>
  );
}
