import React from "react";
import icon from "./../assets/whiteicon.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-[240px] bg-blue-700 text-white h-screen p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-row items-center space-x-2">
          <img src={icon} alt="white-icon" className="w-[26px] h-[26px]" />
          <span className="font-inter text-[16px] font-semibold text-white">
            Moneasy
          </span>
        </div>
        <ul className="space-y-[15px] mt-[43px] text-[14px] font-medium">
          <li>
            {/* Setiap Link sekarang adalah flex container */}
            <Link
              to="/beranda"
              className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer w-full"
            >
              <Icon icon="mage:dashboard-fill" width="20" height="20" />{" "}
              {/* Tambahkan ukuran ikon jika perlu */}
              <span>Beranda</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dompet"
              className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer w-full"
            >
              <Icon icon="tdesign:wallet" width="20" height="20" />
              <span>Dompet</span>
            </Link>
          </li>
          <li>
            <Link
              to="/anggaran"
              className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer w-full"
            >
              <Icon icon="cuida:lamp-on-outline" width="20" height="20" />
              <span>Anggaran</span>
            </Link>
          </li>
          <li>
            <Link
              to="/transaksi"
              className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer w-full"
            >
              <Icon icon="ph:money-wavy-bold" width="20" height="20" />
              <span>Transaksi</span>
            </Link>
          </li>
          <li>
            <Link
              to="/goal"
              className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer w-full"
            >
              <Icon icon="mdi:piggy-bank-outline" width="20" height="20" />
              <span>Rencana Tabungan</span>
            </Link>
          </li>
          <li>
            <Link
              to="/kategori"
              className="flex items-center space-x-[15px] p-2 py-2 hover:bg-blue-600 rounded cursor-pointer w-full transition delay-150 ease-in-out"
            >
              <Icon icon="uil:sliders-v" width="20" height="20" />
              <span>Kategori</span>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="space-y-2 text-[12px]">
          <li>
            <Link
              to="/settings"
              className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded cursor-pointer transition delay-150 ease-in"
            >
              <Icon icon="uil:setting" />
              <span>Pengaturan</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2 p-2 bg-red-600 hover:bg-red-800 text-white rounded-md cursor-pointer">
            <Icon icon="material-symbols:logout" />
            <span>Keluar</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
