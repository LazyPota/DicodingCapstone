import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Jika menggunakan React Router v6
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#F3F4F7]">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        toggleSidebar={toggleMobileSidebar} // Kirim fungsi toggle
      />

      {/* Overlay untuk menutup sidebar di mobile saat diklik */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleMobileSidebar} />{" "}
        {/* Kirim fungsi toggle */}
        <main className="flex-1 overflow-y-auto">
          {/* Di sinilah halaman seperti DashboardView akan dirender */}
          {/* Jika menggunakan React Router: */}
          <Outlet />
          {/* Jika tidak, render komponen halaman langsung */}
          {/* <DashboardPage /> */}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
