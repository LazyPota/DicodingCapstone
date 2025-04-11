// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/categories/categorySlice";
import goalSavingReducer from "../features/goal-saving/goalSavingSlice";
import budgetReducer from "../features/budgets/budgetSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    goalSavings: goalSavingReducer,
    budgets: budgetReducer,
  },
});
