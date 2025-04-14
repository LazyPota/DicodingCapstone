import React from "react";
import logo from "../../assets/logoFIX.png";
import container from "../../assets/container.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const ConfirmPasswordView = ({
  showPassword,
  setShowPassword,
  password,
  onChangePassword, 
  confirmPassword,
  onChangeConfirmPassword, 
  handleChangePassword, 
  error, 
  errors, 
  verificationSuccessMessage,
  isLoading 
}) => {
  return (
    <main className="relative flex min-h-[100vh] md:p-2">
      {/* ... Header ... */}
      <header className="absolute top-4 left-4">
        <img
          src={logo}
          alt="Logo Perusahaan"
          className="w-[50px] md:w-[70px]"
        />
      </header>
      <section
        className="flex flex-1 justify-center items-center w-full md:w-1/2 lg:w-1/2 px-4 sm:px-6 lg:px-8"
        aria-labelledby="reset-heading"
      >
        <div className="w-full max-w-[450px]">
          <h1
            id="reset-heading"
            className="text-3xl md:text-[40px] font-bold font-inter text-center lg:text-left"
          >
            Atur Kata Sandi Baru
          </h1>
          <p className="text-[18px] font-normal font-inter text-[#969696] mt-2 text-center lg:text-left">
            Buat Kata Sandi Baru Untuk Akunmu
          </p>
          {verificationSuccessMessage && (
            <div className="my-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm" role="status">
              {verificationSuccessMessage}
            </div>
          )}
          {error && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm" role="alert">
              Gagal: {error}
            </div>
           )}
           {errors && errors.general && (
                <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm" role="alert">
                    {errors.general}
                </div>
            )}

          <form
            className="mt-3 flex flex-col space-y-[25px]" 
            noValidate
            onSubmit={handleChangePassword}
          >
            {/* Input Password Baru */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border ${errors && errors.password ? 'border-red-500' : 'border-[#D9D9D9]'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10`}
                placeholder=" "
                required
                aria-required="true"
                value={password}
                onChange={onChangePassword} 
                disabled={isLoading}
                autoComplete="new-password"
                aria-invalid={errors && errors.password ? "true" : "false"}
                aria-describedby={errors && errors.password ? "password-error" : undefined}
              />
              <label
                htmlFor="password"
                className={`absolute text-[18px] font-medium font-inter duration-300 transform z-10 origin-[0] bg-white px-2 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 -translate-y-4 scale-75 top-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[14px] ${errors && errors.password ? 'text-red-600' : 'text-gray-500'} peer-focus:text-blue-600`}
              >
                Buat Kata Sandi Baru
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
              {/* Popup Error Password Client */}
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

            {/* Input Konfirmasi Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className={`block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border ${errors && errors.confirmPassword ? 'border-red-500' : 'border-[#D9D9D9]'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10`}
                placeholder=" "
                required
                aria-required="true"
                value={confirmPassword}
                onChange={onChangeConfirmPassword} 
                disabled={isLoading}
                autoComplete="new-password"
                 aria-invalid={errors && errors.confirmPassword ? "true" : "false"}
                 aria-describedby={errors && errors.confirmPassword ? "confirmPassword-error" : undefined}
            />
              <label
                htmlFor="confirmPassword"
                className={`absolute text-[18px] font-medium font-inter duration-300 transform z-10 origin-[0] bg-white px-2 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 -translate-y-4 scale-75 top-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[14px] ${errors && errors.confirmPassword ? 'text-red-600' : 'text-gray-500'} peer-focus:text-blue-600`}
             >
                Ulangi Kata Sandi Baru
              </label>
              {errors && errors.confirmPassword && (
                <div
                  id="confirmPassword-error"
                  role="alert"
                  className="absolute z-10 bottom-0 left-1 translate-y-full mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded shadow-md"
                >
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Tombol Submit */}
            <div className="flex flex-col items-center space-y-4 w-full pt-4">
              <button
                type="submit"
                className={`w-full font-inter h-[54px] bg-[#367AFF] text-white text-[18px] font-semibold rounded-[10px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
          <p className="text-gray-500 text-[16px] font-medium font-inter text-center mt-[32px]">
            Kembali ke{" "}
            <Link
              to="/login"
              className={`text-blue-600 font-semibold font-inter underline hover:text-blue-800 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
               aria-disabled={isLoading}
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

export default ConfirmPasswordView;