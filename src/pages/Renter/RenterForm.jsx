import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../../../Firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const RenterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    model: "",
    priceHour: "",
    priceDay: "",
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

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Car Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter car name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              className="form-control"
              name="type"
              placeholder="Enter car type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Model</label>
            <input
              type="text"
              className="form-control"
              name="model"
              placeholder="Enter model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price per Hour</label>
            <input
              type="number"
              className="form-control"
              name="priceHour"
              placeholder="Enter 1-hour price"
              value={formData.priceHour}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price per 24 Hours</label>
            <input
              type="number"
              className="form-control"
              name="priceDay"
              placeholder="Enter 24-hour price"
              value={formData.priceDay}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary " disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RenterForm;
