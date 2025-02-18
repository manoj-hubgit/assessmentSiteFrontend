import React, { useEffect, useState } from "react";
import { Navbar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../main";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(user);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    setIsLoggedIn(user);
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, [user]);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        EasyEval
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-gray-900 dark:text-white">Login</Link>
            <Link to="/register" className="text-gray-900 dark:text-white">Register</Link>
          </>
        ) : (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-gray-900 dark:text-white">Admin</Link>
                <Link to="/user" className="text-gray-900 dark:text-white">Users</Link> 
                <button onClick={handleLogout} className="text-gray-900 dark:text-white">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-gray-900 dark:text-white">
                Logout
              </button>
            )}
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
