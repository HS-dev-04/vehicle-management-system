// Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../../../Firebase";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log(" User signed out");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
