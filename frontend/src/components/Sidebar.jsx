// Sidebar.jsx
import React from "react";
import icon from "./../assets/icon-white.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Sidebar = ({ isMobileOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    if (isMobileOpen) {
      toggleSidebar();
    }
  };

  const handleLinkClick = () => {
    if (isMobileOpen) {
      toggleSidebar();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-[270px] bg-blue-700 text-white p-3 flex flex-col justify-between
                 transform transition-transform duration-300 ease-in-out
                 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                 lg:translate-x-0 lg:static lg:w-[240px] lg:z-auto lg:inset-y-auto lg:transform-none lg:transition-none`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white lg:hidden"
        aria-label="Close sidebar"
      >
        <Icon icon="material-symbols:close" width="24" height="24" />
      </button>
      <div>
        <div className="flex flex-row items-center space-x-2 mb-8 mt-4">
          <img src={icon} alt="white-icon" className="w-[40px] h-[40px]" />
          <span className="font-inter text-[16px] font-semibold text-white">
            Moneasy
          </span>
        </div>

        {/* Menu Utama */}
        <ul className="space-y-4 text-[14px] font-medium mt-12 px-1">
          {" "}
          {[
            { path: "/beranda", icon: "mage:dashboard-fill", label: "Beranda" },
            { path: "/dompet", icon: "tdesign:wallet", label: "Dompet" },
            {
              path: "/anggaran",
              icon: "cuida:lamp-on-outline",
              label: "Anggaran",
            },
            {
              path: "/transaksi",
              icon: "ph:money-wavy-bold",
              label: "Transaksi",
            },
            {
              path: "/goal",
              icon: "mdi:piggy-bank-outline",
              label: "Rencana Tabungan",
            },
            { path: "/kategori", icon: "uil:sliders-v", label: "Kategori" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 p-2 rounded cursor-pointer w-full transition duration-150 ease-in-out
                           ${
                             isActive(item.path)
                               ? "bg-white font-medium text-[#2667FF]"
                               : "hover:bg-blue-600"
                           }`}
              >
                <Icon icon={item.icon} width="20" height="20" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul className="space-y-2 text-xs">
          <li>
            <Link
              to="/settings"
              onClick={handleLinkClick}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition duration-150 ease-in-out
                         ${
                           isActive("/settings")
                             ? "bg-white font-medium text-[#2667FF]"
                             : "hover:bg-blue-600"
                         }`}
            >
              <Icon icon="uil:setting" width="18" height="18" />
              <span>Pengaturan</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer w-full text-left transition duration-150 ease-in-out"
            >
              <Icon icon="material-symbols:logout" width="18" height="18" />
              <span>Keluar</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
