const express = require("express");

const router = express.Router();

const {

    addMedicine,
    getMedicines,
    getDashboardStats,
    deleteMedicine,
    updateMedicine

} = require("../controllers/medicineController");

router.post("/add", addMedicine);

router.get("/", getMedicines);

router.get("/stats", getDashboardStats);

router.delete("/:id", deleteMedicine);

router.put("/:id", updateMedicine);

module.exports = router;