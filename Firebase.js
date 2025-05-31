import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDxF4-otDJgr3UqGYI7Wk5Fq7r2-Vp8_Bw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "vehicle-rental-app-f05f6.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://vehicle-rental-app-f05f6-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "vehicle-rental-app-f05f6",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "vehicle-rental-app-f05f6.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "249417963188",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:249417963188:web:3d83d2e851728b7acd29e1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, db, storage,auth }
 
