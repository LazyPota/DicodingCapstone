import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/categories/categorySlice";
import goalSavingReducer from "../features/goal-saving/goalSavingSlice";
import budgetReducer from "../features/budgets/budgetSlice";
import passwordResetReducer from "../features/passwordReset/passwordResetSlice"; 
import transactionReducer from '../features/transactions/transactionSlice';
import walletReducer from '../features/wallets/walletSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    goalSavings: goalSavingReducer,
    budgets: budgetReducer,
    passwordReset: passwordResetReducer,
    transactions: transactionReducer,
    wallets: walletReducer,
  },
});
