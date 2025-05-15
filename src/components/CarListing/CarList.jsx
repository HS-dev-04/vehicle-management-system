import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";
import { Link } from "react-router-dom";
import car1 from "../../assets/car1.avif";
import car2 from "../../assets/car2.jpeg";
import car3 from "../../assets/car3.webp";
import car4 from "../../assets/car4.jpg";
import car5 from "../../assets/car5.jpg";
import car6 from "../../assets/car6.jpg";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    model: "",
  });

  const images = [car1, car2, car3, car4, car5, car6];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carList);
        setFilteredCars(carList);
      } catch (error) {
        console.error("Error fetching cars:", error);
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
    };

    applyFilters();
  }, [filters, cars, roleFilter]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Cars</h2>

      <div className="card mb-4 p-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Search by Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Toyota"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Search by Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              placeholder="e.g. 2020"
              value={filters.model}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-6">
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
                <label className="form-check-label text-black" htmlFor="renter">
                  Renter
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredCars.length === 0 ? (
          <div className="col-12 text-center text-muted">No cars found</div>
        ) : (
          filteredCars.slice(0, 6).map((car, index) => (
            <div className="col" key={car.id}>
              <Link
                to={`/car/${car.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={images[car.imageIndex ?? (index % images.length)]}
                    className="card-img-top"
                    alt={car.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{car.name}</h5>
                    <p className="card-text text-muted">
                      {car.type} - {car.model}
                    </p>
                    <p className="text-black mb-0">
                      {car.role?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CarList;
