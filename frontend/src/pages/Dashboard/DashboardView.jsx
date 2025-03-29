import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";

const DashboardView = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-4">
          <div className="p-1">
            <MonthPicker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
