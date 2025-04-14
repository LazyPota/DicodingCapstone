import React, { useEffect, useMemo, useState } from "react"; // <-- Import useState
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getWalletById,
  deleteWallet,
  resetCurrentWallet,
  resetWalletState, // <-- Import resetWalletState
} from "../../features/wallets/walletSlice";
import WalletDetailView from "./WalletDetailView";
import { getTransactions } from "../../features/transactions/transactionSlice";
import DeleteConfirmationPopup from "../../components/Popup/DeletePopup";
import SuccessPopup from "../../components/Popup/SuccessPopup";

const WalletDetail = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const {
    currentWallet,
    isDetailLoading,
    isError: isWalletError,
    message: walletMessage,
    isLoading: isWalletLoading,
  } = useSelector((state) => state.wallets);
  const { transactions = [], isLoading: isLoadingTransactions } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (user?.id && walletId) {
      console.log(
        `Fetching wallet detail for user: ${user.id}, wallet: ${walletId}`
      );
      dispatch(resetWalletState());
      dispatch(getWalletById({ userId: user.id, walletId }));

      if (transactions.length === 0) {
        console.log("Fetching transactions...");
        dispatch(getTransactions(user.id));
      }
    } else if (!user?.id) {
      console.log("User not logged in, redirecting to login.");
      navigate("/login");
    }
    return () => {
      console.log(
        "WalletDetail unmounting, resetting current wallet and state."
      );
      dispatch(resetCurrentWallet());
      // dispatch(resetWalletState());
    };
  }, [dispatch, user?.id, walletId, navigate]);
  const walletTransactions = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const idToFilter = Number(walletId);
    return safeTransactions
      .filter((tx) => tx.wallet_id === idToFilter)
      .slice(0, 10);
  }, [transactions, walletId]);

  const openDeleteConfirmation = () => {
    setDeleteErrorMessage(null);
    setIsConfirmDeleteOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!user?.id || !walletId) return;

    setIsConfirmDeleteOpen(false);
    console.log(
      `Dispatching deleteWallet for user: ${user.id}, wallet: ${walletId}`
    );
    const resultAction = await dispatch(
      deleteWallet({ userId: user.id, walletId: Number(walletId) })
    );

    console.log("Result action from deleteWallet:", resultAction);

    if (deleteWallet.fulfilled.match(resultAction)) {
      console.log("--> Delete was FULFILLED");
      console.log("--- isDeleteSuccess SET TO TRUE ---"); // <-- Log konfirmasi
    } else {
      console.log("--> Delete was REJECTED or other status");
      console.error("Delete failed payload:", resultAction.payload);
      setDeleteErrorMessage(
        resultAction.payload || walletMessage || "Gagal menghapus dompet."
      );
    }
  };

  if (isDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat detail dompet...
      </div>
    );
  }

  if (isWalletError && !currentWallet && !isDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {walletMessage || "Gagal memuat detail dompet."}
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

  const closeSuccessPopupAndNavigate = () => {
    navigate("/dompet");
  };

  return (
    <>
      <WalletDetailView
        wallet={currentWallet}
        onDelete={openDeleteConfirmation}
        isDeleting={isWalletLoading}
        transactions={walletTransactions}
        isLoadingTransactions={isLoadingTransactions}
        deleteError={deleteErrorMessage}
      />
      <DeleteConfirmationPopup
        isOpen={isConfirmDeleteOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        closeSuccessPopupAndNavigate={closeSuccessPopupAndNavigate}
      />
    </>
  );
};

export default WalletDetail;
