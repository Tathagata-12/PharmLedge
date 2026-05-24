const db = require("../config/db");


// ADD MEDICINE

exports.addMedicine = (req, res) => {

    const {

        medicine_name,
        category,
        description,

        vendor_name,
        phone,
        email,
        address,

        batch_no,
        stock,
        purchase_price,
        selling_price,
        expiry_date,
        manufacture_date

    } = req.body;

    const medicineQuery = `
        INSERT INTO medicines
        (medicine_name, category, description)
        VALUES (?, ?, ?)
    `;

    db.query(
        medicineQuery,
        [
            medicine_name,
            category,
            description
        ],
        (err, medicineResult) => {

            if(err){

                return res.status(500).json(err);

            }

            const medicineId =
            medicineResult.insertId;

            const vendorQuery = `
                INSERT INTO vendors
                (vendor_name, phone, email, address)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                vendorQuery,
                [
                    vendor_name,
                    phone,
                    email,
                    address
                ],
                (err, vendorResult) => {

                    if(err){

                        return res.status(500).json(err);

                    }

                    const vendorId =
                    vendorResult.insertId;

                    const batchQuery = `
                        INSERT INTO medicine_batches
                        (
                            medicine_id,
                            vendor_id,
                            batch_no,
                            stock,
                            purchase_price,
                            selling_price,
                            expiry_date,
                            manufacture_date
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    db.query(
                        batchQuery,
                        [
                            medicineId,
                            vendorId,
                            batch_no,
                            stock,
                            purchase_price,
                            selling_price,
                            expiry_date,
                            manufacture_date
                        ],
                        (err, batchResult) => {

                            if(err){

                                return res.status(500).json(err);

                            }

                            res.status(201).json({

                                message:
                                "Medicine Added Successfully"

                            });

                        }
                    );

                }
            );

        }
    );

};


// GET ALL MEDICINES

exports.getMedicines = (req, res) => {

    const query = `

        SELECT

            medicines.id,

            medicines.medicine_name,

            medicines.category,

            vendors.vendor_name,

            medicine_batches.batch_no,

            medicine_batches.stock,

            medicine_batches.purchase_price,

            medicine_batches.selling_price,

            medicine_batches.expiry_date

        FROM medicine_batches

        JOIN medicines
        ON medicine_batches.medicine_id = medicines.id

        JOIN vendors
        ON medicine_batches.vendor_id = vendors.id

        ORDER BY medicine_batches.id DESC

    `;

    db.query(query, (err, result) => {

        if(err){

            return res.status(500).json(err);

        }

        res.status(200).json(result);

    });

};


// DASHBOARD STATS

exports.getDashboardStats = (req, res) => {

    const statsQuery = `

        SELECT

            COUNT(DISTINCT medicines.id)
            AS total_medicines,

            SUM(medicine_batches.stock)
            AS total_stock,

            COUNT(
                CASE
                    WHEN medicine_batches.stock < 20
                    THEN 1
                END
            ) AS low_stock,

            COUNT(DISTINCT vendors.id)
            AS total_vendors

        FROM medicine_batches

        JOIN medicines
        ON medicine_batches.medicine_id = medicines.id

        JOIN vendors
        ON medicine_batches.vendor_id = vendors.id

    `;

    db.query(statsQuery, (err, result) => {

        if(err){

            return res.status(500).json(err);

        }

        res.status(200).json(result[0]);

    });

};


// DELETE MEDICINE

exports.deleteMedicine = (req, res) => {

    const { id } = req.params;

    const deleteBatchQuery = `
        DELETE FROM medicine_batches
        WHERE medicine_id = ?
    `;

    db.query(
        deleteBatchQuery,
        [id],
        (err, batchResult) => {

            if(err){

                return res.status(500).json(err);

            }

            const deleteMedicineQuery = `
                DELETE FROM medicines
                WHERE id = ?
            `;

            db.query(
                deleteMedicineQuery,
                [id],
                (err, medicineResult) => {

                    if(err){

                        return res.status(500).json(err);

                    }

                    res.status(200).json({

                        message:
                        "Medicine Deleted Successfully"

                    });

                }
            );

        }
    );

};


// UPDATE MEDICINE

