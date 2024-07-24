export const SERVER_ROUTE =
    import.meta.env.VITE_ENVIRONMENT === "development"
        ? "http://localhost:" + import.meta.env.VITE_SERVER_PORT
        : "https://" + import.meta.env.VITE_DOMAIN;

export const FRONTEND_PORT = import.meta.env.VITE_FRONTEND_PORT