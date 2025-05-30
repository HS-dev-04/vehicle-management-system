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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "renterRequests"));
      const data = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((req) => req.status === "pending");
      setRequests(data);
    } catch (error) {
      toast.error("Failed to fetch requests.");
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (id) => {
    setLoadingId(id);
    try {
      const ref = doc(db, "renterRequests", id);
      const snapshot = await getDoc(ref);
      const requestData = snapshot.data();

      if (!requestData) {
        toast.error("Request not found.");
        setLoadingId(null);
        return;
      }

      await addDoc(collection(db, "cars"), {
        name: requestData.name,
        type: requestData.type,
        model: requestData.model,
        mile: requestData.mile,
        fuelType: requestData.fuelType,
        transmission: requestData.transmission,
        doors: requestData.doors,
        oneHourPrice: requestData.oneHourPrice,
        twentyFourHourPrice: requestData.twentyFourHourPrice,
        role: requestData.role,
        postedBy: requestData.createdBy,
        imageIndex: Math.floor(Math.random() * 6),
        createdAt: new Date(),
      });

      await updateDoc(ref, { status: "approved" });

      toast.success("Request approved and car posted!");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Error approving request.");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />      <h2>Admin Approval Requests</h2>
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div className="col-md-4 mb-3" key={req.id}>
              <div className="card p-3 shadow-sm">
                <h5>{req.name}</h5>
                <p>Type: {req.type}</p>
                <p>Model: {req.model}</p>
                <p>Price/hr: Rs {req.oneHourPrice}</p>
                <p>Price/day: Rs {req.twentyFourHourPrice}</p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>
                <button
                  className="btn btn-success"
                  disabled={loadingId === req.id}
                  onClick={() => approveRequest(req.id)}
                >
                  {loadingId === req.id ? "Approving..." : "Approve"}
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
