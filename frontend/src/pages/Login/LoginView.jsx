import React from "react";
import logo from "../../assets/logoFIX.png";
import container from "../../assets/container.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const LoginView = ({
  setShowPassword,
  showPassword,
  handleLogin,
  email,
  password,
  onChange,
  isLoading,
  errors,
  serverError,
  registrationSuccessMessage,
}) => {
  return (
    <main className="relative flex min-h-[100vh] md:p-2">
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
            Masuk
          </h1>
          <p className="text-[18px] font-normal font-inter text-[#969696] mt-2 text-center lg:text-left">
            Silakan masuk untuk melanjutkan akun Anda.
          </p>
          {registrationSuccessMessage && (
            <div
              className="my-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm" // Style hijau
              role="status" // Role status untuk pesan sukses
            >
              {registrationSuccessMessage}
            </div>
          )}
          {serverError && (
            <div
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
              role="alert"
            >
              Login Gagal: {serverError}
            </div>
          )}
          <form
            className="mt-3 flex flex-col space-y-[20px]"
            onSubmit={handleLogin}
            noValidate
          >
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                className={`block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border ${
                  errors && errors.email ? "border-red-500" : "border-[#D9D9D9]"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10`}
                placeholder=" "
                value={email}
                required
                aria-required="true"
                onChange={onChange}
                disabled={isLoading}
                aria-invalid={errors && errors.email ? "true" : "false"}
                autocomplete="off"
                aria-describedby={
                  errors && errors.email ? "email-error" : undefined
                }
              />
              <label
                htmlFor="email"
                className={`absolute text-[18px] font-medium font-inter duration-300 transform z-10 origin-[0] bg-white px-2 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 -translate-y-4 scale-75 top-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[14px] ${
                  errors && errors.email ? "text-red-600" : "text-gray-500"
                } peer-focus:text-blue-600`}
              >
                Email
              </label>
              {errors && errors.email && (
                <div
                  id="email-error"
                  role="alert"
                  className="absolute z-10 bottom-0 left-1 translate-y-full mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded shadow-md"
                >
                  {errors.email}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border ${
                  errors && errors.password
                    ? "border-red-500"
                    : "border-[#D9D9D9]"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10`}
                placeholder=" "
                value={password}
                onChange={onChange}
                disabled={isLoading}
                required
                aria-required="true"
                aria-invalid={errors && errors.password ? "true" : "false"}
                autocomplete="off"
                aria-describedby={
                  errors && errors.password ? "password-error" : undefined
                }
              />
              <label
                htmlFor="password"
                className={`absolute text-[18px] font-medium font-inter duration-300 transform z-10 origin-[0] bg-white px-2 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 -translate-y-4 scale-75 top-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[14px] ${
                  errors && errors.password ? "text-red-600" : "text-gray-500"
                } peer-focus:text-blue-600`}
              >
                Password
              </label>
              <button
                type="button"
                className="absolute z-10 top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                disabled={isLoading}
              >
                {showPassword ? (
                  <Icon
                    icon="mdi:eye-off"
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon icon="mdi:eye" className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
              {errors && errors.password && (
                <div
                  id="password-error"
                  role="alert"
                  className="absolute z-10 bottom-0 left-1 translate-y-full mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded shadow-md"
                >
                  {errors.password}
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="keep_logged_in"
                  className="w-[18px] h-[18px] border border-black rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="keep_logged_in"
                  className="text-[16px] font-medium text-gray-900 font-inter"
                >
                  Biarkan saya tetap masuk
                </label>
              </div>
              <Link
                className="text-blue-500 font-inter font-semibold text-sm underline hover:text-blue-700 transition-colors delay-75"
                to="/forgot-password"
              >
                Lupa Kata Sandi
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 w-full pt-4">
              <button
                type="submit"
                onClick={(e) => handleLogin(e)}
                className="w-full font-inter h-[54px] bg-[#367AFF] text-white text-[18px] font-semibold rounded-[10px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Masuk
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
            Belum Punya Akun?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold font-inter underline hover:text-blue-800"
            >
              Daftar
            </a>
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

export default LoginView;
