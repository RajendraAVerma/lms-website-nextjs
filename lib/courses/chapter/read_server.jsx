import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getChapter = async ({ courseId, chapterId }) => {
  const docRef = doc(db, `courses/${courseId}/chapters/${chapterId}`);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  } else {
    return null;
  }
};
