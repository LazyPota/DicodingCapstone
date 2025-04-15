import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

const Header = () => {
  const [notifications] = useState(5);

  return (
    <div className="flex justify-between items-center px-8 h-[80px] bg-white shadow-md border-b border-[#DCDCDC]">
      <div className="flex flex-col">
        <h1 className="text-black font-bold text-[20px]">
          Selamat Datang, Fahmi
        </h1>
        <p className="font-semibold text-[#6B6B6B] text-[12px]">
          Inilah yang terjadi dengan keuangan Anda hari ini.
        </p>
      </div>

      <div className="flex items-center space-x-12">
        <div className="relative">
          <span className="text-[25px] cursor-pointer">
            <Icon icon="mingcute:notification-line" />
          </span>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#1570EF] text-white text-xs px-1.5 py-0.5 rounded-full">
              {notifications}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-5 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-[18px] font-semibold">Fahmi</span>
            <span className="text-[12px] font-semibold text-[#6B6B6B]">
              @fahminur11
            </span>
          </div>
          <span className="text-2xl">
            <Icon icon="iconamoon:arrow-down-2-light" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
