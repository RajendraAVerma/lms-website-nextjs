"use client";

import { getChapter } from "@/lib/courses/chapter/read_server";
import { createNewChapter, updateChapter } from "@/lib/courses/chapter/write";
import { Button, Progress } from "@nextui-org/react";
import { Image, Play, Youtube } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";

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

export default function Page() {
  const [fileType, setFileType] = useState(null);
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const router = useRouter();
  const { courseId } = useParams();

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const chapter = await getChapter({ chapterId: id, courseId: courseId });
      if (!chapter) {
        throw new Error("Chapter is empty");
      }
      setData(chapter);
      setFileType(chapter?.fileType);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => {
      return {
        ...prevData,
        [key]: value,
      };
    });
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewChapter({
        courseId: courseId,
        data: data,
        file: file,
        fileType: fileType,
        progressCallback: (progress) => {
          setUploadingProgress((prevData) => {
            return progress;
          });
        },
      });
      toast.success("Successfully Created");
      router.push(`/my-courses/${courseId}`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateChapter({
        courseId: courseId,
        data: data,
        file: file,
        fileType: fileType,
        progressCallback: (progress) => {
          setUploadingProgress((prevData) => {
            return progress;
          });
        },
      });
      toast.success("Successfully Updated");
      router.push(`/my-courses/${courseId}`);
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
      className="flex flex-col gap-4 p-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {id ? "Update Chapter" : "Create New Chapter"}
        </h1>
        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </div>
      <div className="flex flex-col gap-3 bg-white border p-5 rounded-xl">
        <input
          type="text"
          value={data?.title ?? ""}
          onChange={(e) => {
            handleData("title", e.target.value);
          }}
          placeholder="Enter Chapter Title"
          className="px-4 py-2 text-lg border w-full rounded-lg"
        />
        {isLoading && fileType != "youtube" && (
          <Progress
            aria-label="Uploading..."
            value={uploadingProgress}
            className="w-full"
            color={parseInt(uploadingProgress) === 100 ? "success" : "primary"}
          />
        )}
        {!fileType && (
          <div className="flex justify-center items-center gap-4 w-full py-5 border-2 border-dashed rounded-xl">
            <div
              onClick={() => {
                setFileType("youtube");
              }}
              className="border p-4 rounded-xl cursor-pointer"
            >
              <Youtube size={25} className="text-gray-500" />
            </div>
            <div
              onClick={() => {
                setFileType("video");
              }}
              className="border p-4 rounded-xl cursor-pointer"
            >
              <Play size={25} className="text-gray-500" />
            </div>
            <div
              onClick={() => {
                setFileType("image");
              }}
              className="border p-4 rounded-xl cursor-pointer"
            >
              <Image size={25} className="text-gray-500" />
            </div>
          </div>
        )}
        {fileType === "youtube" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <label
                className="text-gray-600 text-sm"
                htmlFor="youtube-video-id"
              >
                YouTube Video ID
              </label>
              <button
                onClick={() => {
                  handleData("youtubeId", "");
                  setFileType(null);
                }}
                className="text-red-700 text-xs font-semibold bg-red-100 px-3 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
            <input
              id="youtube-video-id"
              name="youtube-video-id"
              type="text"
              value={data?.youtubeId ?? ""}
              onChange={(e) => {
                handleData("youtubeId", e.target.value);
              }}
              placeholder="Enter YouTube Video ID"
              className="border px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>
        )}
        {fileType === "video" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <label className="text-gray-600 text-sm">Select Video</label>
              <button
                onClick={() => {
                  setFileType(null);
                  setFile(null);
                }}
                className="text-red-700 text-xs font-semibold bg-red-100 px-3 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
            <input
              type="file"
              onChange={handleFile}
              className="border px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>
        )}
        {fileType === "image" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <label className="text-gray-600 text-sm">Select Image</label>
              <button
                onClick={() => {
                  setFileType(null);
                  setFile(null);
                }}
                className="text-red-700 text-xs font-semibold bg-red-100 px-3 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
            <input
              type="file"
              onChange={handleFile}
              className="border px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>
        )}
        <ReactQuill
          value={data?.content}
          onChange={(value) => {
            handleData("content", value);
          }}
          modules={modules}
          placeholder="Enter your content here..."
          required
        />
      </div>
    </form>
  );
}
