import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

export const getCourse = async ({ id }) => {
  const ref = doc(db, `courses/${id}`);
  const res = await getDoc(ref);
  if (res.exists()) {
    return res.data();
  } else {
    return null;
  }
};

export const getAllCourses = async () => {
  const snapshots = await getDocs(
    query(collection(db, "courses"), orderBy("timestampCreate", "desc"))
  );
  return snapshots.docs.map((item) => item?.data());
};
