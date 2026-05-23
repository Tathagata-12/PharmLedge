const express = require("express");

const router = express.Router();

const {

    addMedicine,
    getMedicines,
    getDashboardStats,
    deleteMedicine,
    updateMedicine,
    checkout,
    getSalesHistory,
    getSalesAnalytics,
    getInvoiceDetails

} = require("../controllers/medicineController");

router.post("/add", addMedicine);

router.get("/", getMedicines);

router.get("/stats", getDashboardStats);

router.delete("/:id", deleteMedicine);

router.put("/:id", updateMedicine);

router.post("/checkout", checkout);

router.get("/sales/history", getSalesHistory);

router.get("/sales/analytics", getSalesAnalytics);

router.get("/sales/invoice/:id", getInvoiceDetails);

module.exports = router;