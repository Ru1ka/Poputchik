import express from "express";
import path from "path";

import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.FRONTEND_PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Front listening on PORT: ${PORT}...`);
});