exports.updateMedicine = (req, res) => {

    const { id } = req.params;

    const {

        medicine_name,
        category,
        stock,
        selling_price

    } = req.body;

    const medicineQuery = `

        UPDATE medicines

        SET

            medicine_name = ?,
            category = ?

        WHERE id = ?

    `;

    db.query(
        medicineQuery,
        [
            medicine_name,
            category,
            id
        ],
        (err, medicineResult) => {

            if(err){

                return res.status(500).json(err);

            }

            const batchQuery = `

                UPDATE medicine_batches

                SET

                    stock = ?,
                    selling_price = ?

                WHERE medicine_id = ?

            `;

            db.query(
                batchQuery,
                [
                    stock,
                    selling_price,
                    id
                ],
                (err, batchResult) => {

                    if(err){

                        return res.status(500).json(err);

                    }

                    res.status(200).json({

                        message:
                        "Medicine Updated Successfully"

                    });

                }
            );

        }
    );

};


// CHECKOUT

exports.checkout = (req, res) => {

    const {

        customer_name,
        cart,
        total_amount

    } = req.body;

    const saleQuery = `

        INSERT INTO sales
        (customer_name, total_amount)
        VALUES (?, ?)

    `;

    db.query(
        saleQuery,
        [
            customer_name,
            total_amount
        ],
        (err, saleResult) => {

            if(err){

                return res.status(500).json(err);

            }

            const saleId =
            saleResult.insertId;

            let completed = 0;

            cart.forEach((item) => {

                const itemQuery = `

                    INSERT INTO sale_items
                    (
                        sale_id,
                        medicine_id,
                        quantity,
                        price,
                        total
                    )
                    VALUES (?, ?, ?, ?, ?)

                `;

                db.query(
                    itemQuery,
                    [
                        saleId,
                        item.id,
                        item.quantity,
                        item.selling_price,
                        item.quantity *
                        item.selling_price
                    ],
                    (err, itemResult) => {

                        if(err){

                            return res.status(500).json(err);

                        }

                        const stockUpdateQuery = `

                            UPDATE medicine_batches

                            SET stock = stock - ?

                            WHERE medicine_id = ?

                        `;

                        db.query(
                            stockUpdateQuery,
                            [
                                item.quantity,
                                item.id
                            ],
                            (err, stockResult) => {

                                if(err){

                                    return res.status(500).json(err);

                                }

                                completed++;

                                if(
                                    completed ===
                                    cart.length
                                ){

                                    res.status(201).json({

                                        message:
                                        "Checkout Successful"

                                    });

                                }

                            }
                        );

                    }
                );

            });

        }
    );

};

// SALES HISTORY

exports.getSalesHistory = (req, res) => {

    const query = `

        SELECT *

        FROM sales

        ORDER BY id DESC

    `;

    db.query(query, (err, result) => {

        if(err){

            return res.status(500).json(err);

        }

        res.status(200).json(result);

    });

};


// SALES ANALYTICS

exports.getSalesAnalytics = (req, res) => {

    const query = `

        SELECT

            COUNT(*) AS total_invoices,

            SUM(total_amount)
            AS total_revenue

        FROM sales

    `;

    db.query(query, (err, result) => {

        if(err){

            return res.status(500).json(err);

        }

        res.status(200).json(result[0]);

    });

};


// INVOICE DETAILS

exports.getInvoiceDetails = (req, res) => {

    const { id } = req.params;

    const query = `

        SELECT

            sales.id,

            sales.customer_name,

            sales.total_amount,

            sales.created_at,

            medicines.medicine_name,

            sale_items.quantity,

            sale_items.price,

            sale_items.total

        FROM sale_items

        JOIN sales
        ON sale_items.sale_id = sales.id

        JOIN medicines
        ON sale_items.medicine_id = medicines.id

        WHERE sales.id = ?

    `;

    db.query(query, [id], (err, result) => {

        if(err){

            return res.status(500).json(err);

        }

        res.status(200).json(result);

    });

};

exports.getAnalytics = (req, res) => {

    const query = `

        SELECT

            COUNT(*) AS total_sales,

            SUM(total_amount) AS total_revenue,

            AVG(total_amount) AS average_sale

        FROM sales

    `;

    db.query(query, (err, result) => {

        if(err){

            return res.status(500).json(err);

        }

        res.status(200).json(result[0]);

    });

};