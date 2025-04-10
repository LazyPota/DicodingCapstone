import React from "react";

const AddTransactionForm = ({ isOpen, onClose, formData, handleFormChange, handleSubmit, activeTab, setActiveTab, wallets, goals, categories }) => {
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
                className={`pb-2 px-4 font-semibold ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
              >
                {tab === "income" && "Pemasukan"}
                {tab === "expense" && "Pengeluaran"}
                {tab === "transfer" && "Transfer"}
              </button>
            ))}
          </div>

          {/* Form */}
          {activeTab === "transfer" ? (
            <FormTransfer formData={formData} handleFormChange={handleFormChange} handleSubmit={handleSubmit} wallets={wallets} goals={goals} />
          ) : (
            <FormTransaksi formData={formData} handleFormChange={handleFormChange} handleSubmit={handleSubmit} wallets={wallets} categories={categories} />
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button onClick={onClose} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-[12px]">
              Batal
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-[12px]">
              Tambah
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const FormTransaksi = ({ formData, handleFormChange, handleSubmit, wallets, categories }) => {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="date"
        value={formData.date}
        onChange={(e) => handleFormChange("transfer_date", e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <select
        value={formData.category}
        onChange={(e) => handleFormChange("category_id", Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Pilih Kategori</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.wallet_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Rp 0.00"
        value={formData.total}
        onChange={(e) => handleFormChange("amount", Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      />

      <select
        value={formData.wallet}
        onChange={(e) => handleFormChange("wallet_id", Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Pilih Dompet</option>
        {wallets.map((wallet) => (
          <option key={wallet.id} value={wallet.id}>
            {wallet.wallet_name}
          </option>
        ))}
      </select>

      <textarea
        rows={3}
        placeholder="Catatan"
        value={formData.note}
        onChange={(e) => handleFormChange("note", e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </form>
  );
};

const FormTransfer = ({ formData, handleFormChange, handleSubmit, wallets, goals }) => {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="date"
        value={formData.date}
        onChange={(e) => handleFormChange("transfer_date", e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <select
        value={formData.transfer_type || ""}
        onChange={(e) => handleFormChange("transfer_type", e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Tipe Transfer</option>
        <option value="wallettowallet" selected={formData.transfer_type === "wallettowallet"}>Dompet Ke Dompet</option>
        <option value="wallettobudget" selected={formData.transfer_type === "wallettobudget"}>Dompet Ke Anggaran</option>
        <option value="budgettobudget" selected={formData.transfer_type === "budgettobudget"}>Anggaran Ke Anggaran</option>
      </select>

      <select
        value={formData.from || ""}
        onChange={(e) => handleFormChange(formData.transfer_type === "wallettowallet" ? "from" : "budget_from", Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
        disabled={!formData.transfer_type}
      >
        {
          formData.transfer_type === "wallettowallet" ? (
            wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.wallet_name}
              </option>
            ))
          ) : formData.transfer_type === "wallettobudget" ? (
            wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.wallet_name}
              </option>
            ))
          ) : formData.transfer_type === "budgettobudget" ? (
            goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.goal_name}
              </option>
            ))
          ) : <option value="">Pilih Terlebih Dahulu</option>
        }
      </select>

      <select
        value={formData.to || ""}
        onChange={(e) => handleFormChange("to", Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
        disabled={!formData.transfer_type}
      >
        {
          formData.transfer_type === "wallettowallet" ? (
            wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.wallet_name}
              </option>
            ))
          ) : formData.transfer_type === "wallettobudget" ? (
            goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.goal_name}
              </option>
            ))
          ) : formData.transfer_type === "budgettobudget" ? (
            goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.goal_name}
              </option>
            ))
          ) : <option value="">Pilih Terlebih Dahulu</option>
        }
      </select>

      <input
        type="number"
        placeholder="Rp 0.00"
        value={formData.total}
        onChange={(e) => handleFormChange("total", Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        rows={3}
        placeholder="Catatan"
        value={formData.note}
        onChange={(e) => handleFormChange("note", e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </form>
  );
};

export default AddTransactionForm;
