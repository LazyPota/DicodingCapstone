import React, { StrictMode } from "react"; 
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store"; 
import "./index.css";
import App from "./App.jsx";

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
  <StrictMode> 
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);