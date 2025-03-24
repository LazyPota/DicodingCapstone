import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Button = ({
  text,
  variant = "primary",
  size = "md",
  showIcon = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: "px-4 py-1 text-sm",
    md: "w-[158px] h-[58px] p-5 text-[16px]",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full font-semibold flex items-center gap-2 transition-all duration-300 shadow-xl
        ${sizeClasses[size]}
        ${
          variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white text-blue-600 border hover:bg-gray-100"
        }
      `}
    >
      {text}
      {showIcon && (
        <span className="text-xl">
          <Icon icon="basil:caret-right-solid" />
        </span>
      )}
    </button>
  );
};

export default Button;
