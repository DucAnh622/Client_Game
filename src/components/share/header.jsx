import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../../service/userService";
import { logoutSuccess } from "../../redux/action/userAction";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useSelector((state) => state.user.account);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    let res = await logoutUser();
    if (res && res.statusCode === 200) {
      navigate("/");
      dispatch(logoutSuccess());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <header className="header">
      <div className="nav-left">
        <span className="logo-text">
          Coding<span>Game</span>
        </span>
        <nav className="nav-menu">
          <NavLink to="/" className="nav-item">
            Home
          </NavLink>
          <NavLink to="/Feature" className="nav-item">
            Feature
          </NavLink>
          <NavLink to="/About" className="nav-item">
            About
          </NavLink>
        </nav>
      </div>
      <div className="user-section">
        {account && account.loading === true ? (
          <div className="user-menu" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="user-btn"
            >
              {account.username}
            </button>
            {showDropdown && (
              <div className="dropdown">
                <Link
                  to={`/account/${account.username}`}
                  className="dropdown-item"
                >
                  My Account
                </Link>
                <button
                  onClick={() => handleLogout()}
                  className="dropdown-item"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
