import React, { useState } from 'react';
import { addCarToFirestore } from '../CarListing/PostCarForm'; // Assuming this function posts the car
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { saveNotification } from '../../Utils/SaveNotifications';
import 'react-toastify/dist/ReactToastify.css';


const AddCarForm = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState({
    name: '',
    type: '',
    model: '',
    oneHourPrice: '',
    twentyFourHourPrice: '',
    role: ''
  });

  const handleChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addCarToFirestore(carData);

    if (result.success) {
      toast.success('Car posted successfully!');
      
      const message = `A new car has been posted: ${carData.name}, ${carData.model}.`;
      
      try {
        await saveNotification({
          message,
          fromRole: "admin",
          toRoles: ["buyer", "seller"], 
          type: "new_car"
        });
        
        console.log("Notification sent successfully.");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
      setCarData({
        name: '',
        type: '',
        model: '',
        oneHourPrice: '',
        twentyFourHourPrice: '',
        role: ''
      });

      setTimeout(() => navigate(-1), 1500); 
    } else {
      toast.error('Failed to post car.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-center mb-4">Post New Car</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Car Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter car name"
              value={carData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              placeholder="Enter car type"
              value={carData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              placeholder="Enter model"
              value={carData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price per Hour</label>
            <input
              type="number"
              name="oneHourPrice"
              className="form-control"
              placeholder="Enter 1-hour price"
              value={carData.oneHourPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price per 24 Hours</label>
            <input
              type="number"
              name="twentyFourHourPrice"
              className="form-control"
              placeholder="Enter 24-hour price"
              value={carData.twentyFourHourPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Type Of car</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="buyer-role"
                  value="buyer"
                  checked={carData.role === "buyer"}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="buyer-role">Buyer</label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="renter-role"
                  value="renter"
                  checked={carData.role === "renter"}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="renter-role">Renter</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Post Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarForm;
