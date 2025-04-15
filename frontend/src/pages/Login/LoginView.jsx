import React, { useEffect, useState } from "react";
import logo from "../../assets/logoFIX.png";
import container from "../../assets/container.png";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../instance/api";

const LoginView = ({ setShowPassword, showPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/beranda");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = "Email tidak boleh kosong";
    if (!password) newErrors.password = "Password tidak boleh kosong";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    api.post("/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.error("Login failed:", err);
        setErrors({ ...newErrors, password: "Email atau password salah" });
      });
  };

  return (
    <main className="relative flex min-h-[140vh] md:p-2">
      <header className="absolute top-4 left-4">
        <img src={logo} alt="Logo Perusahaan" className="w-[50px] md:w-[70px]" />
      </header>
      <section className="flex flex-1 justify-center items-center w-full md:w-1/2 lg:w-1/2 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[400px]">
          <h1 className="text-3xl md:text-[40px] font-bold font-inter text-center lg:text-left">Masuk</h1>
          <p className="text-[18px] font-normal font-inter text-[#969696] mt-2 text-center lg:text-left">
            Silakan masuk untuk melanjutkan akun Anda.
          </p>
          <form onSubmit={handleLogin} className="mt-3 flex flex-col space-y-[20px]" noValidate>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                className={`block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border ${
                  errors.email ? "border-red-500" : "border-[#D9D9D9]"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <label htmlFor="email" className={`absolute text-[18px] font-medium font-inter duration-300 transform z-10 origin-[0] bg-white px-2 start-1 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[14px] ${
                errors.email ? "text-red-600" : "text-gray-500 peer-focus:text-blue-600"
              }`}>Email</label>
              {errors.email && <p id="email-error" className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border ${
                  errors.password ? "border-red-500" : "border-[#D9D9D9]"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10`}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <label htmlFor="password" className={`absolute text-[18px] font-medium font-inter duration-300 transform z-10 origin-[0] bg-white px-2 start-1 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[14px] ${
                errors.password ? "text-red-600" : "text-gray-500 peer-focus:text-blue-600"
              }`}>Password</label>
              <button
                type="button"
                className="absolute z-10 top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
              </button>
              {errors.password && <p id="password-error" className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="keep_logged_in" className="w-[18px] h-[18px] border border-black rounded" />
                <label htmlFor="keep_logged_in" className="text-[16px] font-medium text-gray-900 font-inter">Biarkan saya tetap masuk</label>
              </div>
              <Link to="/lupa-password" className="text-blue-500 font-inter font-semibold text-sm underline hover:text-blue-700 transition-colors delay-75">
                Lupa Kata Sandi
              </Link>
            </div>

            <div className="flex flex-col items-center space-y-4 w-full pt-4">
              <button
                type="submit"
                className="w-full font-inter h-[54px] bg-[#367AFF] text-white text-[18px] font-semibold rounded-[10px] hover:bg-blue-700 transition"
              >
                Masuk
              </button>
              <div className="flex items-center w-full">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-3 text-gray-500 text-sm font-medium font-inter">Atau</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <button
                type="button"
                className="w-full h-[54px] border border-[#E6E8E7] rounded-[10px] flex items-center justify-center space-x-2 text-lg font-medium font-inter text-gray-900 hover:bg-gray-200 transition"
              >
                <Icon icon="flat-color-icons:google" className="text-xl" />
                <span>Masuk Dengan Google</span>
              </button>
            </div>
          </form>
          <p className="text-gray-500 text-[16px] font-medium font-inter text-center mt-[32px]">
            Belum Punya Akun?{" "}
            <Link to="/register" className="text-blue-600 font-semibold underline hover:text-blue-800">
              Daftar
            </Link>
          </p>
        </div>
      </section>
      <aside className="hidden lg:flex justify-center items-center w-1/2">
        <img src={container} alt="Decorative container illustration" className="w-full h-full object-cover rounded-[16px]" />
      </aside>
    </main>
  );
};

export default LoginView;
