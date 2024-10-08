"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createCheckoutSessionAndGetURL } from "@/lib/checkout/create";
import { useSubscription } from "@/lib/subscriptions/read";
import { Button } from "@nextui-org/react";
import { Edit2, Play, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CourseButton({ course }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSubscription({ uid: user?.uid, id: course?.id });

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const url = await createCheckoutSessionAndGetURL({
        uid: user?.uid,
        course: course,
      });
      if (url && url != "") {
        router.push(url);
      } else {
        throw new Error("Failed to checkout.");
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (user?.uid === course?.instructorUid) {
    return (
      <Link href={`/my-courses/${course?.id}`}>
        <button className="flex justify-center gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm">
          <Edit2 size={16} />
          Edit
        </button>
      </Link>
    );
  }

  if (data) {
    return (
      <Link href={`/subscriptions/${course?.id}`}>
        <button className="flex justify-center gap-2 items-center bg-black mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm">
          <Play size={16} />
          Learn
        </button>
      </Link>
    );
  }

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleBuyNow}
      className="flex justify-center gap-2 items-center bg-indigo-600 mt-2 text-white w-full py-3 rounded-xl font-semibold text-sm"
    >
      <ShoppingBag size={16} />
      Buy Now
    </Button>
  );
}
