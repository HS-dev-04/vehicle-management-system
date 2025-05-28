import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxF4-otDJgr3UqGYI7Wk5Fq7r2-Vp8_Bw",
  authDomain: "vehicle-rental-app-f05f6.firebaseapp.com",
  databaseURL: "https://vehicle-rental-app-f05f6-default-rtdb.firebaseio.com",
  projectId: "vehicle-rental-app-f05f6",
  storageBucket: "vehicle-rental-app-f05f6.firebasestorage.app",
  messagingSenderId: "249417963188",
  appId: "1:249417963188:web:3d83d2e851728b7acd29e1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { app, db,auth }
 
