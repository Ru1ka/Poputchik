import express from "express";
import path from "path";

import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.REACT_APP_PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Front listening on PORT: ${PORT}...`);
});
