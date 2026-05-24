const express = require("express");

const router = express.Router();

const db = require("./config/db.js");


// GET ALL SALES

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM sales
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error: err
            });

        }

        res.json(result);

    });

});


// GET SINGLE SALE

router.get("/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT *
        FROM sales
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error: err
            });

        }

        res.json(result[0]);

    });

});


module.exports = router;