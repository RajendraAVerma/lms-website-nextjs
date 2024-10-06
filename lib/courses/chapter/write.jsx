import { db, storage } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const createNewChapter = async ({
  courseId,
  data,
  file,
  fileType,
  progressCallback,
}) => {
  if (!courseId) {
    throw new Error("Course ID is required");
  }
  if (!data) {
    throw new Error("Data is required");
  }
  if (!fileType) {
    throw new Error("File Type is required");
  }

  const newId = doc(collection(db, "ids")).id;

  const chapterRef = doc(db, `courses/${courseId}/chapters/${newId}`);

  if (fileType === "youtube") {
    await setDoc(chapterRef, {
      ...data,
      fileType: fileType,
      courseId: courseId,
      id: newId,
      timestampCreate: Timestamp.now(),
    });
  } else {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, "chapters/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
          await setDoc(chapterRef, {
            ...data,
            fileType: fileType,
            courseId: courseId,
            id: newId,
            fileURL: fileURL,
            timestampCreate: Timestamp.now(),
          });
          resolve(true);
        }
      );
    });
  }
};

export const updateChapter = async ({
  courseId,
  data,
  file,
  fileType,
  progressCallback,
}) => {
  if (!courseId) {
    throw new Error("Course ID is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!fileType) {
    throw new Error("File Type is required");
  }

  const chapterRef = doc(db, `courses/${courseId}/chapters/${data?.id}`);

  if (fileType === "youtube" || !file) {
    await updateDoc(chapterRef, {
      ...data,
      fileType: fileType,
      courseId: courseId,
      timestampUpdate: Timestamp.now(),
    });
  } else {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, "chapters/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(chapterRef, {
            ...data,
            fileType: fileType,
            courseId: courseId,
            fileURL: fileURL,
            timestampUpdate: Timestamp.now(),
          });
          resolve(true);
        }
      );
    });
  }
};

export const deleteChapter = async ({ courseId, chapterId }) => {
  await deleteDoc(doc(db, `courses/${courseId}/chapters/${chapterId}`));
};
