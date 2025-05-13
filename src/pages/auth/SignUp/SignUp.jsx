import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../../../redux/slices/authSignup";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    contact: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
        setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      console.log('Authentication',auth)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

   const uid = userCredential.user.uid;

await setDoc(doc(db, "users", uid), {
  name: formData.name,
  email: formData.email,
  address: formData.address,
  contact: formData.contact,
  role: formData.role,
  uid: uid,
  createdAt: new Date(),
});


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
      toast.success("Account created successfully!");
setTimeout(() => {
  navigate("/login");
}, 4000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email already exists");
      } else {
        toast.error("Signup error: " + error.message);
      }
      console.error("Signup error:", error.message);
    }finally{
          setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-2">
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-3">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-1">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
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
                  label="Renter"
                  name="role"
                  type="radio"
                  id="renter-role"
                  value="renter"
                  checked={formData.role === "renter"}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
   <Button
  variant="warning"
  type="submit"
  className="w-100 mt-3"
  disabled={loading}
>
  {loading ? "Creating account..." : "Sign Up"}
</Button>


          </Form>
          <div className="text-center mt-2">
            Already have an account?{" "}
            <b>
              <Link className="text-warning text-decoration-none" to="/login">
                Log In here!
              </Link>
            </b>
          </div>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
