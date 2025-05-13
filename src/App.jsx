
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './pages/auth/SignUp/SignUp';
import Login from './pages/auth/Login/Login';
import LandingPage from './components/LandingPage/LandingPage';
import { Routes, Route } from 'react-router-dom';
import Reset from './pages/auth/reset/reset';
import Otp from './pages/auth/otp/Otp';
import Admin from './pages/Admin/Admin';
// import CreatePassword from './pages/auth/Reset Password/ResetPassword';
import CarList from './components/CarListing/CarList';
import AddCarForm from './components/AddCarForm/AddCarForm';
import Buyer from './pages/Buyer/Buyer';
// import CarDetail from './components/CarListing/CardDetail';
import CarDetails from './components/CarListing/CardDetail';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset" element={<Reset/>}/>
      <Route path='/otp' element={<Otp/>}/>
      <Route path='/admin' element={<Admin/>}/>
      {/* <Route path='/CreatePassword'element={<CreatePassword/>}/> */}
      <Route path='/CarList' element={<CarList/>}/>
      {/* <Route path='/CardDetail' element={<CarDetail/>}/> */}
      <Route path="/AddCarPost" element={<AddCarForm/>}/>
      <Route path="/buyer-dashboard" element={<Buyer/>}/>
       <Route path="/car/:id" element={<CarDetails />}/>
    </Routes>
  );
};

export default App;
