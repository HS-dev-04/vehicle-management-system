import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Car_Pic from "../../assets/Car_Pic.jpeg";
const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="landing-container">
      <header className="navbar">
        <div className="logo">RESERVE NOW</div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <button
            onClick={() => navigate("/signup")}
            className="customButtonStyling"
          >
            Buyer
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="customButtonStyling"
          >
            Seller
          </button>
          <button className="sign-in" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          &#9776;
        </div>
      </header>

      <section
        className="hero"
        style={{
          backgroundImage: `url(${Car_Pic})`,
          height: "100vh",
          position: "relative",
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>RESERVE NOW & Get 50% Off</h1>
          <h2>WELCOME</h2>
          <Link to="/signup">
            <button className="reserve-btn">RESERVE NOW</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
