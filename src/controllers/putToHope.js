const connection = require('../model/connectionDb');

const putAtHope = (req, res) => {
    const { idService } = req.body;
    const sql = 'CALL putAtHope(?)';
    connection.query(sql, [idService], (err, rows) => {
        if(err) {
            res.status(500).json({message:"Error del servidor"});
        } else {
            res.status(200).json({messge:"Query successful"});
        }
    });
}

module.exports = { putAtHope };