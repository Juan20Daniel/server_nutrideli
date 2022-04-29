const connection = require('../model/connectionDb');

const lookServices = (req, res) => {
    const sql = "CALL getData;";
    connection.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json({services:rows[0], history:rows[1]});
        }
    });
}

module.exports = { lookServices }