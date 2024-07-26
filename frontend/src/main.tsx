import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

import "./App.css";
import "./../index.css";
import { ModalProvider } from "./components/Modal/ModalContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ModalProvider>
            <RouterProvider router={router} />
        </ModalProvider>
    </React.StrictMode>
);