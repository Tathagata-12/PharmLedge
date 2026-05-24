const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db.js");

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
//const salesRoute=require("./routes/salesRoutes");


const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

// ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/medicines", medicineRoutes);

//app.use("/api/sales",salesRoutes);



// TEST ROUTE

app.get("/", (req, res) => {

    res.send("PharmLedge Server Running");

});

// PORT

const PORT = process.env.PORT || 8000;

// START SERVER

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});