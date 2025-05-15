import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { app, db } from "../../../../Firebase";
import { useSelector, useDispatch } from "react-redux";
import { updateLoginData } from "../../../redux/slices/authLogin";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.signup.isAuthenticated);
  const nameofUser = useSelector((state) => state.signup.user.name);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("authToken", "admin-static-token");
      setIsAuthenticated(true);
      navigate("/admin");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        localStorage.setItem("authToken", userCredential.user.accessToken);
        setIsAuthenticated(true);
        dispatch(updateLoginData({ role: userData.role, email }));

        if (userData.role === "buyer") {
          navigate("/buyer-dashboard");
        } else if (userData.role === "renter") {
          navigate("/renter");
        } else {
          navigate("/");
        }
      } else {
        setError("User profile not found in Firestore.");
        console.error("No user data in Firestore for UID:", uid);
      }
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Login error: " + error.message);
      }
      console.error("Login failed:", error.message);
    }
  };

  const HandleEmail = (e) => {
    setEmail(e.target.value);
    dispatch(updateLoginData({ [e.target.name]: e.target.value }));
  };

  const HandlePassword = (e) => {
    setPassword(e.target.value);
    dispatch(updateLoginData({ [e.target.name]: e.target.value }));
  };

  return (
    <div className="login-container">
      {isAuthenticated ? (
        <p className="text-center">Welcome back, {nameofUser}</p>
      ) : (
        <h2 className="text-center">Login</h2>
      )}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={HandleEmail}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={HandlePassword}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-warning text-white mt-3">
          Login
        </button>

        <p className="mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-warning text-decoration-none">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
