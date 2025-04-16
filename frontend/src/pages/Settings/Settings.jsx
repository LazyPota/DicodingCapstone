import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SettingsView from "./SettingsView";
import { updateUserProfile, reset } from "../../features/auth/authSlice";
import defaultAvatarPlaceholder from "../../assets/default-avatar.jpeg"; // Pastikan path benar
import UpdatePopup from "../../components/Popup/UpdatePopup"; // <-- Import UpdatePopup

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"; // Gunakan env variable

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, updateProfileSuccess, message } =
    useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({}); // <-- State untuk validasi & server errors
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // <-- State untuk popup update

  const fileInputRef = useRef(null);

  // Efek untuk inisialisasi form dan preview image
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
       // Logika menampilkan gambar profil atau default (sudah OK)
       if (user.profile_image_path && !previewImage && !selectedFile) { // Hanya set jika belum ada preview
           const imagePath = user.profile_image_path.startsWith("/")
             ? user.profile_image_path.substring(1)
             : user.profile_image_path;
           setPreviewImage(`${BACKEND_URL}/${imagePath}`);
       } else if (!previewImage && !selectedFile) {
           setPreviewImage(defaultAvatarPlaceholder);
       }
    } else {
      setUsername("");
      setSelectedFile(null);
      setPreviewImage(defaultAvatarPlaceholder);
    }
    // JANGAN masukkan previewImage ke dependency array ini agar tidak reset saat file dipilih
  }, [user]); // Hanya bergantung pada user

  // Efek untuk menangani hasil dari Redux (error/sukses)
  useEffect(() => {
    if (isError && message) {
      console.error("Error Updating Profile:", message);
      setErrors(prev => ({ ...prev, server: message })); // Simpan error server ke state
      // Reset state Redux agar error tidak persisten jika user navigasi
      dispatch(reset());
    } else if (updateProfileSuccess && message) {
      console.log("Success:", message);
      setShowUpdatePopup(true); // <-- Tampilkan popup sukses
      setSelectedFile(null); // Reset file setelah sukses
      // JANGAN reset state Redux di sini, biarkan popup onClose yg handle
      // dispatch(reset());
    }
  }, [isError, updateProfileSuccess, message, dispatch]);


  // --- FORM HANDLING & VALIDATION ---

   const clearErrors = (fieldName) => {
     if (errors[fieldName]) {
       setErrors((prev) => ({ ...prev, [fieldName]: null }));
     }
     if (errors.server) {
       setErrors((prev) => ({ ...prev, server: null }));
       // Jika ada error server, reset juga state redux error saat user mulai edit
       if (isError) dispatch(reset());
     }
   };


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    clearErrors('username'); // Bersihkan error saat mengetik
  };

  const handleFileChange = (e) => {
     clearErrors('profile_image'); // Bersihkan error jika ada yg terkait file
    const file = e.target.files[0];
    if ( file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") ) {
      if (file.size > 2 * 1024 * 1024) { // Contoh validasi ukuran file (misal 2MB)
           setErrors(prev => ({...prev, profile_image: "Ukuran file maksimal 2MB."}));
           setSelectedFile(null);
           // Reset preview ke gambar user atau default
           setPreviewImage(user?.profile_image_path ? `${BACKEND_URL}/${user.profile_image_path.replace(/^\//, '')}` : defaultAvatarPlaceholder);
      } else {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setPreviewImage(reader.result); };
            reader.readAsDataURL(file);
            // Clear error jika sebelumnya ada
            if (errors.profile_image) {
                setErrors(prev => ({...prev, profile_image: null}));
            }
      }
    } else if (file) {
      console.warn("Tipe file tidak valid. Pilih JPG, JPEG, atau PNG.");
      setErrors(prev => ({...prev, profile_image: "Tipe file tidak valid (JPG, JPEG, PNG)."}));
      setSelectedFile(null);
      setPreviewImage(user?.profile_image_path ? `${BACKEND_URL}/${user.profile_image_path.replace(/^\//, '')}` : defaultAvatarPlaceholder);
    }
    // Reset input file agar bisa memilih file yang sama lagi jika perlu
    if (fileInputRef.current) { fileInputRef.current.value = ""; }
  };

  const handleEditPictureClick = () => {
    if (fileInputRef.current) { fileInputRef.current.click(); }
  };

  // Fungsi validasi form
   const validateForm = () => {
       let isValid = true;
       let newErrors = {};
       if (!username.trim()) {
           isValid = false;
           newErrors.username = "Nama lengkap tidak boleh kosong.";
       }
       // Tambahkan validasi file jika ada di errors state (misal ukuran)
       if (errors.profile_image) {
           isValid = false;
           newErrors.profile_image = errors.profile_image; // Pertahankan error file jika ada
       }
       setErrors(newErrors);
       return isValid;
   };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset error sebelum submit baru

    // Validasi dulu
    if (!validateForm()) {
        console.log("Form validation failed");
        return;
    }

    // Cek apakah ada perubahan
    const usernameChanged = user && username.trim() !== "" && username !== user.username;
    const imageChanged = selectedFile !== null;

    if (!usernameChanged && !imageChanged) {
      console.log("Tidak ada perubahan untuk disimpan.");
      // Tampilkan pesan info jika perlu (opsional, bisa pakai state lain atau library toast)
       setErrors({ server: "Tidak ada perubahan untuk disimpan." });
      return;
    }

    const formDataPayload = new FormData(); // Gunakan FormData untuk file

    if (usernameChanged) { formDataPayload.append("username", username); }
    if (imageChanged) { formDataPayload.append("profile_image", selectedFile); }

    console.log("Dispatching updateUserProfile...");
    dispatch(updateUserProfile(formDataPayload));
  };

  // --- POPUP CONTROL ---
   const handleCloseUpdatePopup = () => {
       setShowUpdatePopup(false);
       dispatch(reset()); // Reset state Redux (isSuccess, message, etc.) setelah popup ditutup
   };


  // Tentukan URL gambar yang akan ditampilkan
  const displayImage = previewImage || defaultAvatarPlaceholder;

  // Menentukan apakah tombol update harus dinonaktifkan
  const isUpdateDisabled =
    isLoading || !user || (username === (user?.username || "") && !selectedFile);

  // --- RENDER ---
  return (
     <> {/* Fragment untuk menampung view dan popup */}
        <SettingsView
          user={user}
          isLoading={isLoading}
          // isError tidak dikirim lagi, error ditampilkan dari state lokal 'errors'
          // updateProfileSuccess tidak perlu dikirim, ditangani oleh popup
          message={message} // Masih bisa kirim jika ada pesan umum lain
          username={username}
          displayImage={displayImage}
          fileInputRef={fileInputRef}
          onUsernameChange={handleUsernameChange}
          onFileChange={handleFileChange}
          onEditPictureClick={handleEditPictureClick}
          onSubmit={handleSubmit}
          isUpdateDisabled={isUpdateDisabled}
          defaultAvatar={defaultAvatarPlaceholder}
          errors={errors} // <-- Kirim state errors ke view
        />

        {/* Render Update Popup */}
        <UpdatePopup
          isOpen={showUpdatePopup}
          onClose={handleCloseUpdatePopup}
          updateMessage={message} // Gunakan message dari Redux
        />
     </>
  );
};

export default Settings;