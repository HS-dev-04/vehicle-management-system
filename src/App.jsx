
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './pages/auth/SignUp/SignUp';
import Login from './pages/auth/Login/Login';
import LandingPage from './components/LandingPage/LandingPage';
import { Routes, Route } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
