import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getWalletById,
  deleteWallet,
  resetCurrentWallet,
} from "../../features/wallets/walletSlice";
import WalletDetailView from "./WalletDetailView";
import { getTransactions } from "../../features/transactions/transactionSlice";

const WalletDetail = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    currentWallet,
    isDetailLoading,
    isError,
    message,
    isLoading: isDeleting,
  } = useSelector((state) => state.wallets);
  const { transactions = [], isLoading: isLoadingTransactions } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (user?.id && walletId) {
      console.log(
        `Fetching wallet detail for user: ${user.id}, wallet: ${walletId}`
      );
      dispatch(getWalletById({ userId: user.id, walletId }));
    } else if (!user?.id) {
      navigate("/login");
    }

    return () => {
      dispatch(resetCurrentWallet());
    };
  }, [dispatch, user?.id, walletId, navigate]);
  useEffect(() => {
    if (user?.id && transactions.length === 0) {
      dispatch(getTransactions(user.id));
    }
  }, [dispatch, user?.id, transactions.length]);

  const walletTransactions = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const idToFilter = Number(walletId); // Pastikan ID adalah angka
    return safeTransactions
      .filter((tx) => tx.wallet_id === idToFilter) // Filter berdasarkan walletId
      .slice(0, 10); // Ambil beberapa saja untuk detail? Atau semua?
  }, [transactions, walletId]);

  const handleDeleteWallet = async () => {
    if (!user?.id || !walletId) return;

    if (
      window.confirm(
        `Yakin ingin menghapus dompet "${
          currentWallet?.wallet_name || "ini"
        }"? Ini tidak bisa dibatalkan.`
      )
    ) {
      console.log(
        `Dispatching deleteWallet for user: ${user.id}, wallet: ${walletId}`
      );
      const resultAction = await dispatch(
        deleteWallet({ userId: user.id, walletId: Number(walletId) })
      );

      if (deleteWallet.fulfilled.match(resultAction)) {
        alert("Dompet berhasil dihapus.");
        navigate("/dompet");
      } else {
        alert(
          `Gagal menghapus dompet: ${
            resultAction.payload || "Terjadi kesalahan"
          }`
        );
      }
    }
  };
  if (isDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading detail dompet...
      </div>
    );
  }

  if (isError && !currentWallet) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {message || "Gagal memuat detail dompet."}
      </div>
    );
  }

  if (!currentWallet && !isDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Detail dompet tidak ditemukan.
      </div>
    );
  }

  return (
    <WalletDetailView
      wallet={currentWallet}
      onDelete={handleDeleteWallet}
      isDeleting={isDeleting}
      transactions={walletTransactions} // Kirim data terfilter
      isLoadingTransactions={isLoadingTransactions} // Kirim status loading global
    />
  );
};

export default WalletDetail;
