import { useState } from "react";
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
import InputField from "../../../components/Fields/InputField";
import RoleRadioGroup from "../../../components/Fields/RoleRadioGroup";

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        ...formData,
        uid,
        createdAt: new Date(),
      });

      dispatch(signup({ ...formData }));

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 4000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email already exists");
      } else {
        toast.error("Signup error: " + error.message);
      }
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-2">
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-3">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <InputField 
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <InputField
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <InputField
              label="Contact Number"
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
            <RoleRadioGroup value={formData.role} onChange={handleChange} />
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
