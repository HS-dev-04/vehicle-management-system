import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';

const CarDetails = () => {
  const { id } = useParams(); // get car ID from URL
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      }
    };

    fetchCar();
  }, [id]);

  if (!car) {
    return <div className="text-center mt-5">Loading car details...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Car Details</h2>
      <div className="card p-4 shadow">
        <h4>{car.name}</h4>
        <p><strong>Type:</strong> {car.type}</p>
        <p><strong>Model:</strong> {car.model}</p>
        <p><strong>Price per hour:</strong> ${car.oneHourPrice}</p>
        <p><strong>Price per 24 hours:</strong> ${car.twentyFourHourPrice}</p>
      </div>
    </div>
  );
};

export default CarDetails;
