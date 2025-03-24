import { Icon } from "@iconify/react/dist/iconify.js";
import logo from "./../assets/logo.png";
import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-[18px] bg-white">
      <div className="">
        <img src={logo} alt="logo" className="" />
      </div>
      <ul className="flex space-x-8 text-[18px] items-center justify-center font-medium text-black">
        <li className="hover:text-blue-600 cursor-pointer">Home</li>
        <li className="hover:text-blue-600 cursor-pointer">Features</li>
        <li className="hover:text-blue-600 cursor-pointer">About Us</li>
        <li className="hover:text-blue-600 cursor-pointer">Testimonials</li>
        <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
      </ul>
      <div className="flex items-center space-x-4">
        <button
          variant="outline"
          className="flex flex-row rounded-[40px] w-[110px] h-[44px] justify-center items-center text-blue-600 border border-[#B5B5B5]"
        >
          <span className="text-[16px] font-inter">Login</span>
          <span className="text-xl">
            <Icon icon="basil:caret-right-solid" />
          </span>
        </button>
        <button className="flex flex-row justify-center items-center rounded-[40px] w-[110px] h-[44px]  bg-[#2667FF] text-white">
          <span className="text-[16px] font-inter">Sign Up</span>
          <span className="text-xl">
            <Icon icon="basil:caret-right-solid" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
