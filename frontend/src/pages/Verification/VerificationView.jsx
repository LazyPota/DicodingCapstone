import React from "react";
import logo from "../../assets/logoFIX.png";
import container from "../../assets/container.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const VerificationView = ({
  email, 
  otp, 
  handleChange,
  handleKeyDown, 
  inputsRef, 
  handleVerifyCode, 
  isLoading, 
  error, 
}) => {

  return (
    <main className="relative flex min-h-[140vh] md:p-2">
      <header className="absolute top-4 left-4">
        <img
          src={logo}
          alt="Logo Perusahaan"
          className="w-[50px] md:w-[70px]"
        />
      </header>
      <section
        className="flex flex-1 justify-center items-center w-full md:w-1/2 lg:w-1/2 px-4 sm:px-6 lg:px-8"
        aria-labelledby="login-heading"
      >
        <div className="w-full max-w-[400px]">
          <h1
            id="login-heading"
            className="text-3xl md:text-[40px] font-bold font-inter text-center lg:text-left"
          >
            Verifikasi Kode
          </h1>
          <p className="text-[18px] font-normal font-inter text-[#969696] mt-2 text-center lg:text-left">
            Kode Autentikasi Sudah Dikirim Ke {email || "Email Anda"}.
          </p>
          {error && <p className="text-red-500 text-center mt-2 mb-2">{error}</p>}
          <form className="mt-3 flex flex-col space-y-[20px]" noValidate onSubmit={handleVerifyCode}>
            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  value={otp[idx]}
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <div className="flex flex-col items-center space-y-4 w-full pt-4">
              <button
                type="submit"
                className={`w-full font-inter h-[54px] bg-[#367AFF] text-white text-[18px] font-semibold rounded-[10px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 disabled={isLoading}
              >
                 {isLoading ? 'Memverifikasi...' : 'Verifikasi Kode'}
              </button>
              <div className="flex items-center w-full">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-3 text-gray-500 text-sm font-medium font-inter">
                  Atau
                </span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <button
                type="button"
                className="w-full h-[54px] border border-[#E6E8E7] rounded-[10px] flex items-center justify-center space-x-2 text-lg font-medium font-inter text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <Icon
                  icon="flat-color-icons:google"
                  className="text-xl"
                  aria-hidden="true"
                />
                <span>Masuk Dengan Google</span>
              </button>
            </div>
          </form>
          <p className="text-gray-500 text-[16px] font-medium font-inter text-center mt-[32px]">
            Sudah Punya Akun? {" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold font-inter underline hover:text-blue-800"
            >
              Masuk
            </Link>
          </p>
        </div>
      </section>
      <aside
        className="hidden lg:flex justify-center items-center w-1/2"
        aria-hidden="true"
      >
        <img
          src={container}
          alt="Decorative container illustration"
          className="w-full h-full object-cover rounded-[16px]"
        />
      </aside>
    </main>
  );
};

export default VerificationView;