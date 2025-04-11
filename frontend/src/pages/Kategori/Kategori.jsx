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

const Kategori = () => {
  const [filter, setFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "Expense" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { categories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (!user?.id) {
      console.log("User ID tidak ditemukan, tidak bisa fetch kategori.");
      navigate("/login");
      return;
    }
    dispatch(getCategories(user.id));
  }, [dispatch, user?.id]);
  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
      dispatch(resetCategoryState());
    }

    if (isSuccess && message) {
      setIsModalOpen(false);
      setFormData({ name: "", type: "Expense" });
      setCurrentCategory(null);
      setModalMode("add");
      dispatch(resetCategoryState());
    }
  }, [isError, isSuccess, message, dispatch]);

  const filteredCategories = categories.filter((category) => {
    if (filter === "Semua") return true;
    return category.category_type === filter;
  });

  const handleOpenAddModal = () => {
    setModalMode("add");
    setCurrentCategory(null);
    setFormData({ name: "", type: "Expense" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalMode("edit");
    setCurrentCategory(category);
    setFormData({ name: category.category_name, type: category.category_type });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setFormData({ name: "", type: "Expense" });
    dispatch(resetCategoryState());
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) return;

    const categoryData = {
      category_name: formData.name,
      category_type: formData.type,
    };

    if (modalMode === "add") {
      dispatch(createCategory({ userId: user.id, categoryData }));
    } else if (modalMode === "edit" && currentCategory) {
      dispatch(
        updateCategory({
          userId: user.id,
          categoryId: currentCategory.id,
          categoryData,
        })
      );
    }
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      if (!user?.id) return;
      dispatch(deleteCategory({ userId: user.id, categoryId }));
    }
  };

  return (
    <>
      <KategoriView
        categories={filteredCategories}
        filter={filter}
        isLoading={isLoading}
        setFilter={setFilter}
        onAddClick={handleOpenAddModal}
        onEditClick={handleOpenEditModal}
        onDeleteClick={handleDelete}
        isModalOpen={isModalOpen}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === "add" ? "Tambah Kategori" : "Edit Kategori"}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      >
        <>
          <div className="mb-4">
            <label
              htmlFor="category-name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Kategori
            </label>
            <input
              id="category-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleFormChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Masukkan nama kategori"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category-type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipe Kategori
            </label>
            <select
              id="category-type"
              name="type"
              value={formData.type}
              onChange={handleFormChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg px-3 py-2"
              required
              disabled={isLoading}
            >
              <option value="Income">Pemasukan</option> 
              <option value="Expense">Pengeluaran</option>
            </select>
          </div>
        </>
      </Modal>
    </>
  );
};

export default Kategori;
