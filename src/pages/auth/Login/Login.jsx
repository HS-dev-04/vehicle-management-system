import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  updateLoginData,
  resetLoginData,
} from "../../../redux/slices/authLogin";
import { login } from "../../../redux/slices/authSignup";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password } = useSelector((state) => state.login);
  const { user } = useSelector((state) => state.signup);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    dispatch(updateLoginData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!user || !user.email || !user.password) {
      setError("User not found. Please create account.");
      dispatch(resetLoginData())
      return;
    }
    if (user.email === email && user.password === password) {
      dispatch(login());

    
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "seller":
          navigate("/seller-dashboard");
          break;
        case "buyer":
          navigate("/buyer-dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      setError("Invalid email or password");
      dispatch(resetLoginData());
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
