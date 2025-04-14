import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

const FormTransaksi = ({
  formData,
  handleFormChange,
  wallets = [],
  categories = [],
  goals = [],
  isLoading,
  activeTab,
  errors,
}) => {
  const relevantCategories = categories.filter(
    (cat) =>
      cat.category_type === (activeTab === "income" ? "Income" : "Expense")
  );

  return (
    <div className="space-y-4 overflow-auto max-h-[300px] no-scrollbar">
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
          aria-invalid={errors?.transaction_date ? "true" : "false"}
          aria-describedby={
            errors?.transaction_date ? "transaction_date-error" : undefined
          }
        />
        {errors?.transaction_date && (
          <p id="transaction_date-error" className="text-red-500 text-xs mt-1">
            {errors.transaction_date}
          </p>
        )}
      </div>
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
          aria-invalid={errors?.wallet_id ? "true" : "false"}
          aria-describedby={errors?.wallet_id ? "wallet_id-error" : undefined}
        >
          <option value="" disabled>
            {wallets.length === 0 ? "Tidak ada dompet" : "Pilih Dompet"}
          </option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              {w.wallet_name}
            </option>
          ))}
        </select>
        {errors?.wallet_id && (
          <p id="wallet_id-error" className="text-red-500 text-xs mt-1">
            {errors.wallet_id}
          </p>
        )}
      </div>

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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          required
          disabled={isLoading || relevantCategories.length === 0}
          aria-invalid={errors?.category_id ? "true" : "false"}
          aria-describedby={
            errors?.category_id ? "category_id-error" : undefined
          }
        >
          <option value="" disabled>
            {relevantCategories.length === 0
              ? `Tidak ada kategori ${activeTab}`
              : "Pilih Kategori"}
          </option>
          {relevantCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.category_name}
            </option>
          ))}
        </select>
        {/* Tampilkan Error */}
        {errors?.category_id && (
          <p id="category_id-error" className="text-red-500 text-xs mt-1">
            {errors.category_id}
          </p>
        )}
      </div>

      {/* Jumlah */}
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Jumlah (Rp)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="0"
          value={formData.amount || ""}
          onChange={(e) => handleFormChange(e, "transaction")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          required
          min="0"
          step="any"
          disabled={isLoading}
          aria-invalid={errors?.amount ? "true" : "false"}
          aria-describedby={errors?.amount ? "amount-error" : undefined}
        />
        {/* Tampilkan Error */}
        {errors?.amount && (
          <p id="amount-error" className="text-red-500 text-xs mt-1">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Tujuan Menabung (Hanya untuk Expense) */}
      {activeTab === "expense" && (
        <div className="mb-4">
          <label
            htmlFor="goal_id"
            className="block text-sm font-medium text-gray-700"
          >
            Tujuan Menabung (Opsional)
          </label>
          <select
            id="goal_id"
            name="goal_id"
            value={formData.goal_id || ""}
            onChange={(e) => handleFormChange(e, "transaction")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
            disabled={isLoading || goals.length === 0}
          >
            <option value="">
              {goals.length === 0 ? "Tidak ada rencana" : "Tidak ada"}
            </option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.goal_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Catatan */}
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

// --- Komponen Form Transfer ---
const FormTransfer = ({
  formData,
  handleFormChange,
  wallets = [],
  goals = [],
  isLoading,
  errors, // <-- Terima errors
}) => {
  const [fromType, setFromType] = React.useState("wallet");
  const [toType, setToType] = React.useState("wallet");
  useEffect(() => {
    if (formData.from_wallet_id) setFromType("wallet");
    else if (formData.from_goal_id) setFromType("goal");
    else setFromType("wallet");

    if (formData.to_wallet_id) setToType("wallet");
    else if (formData.to_goal_id) setToType("goal");
    else setToType("wallet");
  }, [
    formData.from_wallet_id,
    formData.from_goal_id,
    formData.to_wallet_id,
    formData.to_goal_id,
  ]);
  const handleTypeChange = (typeSetter, idFieldToClear, event) => {
    const { value } = event.target;
    typeSetter(value);
    handleFormChange(
      { target: { name: idFieldToClear, value: "" } },
      "transfer"
    );
  };

  return (
    <div className="space-y-4 max-h-[300px] no-scrollbar overflow-auto">
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          required
          disabled={isLoading}
          aria-invalid={errors?.transfer_date ? "true" : "false"}
          aria-describedby={
            errors?.transfer_date ? "transfer_date-error" : undefined
          }
        />
        {/* Tampilkan Error */}
        {errors?.transfer_date && (
          <p id="transfer_date-error" className="text-red-500 text-xs mt-1">
            {errors.transfer_date}
          </p>
        )}
      </div>

      {/* Sumber Transfer */}
      <fieldset className="mb-4 border p-3 rounded-md">
        <legend className="text-sm font-medium px-1">Dari Sumber</legend>
        <div className="flex space-x-4 mb-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="fromTypeRadio"
              value="wallet"
              checked={fromType === "wallet"}
              onChange={(e) => handleTypeChange(setFromType, "from_goal_id", e)}
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
              onChange={(e) =>
                handleTypeChange(setFromType, "from_wallet_id", e)
              }
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
              : formData.from_goal_id) || ""
          }
          onChange={(e) => handleFormChange(e, "transfer")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          required
          disabled={
            isLoading ||
            (fromType === "wallet" && wallets.length === 0) ||
            (fromType === "goal" && goals.length === 0)
          }
          aria-invalid={errors?.from_wallet_id ? "true" : "false"} // General source error
          aria-describedby={
            errors?.from_wallet_id ? "from_source-error" : undefined
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
        {/* Tampilkan Error Sumber */}
        {errors?.from_wallet_id && (
          <p id="from_source-error" className="text-red-500 text-xs mt-1">
            {errors.from_wallet_id}
          </p>
        )}
      </fieldset>

      {/* Tujuan Transfer */}
      <fieldset className="mb-4 border p-3 rounded-md">
        <legend className="text-sm font-medium px-1">Ke Tujuan</legend>
        <div className="flex space-x-4 mb-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="toTypeRadio"
              value="wallet"
              checked={toType === "wallet"}
              onChange={(e) => handleTypeChange(setToType, "to_goal_id", e)}
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
              onChange={(e) => handleTypeChange(setToType, "to_wallet_id", e)}
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
              : formData.to_goal_id) || ""
          }
          onChange={(e) => handleFormChange(e, "transfer")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          required
          disabled={
            isLoading ||
            (toType === "wallet" && wallets.length === 0) ||
            (toType === "goal" && goals.length === 0)
          }
          aria-invalid={
            errors?.to_wallet_id || errors?.to_goal_id ? "true" : "false"
          } // Cek kedua potensi error
          aria-describedby={
            errors?.to_wallet_id
              ? "to_destination-error"
              : errors?.to_goal_id
              ? "to_destination-goal-error"
              : undefined
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
        {/* Tampilkan Error Tujuan */}
        {errors?.to_wallet_id && (
          <p id="to_destination-error" className="text-red-500 text-xs mt-1">
            {errors.to_wallet_id}
          </p>
        )}
        {errors?.to_goal_id && (
          <p
            id="to_destination-goal-error"
            className="text-red-500 text-xs mt-1"
          >
            {errors.to_goal_id}
          </p>
        )}
      </fieldset>

      {/* Jumlah Transfer */}
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Jumlah Transfer (Rp)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="0"
          value={formData.amount || ""}
          onChange={(e) => handleFormChange(e, "transfer")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          required
          min="0"
          step="any"
          disabled={isLoading}
          aria-invalid={errors?.amount ? "true" : "false"}
          aria-describedby={
            errors?.amount ? "transfer_amount-error" : undefined
          }
        />
        {/* Tampilkan Error */}
        {errors?.amount && (
          <p id="transfer_amount-error" className="text-red-500 text-xs mt-1">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Catatan Transfer */}
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // <-- Style tidak diubah
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

// --- Komponen Utama AddTransactionForm ---
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
  errors, // <-- Terima errors dari parent
}) => {
  const handleInternalSubmit = (e) => {
    e.preventDefault();
    handleSubmit(); // Panggil handler submit dari parent
  };

  // Set transaction_type di parent saat tab berubah (jika bukan transfer)
  useEffect(() => {
    if (activeTab !== "transfer") {
      handleFormChange(
        {
          target: {
            name: "transaction_type",
            value: activeTab === "income" ? "Income" : "Expense",
          },
        },
        "transaction"
      );
    }
  }, [activeTab]);

  return (
    isOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-[16px] w-[500px] "
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleInternalSubmit} noValidate>
            <div className="flex justify-around border-b mb-4 sticky top-0 bg-white z-10 py-2">
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
                  disabled={isLoading}
                >
                  {tab === "income" && "Pemasukan"}
                  {tab === "expense" && "Pengeluaran"}
                  {tab === "transfer" && "Transfer"}
                </button>
              ))}
            </div>
            {errors && errors.server && (
              <p className="text-red-500 text-xs mb-3 text-center">
                {errors.server}
              </p>
            )}
            {activeTab === "transfer" ? (
              <FormTransfer
                formData={formData}
                handleFormChange={handleFormChange}
                wallets={wallets}
                goals={goals}
                isLoading={isLoading}
                errors={errors}
              />
            ) : (
              <FormTransaksi
                formData={formData}
                handleFormChange={handleFormChange}
                wallets={wallets}
                categories={categories}
                goals={goals}
                isLoading={isLoading}
                activeTab={activeTab}
                errors={errors}
              />
            )}
            <div className="flex justify-end space-x-3 mt-6 sticky bottom-0 bg-white z-10 py-4 border-t">
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
                {isLoading
                  ? "Menyimpan..."
                  : activeTab === "transfer"
                  ? "Transfer Dana"
                  : "Simpan Transaksi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddTransactionForm;
