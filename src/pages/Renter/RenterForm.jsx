import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../../../Firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CarForm from "../Form/CarFom";
import "react-toastify/dist/ReactToastify.css";
const RenterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    model: "",
    mile: "",
    fuelType: "",
    transmission: "",
    doors: "",
    oneHourPrice: "",
    twentyFourHourPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "renterRequests"), {
        ...formData,
        status: "pending",
        role: "renter",
        fromRole: "renter",
        toRole: "admin",
        createdBy: user.uid,
        createdAt: Timestamp.now(),
      });
      toast.success("Your request for post goes to admin");
      setTimeout(() => {
        navigate("/renter");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError("Failed to submit request");
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "500px" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="mb-4 text-center">Post Your Car for Rent</h2>
          <CarForm
          carData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          showRoleSelector={false}
        />
      </div>
    </div>
  );
};

export default RenterForm;
