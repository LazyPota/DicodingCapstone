import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-[#DEE8FF] w-[391px] px-6 h-[285px] rounded-[40px] flex flex-col items-start justify-center">
      <div className="bg-blue-600 p-2 rounded-xl flex items-center justify-center">
        <Icon icon={icon} className="text-white text-[43px]" />
      </div>
      <h3 className="text-[18px] font-extrabold mt-[20px] text-black">
        {title}
      </h3>
      <p className="text-[16px] text-black font-medium mt-1">{description}</p>
    </div>
  );
};

export default FeatureCard;
