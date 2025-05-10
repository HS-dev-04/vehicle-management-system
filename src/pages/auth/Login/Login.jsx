import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateLoginData, resetLoginData} from '../../../redux/slices/authLogin'
import { login } from '../../../redux/slices/authSignup';
import { Link } from 'react-router-dom';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password } = useSelector((state) => state.login);
  const { user, isAuthenticated } = useSelector((state) => state.signup);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    dispatch(updateLoginData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
   
    if (user.email === email && user.password === password) {
      dispatch(login()); 
      
     
      switch(user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'seller':
          navigate('/seller-dashboard');
          break;
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError('Invalid email or password');
      dispatch(resetLoginData());
    }
  };

  return (
    <div className="login-container">
      <h2>Login to your account</h2>
      <p>Please enter your email address and password to access your account</p>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className='text-white bg-warning'>Login</button>
           <div className="text-center mt-2">
                    Dont  have an account? <b><Link className="text-warning" to="/signup">Sign Up!</Link></b>
            </div>
      </form>
    </div>
  );
};

export default Login;