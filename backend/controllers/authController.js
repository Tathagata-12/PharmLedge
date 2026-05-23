const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER USER
exports.registerUser = async (req, res) => {

    const {
        shop_name,
        owner_name,
        email,
        password,
        phone
    } = req.body;

    try {

        // CHECK IF USER EXISTS
        const checkQuery = "SELECT * FROM users WHERE email = ?";

        db.query(checkQuery, [email], async (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            if(result.length > 0){
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            // HASH PASSWORD
            const hashedPassword = await bcrypt.hash(password, 10);

            // INSERT USER
            const insertQuery = `
                INSERT INTO users
                (shop_name, owner_name, email, password, phone)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [
                    shop_name,
                    owner_name,
                    email,
                    hashedPassword,
                    phone
                ],
                (err, result) => {

                    if(err){
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: "User Registered Successfully"
                    });

                }
            );

        });

    } catch(error){
        res.status(500).json(error);
    }

};



// LOGIN USER
exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        if(result.length === 0){
            return res.status(400).json({
                message: "User not found"
            });
        }

        const user = result[0];

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // CREATE TOKEN
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                shop_name: user.shop_name,
                email: user.email
            }
        });

    });

};