import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Icon } from "@iconify/react";

const SettingsView = ({
  user,
  isLoading,
  isError,
  updateProfileSuccess,
  message,
  username,
  displayImage,
  fileInputRef,
  onUsernameChange,
  onFileChange,
  onEditPictureClick,
  onSubmit,
  isUpdateDisabled,
  defaultAvatar,
}) => {
  const finalDisplayImage = displayImage || defaultAvatar;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-7 overflow-auto bg-[#F3F4F7]">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            Akun Pengguna
          </h1>
          <p className="text-gray-600 mb-6">
            Kelola informasi dan keamanan akun Anda.
          </p>

          {isError && message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {updateProfileSuccess && message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <div className="bg-white p-6 md:p-8 rounded-xl max-w-[1500px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center border-b pb-6 mb-6">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <img
                  src={finalDisplayImage}
                  alt="Profil Pengguna"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
                <button
                  type="button"
                  onClick={onEditPictureClick}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  aria-label="Ubah gambar profil"
                  disabled={isLoading}
                >
                  <Icon icon="ph:pencil-simple-line-fill" className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  disabled={isLoading}
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.username || "Nama Pengguna"}
                </h2>
                <p className="text-gray-500">
                  {user?.email || "email@contoh.com"}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Informasi Pribadi
            </h3>
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  required
                  value={username}
                  onChange={onUsernameChange}
                  disabled={isLoading || !user}
                />
              </div>
              {/* ... */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdateDisabled}
                >
                  {isLoading ? "Memperbarui..." : "Perbarui Profil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
