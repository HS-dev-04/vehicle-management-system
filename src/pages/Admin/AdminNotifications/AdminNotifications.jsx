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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Pending Renter Requests</h2>
          
          {requests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <div className="row">
              {requests.map((req) => (
                <div key={req.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="p-3 border rounded">
                    <p><strong>Car Name:</strong> {req.name}</p>
                    <p><strong>Type:</strong> {req.type}</p>
                    <p><strong>Model:</strong> {req.model}</p>
                    <p><strong>Price/hr:</strong> {req.priceHour}</p>
                    <p><strong>Price/day:</strong> {req.priceDay}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;