import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Button = ({
  text,
  variant = "primary",
  size = "md",
  showIcon = true,
  onClick,
  as: Component = "button", // Default ke <button>, bisa diganti dengan <Link>
  to,
  ...props
}) => {
  const sizeClasses = {
    ms: "px-4 py-2",
    sm: "px-4 py-1 text-sm",
    md: "w-[158px] h-[58px] p-5 text-[16px]",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <Component
      to={Component === "button" ? undefined : to} // Kirim props 'to' hanya jika Component adalah Link
      onClick={onClick}
      className={`rounded-full font-semibold flex items-center gap-2 transition-all duration-300 shadow-xl
        ${sizeClasses[size]}
        ${
          variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white text-blue-600 border hover:bg-gray-100"
        }
      `}
      {...props}
    >
      {text}
      {showIcon && (
        <span className="text-xl">
          <Icon icon="basil:caret-right-solid" />
        </span>
      )}
    </Component>
  );
};

export default Button;