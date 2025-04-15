import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "Aplikasi ini benar-benar membantu saya mengatur keuangan! Sekarang saya lebih tahu ke mana uang saya pergi dan dapat menabung dengan lebih efektif!",
      name: "John Carter",
      role: "ROLE, COMPANY",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      text: "Dulu saya selalu membuat anggaran yang berlebihan setiap bulan. Dengan Smart Budgeting, sekarang saya bisa lebih disiplin! 💪",
      name: "Sarah Connor",
      role: "ROLE, COMPANY",
      img: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      text: "Dulu saya sering lupa mencatat pengeluaran, sekarang dengan Auto Expense Tracker, semuanya jadi lebih teratur! Saya jadi lebih paham ke mana saja uang saya pergi setiap bulan.",
      name: "Michael Scott",
      role: "ROLE, COMPANY",
      img: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      text: "Sebelum menggunakan aplikasi ini, saya kesulitan menabung. Namun kini, dengan fitur Goal-Based Saving Plan, saya dapat mencapai target tabungan tanpa stres! 🔥",
      name: "Lisa Kudrow",
      role: "ROLE, COMPANY",
      img: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      text: "Akhirnya saya bisa melihat ke mana uang saya pergi setiap bulan. Aplikasi yang hebat!",
      name: "David Beckham",
      role: "ROLE, COMPANY",
      img: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // const prevTestimonial = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
  //   );
  // };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const cardWidth = 586;
  const gap = 24;
  const containerWidth = cardWidth + gap;

  const getTranslateX = () => {
    return `translateX(-${currentIndex * containerWidth}px)`;
  };

  return (
    <div className="w-full flex flex-col items-center mt-[60px]">
      <div className="relative w-[600px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: getTranslateX(),
            gap: `${gap}px`,
          }}
        >
          <div className="w-[600px]"></div>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 flex flex-col justify-center w-[586px] h-[311px] rounded-[40px] text-center transition-all duration-500 ${
                index === currentIndex
                  ? "bg-[#DEE8FF] opacity-100 scale-105"
                  : "bg-[#DEE8FF] opacity-50 scale-95"
              }`}
              style={{
                flexShrink: 0,
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <p className="text-black font-inter text-[18px] font-medium">
                {testimonial.text}
              </p>
              <div className="flex items-center justify-center mt-[25px]">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-bold font-inter text-[16px] text-black">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 font-inter text-[16px]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="w-[600px]"></div>
        </div>
      </div>
      {/* <div className="flex justify-around w-full max-w-xs mt-4">
        <button
          onClick={prevTestimonial}
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextTestimonial}
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
        >
          <FaChevronRight />
        </button>
      </div> */}
    </div>
  );
};

export default Testimonials;
