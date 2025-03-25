"use client";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Home,
  Package,
  Map,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "react-feather";
import "./Sidebar.css";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { FaHotel } from "react-icons/fa";

const Sidebar = ({ isOpen, setSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: "/home-enquiries",
      name: "Home Enquiries",
      icon: <Package size={20} />,
    },
    {
      path: "/tour-package-detail-enquiries",
      name: "Tour Package Detail Enquiries",
      icon: <Map size={20} />,
    },
    {
      path: "/dashboard/car-enquiries",
      name: "Car Rental Enquiries",
      icon: <Map size={20} />,
    },
    {
      path: "/dashboard/hotel-enquiries",
      name: "Hotel Enquiries",
      icon: <Map size={20} />,
    },
    {
      path: "/contact-form-submissions",
      name: "Contact Form Submissions",
      icon: <MessageSquare size={20} />,
    },
    {
      path: "/add-hotel",
      name: "Add Hotel",
      icon: <FaHotel size={20} />,
    },
    {
      path: "/add-car-rental",
      name: "Add Car Rental",
      icon: <DirectionsCarIcon size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={toggleSidebar}
      ></div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <h3 className="logo-text">RPS Tours</h3>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-menu-item ${isActive ? "active" : ""}`
              }
              end={item.path === "/"}
              onClick={() => setSidebarOpen(!isOpen)}
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              <span className="sidebar-menu-text">{item.name}</span>
              {item.path === location.pathname && (
                <span className="active-indicator"></span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <button
        className={`sidebar-toggle ${isOpen ? "d-none d-lg-flex" : ""}`}
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;
