import { useState, useEffect } from "react";
import { db, auth } from "../../../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RenterNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notifications"),
          where("toRoles", "array-contains", "seller"),
          where("read", "==", false)
        );
        console.log(q);
        const querySnapshot = await getDocs(q);
        const notificationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    const fetchApprovedRequests = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "renterRequests"),
          where("createdBy", "==", user.uid),
          where("status", "==", "approved")
        );
        const snapshot = await getDocs(q);
        const approved = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApprovedRequests(approved);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
        toast.error("Failed to load approved requests");
      }
    };

    fetchNotifications();
    fetchApprovedRequests();
  }, []);

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center my-4">Renter Notifications</h2>
      <h4>Admin Posts</h4>
      {notifications.length > 0 ? (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-item mb-3 p-3 border border-success rounded"
            >
              <h5>{notification.message}</h5>
              <small>
                {new Date(
                  notification.createdAt.seconds * 1000
                ).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p>No new admin notifications</p>
      )}

      <h4 className="mt-5">Approved Requests by Admin</h4>
      {approvedRequests.length > 0 ? (
        <ul className="list-group">
          {approvedRequests.map((note) => (
            <li key={note.id} className="list-group-item">
              Your request for <strong>{note.name}</strong> has been{" "}
              <span className="text-success">approved</span>!
            </li>
          ))}
        </ul>
      ) : (
        <p>No approved requests yet</p>
      )}
    </div>
  );
};

export default RenterNotification;
