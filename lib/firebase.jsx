import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMCYpDu6PpUs0ruroLmFKwgppExfVVL98",
  authDomain: "lms-website-nextjs.firebaseapp.com",
  projectId: "lms-website-nextjs",
  storageBucket: "lms-website-nextjs.appspot.com",
  messagingSenderId: "711342421820",
  appId: "1:711342421820:web:b2518bf1f13d71a0ea9039",
  measurementId: "G-HYE4YSE7ZX",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const analytics = isSupported().then((yes) => {
  if (yes) {
    return getAnalytics(app);
  } else {
    return null;
  }
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
