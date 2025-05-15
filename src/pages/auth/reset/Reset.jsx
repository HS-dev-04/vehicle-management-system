import Email from "../../../components/Fields/EmailField";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setEmail } from "../../../redux/slices/authResetSlice";
import emailjs from "emailjs-com";

const Reset = () => {
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.authReset.email);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email before continuing.");
      return;
    }

    setLoading(true);
    const otp = generateOtp();

    localStorage.setItem("reset_otp", otp);
    localStorage.setItem("reset_email", email);
    console.log("Stored OTP:", otp);
    console.log("Stored Email:", email);

    const templateParams = {
      to_email: email,
      otp: otp,
    };

    emailjs
      .send(
        "service_kkr9u69",
        "template_ka9sylf",
        templateParams,
        "-1FSXLhcg50QmoNDz"
      )
      .then(
        (response) => {
          console.log("OTP sent:", response);
          setLoading(false);
          alert("OTP sent to your email.");
          navigate("/otp"); 
        },
        (error) => {
          console.error("Error sending OTP:", error);
          setLoading(false);
          alert("Failed to send OTP. Try again.");
        }
      );
  };

  const HandleChange = (e) => {
    dispatch(setEmail(e.target.value));
  };

  return (
    <>
      <div className="container mt-5">
        <h2>Reset Password</h2>
        <p className="text-muted">
          Please enter your email address to receive a one-time pin to reset your password.
        </p>
        <form onSubmit={handleSendOtp}>
          <Email
            name="email"
            label="Email Address*"
            placeholder="Enter your email"
            value={email}
            onChange={HandleChange}
            className="custom_Form"
            required
          />

          <div className="d-flex align-items-center mt-2">
            <Button variant="warning" type="submit" className="me-1" disabled={Loading}>
              {Loading ? "OTP sending..." : "Continue"}
            </Button>

            <p className="text-muted mb-0">
              Click by Mistake?{" "}
              <Link to="/login" className="text-warning text-decoration-none">
                Go Back to Login!
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Reset;
