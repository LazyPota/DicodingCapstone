import React from "react";
import logo from "./../assets/icon-blue.png";

const Footer = () => {
  const handleScroll = (sectionId) => {
    if (sectionId === "beranda-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      } else {
        console.warn(`Element with ID "${sectionId}" not found.`);
      }
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-12 md:px-10 md:py-16 lg:px-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-6">
        <div className="flex flex-col space-y-6 md:space-y-[43px] w-full md:w-auto">
          <div className="flex flex-row items-center space-x-2 mb-8 mt-4">
            <img src={logo} alt="white-icon" className="w-[40px] h-[40px]" />
            <span className="font-inter text-[24px] font-semibold text-black">
              Moneasy
            </span>
          </div>
          <nav>
            <ul className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-6 lg:space-x-[44px] text-[#8896AB] text-base md:text-[18px]">
              <li
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => handleScroll("beranda")}
              >
                Beranda
              </li>
              <li
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => handleScroll("features")}
              >
                Fitur
              </li>
              <li
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => handleScroll("tentang-kami")}
              >
                Tentang Kami
              </li>
              <li
                className="hover:text-blue-600 cursor-pointer hidden md:flex"
                onClick={() => handleScroll("testimoni")}
              >
                Testimoni
              </li>
              <li
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => handleScroll("hubungi-kami")}
              >
                Hubungi Kami
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col space-y-4 md:space-y-[43px] w-full md:w-auto">
          <label className="text-gray-700 text-lg md:text-[20px] font-extrabold">
            Surat Kabar
          </label>
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4 items-stretch md:items-center">
            <input
              type="email"
              placeholder="backend@moneasy.dev"
              className="w-full md:w-auto border rounded-lg p-2 h-[46px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow md:flex-grow-0"
              aria-label="Alamat Email Newsletter"
            />
            <button className="bg-blue-500 text-white w-full md:w-[91px] h-[46px] rounded-[40px] text-[16px] hover:bg-blue-600 flex-shrink-0">
              Kirim
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-12 md:mt-[96px] gap-4  text-[#8896AB] text-sm md:text-[16px] font-extrabold">
        <p className="text-center md:text-left">
          © 2024 ME. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 md:justify-start">
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
