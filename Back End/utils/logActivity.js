const connection = require("./database");


function logActivity (admin_id, action, description) {

    return new Promise((resolve, reject) => {

        const query = `INSERT INTO admin_logs (admin_id, action, description) VALUES (?, ?, ?)`;

        connection.query(query, [admin_id, action, description], (err, results) => {

            if(err){

                console.error("Error logging activity:", err);
                reject(err);

            }else{

                resolve(results);

            }

        });

    });

};

module.exports = { logActivity };