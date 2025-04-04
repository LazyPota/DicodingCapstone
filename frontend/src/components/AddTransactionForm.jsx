import React, { useState } from "react";
import Modal from "./Modal"; // Pastikan Modal.jsx sudah ada

const AddTransactionForm = ({ isOpen, onClose }) => {
  const [type, setType] = useState("pemasukan");
  const [amount, setAmount] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Transaksi">
      {/* Tanggal */}
      <input
        type="date"
        className="w-full px-3 py-2 border rounded-[16px] mb-3"
      />

      {/* Tipe (Radio Button) */}
      <div className="flex justify-between mb-3">
        <button
          className={`px-4 py-2 w-full border rounded-[16px] mr-2 ${
            type === "pemasukan" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setType("pemasukan")}
        >
          Pemasukan
        </button>
        <button
          className={`px-4 py-2 w-full border rounded-[16px] ${
            type === "pengeluaran" ? "bg-red-500 text-white" : ""
          }`}
          onClick={() => setType("pengeluaran")}
        >
          Pengeluaran
        </button>
      </div>

      {/* Kategori */}
      <select className="w-full px-3 py-2 border rounded-[16px] mb-3">
        <option value="">Pilih Kategori</option>
      </select>

      {/* Total */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 border rounded-[16px] mb-3"
        placeholder="Rp 0,00"
      />

      {/* Dompet */}
      <select className="w-full px-3 py-2 border rounded-[16px] mb-3">
        <option value="">Pilih Dompet</option>
      </select>

      {/* Catatan */}
      <textarea
        className="w-full px-3 py-2 border rounded-[16px] mb-3"
        placeholder="Tambahkan catatan"
      ></textarea>
    </Modal>
  );
};

export default AddTransactionForm;