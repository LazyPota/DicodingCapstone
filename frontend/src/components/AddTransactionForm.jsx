import React from "react";
import { Icon } from "@iconify/react";

const FormTransaksi = ({
  formData,
  handleFormChange,
  wallets = [],
  categories = [],
  isLoading,
  activeTab,
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="transaction_date"
          className="block text-sm font-medium text-gray-700"
        >
          Tanggal
        </label>
        <input
          id="transaction_date"
          name="transaction_date"
          type="date"
          value={formData.transaction_date || ""}
          onChange={(e) => handleFormChange(e, "transaction")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={isLoading}
        />
      </div>
      {/* Input Dompet */}
      <div className="mb-4">
        <label
          htmlFor="wallet_id"
          className="block text-sm font-medium text-gray-700"
        >
          Dompet
        </label>
        <select
          id="wallet_id"
          name="wallet_id"
          value={formData.wallet_id || ""}
          onChange={(e) => handleFormChange(e, "transaction")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={isLoading || wallets.length === 0}
        >
          <option value="" disabled>
            {wallets.length === 0 ? "Tidak ada dompet" : "Pilih Dompet"}
          </option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.wallet_name}
            </option>
          ))}
        </select>
      </div>
      {/* Input Kategori */}
      <div className="mb-4">
        <label
          htmlFor="category_id"
          className="block text-sm font-medium text-gray-700"
        >
          Kategori
        </label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id || ""}
          onChange={(e) => handleFormChange(e, "transaction")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={isLoading || categories.length === 0}
        >
          <option value="" disabled>
            {categories.length === 0
              ? "Memuat/Tidak ada kategori"
              : "Pilih Kategori"}
          </option>
          {categories
            .filter(
              (cat) =>
                cat.category_type ===
                (activeTab === "income" ? "Income" : "Expense")
            )
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
        </select>
      </div>
      {/* Input Jumlah */}
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Jumlah
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="Rp 0"
          value={formData.amount || ""}
          onChange={(e) => handleFormChange(e, "transaction")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          min="0"
          disabled={isLoading}
        />
      </div>
      {/* Input Catatan */}
      <div className="mb-4">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-gray-700"
        >
          Catatan (Opsional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Catatan"
          value={formData.note || ""}
          onChange={(e) => handleFormChange(e, "transaction")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

const FormTransfer = ({
  formData,
  handleFormChange,
  wallets = [],
  goals = [],
  isLoading,
}) => {
  const [fromType, setFromType] = React.useState("wallet");
  const [toType, setToType] = React.useState("wallet");

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="transfer_date"
          className="block text-sm font-medium text-gray-700"
        >
          Tanggal Transfer
        </label>
        <input
          id="transfer_date"
          name="transfer_date"
          type="date"
          value={formData.transfer_date || ""}
          onChange={(e) => handleFormChange(e, "transfer")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={isLoading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sumber Dana
        </label>
        <div className="flex space-x-4 mb-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="fromTypeRadio"
              value="wallet"
              checked={fromType === "wallet"}
              onChange={(e) => setFromType(e.target.value)}
              disabled={isLoading}
            />
            <span className="ml-2">Dompet</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="fromTypeRadio"
              value="goal"
              checked={fromType === "goal"}
              onChange={(e) => setFromType(e.target.value)}
              disabled={isLoading}
            />
            <span className="ml-2">Rencana Tabungan</span>
          </label>
        </div>
        <select
          id={fromType === "wallet" ? "from_wallet_id" : "from_goal_id"}
          name={fromType === "wallet" ? "from_wallet_id" : "from_goal_id"}
          value={
            (fromType === "wallet"
              ? formData.from_wallet_id
              : formData.from_goal_id) ?? ""
          } // Value dinamis
          onChange={(e) => {
            const otherIdField =
              fromType === "wallet" ? "from_goal_id" : "from_wallet_id";
            handleFormChange(
              { target: { name: otherIdField, value: null } },
              "transfer"
            );
            handleFormChange(e, "transfer");
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={
            isLoading ||
            (fromType === "wallet" && wallets.length === 0) ||
            (fromType === "goal" && goals.length === 0)
          }
        >
          <option value="" disabled>
            {fromType === "wallet"
              ? wallets.length === 0
                ? "Tidak ada dompet"
                : "Pilih Dompet Sumber..."
              : goals.length === 0
              ? "Tidak ada rencana"
              : "Pilih Rencana Sumber..."}
          </option>
          {fromType === "wallet"
            ? wallets.map((w) => (
                <option key={`from-w-${w.id}`} value={w.id}>
                  {w.wallet_name}
                </option>
              ))
            : goals.map((g) => (
                <option key={`from-g-${g.id}`} value={g.id}>
                  {g.goal_name}
                </option>
              ))}
        </select>
      </div>

      {/* Tujuan Transfer */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tujuan Dana
        </label>
        <div className="flex space-x-4 mb-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="toTypeRadio"
              value="wallet"
              checked={toType === "wallet"}
              onChange={(e) => setToType(e.target.value)}
              disabled={isLoading}
            />
            <span className="ml-2">Dompet</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="toTypeRadio"
              value="goal"
              checked={toType === "goal"}
              onChange={(e) => setToType(e.target.value)}
              disabled={isLoading}
            />
            <span className="ml-2">Rencana Tabungan</span>
          </label>
        </div>
        <select
          id={toType === "wallet" ? "to_wallet_id" : "to_goal_id"}
          name={toType === "wallet" ? "to_wallet_id" : "to_goal_id"}
          value={
            (toType === "wallet"
              ? formData.to_wallet_id
              : formData.to_goal_id) ?? ""
          }
          onChange={(e) => {
            const otherIdField =
              toType === "wallet" ? "to_goal_id" : "to_wallet_id";
            handleFormChange(
              { target: { name: otherIdField, value: null } },
              "transfer"
            );
            handleFormChange(e, "transfer");
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={
            isLoading ||
            (toType === "wallet" && wallets.length === 0) ||
            (toType === "goal" && goals.length === 0)
          }
        >
          <option value="" disabled>
            {toType === "wallet"
              ? wallets.length === 0
                ? "Tidak ada dompet"
                : "Pilih Dompet Tujuan..."
              : goals.length === 0
              ? "Tidak ada rencana"
              : "Pilih Rencana Tujuan..."}
          </option>
          {toType === "wallet"
            ? wallets.map((w) => (
                <option key={`to-w-${w.id}`} value={w.id}>
                  {w.wallet_name}
                </option>
              ))
            : goals.map((g) => (
                <option key={`to-g-${g.id}`} value={g.id}>
                  {g.goal_name}
                </option>
              ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Jumlah Transfer
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="Rp 0"
          value={formData.amount || ""}
          onChange={(e) => handleFormChange(e, "transfer")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          min="0"
          disabled={isLoading}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-gray-700"
        >
          Catatan (Opsional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Catatan"
          value={formData.note || ""}
          onChange={(e) => handleFormChange(e, "transfer")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
const AddTransactionForm = ({
  isOpen,
  onClose,
  formData,
  handleFormChange,
  handleSubmit,
  activeTab,
  setActiveTab,
  wallets = [],
  goals = [],
  categories = [],
  isLoading,
}) => {
  const handleInternalSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-[16px] w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleInternalSubmit}>
            <div className="flex justify-around border-b mb-4">
              {["income", "expense", "transfer"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-4 font-semibold ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "income" && "Pemasukan"}
                  {tab === "expense" && "Pengeluaran"}
                  {tab === "transfer" && "Transfer"}
                </button>
              ))}
            </div>
            {activeTab === "transfer" ? (
              <FormTransfer
                formData={formData}
                handleFormChange={handleFormChange}
                wallets={wallets}
                goals={goals}
                isLoading={isLoading}
              />
            ) : (
              <FormTransaksi
                formData={formData}
                handleFormChange={handleFormChange}
                wallets={wallets}
                categories={categories}
                isLoading={isLoading}
                activeTab={activeTab}
              />
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Tambah"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddTransactionForm;
