import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import SignUp from './pages/auth/SignUp/SignUp';
import Login from './pages/auth/Login/Login';
import Reset from './pages/auth/reset/reset';
import Otp from './pages/auth/otp/Otp';
// import CreatePassword from './pages/auth/Reset Password/ResetPassword';
import AdminDashboard from './pages/Admin/Admin'
import CarList from './components/CarListing/CarList';
import AddCarForm from './components/AddCarForm/AddCarForm';
import BuyerDashboard from './pages/Buyer/Buyer'
import RenterDashboard from './pages/Renter/Renter';
import CarDetails from './components/CarListing/CardDetail';
import BuyerNotification from './pages/Buyer/BuyerNotification';
import LogoutButton from './pages/auth/LogOut/LogOut';
// import RenterNotification from './pages/Renter/RenterNotification'
import RenterForm from './pages/Renter/RenterForm';
import AdminApprovals from './pages/Admin/AdminApprovals/AdminApprovals';
import RenterNotify from './pages/Renter/RenterNotification';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset" element={<Reset/>}/>
      <Route path='/otp' element={<Otp/>}/>
    <Route path='/admin' element={<AdminDashboard role="admin" />} />
      {/* <Route path='/CreatePassword'element={<CreatePassword/>}/> */}
      <Route path='/CarList' element={<CarList/>}/>
      <Route path="/AddCarPost" element={<AddCarForm/>}/>
      <Route path="/buyer-dashboard" element={<BuyerDashboard role="buyer"/>}/>
      <Route path='/renter' element={<RenterDashboard role="renter" />}></Route>
       <Route path="/car/:id" element={<CarDetails />}/>
       <Route path="/buyerNotification" element={<BuyerNotification/>}/>
       <Route path="/logout" element={<LogoutButton/>}/> 
       <Route path="/renternotifications" element={<RenterNotify />} />
       <Route path='renterCarPost' element={<RenterForm/>}/>
       <Route path='/AdminApprovals' element={<AdminApprovals/>}/>
    </Routes>
  );
};

export default App;
