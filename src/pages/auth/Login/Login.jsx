import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  updateLoginData,
  resetLoginData,
} from "../../../redux/slices/authLogin";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { login } from "../../../redux/slices/authSignup";
import { app } from "../../../../Firebase";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const { email, password } = useSelector((state) => state.login);
  const { user } = useSelector((state) => state.signup);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    dispatch(updateLoginData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      navigate("/admin");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // If user is in Redux (from signup), continue
      if (user?.email === email && user?.password === password) {
        dispatch(login());

        switch (user.role) {
          case "renter":
            navigate("/renter-dashboard");
            break;
          case "buyer":
            navigate("/buyer-dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("User data missing. Please sign up again.");
        dispatch(resetLoginData());
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to your account</h2>
      <p>Please enter your email address and password to access your account</p>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-end mt-2">
          <Link to="/reset" className="text-decoration-none">
            <p className="text-warning mb-0">Forgot Password?</p>
          </Link>
        </div>

        <div className="mt-3 d-flex align-items-center gap-2">
          <button type="submit" className="btn btn-warning text-white">
            Login
          </button>
          <p className="mb-0">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-warning text-decoration-none">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
