import React from "react";
import icon from "./../assets/whiteicon.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[240px] bg-blue-700 text-white h-screen p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-row items-center space-x-2">
          <img src={icon} alt="white-icon" className="w-[26px] h-[26px]" />
          <span className="font-inter text-[16px] font-semibold text-white">
            Logo
          </span>
        </div>
        <ul className="space-y-[15px] mt-[43px] text-[14px] font-medium">
          <li className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="mage:dashboard-fill" />
            <Link to="/beranda">Beranda</Link>
          </li>
          <li className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="tdesign:wallet" />
            <Link to="/dompet">Dompet</Link>
          </li>
          <li className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="cuida:lamp-on-outline" />
            <Link to="/anggaran">Anggaran</Link>
          </li>
          <li className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="ph:money-wavy-bold" />
            <Link to="/transaksi">Transaksi</Link>
          </li>
          <li className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="mdi:piggy-bank-outline" />
            <span>Rencana Tabungan</span>
          </li>
          <li className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="uil:sliders-v" />
            <Link to="/kategori">Kategori</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="space-y-2 text-[12px]">
          <li className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded cursor-pointer">
            <Icon icon="uil:setting" />
            <span>Settings</span>
          </li>
          <li className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-600 hover:text-white rounded cursor-pointer">
            <Icon icon="material-symbols:logout" />
            <span>Log Out</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
