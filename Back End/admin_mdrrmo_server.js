const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { logActivity } = require('./utils/logActivity');
const connection = require('./utils/database');

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

// SECTION - ADMIN CREDENTIALS

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
                    admin_id: user.admin_id,
                    role: user.role

                }, secret, { expiresIn: "8h" });

                try{

                    await logActivity(
                        user.admin_id,
                        "LOGIN",
                        `NEW LOGIN for ${user.role}`
                    );

                }catch(logError){

                    console.log(logError);

                }

                return res.status(200).json({

                    msg: `Log In Successful`,
                    token: token,
                    admin_id: user.admin_id,
                    role: user.role,
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

app.delete('/delete/account/:admin_id', verifyToken, (req, res) => {

    try {

        const admin_id = req.params.admin_id;

        const query = `DELETE FROM admin_credentials WHERE admin_id = ?`;

        connection.query(query, [admin_id], (err, result) => {

        if(err){

            console.error(err);
            return res.status(500).json({ message: 'Database Error', details: err.message });
        
        }

        if(result.affectedRows === 0){

            return res.status(404).json({ message: 'Account not found' });

        }

            res.status(200).json({ message: 'Account deleted successfully' });

        });

    }catch(error) {

        console.error(error);
        res.status(500).json({ message: 'Server Error' });

    }

});



//!SECTION

// SECTION - ADMIN PROFILES 

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
//!SECTION

// SECTION - INVENTORIES
app.post(`/add/inventory`, verifyToken, (req, res) => {

    try{

        const { item_name, quantity } = req.body;

        const { admin_id, role } = req.user;

        const person_in_charge = role;

        const checkQuery = `SELECT * FROM inventories WHERE item_name = ?`;

        connection.query(checkQuery, [item_name], (err, results) => {

            if(err){

                console.error("DB Error:", err);
                return res.status(500).json({ error: "Database Error", details: err.message });

            }

            if(results.length > 0){

                return res.status(400).json({ message: "This item already exists in the inventory." });

            }

            const insertQuery = `INSERT INTO inventories (item_name, quantity, person_in_charge) VALUES (?, ?, ?)`;

            connection.query(insertQuery, [item_name, quantity, person_in_charge], async (err2) => {

                if(err2){

                    console.error("Insert Error:", err2);
                    return res.status(500).json({ error: "Database Error", details: err2.message });

                }

                try{

                    await logActivity(
                        admin_id,
                        "ADD",
                        `Added new inventory item "${item_name}" (Quantity: ${quantity}) by ${role}`
                    );

                }catch(logError){

                    console.log(logError);

                }

                res.json({ message: "Inventory Added Successfully" });

            });

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



app.get(`/view/inventory/:inventory_id`, verifyToken, (req, res) => {

  const { inventory_id } = req.params;

  const query = 'SELECT * FROM inventories WHERE inventory_id = ?';

  connection.query(query, [inventory_id], (err, result) => {

        if (err) return res.status(500).json({ message: 'Database Error' });
        
        if (result.length === 0) return res.status(404).json({ message: 'Inventory not found' });
        
        res.json(result[0]);
  
  });

});

app.put(`/update/inventory/:inventory_id`, verifyToken, (req, res) => {

  const { inventory_id } = req.params;
  const { item_name, quantity } = req.body;
  
  const { admin_id, role } = req.user;

  const query = `
    UPDATE inventories
    SET item_name = ?, quantity = ?, person_in_charge = ?
    WHERE inventory_id = ?
  `;

  connection.query(query, [item_name, quantity, role, inventory_id], async (err) => {

        if (err) return res.status(500).json({ message: 'Database Error' });

        await logActivity(admin_id, 'UPDATE', `Updated ${item_name} quantity to ${quantity} by ${role}`);

        res.json({ message: 'Inventory updated successfully' });

  });

});



app.delete(`/delete/inventory/:inventory_id`, verifyToken, (req, res) => {

    try{

        const { inventory_id } = req.params;
        const { admin_id, role } = req.user;
        
        const getQuery = `SELECT item_name, quantity FROM inventories WHERE inventory_id = ?`;

        connection.query(getQuery, [inventory_id], (err, rows) => {

            if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

            if (rows.length === 0) {
               
                return res.status(404).json({ error: "Inventory not found" });
            
            }

            const { item_name, quantity } = rows[0];

            const deleteQuery = `DELETE FROM inventories WHERE inventory_id = ?`;

            connection.query(deleteQuery, [inventory_id], async (err, result) => {

                if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

                try{

                    await logActivity(
                        admin_id, 
                        'DELETE', 
                        `Deleted ${item_name} with quantity of ${quantity} by ${role}`
                    );

                }catch(error){

                    console.log(error);

                }

                res.json({ message: `Inventory Deleted Successfully` });

            });

        })

        
    }catch(error){

        console.log(error);

    }

});


//!SECTION

// SECTION - USERS
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
//!SECTION

//SECTION - EMERGENCY CONTACT
app.post(`/add/contact`, verifyToken, (req, res) => {

    const { office_name, hotline, landline, phone_number } = req.body;

    const { admin_id, role } = req.user;

    const query = `INSERT INTO emergency_contacts (office_name, hotline, landline, phone_number) VALUES (?, ?, ?, ?)`;

    connection.query(query, [office_name, hotline, landline, phone_number], async (err, results) => {

        if(err) {

            if (err.code === 'ER_DUP_ENTRY') {

                return res.status(400).json({ error: 'Duplicate Office', message: 'This office already exists.' });
                
            }

            return res.status(500).json({ error: `Database Error`, details: err.message });
        
        }

        try{

            await logActivity(
                admin_id,
                "ADD",
                `Added ${office_name} to Emergency Contacts by ${role}`
            );

        }catch(logError){

            console.log(logError);

        }

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


app.get(`/view/contact/:contact_id`, verifyToken, (req, res) => {

  const { contact_id } = req.params;

  const query = 'SELECT * FROM emergency_contacts WHERE contact_id = ?';

  connection.query(query, [contact_id], (err, result) => {

        if (err) return res.status(500).json({ message: 'Database Error' });
        
        if (result.length === 0) return res.status(404).json({ message: 'Contact not found' });
        
        res.json(result[0]);
  
  });

});

app.put(`/update/contact/:contact_id`, verifyToken, (req, res) => {

  const { contact_id } = req.params;
  const { office_name, hotline, landline, phone_number } = req.body;

  const { admin_id, role } = req.user;

  const query = `
    UPDATE emergency_contacts
    SET office_name = ?, hotline = ?, landline = ?, phone_number = ?
    WHERE contact_id = ?
  `;

  connection.query(query, [office_name, hotline, landline, phone_number, contact_id], async (err) => {

        if (err) return res.status(500).json({ message: 'Database Error' });

        try{

            await logActivity(
                admin_id,
                "UPDATE",
                `Updated ${office_name} to Emergency Contacts by ${role}`
            );

        }catch(logError){

            console.log(logError);

        }

        res.json({ message: 'Contact updated successfully' });

  });

});


app.delete(`/delete/contact/:contact_id`, verifyToken, (req, res) => {

    try{

        const { contact_id } = req.params;

        const { admin_id, role } = req.user;

        const getQuery = `SELECT * FROM emergency_contacts WHERE contact_id = ?`;

        connection.query(getQuery, [contact_id], async (err, rows) => {

            if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

            if(rows.affectedRows === 0) {

                return res.status(404).json({ error: `Contact not found` });

            }

            const { office_name } = rows[0];

            const deleteQuery = `DELETE FROM emergency_contacts WHERE contact_id = ?`;

            connection.query(deleteQuery, [contact_id], async (err, result) => {
            
                if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

            });

            try{

                await logActivity(
                    admin_id,
                    "DELETE",
                    `Deleted ${office_name} to Emergency Contacts by ${role}`
                );

            }catch(logError){

                console.log(logError);

            }

            res.json({ message: `Contact Deleted Successfully` });

        });

    }catch(error){

        console.log(error);

    }

});

//!SECTION

app.get(`/viewAll/logs`, verifyToken, (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) AS total FROM admin_logs`;

    connection.query(countQuery, (err, countResult) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        const totalLogs = countResult[0].total;

        const dataQuery = `
            SELECT al.log_id, ac.fullname, al.action, al.description, al.created_at
            FROM admin_logs al
            JOIN admin_credentials ac ON al.admin_id = ac.admin_id
            ORDER BY al.created_at DESC
            LIMIT ? OFFSET ?
        `;

        connection.query(dataQuery, [parseInt(limit), parseInt(offset)], (err2, logs) => {

            if(err2) return res.status(500).json({ error: `Database Error`, details: err2.message });

            res.json({

                logs,
                total: totalLogs,
                totalPages: Math.ceil(totalLogs / limit),
                currentPage: parseInt(page)

            });

        });

    });

});



app.get(`/viewAll/accidents`, (req, res) => {

    const query = `
    SELECT 
        ir.id,
        CONCAT(cc.firstname, ' ', cc.lastname) AS full_name,
        cc.contact,
        CONCAT(ir.district, ', ', ir.street) AS accident_address,
        ir.photo_url,
        ir.type_of_accident,
        ir.created_at,
        ir.status
    FROM incident_reports ir
    JOIN client_credentials cc ON ir.user_id = cc.id
    ORDER BY ir.created_at DESC
    `;

    connection.query(query, (err, results) => {

        if(err) return res.status(500).json({ error: `Database Error`, details: err.message });

        res.json(results);

    });

});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server is running at PORT ${PORT}`);

});