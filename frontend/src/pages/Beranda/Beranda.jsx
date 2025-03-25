import React from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import bgImage from "../../assets/background.jpg";
import FeatureCard from "../../components/FeatureCard";
import iphones from "../../assets/iphones.png";

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
      <article className="mt-[117px]">
        <h1 className="text-black text-center font-extrabold text-[40px]">
          Advanced Features for Your Financial Future!
        </h1>
        <p className="text-black font-medium text-center mt-[15px] text-[18px] w-[496px] mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Feugiat nulla
          suspendisse tortor aene.
        </p>
        <div className="flex justify-center items-center min-h-screen mt-[60px]">
          <div className="grid grid-cols-3 gap-5 p-8 rounded-2xl ">
            <FeatureCard
              title="AUTO EXPENSE TRACKER"
              description="Quickly check expenses by scanning receipts or manual input."
              icon="solar:wallet-bold"
            />
            <div className="col-span-1 row-span-2 bg-blue-600 text-white rounded-2xl flex flex-col ">
              <div className="p-10">
                <h2 className="text-[20px] font-extrabold">
                  FINANCIAL HEALTH SCORE
                </h2>
                <p className="text-[16px] mt-[20px] font-medium">
                  Keep track of your finances with an easy-to-understand
                  financial health score.
                </p>
              </div>
              <div className="px-10 mt-8">
                <img src={iphones} alt="iphones" />
              </div>
            </div>
            <FeatureCard
              title="GOAL-BASED SAVING PLAN"
              description="Achieve your financial goals faster with goal-based savings!"
              icon="uis:graph-bar"
            />
            <FeatureCard
              title="SMART BUDGETING ASSISTANT"
              description="Set a budget according to your income automatically & avoid overspending."
              icon="bx:transfer"
            />
            <FeatureCard
              title="AI CHATBOT KEUANGAN"
              description="Need financial advice? Ask our smart chatbot & get the best recommendations."
              icon="fa6-solid:rotate"
            />
          </div>
        </div>
      </article>
    </main>
  );
};

export default Beranda;
