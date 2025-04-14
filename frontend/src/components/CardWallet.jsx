import React from "react";

const CardWallet = ({
  size = "large",
  amount = 0,
  name = "null",
  type = "Other",
}) => {
  const isSmall = size === "small";

  const displayWalletType = (typeValue) => {
    switch (typeValue) {
      case "Cash":
        return "Tunai";
      case "Debit":
        return "Debit";
      case "Loan":
        return "Pinjaman";
      case "E-Money":
        return "Dompet Digital";
      case "Investment":
        return "Investasi";
      case "Other":
        return "Lainnya";
      default:
        return typeValue;
    }
  };

  const gradientMap = {
    Cash: "from-green-400 to-green-600",
    Debit: "from-blue-500 to-blue-700",
    "E-Money": "from-purple-500 to-purple-700",
    Loan: "from-red-500 to-red-700",
    Investment: "from-yellow-400 to-yellow-600",
    Other: "from-gray-500 to-gray-700",
  };

  const gradientClass = gradientMap[type] || gradientMap.Other;

  let displayAmount = amount;
  let amountLabel = "Total Saldo";
  let amountPrefix = "Rp. ";

  if (type === "Loan") {
    amountLabel = "Sisa Pinjaman";
    displayAmount = Math.abs(amount);
  }

  const formattedDisplayAmount = displayAmount.toLocaleString("id-ID");

  return (
    <div
      className={`${
        isSmall ? "py-4 px-3 h-[150px]" : "py-7 px-5 h-[211px]"
      } bg-gradient-to-br ${gradientClass} rounded-xl text-white relative shadow-md hover:shadow-lg transition-shadow`}
    >
      <p className={`${isSmall ? "text-sm" : "text-[20px] "} font-medium`}>
       {amountLabel}
      </p>
      <h2
        className={`${
          isSmall ? "text-[25px] mt-[13px]" : "text-[35px]"
        } font-semibold`}
      >
        {amountPrefix}{formattedDisplayAmount}
      </h2>
      <div className="flex flex-row justify-between">
        <div
          className={`flex space-x-12 ${
            isSmall ? "text-xs mt-[15px]" : "mt-[35px] text-sm"
          }`}
        >
          <p>
            <span className={isSmall ? "text-xs" : "text-[14px]"}>
              Nama Dompet
            </span>
            <br />
            <b className={isSmall ? "text-sm" : "text-[20px]"}>{name}</b>
          </p>
          <p>
            <span className={isSmall ? "text-xs" : "text-[14px]"}>Jenis</span>
            <br />
            <b className={isSmall ? "text-sm" : "text-[20px]"}>
              {displayWalletType(type)}
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardWallet;
