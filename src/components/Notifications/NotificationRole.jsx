import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../Firebase';

export const GetNotificationsByRole = async (role) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userType', '==', role),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};
