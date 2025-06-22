import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAD_UDU-K9Vkghvdezs0rXVpQIBAYyiBK8",
  authDomain: "car-rental-system-459c1.firebaseapp.com",
  projectId: "car-rental-system-459c1",
  storageBucket: "car-rental-system-459c1.appspot.com", 
  messagingSenderId: "898021527622",
  appId: "1:898021527622:web:6fb0f9a2246f2cf645ba47",
  measurementId: "G-NRYH92EMDQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

console.log('Firebase services initialized:', {
  app: !!app,
  db: !!db,
  auth: !!auth,
  storage: !!storage
});

export { app, db, storage, auth };