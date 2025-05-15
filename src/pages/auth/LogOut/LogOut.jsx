import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSignup";
import { app } from "../../../../Firebase";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        dispatch(logout());   
        setLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [dispatch, navigate]);

  if (loading) {
    return <p>Logging out, please wait...</p>;
  }
};

export default Logout;
