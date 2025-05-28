import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";
import { Link } from "react-router-dom";

import car1 from "../../assets/car1.avif";
import car2 from "../../assets/car2.jpeg";
import car3 from "../../assets/car3.webp";
import car4 from "../../assets/car4.jpg";
import car5 from "../../assets/car5.jpg";
import car6 from "../../assets/car6.jpg";
import { FaCar } from "react-icons/fa";
import Filters from "../Filter/Filter";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;

  const [filters, setFilters] = useState({
    name: "",
    model: "",
  });

  const images = [car1, car2, car3, car4, car5, car6];

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const getImageIndex = (car) => {
    try {
      if (car.imageIndex !== undefined && !isNaN(car.imageIndex)) {
        const index = parseInt(car.imageIndex);
        if (index >= 0 && index < images.length) {
          return index;
        }
      }
     
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
      setCurrentPage(1); 
    };

    applyFilters();
  }, [filters, cars, roleFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      <Filters
        filters={filters}
        roleFilter={roleFilter}
        setFilters={setFilters}
        setRoleFilter={setRoleFilter}
      />

      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h3 className="fw-bold">
          {filteredCars.length}{" "}
          {filteredCars.length === 1 ? "Vehicle" : "Vehicles"} Found
        </h3>
        <div className="text-muted">
          Showing {indexOfFirstCar + 1}-
          {Math.min(indexOfLastCar, filteredCars.length)} of{" "}
          {filteredCars.length}
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
            <div className="display-1 text-muted mb-3">
              <FaCar />
            </div>
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
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentCars.map((car) => (
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
                      {car.type} • {car.model} •{" "}
                      {car.transmission || "Automatic"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCars.length > carsPerPage && (
            <div className="custom-pagination-wrapper mt-5">
              <nav>
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &laquo; Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    )
                  )}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
              <p className="text-center text-muted mt-2">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CarList;
