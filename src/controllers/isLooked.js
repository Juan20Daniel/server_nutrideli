const connection = require('../model/connectionDb');

const isLooked = (req, res) => {
    const { idService } = req.body;
    connection.query(`CALL isLooked(?);`, [idService], (err, rows) => {
        if(err) {
            res.status(500).json({message:"Error del servidor."});
        } else {
            res.status(200).json(rows[0]);
        }
    });
}

module.exports = { isLooked };