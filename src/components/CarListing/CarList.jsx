import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
import car1 from "../../assets/car1.avif";
import car2 from "../../assets/car2.jpeg";
import car3 from "../../assets/car3.webp";
import car4 from "../../assets/car4.jpg";
import car5 from "../../assets/car5.jpg";
import car6 from "../../assets/car6.jpg";
import { FaCar, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
=======
import car1 from "../../../dist/assets/car1-DJAA6xJ2-DJAA6xJ2.avif";
import car2 from "../../../dist/assets/car2-9TEypQN7-9TEypQN7.jpeg";
import car3 from "../../../dist/assets/car3-CdT7_i8_-CdT7_i8_.webp";
import car4 from "../../../dist/assets/car4-D85rijZ0-D85rijZ0.jpg";
import car5 from "../../../dist/assets/car5-R3x2BmsM-R3x2BmsM.jpg";
import car6 from "../../../dist/assets/car6-CLr8pv4--CLr8pv4-.jpg";
import { FaCar } from "react-icons/fa";
import Filters from "../Filter/Filter";
>>>>>>> Stashed changes

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    model: "",
  });

  const images = [car1, car2, car3, car4, car5, car6];
  const getImageIndex = (car) => {
    try {
      if (car.imageIndex !== undefined && !isNaN(car.imageIndex)) {
        const index = parseInt(car.imageIndex);
        if (index >= 0 && index < images.length) {
          return index;
        }
      }
<<<<<<< Updated upstream
      //using hashing for static pic
=======

>>>>>>> Stashed changes
      if (car.id) {
        let hash = 0;
        for (let i = 0; i < car.id.length; i++) {
          hash = (hash << 5) - hash + car.id.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash) % images.length;
      }
      return 0;
    } catch (e) {
      console.error("Error determining image index:", e);
      return 0;
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          imageIndex: getImageIndex({ id: doc.id, ...doc.data() }),
        }));
        setCars(carList);
        setFilteredCars(carList);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  useEffect(() => {
    const applyFilters = () => {
      const { name, model } = filters;

      const filtered = cars.filter((car) => {
        const matchesName =
          name === "" || car.name.toLowerCase().includes(name.toLowerCase());
        const matchesModel =
          model === "" || car.model.toLowerCase().includes(model.toLowerCase());
        const matchesRole = roleFilter === "" || car.role === roleFilter;

        return matchesName && matchesModel && matchesRole;
      });

      setFilteredCars(filtered);
<<<<<<< Updated upstream
=======
      setCurrentPage(1);
>>>>>>> Stashed changes
    };

    applyFilters();
  }, [filters, cars, roleFilter]);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-success">
          <FaCar className="me-2" />
          Explore Our Vehicles
        </h1>
        <p className="lead text-muted">
          Find the perfect vehicle for your needs
        </p>
      </div>

      <div className="card mb-5 border-0 shadow-lg">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Options
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">
                <FaSearch className="me-2" />
                Search by Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control "
                placeholder="e.g. Toyota"
                value={filters.name}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">
                <FaCalendarAlt className="me-2" />
                Search by Model
              </label>
              <input
                type="text"
                name="model"
                className="form-control"
                placeholder="e.g. 2020"
                value={filters.model}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by Role</label>
              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    type="radio"
                    id="all"
                    name="roleFilter"
                    className="form-check-input"
                    value=""
                    checked={roleFilter === ""}
                    onChange={() => setRoleFilter("")}
                  />
                  <label className="form-check-label" htmlFor="all">
                    All
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="buyer"
                    name="roleFilter"
                    className="form-check-input"
                    value="buyer"
                    checked={roleFilter === "buyer"}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="buyer">
                    Buyer
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="renter"
                    name="roleFilter"
                    className="form-check-input"
                    value="renter"
                    checked={roleFilter === "renter"}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  />
                  <label
                    className="form-check-label text-black"
                    htmlFor="renter"
                  >
                    Renter
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h3 className="fw-bold">
          {filteredCars.length}{" "}
          {filteredCars.length === 1 ? "Vehicle" : "Vehicles"} Found
        </h3>
        <div className="text-muted">
          Showing {Math.min(filteredCars.length, 6)} of {filteredCars.length}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading vehicles...</p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <div className="display-1 text-muted mb-3">🚗</div>
            <h3 className="text-muted">No vehicles match your criteria</h3>
            <p className="text-muted">
              Try adjusting your filters or search terms
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => {
                setFilters({ name: "", model: "" });
                setRoleFilter("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredCars.slice(0, 6).map((car) => (
            <div className="col" key={car.id}>
              <div className="card h-100 shadow-sm border-0 overflow-hidden">
                <div className="position-relative">
                  <img
                    src={images[car.imageIndex]}
                    className="card-img-top"
                    alt={car.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span
                      className={`badge ${
                        car.role === "buyer" ? "bg-success" : "bg-info"
                      }`}
                    >
                      {car.role === "buyer" ? "FOR SALE" : "FOR RENT"}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0">{car.name}</h5>
                    <span className="text-primary fw-bold">
                      {" "}
                      <div className="d-flex justify-content-end align-items-center">
                        <Link
                          to={`/car/${car.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </span>
                  </div>
                  <p className="card-text text-muted small mb-3">
                    {car.type} • {car.model} • {car.transmission || "Automatic"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCars.length > 6 && (
        <div className="text-center mt-5">
          <button className="btn btn-primary px-4 py-2">
            Load More Vehicles
          </button>
        </div>
      )}
    </div>
  );
};

export default CarList;
