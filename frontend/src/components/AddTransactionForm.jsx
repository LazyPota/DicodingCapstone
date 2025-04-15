import React, { useState } from "react";

const AddTransactionForm = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("income");

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-[16px] w-[500px]">
          {/* Tabs */}
          <div className="flex justify-around border-b mb-4">
            {["income", "expense", "transfer"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-4 font-semibold ${
                  activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                }`}
              >
                {tab === "income" && "Pemasukan"}
                {tab === "expense" && "Pengeluaran"}
                {tab === "transfer" && "Transfer"}
              </button>
            ))}
          </div>

          {/* Form Berdasarkan Tab */}
          {activeTab === "income" || activeTab === "expense" ? (
            <FormTransaksi />
          ) : (
            <FormTransfer />
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-[12px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-[12px]"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const FormTransaksi = () => {
  return (
    <form className="space-y-4">
      {/* Date */}
      <input type="date" className="w-full border rounded px-3 py-2" />

      {/* Kategori */}
      <select className="w-full border rounded px-3 py-2">
        <option>Kategori</option>
      </select>

      {/* Total */}
      <input type="number" placeholder="Rp 0.00" className="w-full border rounded px-3 py-2" />

      {/* Dompet */}
      <select className="w-full border rounded px-3 py-2">
        <option>Dompet</option>
      </select>

      {/* Catatan */}
      <textarea
        rows={3}
        placeholder="Catatan"
        className="w-full border rounded px-3 py-2"
      />
    </form>
  );
};

const FormTransfer = () => {
  return (
    <form className="space-y-4">
      {/* Tanggal */}
      <input
        type="date"
        className="w-full border rounded px-3 py-2"
        defaultValue={new Date().toISOString().split("T")[0]}
      />

      {/* Tipe Transfer */}
      <select className="w-full border rounded px-3 py-2">
        <option value="">Tipe Transfer</option>
        <option value="bank">Antar Bank</option>
        <option value="wallet">Dompet Digital</option>
      </select>

      {/* Dari */}
      <select className="w-full border rounded px-3 py-2">
        <option value="">Dari</option>
        <option value="bank1">Rekening BCA</option>
        <option value="wallet1">OVO</option>
      </select>

      {/* Tujuan */}
      <select className="w-full border rounded px-3 py-2">
        <option value="">Tujuan</option>
        <option value="bank2">Rekening Mandiri</option>
        <option value="wallet2">Gopay</option>
      </select>

      {/* Total */}
      <div>
        <label className="text-sm font-medium">Total</label>
        <input
          type="number"
          placeholder="Rp 0.00"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Catatan */}
      <textarea
        rows={3}
        placeholder="Catatan"
        className="w-full border rounded px-3 py-2"
      />
    </form>
  );
};


export default AddTransactionForm;
