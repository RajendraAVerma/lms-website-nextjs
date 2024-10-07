"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/lib/subscriptions/read";
import { Edit2, Play, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CourseButton({ courseId, instructorUid }) {
  const { user } = useAuth();

  const { data } = useSubscription({ uid: user?.uid, id: courseId });

  if (user?.uid === instructorUid) {
    return (
      <Link href={`/my-courses/${courseId}`}>
        <button className="flex justify-center gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm">
          <Edit2 size={16} />
          Edit
        </button>
      </Link>
    );
  }

  if (data) {
    return (
      <Link href={`/subscriptions/${courseId}`}>
        <button className="flex justify-center gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm">
          <Play size={16} />
          Learn
        </button>
      </Link>
    );
  }

  return (
    <Link href={`/courses/${courseId}`}>
      <button className="flex justify-center gap-2 items-center bg-indigo-600 mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm">
        <ShoppingBag size={16} />
        Buy Now
      </button>
    </Link>
  );
}
