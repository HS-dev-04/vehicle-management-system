import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const Otp = () => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; 

    const updatedDigits = [...otpDigits];
    updatedDigits[index] = value;
    setOtpDigits(updatedDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus(); 
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");
    const storedOtp = localStorage.getItem("reset_otp");

    if (enteredOtp === storedOtp) {
      navigate("/CreatePassword");
    } else {
      setError("Please enter the correct 6-digit code.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Enter one time OTP</h3>
      <p>Please enter one time pin, We just sent to your submitted email address.</p>
      <p>Enter OTP</p>
      <Form onSubmit={handleVerify}>
        <div className="d-flex gap-2 mb-3">
          {otpDigits.map((digit, index) => (
            <Form.Control
              key={index}
              type="text"
              maxLength={1}
              className="text-center fs-4"
              style={{ width: "3rem" }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              required
            />
          ))}
        </div>
        {error && <p className="text-danger">{error}</p>}
        <Button type="submit" variant="warning">
          Verify
        </Button>
      </Form>
    </div>
  );
};

export default Otp;
