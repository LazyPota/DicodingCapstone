import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const SettingsView = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
  });

  const profileImageUrl = "https://randomuser.me/api/portraits/men/1.jpg"; // Foto Profil dari Header

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        {/* Content Wrapper */}
        <div className="flex flex-col p-10 overflow-auto">
          <h2 className="text-3xl font-bold text-gray-900">Akun Pengguna</h2>
          <p className="text-gray-600 text-lg mb-6">
            Kelola informasi dan keamanan akun Anda.
          </p>

          {/* Card Settings */}
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
            <div className="flex gap-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <img
                  src={profileImageUrl} // Pakai foto yang sama dengan header
                  alt="Profile"
                  className="w-100 h-100 rounded-lg object-cover"
                />
                <div className="mt-2 flex gap-3">
                  <button className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition">
                    Ubah Gambar
                  </button>
                  <button className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition">
                    Hapus Gambar
                  </button>
                </div>
              </div>

              {/* Form Input */}
              <div className="flex-1 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-semibold">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded-lg w-full mt-1"
                    placeholder="Masukkan Nama Lengkap"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded-lg w-full mt-1"
                    placeholder="Masukkan Email"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Kata Sandi</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded-lg w-full mt-1"
                    placeholder="Kata Sandi"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Phone No.</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-600">+62 (ID)</span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border px-4 py-2 rounded-lg w-full pl-20 mt-1"
                      placeholder="Masukkan Nomor Ponsel"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded-lg w-full mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
                Perbarui Profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
