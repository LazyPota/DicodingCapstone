import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const MonthPicker = ({ selectedMonth, selectedYear, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayDate = new Date(selectedYear, selectedMonth - 1);

  const handleYearChange = (increment) => {
    const newYear = selectedYear + increment;
    onChange(selectedMonth, newYear);
  };

  const handleMonthSelect = (monthIndex) => {
    onChange(monthIndex + 1, selectedYear);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-[189px] h-[48px] px-7 rounded-[16px] bg-white text-black hover:bg-gray-200 transition-all"
      >
        <FaRegCalendarAlt className="text-black text-lg" />
        <span className="font-regular text-black text-[16px]">
          {displayDate.toLocaleString("id-ID", {
            month: "short",
            year: "numeric",
          })}
        </span>
        {isOpen ? (
          <IoIosArrowDown className="text-black text-lg transition-transform transform" />
        ) : (
          <IoIosArrowForward className="text-black text-lg transition-transform transform rotate-0" />
        )}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border shadow-lg rounded-lg p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => handleYearChange(-1)}
              className="text-gray-500 hover:text-black"
            >
              &lt;
            </button>
            <span className="font-semibold">{selectedYear}</span>
            <button
              onClick={() => handleYearChange(1)}
              className="text-gray-500 hover:text-black"
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, index) => {
              const month = new Date(2000, index).toLocaleString("id-ID", {
                // Gunakan id-ID
                month: "short",
              });
              return (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)} 
                  className={`p-2 rounded-md text-center font-medium transition-all text-sm ${ 
                    (selectedMonth - 1) === index
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
