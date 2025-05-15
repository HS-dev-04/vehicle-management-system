import { db } from '../../../Firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

export const addCarToFirestore = async (carData) => {
  try {
    const newDocRef = doc(collection(db, 'cars'));
    const uuid = newDocRef.id;
    await setDoc(newDocRef, {
      ...carData,
      uuid: uuid,
      oneHourPrice: Number(carData.oneHourPrice),
      twentyFourHourPrice: Number(carData.twentyFourHourPrice),
      createdAt: serverTimestamp()
    });
    await addDoc(collection(db,'notifications'),{
      message:`New car posted for ${carData.role}:${carData.name}`,
      userType: carData.role,
      createdAt:serverTimestamp()
    });
    return { success: true, id: uuid };
  } catch (error) {
     console.error('Error adding car or notification to Firestore:', error);
    return { success: false, error };
  }
};
