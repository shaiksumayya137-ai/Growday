require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const habitRoutes = require("./routes/habitRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
    res.json({
        message: "GrowDay API is running!"
    });
});

// API routes
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log(
            "MongoDB connection failed:",
            error.message
        );
    });

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});