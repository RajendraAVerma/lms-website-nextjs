"use client";

import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "../firebase";

export function useCourses({ uid }) {
  const { data, error } = useSWRSubscription(
    ["courses", uid],
    ([path, uid], { next }) => {
      const collectionRef = query(
        collection(db, `courses`),
        where("instructorUid", "==", uid)
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

export function useCourse({ id }) {
  const { data, error } = useSWRSubscription(
    ["courses", id],
    ([path, id], { next }) => {
      const docRef = doc(db, `courses/${id}`);
      const unsub = onSnapshot(
        docRef,
        (snapshot) => {
          next(null, !snapshot.exists() ? null : snapshot.data());
        },
        (error) => next(error, null)
      );
      return () => unsub();
    }
  );
  return { data, error, isLoading: data === undefined };
}
