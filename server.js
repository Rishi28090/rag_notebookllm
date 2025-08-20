import express from "express";
import "dotenv/config";
import path from "path";
import indexRoutes from "./src/routes/index.js";

const app = express();

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
