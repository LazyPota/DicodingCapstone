import React from "react";
import icon from "./../assets/whiteicon.png";

const CardWallet = ({ size = "large", amount = 0, name = "null", type = "null"}) => {
  const isSmall = size === "small";

  return (
    <div
      className={`${
        isSmall ? "py-4 px-3 h-[150px]" : "py-7 px-5 h-[231px]"
      } bg-gradient-to-br from-[#3973FF] to-[#224599] rounded-xl text-white shadow-lg relative`}
    >
      <div className="absolute top-3 right-3">
        <img
          src={icon}
          alt="white-icon"
          className={isSmall ? "w-4 h-4" : "w-[26px] h-[26px]"}
        />
      </div>
      <p className={`${isSmall ? "text-sm" : "text-[20px] font-medium"}`}>
        Total Saldo
      </p>
      <h2
        className={`${
          isSmall ? "text-[25px] mt-[13px]" : "text-[35px]"
        } font-semibold`}
      >
        Rp. {amount.toLocaleString("id-ID")}
      </h2>
      <div className="flex flex-row justify-between">
        <div
          className={`flex space-x-3 ${
            isSmall ? "text-xs mt-[15px]" : "mt-[55px] text-sm"
          }`}
        >
          <p>
            <span className={isSmall ? "text-xs" : "text-[14px]"}>
              Nama Dompet
            </span>
            <br />
            <b className={isSmall ? "text-sm" : "text-[18px]"}>{name}</b>
          </p>
          <p>
            <span className={isSmall ? "text-xs" : "text-[14px]"}>Jenis</span>
            <br />
            <b className={isSmall ? "text-sm" : "text-[18px]"}>{type}</b>
          </p>
        </div>

        {/* Lingkaran bawah kanan */}
        {/* <div className="absolute bottom-3 right-2 flex">
          <div
            className={`${
              isSmall ? "w-3 h-3" : "w-[30px] h-[30px]"
            } bg-[#0D2459] opacity-50 rounded-full`}
          ></div>
          <div
            className={`${
              isSmall ? "w-3 h-3" : "w-[30px] h-[30px]"
            } bg-[#0D2459] rounded-full`}
          ></div>
        </div> */}
      </div>
    </div>
  );
};

export default CardWallet;
