import React from "react";
import logo from "./../assets/logo.png";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center bg-white border-t border-gray-200 px-10 h-[401px]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="flex flex-col space-y-[43px] ">
          <div className="flex items-left space-x-2">
            <img src={logo} alt="logo" className="" />
          </div>
          <nav className="flex space-x-[44px] text-[#8896AB] text-[18px]">
            <a href="#" className="hover:text-gray-900">
              Home
            </a>
            <a href="#" className="hover:text-gray-900">
              Features
            </a>
            <a href="#" className="hover:text-gray-900">
              About us
            </a>
            <a href="#" className="hover:text-gray-900">
              Testimonials
            </a>
            <a href="#" className="hover:text-gray-900">
              Contact us
            </a>
          </nav>
        </div>
        <div className="flex flex-col space-y-[43px]">
          <label className="text-gray-700 text-[20px] font-extrabold">
            Newsletter
          </label>
          <div className="flex flex-row space-x-4">
            <input
              type="email"
              placeholder="backend@moneasy.dev"
              className="border rounded-lg  w-[226px] p-2 h-[46px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 text-white w-[91px] h-[46px] rounded-[40px] text-[16px] hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-[96px] px-6 text-[#8896AB] text-[16px] font-extrabold">
        <p>© 2024 ME. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-900">
            Terms
          </a>
          <a href="#" className="hover:text-gray-900">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-900">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
