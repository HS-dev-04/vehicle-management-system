import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../../../redux/slices/authSignup";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
const SignUp = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    contact: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    dispatch(
      signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        contact: formData.contact,
        role: formData.role,
      })
    );

    // Navigate to login
    // navigate('/login');
  };

  return (
    <div className="d-flex justify-content-center mt-2">
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-3">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-1">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                className="no-focus-border"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="no-focus-border"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="no-focus-border"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                className="no-focus-border"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                className="no-focus-border"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                className="no-focus-border"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Account Type</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Buyer"
                  name="role"
                  type="radio"
                  id="buyer-role"
                  value="buyer"
                  checked={formData.role === "buyer"}
                  onChange={handleChange}
                  required
                />
                <Form.Check
                  inline
                  label="Seller"
                  name="role"
                  type="radio"
                  id="seller-role"
                  value="seller"
                  checked={formData.role === "seller"}
                  onChange={handleChange}
                  required
                />
                <Form.Check
                  inline
                  label="Admin "
                  name="role"
                  type="radio"
                  id="admin-role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <Button variant="btn btn-warning" type="submit" className="w-100 mt-3">
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-2">
            Already have an account? <b><Link className="text-warning" to="/login">Log In here!</Link></b>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp;
