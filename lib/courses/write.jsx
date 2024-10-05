import { doc, collection, setDoc, Timestamp } from "firebase/firestore";
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
