import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#F3F4F7]">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        toggleSidebar={toggleMobileSidebar} 
      />
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleMobileSidebar} />{" "}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
