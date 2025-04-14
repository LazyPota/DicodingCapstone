import React from "react";
import { Icon } from "@iconify/react";

const SettingsView = ({
  user,
  isLoading,
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
  errors,
}) => {
  const finalDisplayImage = displayImage || defaultAvatar;

  return (
    <div className="flex-1 p-4 md:p-7 overflow-auto bg-[#F3F4F7]">
      <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-800">
        Akun Pengguna
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Kelola informasi dan keamanan akun Anda.
      </p>

      {/* Tampilkan Server/General Error */}
      {errors && errors.server && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" // Ukuran font kecil
          role="alert"
        >
          <span className="block sm:inline">{errors.server}</span>
        </div>
      )}

      {/* Tampilkan Pesan Info Umum (jika ada, selain sukses update) */}
      {message && !errors.server && !isLoading && (
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-sm"
          role="status"
        >
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {/* Kontainer Utama */}
      <div className="bg-white p-6 md:p-8 rounded-xl max-w-full mx-auto shadow-sm">
        <div className="flex flex-col sm:flex-row items-center border-b pb-6 mb-6">
          <div className="relative mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
            <img
              src={finalDisplayImage}
              alt="Profil Pengguna"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <button
              type="button"
              onClick={onEditPictureClick}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 md:p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Ubah gambar profil"
              disabled={isLoading}
            >
              <Icon
                icon="ph:pencil-simple-line-fill"
                className="w-3 h-3 md:w-4 md:h-4"
              />
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              ref={fileInputRef}
              onChange={onFileChange}
              disabled={isLoading}
              aria-describedby={
                errors?.profile_image ? "profile_image-error" : undefined
              }
            />
            {errors?.profile_image && (
              <p
                id="profile_image-error"
                className="text-red-500 text-xs mt-1 text-center sm:text-left"
              >
                {errors.profile_image}
              </p>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 break-words">
              {user?.username || "Nama Pengguna"}
            </h2>
            <p className="text-sm text-gray-500 break-words">
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
              // className tidak diubah, tapi tambahkan error handling
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 ${
                errors?.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`} // <-- Styling error
              required
              value={username}
              onChange={onUsernameChange}
              disabled={isLoading || !user}
              aria-invalid={errors?.username ? "true" : "false"}
              aria-describedby={errors?.username ? "username-error" : undefined}
            />
            {errors?.username && (
              <p id="username-error" className="text-red-500 text-xs mt-1">
                {errors.username}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
              readOnly
              value={user?.email || ""}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email tidak dapat diubah.
            </p>
          </div>
          <div className="flex justify-end mt-8">
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
  );
};

export default SettingsView;
