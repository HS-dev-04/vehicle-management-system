import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
const Sidebar = ({ role }) => {
  return (
    <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
      <h4 className="mb-4 text-center">
        {role.charAt(0).toUpperCase() + role.slice(1)} Panel
      </h4>

      <ul className="nav flex-column">
        {role === "admin" ? (
          <Link to="/AddCarPost" className="nav-link text-white">
            <FaCar /> <span>Add Car Post</span>
          </Link>
        ) : role === "renter" ? (
          <Link to="/renterCarPost" className="nav-link text-white">
            <FaCar /> <span>Add Car Post</span>
          </Link>
        ):null}

        <li className="nav-item mb-2">
          {role === "admin" ? (
            <Link
              to="/AdminNotifications"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <i className="fa-solid fa-bell"></i>
              <span>Notifications</span>
            </Link>
          ) : role === "buyer" ? (
            <Link
              to="/buyerNotification"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <i className="fa-solid fa-bell"></i>
              <span>Notifications</span>
            </Link>
          ) : (
            <Link
              to="/renternotifications"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <i className="fa-solid fa-bell"></i>
              <span> Notifications</span>
            </Link>
          )}
        </li>

        {role === "admin" && (
          <li className="nav-item mb-2">
            
            <Link
              to="/AdminApprovals"
              className="nav-link text-white d-flex align-items-center gap-2"
            >
              <RiAdminFill/>
              <span>Admin Approvals</span>
              
            </Link>
          </li>
        )}
        <Link to="/logout" className="nav-link text-white">
        <CiLogout />
          <span> Logout</span>
        </Link>
      </ul>
    </div>
  );
};
export default Sidebar;
