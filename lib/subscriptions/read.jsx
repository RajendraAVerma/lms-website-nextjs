"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "../firebase";

export function useSubscriptions({ uid }) {
  const { data, error } = useSWRSubscription(
    ["subscriptions", uid],
    ([path, uid], { next }) => {
      const collectionRef = query(
        collection(db, `users/${uid}/subscriptions`),
        orderBy("timestamp", "desc")
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

export function useSubscription({ uid, id }) {
  const { data, error } = useSWRSubscription(
    ["subscriptions", uid, id],
    ([path, uid, id], { next }) => {
      const docRef = doc(db, `users/${uid}/subscriptions/${id}`);
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
