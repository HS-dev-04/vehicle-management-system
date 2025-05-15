import React from 'react'
import { Link } from 'react-router-dom'
import CarList from '../../components/CarListing/CarList'
import "@fortawesome/fontawesome-free/css/all.min.css";
const Renter = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="mb-4 text-center">Buyer Dasboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/renterCarPost" className="nav-link text-white">
              🚗 Add Car Post
            </Link>
            <Link
              to="/renterNotification"
              className="nav-link text-white d-flex align-items-center gap-2"
            > 
              <i className="fa-solid fa-bell"></i>
              <span>Notifications</span>
            </Link>
            <Link
            to="/logout"
              className="nav-link text-white d-flex align-items-center gap-2">
                <span>Logout</span>
            </Link>
          </li>

        </ul>
      </div>
      
      <div className="flex-grow-1 p-4">
        <h2>Dashboard</h2>
        <p>Welcome to the Renter dashboard. Use the sidebar to navigate.</p>
        <CarList />
      </div>
    </div>
  );
}

export default Renter;



