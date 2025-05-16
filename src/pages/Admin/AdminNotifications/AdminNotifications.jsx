import { useEffect, useState } from 'react';
import { db } from '../../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminNotifications = () => {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "renterRequests"));
      const data = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((req) => req.status === "pending");
      setRequests(data);
    } catch (error) {
      console.error("Error fetching renter requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Renter Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 rounded shadow w-25">
              <p><strong>Car Name:</strong> {req.name}</p>
              <p><strong>Type:</strong> {req.type}</p>
              <p><strong>Model:</strong> {req.model}</p>
              <p><strong>Price/hr:</strong> {req.priceHour}</p>
              <p><strong>Price/day:</strong> {req.priceDay}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNotifications;
