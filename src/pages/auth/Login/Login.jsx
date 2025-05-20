import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { app, db } from "../../../../Firebase";
import { useSelector, useDispatch } from "react-redux";
import { updateLoginData } from "../../../redux/slices/authLogin";
import { ToastContainer, toast } from "react-toastify";
import { Form } from "react-bootstrap";
import InputField from "../../../components/Fields/InputField";
import "react-toastify/dist/ReactToastify.css";
const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.signup.isAuthenticated);
  const nameofUser = useSelector((state) => state.signup.user.name);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Logging in...");

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("authToken", "admin-static-token");
      setIsAuthenticated(true);
      toast.update(toastId, {
        render: "Admin login successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
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

        toast.update(toastId, {
          render: "Login successful",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        if (userData.role === "buyer") {
          navigate("/buyer-dashboard");
        } else if (userData.role === "renter") {
          navigate("/renter");
        } else {
          navigate("/");
        }
      } else {
        toast.update(toastId, {
          render: "User profile not found in Firestore.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Login failed:", error.message);

      let message = "Incorrect email or password.";
      if (error.code === "auth/user-not-found") {
        message = "Incorrect email address.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else {
        message = "Login error: " + "Incorrect email or password.";
      }

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
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
      <ToastContainer position="top-center" autoClose={3000} />
      {isAuthenticated ? (
        <p className="text-center">Welcome back, {nameofUser}</p>
      ) : (
        <h2 className="text-center">Login</h2>
      )}
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <div className="form-group">
          <InputField
            label="Email: "
            type="email"
            name="email"
            required
            value={email}
            onChange={HandleEmail}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <InputField
            label="Password:"
            type="password"
            name="password"
            required
            value={password}
            onChange={HandlePassword}
            className="form-control"
          />
          </div>
        <button
          type="submit"
          className="btn btn-warning text-white mt-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-warning text-decoration-none">
            Register
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default Login;
