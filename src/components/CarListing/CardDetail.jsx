import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Firebase";
import { ToastContainer, toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCar,
  FaGasPump,
  FaTachometerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaCarSide,
  FaImage,
  FaComments
} from "react-icons/fa";
import { GiCarDoor, GiGearStick } from "react-icons/gi";
import {auth} from '../../../Firebase';
import ChatWindow from "../Chat/ChatWindow";

import car1 from "../../assets/car1.avif";
import car2 from "../../assets/car2.jpeg";
import car3 from "../../assets/car3.webp";
import car4 from "../../assets/car4.jpg";
import car5 from "../../assets/car5.jpg";
import car6 from "../../assets/car6.jpg";

const carImages = [car1, car2, car3, car4, car5, car6].filter(Boolean);

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [showChat,setShowChat] = useState(false);
  const [currentUserId,setCurrentUserId] = useState(null)
  useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        console.log("Current user UID:", user.uid);
      } else {
        setCurrentUserId(null);
        console.log("No user logged in");
      }
    });
    const fetchCar = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const carData = { id: docSnap.id, ...docSnap.data() };
          setCar(carData);
          const imgIndex =
            carData.imageIndex >= 0 && carData.imageIndex < carImages.length
              ? carData.imageIndex
              : Math.abs(carData.id?.hashCode() || 0) % carImages.length;
          setCurrentImage(carImages[imgIndex]);

          toast.success("Car details loaded successfully!");
        } else {
          toast.error("No such car found!");
        }
      } catch (error) {
        toast.error("Error fetching car details!");
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
     return () => unsubscribe();
  }, [id]);

  //use HASHING code for picture
  String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      const char = this.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <ToastContainer />
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5">Loading vehicle details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container py-5 text-center">
        <ToastContainer />
        <div className="card shadow-sm border-0 py-5">
          <div className="card-body">
            <h1 className="display-5 text-danger mb-4">🚗 Vehicle Not Found</h1>
            <p className="lead">
              The requested vehicle could not be located in our system.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const HandleMessageClick = () => {  
  if (!currentUserId) {
    toast.error("Please log in to start a chat!");
    return;
  }
  setShowChat(true);
  toast.info("Opening Chat!");
};
  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-black d-flex align-items-center justify-content-center">
          <FaCar className="me-2" />
          {car.name} - {car.model}
        </h1>
        <div className="badge bg-success text-white fs-6 mt-2 px-3 py-2">
          Available for {car.role === "buyer" ? "Purchase" : "Rental"}
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-lg overflow-hidden">
            {currentImage ? (
              <div className="ratio ratio-16x9">
                <img
                  src={currentImage}
                  className="img-fluid object-fit-cover"
                  alt={`${car.name} ${car.model}`}
                />
              </div>
            ) : (
              <div className="ratio ratio-16x9 bg-light d-flex flex-column align-items-center justify-content-center">
                <FaImage className="fs-1 text-muted mb-2" />
                <span className="text-muted">Image not available</span>
              </div>
            )}
          </div>

          <div className="row g-3 mt-3">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center py-3">
                <FaTachometerAlt className="fs-3 text-success mb-2 mx-auto" />
                <h6 className="mb-0">Mileage</h6>
                <p className="text-muted mb-0">{car.mile }</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center py-3">
                <FaGasPump className="fs-3 text-success mb-2 mx-auto" />
                <h6 className="mb-0">Fuel Type</h6>
                <p className="text-muted mb-0">{car.fuelType}</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center py-3">
                <GiGearStick className="fs-3 text-success mb-2 mx-auto" />
                <h6 className="mb-0">Transmission</h6>
                <p className="text-muted mb-0">
                  {car.transmission}
                </p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center py-3">
                <GiCarDoor className="fs-3 text-success mb-2 mx-auto" />
                <h6 className="mb-0">Doors</h6>
                <p className="text-muted mb-0">{car.doors}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-lg h-90">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">Vehicle Specifications</h3>

              <div className="mb-4">
                <h5 className="fw-bold mb-3">
                  <FaCarSide className="me-2 text-danger" />
                  Overview
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Type:</span>
                    <span className="fw-medium">{car.type}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Model Year:</span>
                    <span className="fw-medium">{car.model}</span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold mb-3">
                  <FaMoneyBillWave className="me-2 text-primary" />
                  Pricing
                </h5>
                <button
                onClick={HandleMessageClick}
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                style={{padding:"12px"}}>
                  <FaComments size={20}/>
                  <span>Message about the car</span>
                </button>
                {car.role === "renter" ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <FaClock className="me-2 text-primary" />
                        <span className="text-muted">Hourly Rate:</span>
                      </div>
                      <span className="fw-bold text-success">
                        ${car.oneHourPrice}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <FaCalendarAlt className="me-2 text-primary" />
                        <span className="text-muted">Daily Rate:</span>
                      </div>
                      <span className="fw-bold text-success">
                        ${car.twentyFourHourPrice}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaMoneyBillWave className="me-2 text-primary" />
                      <span className="text-muted">Purchase Price:</span>
                    </div>
                    <span className="fw-bold text-success">
                      ${car.twentyFourHourPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>      </div>
      {showChat && (
        <ChatWindow 
          carId={car.id}
          carName={`${car.name} - ${car.model}`}
          onClose={() => setShowChat(false)}
          currentUserId = {currentUserId}
          carRole = {car.role}
          carOwnerId={car.postedBy || car.createdBy}
        />
      )}
    </div>
  );
};

export default CarDetails;
