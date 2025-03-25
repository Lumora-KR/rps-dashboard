"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, User, Settings, Search } from "react-feather";
import { Avatar } from "@mui/material";
import "./Navbar.css";

const Navbar = ({ toggleSidebar, user }) => {
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="dashboard-navbar">
      <div className="container-fluid">
        <div className="navbar-content">
          <div className="navbar-left">
            <h4 className="page-title ms-4">Dashboard</h4>
          </div>

          <div className="navbar-right">
            {/* <div className="search-container d-none d-md-flex">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div>
            </div> */}

            <div className="navbar-actions">
              {/* <button className="navbar-action-btn">
                <Bell size={18} />
                <span className="notification-badge">3</span>
              </button> */}

              <div className="user-dropdown">
                <button
                  className="user-dropdown-toggle"
                  onClick={toggleDropdown}
                >
                  <Avatar className="user-avatar">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </button>

                {showDropdown && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-header">
                      <Avatar className="dropdown-avatar">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <div className="dropdown-user-info">
                        <h6>{user?.username || "User"}</h6>
                        <p>Administrator</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    {/* <button className="dropdown-item">
                      <User size={16} />
                      <span>Profile</span>
                    </button> */}
                    {/* <button className="dropdown-item">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button> */}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
