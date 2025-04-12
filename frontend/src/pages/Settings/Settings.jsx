import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SettingsView from "./SettingsView";
import { updateUserProfile, reset } from "../../features/auth/authSlice";
import defaultAvatarPlaceholder from "../../assets/default-avatar.jpeg";

const BACKEND_URL = "http://localhost:8000";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, updateProfileSuccess, message } =
    useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      if (user.profile_image_path) {
        const imagePath = user.profile_image_path.startsWith("/")
          ? user.profile_image_path.substring(1)
          : user.profile_image_path;
        setPreviewImage(`${BACKEND_URL}/${imagePath}`);
      } else {
        setPreviewImage(defaultAvatarPlaceholder);
      }
    } else {
      setUsername("");
      setSelectedFile(null);
      setPreviewImage(defaultAvatarPlaceholder);
    }
    if (!selectedFile && user && !user.profile_image_path) {
      setPreviewImage(defaultAvatarPlaceholder);
    } else if (!selectedFile && user && user.profile_image_path) {
      const imagePath = user.profile_image_path.startsWith("/")
        ? user.profile_image_path.substring(1)
        : user.profile_image_path;
      setPreviewImage(`${BACKEND_URL}/${imagePath}`);
    }
  }, [user, selectedFile]);

  useEffect(() => {
    if (isError && message) {
      console.error("Error Updating Profile:", message);
      dispatch(reset());
    } else if (updateProfileSuccess && message) {
      console.log("Success:", message);
      setSelectedFile(null);
      dispatch(reset());
    }
  }, [isError, updateProfileSuccess, message, dispatch]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      console.warn("Tipe file tidak valid. Pilih JPG, JPEG, atau PNG.");
      setSelectedFile(null);
    } else {
      setSelectedFile(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditPictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cek apakah ada perubahan
    const usernameChanged =
      user && username.trim() !== "" && username !== user.username;
    const imageChanged = selectedFile !== null;

    if (!usernameChanged && !imageChanged) {
      console.log("Tidak ada perubahan untuk disimpan.");
      // toast.info("Tidak ada perubahan untuk disimpan.");
      return;
    }

    const formData = new FormData();

    // Hanya tambahkan field yang berubah ke FormData
    if (usernameChanged) {
      formData.append("username", username);
    }
    if (imageChanged) {
      formData.append("profile_image", selectedFile);
    }

    // Dispatch action Redux
    console.log("Dispatching updateUserProfile with:", {
      username: usernameChanged ? username : undefined,
      profile_image: imageChanged ? selectedFile.name : undefined,
    }); // Log data yg dikirim
    dispatch(updateUserProfile(formData));
  };

  // Tentukan URL gambar yang akan ditampilkan di SettingsView
  const displayImage = previewImage || defaultAvatarPlaceholder;

  // Menentukan apakah tombol update harus dinonaktifkan
  const isUpdateDisabled =
    isLoading ||
    !user ||
    (username === (user?.username || "") && !selectedFile);

  return (
    <SettingsView
      user={user}
      isLoading={isLoading}
      isError={isError} // Kirim state error
      updateProfileSuccess={updateProfileSuccess} // Kirim state sukses
      message={message} // Kirim pesan feedback
      username={username}
      displayImage={displayImage}
      fileInputRef={fileInputRef}
      onUsernameChange={handleUsernameChange}
      onFileChange={handleFileChange}
      onEditPictureClick={handleEditPictureClick}
      onSubmit={handleSubmit}
      isUpdateDisabled={isUpdateDisabled}
      defaultAvatar={defaultAvatarPlaceholder} // Kirim placeholder jika diperlukan di view
    />
  );
};

export default Settings;
