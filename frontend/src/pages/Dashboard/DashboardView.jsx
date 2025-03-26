import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const DashboardView = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-4">
          {" "}
          {/* Tempat untuk konten utama */}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
