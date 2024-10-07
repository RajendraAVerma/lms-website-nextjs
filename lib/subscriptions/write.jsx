import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const markChapterAsCompleted = async ({
  uid,
  courseId,
  chapterId,
  totalChapter,
}) => {
  await updateDoc(doc(db, `users/${uid}/subscriptions/${courseId}`), {
    totalChapter: totalChapter,
    completedChapters: arrayUnion(chapterId),
  });
};

export const markChapterAsInCompleted = async ({
  uid,
  courseId,
  chapterId,
  totalChapter,
}) => {
  await updateDoc(doc(db, `users/${uid}/subscriptions/${courseId}`), {
    totalChapter: totalChapter,
    completedChapters: arrayRemove(chapterId),
  });
};
