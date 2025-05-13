import React, { useState } from 'react';
import { addCarToFirestore } from '../CarListing/PostCarForm';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddCarForm = () => {
    const navigate = useNavigate();
  const [carData, setCarData] = useState({
    name: '',
    type: '',
    model: '',
    oneHourPrice: '',
    twentyFourHourPrice: ''
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
      setCarData({
        name: '',
        type: '',
        model: '',
        oneHourPrice: '',
        twentyFourHourPrice: ''
      });
      navigate
    } else {
       toast.error('Failed to post car.');
    }
    
  };
 
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
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

          <button type="submit" className="btn btn-primary w-100" >
            Post Car
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AddCarForm;
