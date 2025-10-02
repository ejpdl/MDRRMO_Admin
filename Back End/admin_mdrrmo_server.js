const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = 'ADMIN_ADMIN';
const salt = 10;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = (req, res, next) => {

    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} : ${moment().format()}`);

    next();

}

app.use(logger);

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mdrrmo_app',

});

connection.connect((err) => {

    if(err){

        console.log(`Error Connecting on the database MYSQL: ${err}`);
        return;

    }else{

        console.log(`Successfully Connected to ${connection.config.database}`);

    }

});

const verifyToken = async (req, res, next) => {

    try{

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token) return res.sendStatus(401);

        jwt.verify(token, secret, (err, user) => {

            if(err) return res.sendStatus(403);

            req.user = user;
            next();

        });

    }catch(error){

        console.log(error);

    }

};

app.post(`/register/admin`, async (req, res) => {

    try {

        const { role, email, admin_password, fullname, admin_address, admin_contact } = req.body;

        if (!role || !email || !admin_password || !fullname || !admin_address || !admin_contact) {

            return res.status(400).json({ message: "All fields are required" });

        }

        const check_existing_email = `SELECT * FROM admin_credentials WHERE email = ?`;

        connection.query(check_existing_email, [email], (err, result) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            if (result.length > 0) {

                return res.status(400).json({ message: `Email already exists` });

            }

            bcrypt.hash(admin_password, salt, (err, hashed) => {

                if (err) {

                    return res.status(500).json({ message: "Error hashing password" });

                }

                const query = `INSERT INTO admin_credentials (fullname, email, admin_password, role, admin_address, admin_contact) VALUES(?, ?, ?, ?, ?, ?)`;

                connection.query(query, [fullname, email, hashed, role, admin_address, admin_contact], (err, result) => {

                    if (err) {

                        return res.status(500).json({ error: err.message });

                    }

                    res.status(201).json({

                        message: "Admin registered successfully",

                    });

                });

            });

        });

    } catch (error) {

        console.log(error);

    }

});


app.post(`/login/admin`, async (req, res) => {

    try {

        const { email, admin_password } = req.body;

        if(!email || !admin_password) {

            return res.status(400).json({ message: "All fields are required" });

        }

        const query = `SELECT * FROM admin_credentials WHERE email = ?`;

        connection.query(query, [email], async (err, rows) => {

            if(err) {

                return res.status(500).json({ error: err.message });

            }

            if(rows.length === 0) {

                return res.status(401).json({ msg: `Invalid Credentials` });

            }

            const user = rows[0];

            if(!user.admin_password) {

                return res.status(401).json({ msg: `Password Incorrect` });

            }

            try{

                const isMatch = await bcrypt.compare(admin_password, user.admin_password);

                if (!isMatch) {

                    return res.status(401).json({ msg: `Username or Password is incorrect` });

                }

                const token = jwt.sign({

                    email: user.email,
                    admin_id: user.admin_id

                }, secret, { expiresIn: "1h" });

                return res.status(200).json({

                    msg: `Log In Successful`,
                    token: token,
                    admin_id: user.admin_id,
                    redirectUrl: `../pages/dashboard.html`

                });


            }catch(error){

                console.log(error);
            
            }

        });

    }catch(error){

        console.log(error);

    }

});


app.get(`/admin/profile`, verifyToken, (req, res) => {

    const adminId = req.user.admin_id;
    const query = `SELECT * FROM admin_credentials WHERE admin_id = ?`;

    connection.query(query, [adminId], (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        if(results.length === 0) return res.status(404).json({ error: `User not found` });

        res.status(200).json(results[0]);

    });

});


app.put('/admin/edit_info', verifyToken, (req, res) => {

    const adminId = req.user.admin_id;
    const { fullname, address, contact, email, password } = req.body;

    let updates = [];
    let values = [];

    if (fullname) {
        updates.push("fullname = ?");
        values.push(fullname);
    }
    if (address) {
        updates.push("admin_address = ?");
        values.push(address);
    }
    if (contact) {
        updates.push("admin_contact = ?");
        values.push(contact);
    }
    if (email) {
        updates.push("email = ?");
        values.push(email);
    }

    if(password){

        bcrypt.hash(password, salt, (err, hashedPassword) => {

            if(err) return res.status(500).json({ message: `Error hashing Password` });

            updates.push("admin_password = ?");
            values.push(hashedPassword);

            if (updates.length === 0) {

                return res.status(400).json({ message: "No fields provided to update" });

            }

            const query = `UPDATE admin_credentials SET ${updates.join(", ")} WHERE admin_id = ?`;

            values.push(adminId);

            connection.query(query, values, (err, result) => {

                if (err) {

                    return res.status(500).json({ error: "Database Error", details: err.message });

                }

                res.json({ message: "Profile updated successfully (password updated too)" });

            });

        });

    } else {

        if(updates.length === 0) {

            return res.status(400).json({ message: "No fields provided to update" });

        }

        const query = `UPDATE admin_credentials SET ${updates.join(", ")} WHERE admin_id = ?`;
        values.push(adminId);

        connection.query(query, values, (err, result) => {

            if (err) return res.status(500).json({ error: "Database Error", details: err.message });

            res.json({ message: "Profile updated successfully" });

        });

    }

});



app.get(`/admin/status`, verifyToken, (req, res) => {

    const query = `
    SELECT 
        (SELECT COUNT(*) FROM admin_credentials) AS officerCount,
        (SELECT COUNT(*) FROM client_credentials) AS userCount,
        (SELECT COUNT(*) FROM inventories) AS inventoryCount,
        (SELECT COUNT(*) FROM incident_reports) AS accidentCount
    `;

    connection.query(query, (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json(results[0]);

    });

});



app.get(`/viewAll/officers`, verifyToken, (req, res) => {

    const query = `SELECT admin_id, fullname, admin_address, admin_contact, role FROM admin_credentials`;

    connection.query(query, (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json(results);

    });

});


app.post(`/add/inventory`, verifyToken, (req, res) => {

    try{

        const { item_name, quantity, person_in_charge } = req.body;

        const query = `INSERT INTO inventories (item_name, quantity, person_in_charge) VALUES (?, ?, ?)`;

        connection.query(query, [item_name, quantity, person_in_charge], (err, results) => {

            if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

            res.json({ message: `Inventory Added Successfully` });

        });


    }catch(error){

        console.log(error);

    }

});

app.get(`/viewAll/inventories`, verifyToken, (req, res) => {

    const query = `SELECT inventory_id, item_name, quantity, person_in_charge, updated_at FROM inventories`;

    connection.query(query, (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json(results);

    });

});

app.get(`/viewAll/users`, verifyToken, (req, res) => {

    const query = `
    SELECT id, 
    CONCAT(firstname, ' ', lastname) 
    AS fullname, 
    address, contact 
    FROM client_credentials`;

    connection.query(query, (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json(results);

    });

});


app.post(`/add/contact`, verifyToken, (req, res) => {

    const { office_name, hotline, landline, phone_number } = req.body;

    const query = `INSERT INTO emergency_contacts (office_name, hotline, landline, phone_number) VALUES (?, ?, ?, ?)`;

    connection.query(query, [office_name, hotline, landline, phone_number], (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json({ message: `Contact Added Successfully` });

    });

});

app.get(`/viewAll/contacts`, verifyToken, (req, res) => {

    const query = `SELECT * FROM emergency_contacts`;
    connection.query(query, (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json(results);

    });

});




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server is running at PORT ${PORT}`);

});