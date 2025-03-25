import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-7 bg-[#F3F4F7]">
      <div>
        <h1 className="text-[30px] font-semibold text-black">Welcome Avian!</h1>
        <p className="text-[18px] text-[#C9C9C9]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </div>
      <div className="flex items-center space-x-10">
        <span className="text-[#C3C3C3] text-[30px]">
          <Icon icon="ion:notifcations" />
        </span>
        <div className="flex items-center space-x-2">
          <img
            src="https://randomuser.me/api/portraits/men/5.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-[11px] text-[#C3C3C3]">@avianzimasha11</p>
            <p className="text-[16px] font-semibold">Avian Zimasha</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
