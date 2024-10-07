import { admin, adminDB } from "@/lib/firebase_admin";
import { Play } from "lucide-react";
import Link from "next/link";

const getPayment = async ({ checkout_id }) => {
  const res = await adminDB
    .collectionGroup("payments")
    .where("metadata.checkoutId", "==", checkout_id)
    .where("status", "==", "succeeded")
    .get();

  if (res.empty) {
    throw new Error("Payment with checkout not found!");
  }
  return res.docs[0].data();
};

const processOrder = async ({ uid, courseId, payment }) => {
  const subscription = await adminDB
    .doc(`users/${uid}/subscriptions/${courseId}`)
    .get();
  if (subscription.exists) {
    return null;
  } else {
    await adminDB.doc(`users/${uid}/subscriptions/${courseId}`).set({
      id: courseId,
      courseId: courseId,
      timestamp: admin.firestore.Timestamp.now(),
      uid: uid,
      payment: payment,
    });
    await adminDB.doc(`courses/${courseId}`).update({
      totalStudents: admin.firestore.FieldValue.increment(1),
    });
  }
};

export default async function Page({ searchParams }) {
  const { checkout_id } = searchParams;
  const payment = await getPayment({ checkout_id: checkout_id });
  const { uid, courseId } = payment?.metadata;
  await processOrder({
    courseId: courseId,
    payment: payment,
    uid: uid,
  });
  return (
    <main className="p-8 py-20 flex flex-col w-full gap-3 justify-center items-center">
      <h1 className="text-3xl font-semibold">Payment is Success</h1>
      <Link href={`/subscriptions/${courseId}`}>
        <button className="flex gap-2 items-center bg-indigo-700 rounded-xl text-white px-5 py-2 text-sm font-semibold">
          <Play size={14} /> Learn
        </button>
      </Link>
    </main>
  );
}
