import { useState } from "react";
import CarList from "../../components/CarListing/CarList";
import AdminChatInterface from "../../components/Chat/AdminChatInterface";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../../components/SideBar/SideBar";

const AdminDashboard = ({ role }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role={role} />

      <div className="flex-grow-1 p-4">
       
        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                📊 Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "chats" ? "active" : ""}`}
                onClick={() => setActiveTab("chats")}
              >
                💬 Customer Chats
              </button>
            </li>
          </ul>
        </div>

        {activeTab === "dashboard" && (
          <>
            <h2>Dashboard</h2>
            <p>Welcome to the {role} dashboard. Use the sidebar to navigate.</p>
            <CarList/>
          </>
        )}

        {activeTab === "chats" && (
          <>
            <h2>Customer Inquiries</h2>
            <p>Manage customer chat inquiries about specific cars</p>
            <AdminChatInterface />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
