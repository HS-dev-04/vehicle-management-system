import { useState, useEffect } from "react";
import { db } from "../../../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BuyerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const q = query(
          collection(db, "notifications"),
          where("toRoles", "array-contains", "buyer"),
          where("read", "==", false)
        );

        const querySnapshot = await getDocs(q);
        const notificationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center my-4">Buyer Notifications</h2>
      
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading notifications...</p>
        </div>
      ):
      notifications.length > 0 ? (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-item mb-3 p-3 border border-primary rounded"
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
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default BuyerNotification;
