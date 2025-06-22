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

      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: "100vh" }}>
       
        <div className="mb-4 p-4 pb-0">
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
          <div className="flex-grow-1 p-4 pt-0">
            <h2>Dashboard</h2>
            <p>Welcome to the {role} dashboard. Use the sidebar to navigate.</p>
            <CarList/>
          </div>
        )}

        {activeTab === "chats" && (
          <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
            <div className="px-4 pb-2">
              <h2 className="mb-1">Customer Inquiries</h2>
              <p className="mb-3">Manage customer chat inquiries about specific cars</p>
            </div>
            <div className="flex-grow-1" style={{ minHeight: 0 }}>
              <AdminChatInterface />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;