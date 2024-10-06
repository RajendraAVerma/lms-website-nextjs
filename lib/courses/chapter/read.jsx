"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useChapters({ courseId }) {
  const { data, error } = useSWRSubscription(
    ["chapters", courseId],
    ([path, courseId], { next }) => {
      const collectionRef = query(
        collection(db, `courses/${courseId}/chapters`),
        orderBy("timestampCreate", "asc")
      );
      const unsub = onSnapshot(
        collectionRef,
        (snapshot) => {
          next(
            null,
            snapshot.empty ? null : snapshot.docs?.map((snap) => snap.data())
          );
        },
        (error) => next(error, null)
      );
      return () => unsub();
    }
  );
  return { data, error, isLoading: data === undefined };
}
