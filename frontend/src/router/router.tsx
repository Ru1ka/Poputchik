import { createBrowserRouter } from "react-router-dom";

// import { AUTH_PAGE, CODE_PAGE, HOME_PAGE, LOADER_PAGE } from "./paths";
import { AUTH_PAGE, HOME_PAGE } from "./paths";
import RegistrationPage from "../pages/Registration/RegistrationPage";

import HomePage from "../pages/HomePage/HomePage";
// import AuthPage from "../pages/AuthPage/AuthPage";
// import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
// import CodePage from "../pages/CodePage/CodePage";
// import LoaderPage from "../pages/LoaderPage/LoaderPage";

export const router = createBrowserRouter([
    {
        path: AUTH_PAGE,
        element: < RegistrationPage />
    },
    {
        path: HOME_PAGE,
        element: <HomePage />,
        // errorElement: <NotFoundPage />,
    },
    // {
    //     path: AUTH_PAGE,
    //     element: <AuthPage />,
    // },
    // {
    //     path: CODE_PAGE,
    //     element: <CodePage />,
    // },
    // {
    //     path: LOADER_PAGE,
    //     element: <LoaderPage />,
    // },
]);
