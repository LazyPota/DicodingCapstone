// Header.js
import React from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import defaultAvatarPlaceholder from "./../assets/default-avatar.jpeg"; // Pastikan path asset benar

const BACKEND_URL = "http://localhost:8000"; // Sesuaikan jika perlu

// Terima prop toggleSidebar
const Header = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);

  // Logika gambar profil dan nama pengguna tetap sama
  let profileImageUrl = defaultAvatarPlaceholder;
  if (user && user.profile_image_path) {
    // ... logika path gambar ...
    const imagePath = user.profile_image_path.startsWith("/")
      ? user.profile_image_path.substring(1)
      : user.profile_image_path;
    profileImageUrl = `${BACKEND_URL}/${imagePath}`;
  }
  const userName = user?.username || "Pengguna";

  return (
    // Sesuaikan padding untuk mobile dan desktop
    <div className="flex justify-between items-center px-4 md:px-6 lg:px-10 h-[70px] md:h-[80px] bg-white shadow-md border-b border-[#DCDCDC] flex-shrink-0">
      {" "}
      {/* Tinggi header sedikit dikurangi di mobile */}
      {/* Kiri: Tombol Hamburger (Mobile) & Teks Sambutan */}
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger - Hanya muncul di bawah lg */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden" // Sembunyikan di lg ke atas
          aria-label="Open sidebar"
        >
          <Icon icon="ci:menu-alt-01" width="24" height="24" />{" "}
          {/* Ganti ikon hamburger jika perlu */}
        </button>

        {/* Teks Sambutan */}
        {/* Ukuran teks disesuaikan */}
        <div className="flex flex-col">
          <h1 className="text-black font-bold text-sm sm:text-lg lg:text-xl">
            {" "}
            {/* Ukuran font responsif */}
            Selamat Datang, {userName}👋 {/* Emoji bisa ditaruh di sini */}
          </h1>
          <p className="font-semibold text-[#6B6B6B] text-[10px] sm:text-xs lg:text-sm">
            {" "}
            {/* Ukuran font responsif */}
            Inilah yang terjadi dengan keuangan Anda hari ini.
          </p>
        </div>
      </div>
      {/* Kanan: Info Pengguna */}
      {/* Ukuran avatar dan teks disesuaikan */}
      {user && (
        <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
          <img
            src={profileImageUrl}
            alt="User"
            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border border-gray-200" // Tambah border halus
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatarPlaceholder;
            }}
          />
          {/* Sembunyikan nama di layar sangat kecil jika perlu */}
          <span className="hidden sm:inline text-sm lg:text-base font-semibold">
            {userName}
          </span>
        </div>
      )}
    </div>
  );
};

export default Header;
