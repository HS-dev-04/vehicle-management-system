import React from 'react'
import { Link } from 'react-router-dom'
import CarList from '../../components/CarListing/CarList'
const Buyer = () => {
  return (
     <div className="d-flex" style={{ minHeight: '100vh' }}>
          {/* Sidebar */}
          <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
            <h4 className="mb-4 text-center">Buyer Dasboard</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/AddCarPost" className="nav-link text-white">
                  🚗 Add Car Post
                </Link>
              </li>
              {/* You can add more sidebar items below */}
              {/* <li className="nav-item mb-2">
                <Link to="/manageCars" className="nav-link text-white">
                  🛠 Manage Cars
                </Link>
              </li> */}
            </ul>
          </div>
    
          {/* Main Content Area */}
          <div className="flex-grow-1 p-4">
            <h2>Dashboard</h2>
            <p>Welcome to the Buyer dashboard. Use the sidebar to navigate.</p>
            <CarList/>
          </div>
        </div>
  )
}

export default Buyer