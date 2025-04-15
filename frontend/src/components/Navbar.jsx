import { Icon } from "@iconify/react/dist/iconify.js";
import logo from "./../assets/logoFIX.png";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-[18px] bg-white">
      <div className="">
        <img src={logo} alt="logo" className="" />
      </div>
      <ul className="flex space-x-8 text-[18px] items-center justify-center font-medium text-black">
        <li className="hover:text-blue-600 cursor-pointer">Beranda</li>
        <li className="hover:text-blue-600 cursor-pointer">Fitur</li>
        <li className="hover:text-blue-600 cursor-pointer">Tentang Kami</li>
        <li className="hover:text-blue-600 cursor-pointer">Testimoni</li>
        <li className="hover:text-blue-600 cursor-pointer">Hubungi Kami</li>
      </ul>

      <Link
        to="/login"
        variant="outline"
        className="flex flex-row rounded-[40px] w-[110px] h-[44px] justify-center items-center text-blue-600 border border-[#B5B5B5]"
      >
        <span className="text-[16px] font-inter">Masuk</span>
        <span className="text-xl">
          <Icon icon="basil:caret-right-solid" />
        </span>
      </Link>
    </nav>
  );
};

export default Navbar;
