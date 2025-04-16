import React, { useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Tidak dibutuhkan lagi

const Testimonials = () => {
  const testimonials = [
    // ... (data testimonials tetap sama) ...
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

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const cardWidth = 555;
  const gap = 50;
  const containerWidth = cardWidth + gap;

  const getTranslateX = () => {
    return `translateX(-${currentIndex * containerWidth}px)`;
  };

  return (
    <div className="w-full flex flex-col items-center mt-12 md:mt-[60px]">
      <div className="relative w-full max-w-full overflow-visible px-[5vw] sm:px-[10vw] md:px-[15vw] lg:max-w-[595px] lg:px-0">
        <div
          className="flex items-center transition-transform duration-500 ease-in-out"
          style={{
            transform: getTranslateX(),
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`p-6 flex flex-col justify-center items-center
                          w-[80vw]    sm:w-[70vw]    md:w-[60vw]    lg:w-[586px]
                          min-h-[280px] md:min-h-[311px]
                          mx-[10px]    sm:mx-[12px]    md:mx-[12px]  lg:mx-[12px]  // Margin = gap/2
                          rounded-[40px] text-center transition-all duration-500
                          ${
                            index === currentIndex
                              ? "bg-[#DEE8FF] opacity-100 scale-100"
                              : "bg-gray-200 opacity-70 scale-90"
                          }`}
              style={{
                flexShrink: 0,
              }}
            >
              <p className="text-black font-inter text-sm sm:text-base md:text-[18px] font-medium">
                {testimonial.text}
              </p>
              <div className="flex items-center justify-center mt-4 md:mt-[25px]">
                <img
                  src={testimonial.img}
                  alt={`Foto ${testimonial.name}`}
                  className="w-10 h-10 rounded-full mr-3"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold font-inter text-sm md:text-[16px] text-black">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 font-inter text-sm md:text-[16px]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
