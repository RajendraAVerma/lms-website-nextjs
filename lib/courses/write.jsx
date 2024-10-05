import {
  doc,
  collection,
  setDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createNewCourses = async ({
  data,
  image,
  instructorUid,
  instructorEmail,
  instructorName,
  instructorPhotoURL,
}) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!image) {
    throw new Error("Image is required");
  }
  if (!instructorUid) {
    throw new Error("Instructor UID is required");
  }

  const newId = doc(collection(db, "ids")).id;

  const imageRef = ref(storage, `courses/${image?.name}`);

  await uploadBytes(imageRef, image);

  const imageURL = await getDownloadURL(imageRef);

  await setDoc(doc(db, `courses/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    instructorUid: instructorUid,
    instructorEmail: instructorEmail,
    instructorName: instructorName,
    instructorPhotoURL: instructorPhotoURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCourse = async ({
  data,
  image,
  instructorUid,
  instructorEmail,
  instructorName,
  instructorPhotoURL,
}) => {
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.title) {
    throw new Error("Title is required");
  }

  if (!instructorUid) {
    throw new Error("Instructor UID is required");
  }

  let imageURL = data?.imageURL;

  if (image) {
    const imageRef = ref(storage, `courses/${image?.name}`);
    await uploadBytes(imageRef, image);
    imageURL = await getDownloadURL(imageRef);
  }

  await updateDoc(doc(db, `courses/${data?.id}`), {
    ...data,
    imageURL: imageURL,
    instructorUid: instructorUid,
    instructorEmail: instructorEmail,
    instructorName: instructorName,
    instructorPhotoURL: instructorPhotoURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCourse = async ({ id }) => {
  await deleteDoc(doc(db, `courses/${id}`));
};
