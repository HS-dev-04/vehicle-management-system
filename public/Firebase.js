import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCM_WIbA0IEumZpNNCXGV7KrzZzzP-SmXg",
  authDomain: "vehicle-management-syste-3ab8b.firebaseapp.com",
  projectId: "vehicle-management-syste-3ab8b",
  storageBucket: "vehicle-management-syste-3ab8b.firebasestorage.app",
  messagingSenderId: "949761329398",
  appId: "1:949761329398:web:0e48140a88f68d832e04d7",
  measurementId: "G-ENYR8M5TFX"
};

export const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app.name); 
export const db = getFirestore(app);
export const auth = getAuth(app);
