import CarList from "../../components/CarListing/CarList";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../../components/SideBar/SideBar";
const RenterDashboard = ({ role }) => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role={role} />

      <div className="flex-grow-1 p-4">
        <h2>Dashboard</h2>
        <p>Welcome to the {role} dashboard. Use the sidebar to navigate.</p>
        <CarList userRole={role}/>
      </div>
    </div>
  );
};

export default RenterDashboard;
