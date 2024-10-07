export const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_KEY);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
