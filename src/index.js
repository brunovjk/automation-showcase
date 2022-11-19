import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";

import { ContractProvider } from "./context/ContractContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContractProvider>
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
  </ContractProvider>
);
