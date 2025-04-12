// Header.js
import React from "react";
import { useSelector } from "react-redux"; // 1. Import useSelector
import { Icon } from "@iconify/react/dist/iconify.js";
import defaultAvatarPlaceholder from "./../assets/default-avatar.jpeg";

const BACKEND_URL = "http://localhost:8000";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  let profileImageUrl = defaultAvatarPlaceholder;
  if (user && user.profile_image_path) {
    const imagePath = user.profile_image_path.startsWith("/")
      ? user.profile_image_path.substring(1)
      : user.profile_image_path;
    profileImageUrl = `${BACKEND_URL}/${imagePath}`;
  }

  const userName = user?.username || "Pengguna";

  return (
    <div className="flex justify-between items-center px-8 h-[80px] bg-white shadow-md border-b border-[#DCDCDC">
      <div className="flex flex-col">
        <h1 className="text-black font-bold text-[20px]">
          Selamat Datang, {userName}
        </h1>
        <p className="font-semibold text-[#6B6B6B] text-[12px]">
          Inilah yang terjadi dengan keuangan Anda hari ini.
        </p>
      </div>

      <div className="flex items-center px-8">
        {user && (
          <div className="flex items-center space-x-4 cursor-pointer">
            <img
              src={profileImageUrl}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatarPlaceholder;
              }}
            />
            <span className="text-[18px] font-semibold">{userName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
