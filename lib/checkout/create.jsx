import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createCheckoutSessionAndGetURL = async ({ uid, course }) => {
  if (!uid) {
    throw new Error("Please Logged In First");
  }

  if (!course?.id) {
    throw new Error("Course Not Found");
  }

  const checkoutId = doc(collection(db, "ids")).id;

  const data = {
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course?.title,
            description: course?.shortDescription,
            images: [course?.imageURL],
            metadata: {
              courseId: course?.id,
            },
          },
          unit_amount: course?.salePrice * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      checkoutId: checkoutId,
      courseId: course?.id,
      uid: uid,
    },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success?checkout_id=${checkoutId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-failed?checkout_id=${checkoutId}`,
  };

  const docRef = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`);

  await setDoc(docRef, data);

  await new Promise((res) => setTimeout(res, 5000));

  const checkout = await getDoc(docRef);

  if (checkout.exists() && checkout?.data()?.url) {
    return checkout?.data()?.url;
  } else {
    await new Promise((res) => setTimeout(res, 5000));

    const checkout = await getDoc(docRef);

    if (checkout.exists() && checkout?.data()?.url) {
      return checkout?.data()?.url;
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};
