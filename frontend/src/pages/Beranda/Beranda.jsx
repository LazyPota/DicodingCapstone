import React from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import bgImage from "../../assets/background.jpg";

const Beranda = () => {
  return (
    <main>
      <Navbar />
      <article className="p-2">
        <section
          className="relative flex items-center justify-between w-full h-screen px-10 text-white rounded-2xl"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: "center",
            borderRadius: "16px",
          }}
        >
          <div className="max-w-lg space-y-[24px]">
            <h1 className="text-5xl md:text-5xl font-bold leading-tight text-white">
              Smart Solutions for <br />
              Healthier Finances💰
            </h1>
            <p className="text-lg font-semibold text-gray-200">
              AI-based Financial Planner that helps you manage your income,
              expenses, and savings automatically. Save more, achieve your
              financial goals faster!
            </p>
            <div className="flex space-x-4">
              <Button text="Get Started" variant="primary" />
              <Button text="Learn More" variant="secondary" />
            </div>
          </div>
          <div className="hidden md:block absolute right-10 top-1/4"></div>
        </section>
      </article>
    </main>
  );
};

export default Beranda;
