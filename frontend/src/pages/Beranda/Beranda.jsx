import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import bgheader from "../../assets/bgheader.png";
import bgImage from "../../assets/background.jpg";
import bgImage2 from "../../assets/background2.png";
import bgImage3 from "../../assets/background3.png";
import bgImage4 from "../../assets/CTA.png";
import icon from "../../assets/icon.png";
import FeatureCard from "../../components/FeatureCard";
import iphones from "../../assets/iphones.png";
import Testimonials from "../../components/Testimonials";
import Footer from "../../components/Footer";

const Beranda = () => {
  return (
    <main>
      <Navbar />
      <article className="p-2">
        <section
          className="relative flex items-center justify-between w-full h-[822px] px-10 text-white rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
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
          <div className="hidden md:block absolute right-10 h-[500px] w-[500px]">
            <img src={bgheader} alt="bgheader" />
          </div>
        </section>
      </article>
      <article className="mt-[118px]">
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
      <article className="flex flex-row gap-[250px] items-center mt-[118px] p-8">
        <div className="flex gap-4 relative">
          <img
            src={bgImage2}
            alt="bgimage"
            className="rounded-[40px] relative w-[292px] h-[622px]"
          />
          <img
            src={bgImage3}
            alt="bgimage"
            className="rounded-[40px] relative top-36 w-[292px] h-[622px]"
          />
        </div>
        <div className="md:ml-8 text-center md:text-left mt-6 md:mt-0">
          <h2 className="text-[40px] font-extrabold text-black leading-tight">
            Smart Financial Planning for a Secure Future
          </h2>
          <p className="text-gray-900 text-[18px] font-regular mt-4 max-w-md mb-[50px]">
            Manage your finances more easily and effectively with Moneasy. We
            believe that everyone deserves to have full control over their
            finances. Our mission is to create smart, secure, and accessible
            financial management solutions, so that anyone can achieve their
            financial goals without stress.
          </p>
          <Button text="Lets Get Started" variant="primary" size="lg" />
        </div>
      </article>
      <article className="flex flex-col items-center py-10 px-4 mt-[218px] overflow-hidden">
        <h2 className="text-[40px] font-extrabold text-black mb-6">
          Customer reviews about Moneasy
        </h2>
        <Testimonials />
      </article>
      <article className="mt-[118px]">
        <section
          className="relative w-full h-[555px] px-10 text-white object-cover flex items-center justify-center"
          style={{
            backgroundImage: `url(${bgImage4})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-lg text-center space-y-[32px]">
            <div className="flex justify-center">
              <div
                className="w-[64px] h-[64px] bg-blue-600 rounded-2xl flex items-center justify-center shadow-[#w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center 
              shadow-[0_0_20px_#3b82f6] backdrop-blur-md]"
              >
                <img src={icon} />
              </div>
            </div>
            <h1 className="text-5xl md:text-5xl font-bold leading-tight text-white">
              Get Started with <br />
              Moneasy Today
            </h1>
            <p className="text-lg font-semibold text-gray-200">
              Join thousands of other users and start managing your finances
              smarter!
            </p>
            <div className="flex justify-center space-x-4">
              <Button text="Get Started Now" variant="secondary" size="lg" />
            </div>
          </div>
        </section>
      </article>
      <Footer />
    </main>
  );
};

export default Beranda;
