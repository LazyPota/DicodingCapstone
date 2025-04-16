import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  resetCategoryState, 
} from "../../features/categories/categorySlice";
import KategoriView from "./KategoriView";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "../../components/Popup/SuccessPopup"; // Import popup
import UpdatePopup from "../../components/Popup/UpdatePopup";   // Import popup
import DeleteConfirmationPopup from "../../components/Popup/DeletePopup"; // Import popup

const Kategori = () => {
  const [filter, setFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [errors, setErrors] = useState({}); // <-- State Validasi
  const initialFormData = { name: "", type: "Expense" };
  const [formData, setFormData] = useState(initialFormData);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { categories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }
    dispatch(getCategories(user.id));
  }, [dispatch, user?.id, navigate]);

  useEffect(() => {
    if (isSuccess && message) {
      console.log("Category operation successful:", message);
      setIsModalOpen(false); 
      setFormData(initialFormData); 
      setCurrentCategory(null);
      setModalMode("add");
      setErrors({}); 
      if (message.includes("dihapus")) {
         setDeleteSuccessMessage(message);
         setIsDeleteSuccess(true); 
      } else {
         if (user?.id) {
             console.log("Refetching categories after C/U success...");
             dispatch(getCategories(user.id));
         }
      }
    }
  }, [isSuccess, message, dispatch, user?.id]); 

  useEffect(() => {
    if (isError && message) {
      console.error("Category operation error:", message);
      if (isModalOpen) { 
        setErrors(prev => ({ ...prev, server: message }));
      } else if (message.toLowerCase().includes('delete') || message.toLowerCase().includes('hapus')) { 
        setDeleteErrorMessage(message);
      } else { 
        console.error("General category fetch/operation error:", message);
      }
      dispatch(resetCategoryState());
    }
  }, [isError, message, dispatch, isModalOpen]);

  const filteredCategories = categories.filter((category) => {
    if (filter === "Semua") return true;
    return category.category_type === filter;
  });

  const displayCategoryType = (typeValue) => {
    if (typeValue === "Income") {
      return "Pemasukan";
    } else if (typeValue === "Expense") {
      return "Pengeluaran";
    }
    return typeValue;
  };

  const handleOpenAddModal = () => { /* ... sama, panggil setErrors({}) ... */
    setModalMode("add");
    setCurrentCategory(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };
 const handleOpenEditModal = (category) => { /* ... sama, panggil setErrors({}) ... */
    setModalMode("edit");
    setCurrentCategory(category);
    setFormData({ name: category.category_name, type: category.category_type });
    setErrors({});
    setIsModalOpen(true);
  };
 const handleCloseModal = () => { /* ... sama, panggil setErrors({}) ... */
    setIsModalOpen(false);
    setCurrentCategory(null);
    setFormData(initialFormData);
    setErrors({});
    if (isError) dispatch(resetCategoryState()); // Reset jika tutup modal saat error
  };

 const handleFormChange = (e) => {
   const { name, value } = e.target;
   setFormData((prevState) => ({ ...prevState, [name]: value, }));
   // Clear validation error
   if (errors[name]) {
     setErrors((prev) => ({ ...prev, [name]: null }));
   }
   if (errors.server) {
     setErrors((prev) => ({ ...prev, server: null }));
      // if (isError) dispatch(resetCategoryState()); // Ditangani di effect error
   }
 };

 // --- Validation ---
 const validateForm = () => {
     let formIsValid = true;
     let newErrors = {};
     if (!formData.name.trim()) {
         formIsValid = false;
         newErrors.name = "Nama kategori wajib diisi.";
     }
     // Validasi type tidak perlu karena default dan select
     setErrors(newErrors);
     return formIsValid;
 };

 const handleFormSubmit = (e) => {
   e.preventDefault();
   if (!user?.id) return;
   setErrors({}); 
   if (!validateForm()) {
       console.log("Category form validation failed");
       return;
   }

   const categoryData = {
     category_name: formData.name.trim(), 
     category_type: formData.type,
   };

   if (modalMode === "add") {
     console.log("Submitting create category:", categoryData);
     dispatch(createCategory({ userId: user.id, categoryData }));
   } else if (modalMode === "edit" && currentCategory) {
     console.log("Submitting update category:", categoryData, "for ID:", currentCategory.id);
     dispatch( updateCategory({ userId: user.id, categoryId: currentCategory.id, categoryData }) );
   }
 };

 // --- Delete Handling ---
 const handleDelete = (categoryId) => {
   setCategoryToDelete(categoryId);
   setDeleteErrorMessage(null); // Reset error delete
   setIsConfirmDeleteOpen(true); // Buka konfirmasi
 };

 const handleConfirmDelete = async () => {
   if (!user?.id || !categoryToDelete) return;
   setIsConfirmDeleteOpen(false); // Tutup konfirmasi
   console.log(`Dispatching deleteCategory for user: ${user.id}, category: ${categoryToDelete}`);
   await dispatch(deleteCategory({ userId: user.id, categoryId: categoryToDelete }));
   setCategoryToDelete(null); // Reset ID
   // Hasil sukses/error ditangani oleh useEffect isSuccess/isError
 };

 const closeDeleteConfirmation = () => {
   setIsConfirmDeleteOpen(false);
   setCategoryToDelete(null);
 };

  const closeDeleteSuccessPopup = () => {
    setIsDeleteSuccess(false);
    setDeleteSuccessMessage("");
    // Fetch ulang data setelah popup sukses delete ditutup
    if (user?.id) {
        console.log("Refetching categories after delete success...");
        dispatch(getCategories(user.id));
    }
    dispatch(resetCategoryState()); // Reset state Redux
 };


 // --- RENDER ---
 return (
   <>
     <KategoriView
       categories={filteredCategories}
       filter={filter}
       isLoading={isLoading}
       setFilter={setFilter}
       onAddClick={handleOpenAddModal}
       onEditClick={handleOpenEditModal}
       onDeleteClick={handleDelete} // <-- Kirim handler delete baru
       isModalOpen={isModalOpen} // Kirim untuk disable tombol?
       displayCategoryType={displayCategoryType}
       // isSuccessPopupOpen={isSuccessPopupOpen} // Hapus
       // closeSuccessPopup={closeSuccessPopup} // Hapus
       deleteError={deleteErrorMessage} // <-- Kirim delete error
     />

     {/* Modal Add/Edit */}
     <Modal
       isOpen={isModalOpen}
       onClose={handleCloseModal}
       title={modalMode === "add" ? "Tambah Kategori" : "Edit Kategori"}
       onSubmit={handleFormSubmit}
       isLoading={isLoading}
        submitLabel={modalMode === 'add' ? 'Tambah' : 'Simpan'} // Label dinamis
     >
        {/* Konten Form dengan Validasi */}
       <>
          {/* Server Error */}
          {errors.server && ( <p className="text-red-500 text-xs mb-3 text-center">{errors.server}</p> )}

          {/* Nama Kategori */}
         <div className="mb-4">
           <label htmlFor="category-name" className="block text-sm font-medium text-gray-700"> Nama Kategori </label>
           <input
             id="category-name"
             name="name" // Pastikan name="name"
             type="text"
             value={formData.name}
             onChange={handleFormChange}
              className={`mt-1 block w-full border rounded-lg px-3 py-2 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
             placeholder="Masukkan nama kategori"
             required
             disabled={isLoading}
             aria-invalid={errors.name ? "true" : "false"}
             aria-describedby={errors.name ? "category-name-error" : undefined}
           />
            {errors.name && <p id="category-name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
         </div>

          {/* Tipe Kategori */}
         <div className="mb-4">
           <label htmlFor="category-type" className="block text-sm font-medium text-gray-700"> Tipe Kategori </label>
           <select
             id="category-type"
             name="type" // Pastikan name="type"
             value={formData.type}
             onChange={handleFormChange}
             className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             required
             disabled={isLoading}
           >
             <option value="Expense">Pengeluaran</option> {/* Default atau urutan sesuai preferensi */}
             <option value="Income">Pemasukan</option>
           </select>
            {/* Error validasi tidak diperlukan untuk select dengan default */}
         </div>
       </>
     </Modal>

      {/* --- POPUPS --- */}
      <DeleteConfirmationPopup
         isOpen={isConfirmDeleteOpen}
         onClose={closeDeleteConfirmation}
         onConfirm={handleConfirmDelete}
         isLoading={isLoading}
     />
      {isSuccess && message && !message.includes("dihapus") && (
          message.includes("ditambahkan")
          ? <SuccessPopup isOpen={isSuccess} onClose={() => dispatch(resetCategoryState())} successMessage={message} />
          : message.includes("diperbarui")
          ? <UpdatePopup isOpen={isSuccess} onClose={() => dispatch(resetCategoryState())} updateMessage={message}/>
          : null // Fallback jika pesan tidak cocok
      )}
        {isDeleteSuccess && (
           <SuccessPopup
               isOpen={isDeleteSuccess}
               onClose={closeDeleteSuccessPopup}
               successMessage={deleteSuccessMessage}
           />
       )}
   </>
 );
};

export default Kategori;