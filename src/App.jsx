import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import SignUp from "./pages/auth/SignUp/SignUp";
import Login from "./pages/auth/Login/Login";
import Reset from "./pages/auth/reset/reset";
import Otp from "./pages/auth/otp/Otp";
import AdminDashboard from "./pages/Admin/Admin";
import AdminNotifications from './pages/Admin/AdminNotifications/AdminNotifications'
import CarList from "./components/CarListing/CarList";
import AddCarForm from "./components/AddCarForm/AddCarForm";
import BuyerDashboard from "./pages/Buyer/Buyer";
import RenterDashboard from "./pages/Renter/Renter";
import CarDetails from "./components/CarListing/CardDetail";
import BuyerNotification from "./pages/Buyer/BuyerNotification";
import LogoutButton from "./pages/auth/LogOut/LogOut";
import RenterForm from "./pages/Renter/RenterForm";
import AdminApprovals from "./pages/Admin/AdminApprovals/AdminApprovals";
import RenterNotify from "./pages/Renter/RenterNotification";
import Protected from "./components/ProtectedRoute/ProtectedRoute";
import RenterChatInterface from "./components/Chat/RenterChatInterface";
import AdminChatInterface from "./components/Chat/AdminChatInterface";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/Profile/Profile"
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("authToken") !== null;
  });
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/reset" element={<Reset />} />
        <Route path="/otp" element={<Otp />} />

        <Route
          path="/admin"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <AdminDashboard role="admin" />
            </Protected>
          }
        />
        <Route
          path="/buyer-profile"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <Profile userRole="buyer" />
            </Protected>
          }
        />
        
        <Route
          path="/renter-profile"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <Profile userRole="renter" />
            </Protected>
          }
        />
        <Route
          path="/buyer-dashboard"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <BuyerDashboard role="buyer" />
            </Protected>
          }
        />

        <Route
          path="/AddCarPost"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <AddCarForm />
            </Protected>
          }
        />

        <Route
          path="/renter"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <RenterDashboard role="renter" />
            </Protected>
          }
        />
        <Route path="/AdminNotifications" element={<AdminNotifications/>}/>
        <Route path="/CarList" element={<CarList />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/buyerNotification" element={<BuyerNotification />} />        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/renternotifications" element={<RenterNotify />} />
        <Route path="/renterCarPost" element={<RenterForm />} />
        <Route path="/AdminApprovals" element={<AdminApprovals />} />
        <Route path="/AdminChat" element={<AdminChatInterface />} />
        <Route path="/RenterChat" element={<RenterChatInterface />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
