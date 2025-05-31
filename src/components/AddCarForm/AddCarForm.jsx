import { useState } from "react";
import { addCarToFirestore } from "../CarListing/PostCarForm";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { saveNotification } from "../../Utils/SaveNotifications";
import CarForm from "../../pages/Form/CarFom";
import "react-toastify/dist/ReactToastify.css";

const AddCarForm = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState({
    name: "",
    type: "",
    model: "",
    mile: "",
    fuelType: "",
    transmission: "",
    doors: "",
    oneHourPrice: "",
    twentyFourHourPrice: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addCarToFirestore(carData);

    if (result.success) {
      toast.success("Car posted successfully!");

      const message = `A new car has been posted: ${carData.name}, ${carData.model}.`;

      try {
        await saveNotification({
          message,
          fromRole: "admin",
          toRoles: ["buyer", "seller"],
          type: "new_car",
        });
      } catch (error) {
        console.error("Error sending notification:", error);
      }
      setCarData({
        name: "",
        type: "",
        model: "",
        mile: "",
        fuelType: "",
        transmission: "",
        doors: "",
        oneHourPrice: "",
        twentyFourHourPrice: "",
        role: "",
      });

      setTimeout(() => navigate(-1), 1500);
    } else {
      toast.error("Failed to post car.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "500px" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-center mb-4">Post New Car</h2>
        <CarForm
          carData={carData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          showRoleSelector={true}
        />
      </div>
    </div>
  );
};

export default AddCarForm;
