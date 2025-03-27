import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

const Header = () => {
  const [notifications, setNotifications] = useState(5); // Contoh jumlah notifikasi

  return (
    <div className="flex justify-between items-center px-4 h-[70px] bg-white shadow-md border-b border-[#DCDCDC]">
      <button className="p-2 rounded hover:bg-gray-200 text-[20px]">
        <Icon icon="ci:hamburger-md" />
      </button>

      <div className="flex items-center space-x-7">
        <div className="relative">
          <span className="text-[25px] cursor-pointer">
            <Icon icon="mingcute:notification-line" />
          </span>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {notifications}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm font-semibold">Jhon Doe</span>
          <span className="text-2xl">
            <Icon icon="iconamoon:arrow-down-2-light" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
