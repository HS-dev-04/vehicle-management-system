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
  const [filters, setFilters] = useState({
    name: "",
    model: "",
    oneHourMin: "",
    oneHourMax: "",
    dayMin: "",
    dayMax: "",
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
      const { name, model, oneHourMin, oneHourMax, dayMin, dayMax } = filters;

      const filtered = cars.filter((car) => {
        const matchesName =
          name === "" || car.name.toLowerCase().includes(name.toLowerCase());
        const matchesModel =
          model === "" || car.model.toLowerCase().includes(model.toLowerCase());
        const matchesOneHour =
          (!oneHourMin || car.oneHourPrice >= Number(oneHourMin)) &&
          (!oneHourMax || car.oneHourPrice <= Number(oneHourMax));
        const matchesDay =
          (!dayMin || car.twentyFourHourPrice >= Number(dayMin)) &&
          (!dayMax || car.twentyFourHourPrice <= Number(dayMax));

        return matchesName && matchesModel && matchesOneHour && matchesDay;
      });

      setFilteredCars(filtered);
    };

    applyFilters();
  }, [filters, cars]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Cars</h2>

      <div className="card mb-4 p-3 shadow-sm">
        <div className="row g-3">
          <div className="col-md-3">
            <input 
              type="text"
              name="name"
              placeholder="Search by Name"
              value={filters.name}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="model"
              placeholder="Search by Model"
              value={filters.model}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="oneHourMin"
              placeholder="Min 1-Hour Price"
              value={filters.oneHourMin}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="oneHourMax"
              placeholder="Max 1-Hour Price"
              value={filters.oneHourMax}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="dayMin"
              placeholder="Min 24-Hour Price"
              value={filters.dayMin}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="dayMax"
              placeholder="Max 24-Hour Price"
              value={filters.dayMax}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Car Cards */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredCars.slice(0, 6).map((car, index) => (
          <div className="col" key={car.id}>
            <Link
              to={`/car/${car.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={images[index % images.length]}
                  className="card-img-top"
                  alt={car.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{car.name}</h5>
                  <p className="card-text text-muted">{car.type}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
