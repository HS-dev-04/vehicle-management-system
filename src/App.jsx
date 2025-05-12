
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './pages/auth/SignUp/SignUp';
import Login from './pages/auth/Login/Login';
import LandingPage from './components/LandingPage/LandingPage';
import { Routes, Route } from 'react-router-dom';
import Reset from './pages/auth/reset/reset';
import Otp from './pages/auth/otp/Otp';
// import CreatePassword from './pages/auth/Reset Password/ResetPassword';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset" element={<Reset/>}/>
      <Route path='/otp' element={<Otp/>}/>
      {/* <Route path='/CreatePassword'element={<CreatePassword/>}/> */}
    </Routes>
  );
};

export default App;
