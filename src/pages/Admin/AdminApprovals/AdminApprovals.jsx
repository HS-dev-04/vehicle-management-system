import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../Firebase";

const AdminApprovals = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "renterRequests"));
    const data = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((req) => req.status === "pending");
    setRequests(data);
  };

  const approveRequest = async (id) => {
    try {
      const ref = doc(db, "renterRequests", id);
      const snapshot = await getDoc(ref);
      const requestData = snapshot.data();

      if (!requestData) {
        alert("Request not found");
        return;
      }
      
      await addDoc(collection(db, "cars"), {
        name: requestData.name,
        type: requestData.type,
        model: requestData.model,
        priceHour: requestData.priceHour,
        priceDay: requestData.priceDay,
        role: requestData.role,
        postedBy: requestData.createdBy,
        imageIndex: Math.floor(Math.random() * 6),
        createdAt: new Date(),
      });

      await updateDoc(ref, {
        status: "approved",
      });

      alert("Request approved and car posted!");
      fetchRequests();
    } catch (error) {
      console.error("Error approving request: ", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Approval Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div className="col-md-4 mb-3" key={req.id}>
              <div className="card p-3 shadow-sm">
                <h5>{req.name}</h5>
                <p>Type: {req.type}</p>
                <p>Model: {req.model}</p>
                <p>Price/hr: Rs {req.priceHour}</p>
                <p>Price/day: Rs {req.priceDay}</p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => approveRequest(req.id)}
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
