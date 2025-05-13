import { db } from '../../../Firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export const addCarToFirestore = async (carData) => {
  try {
    const newDocRef = doc(collection(db, 'cars'));
    const uuid = newDocRef.id;
    await setDoc(newDocRef, {
      ...carData,
      uuid: uuid,
      oneHourPrice: Number(carData.oneHourPrice),
      twentyFourHourPrice: Number(carData.twentyFourHourPrice),
      createdAt: new Date()
    });

    return { success: true, id: uuid };
  } catch (error) {
    console.error('Error adding car to Firestore:', error);
    return { success: false, error };
  }
};
