const connection = require('../model/connectionDb');

const acreditAndContinues = (req, res) => {
    const { 
        idService, 
        phone, 
        nameClient, 
        typeService, 
        periodTime, 
        dateNormal, 
        dateComplet, 
        dateStart, 
        dateFinish
    } = req.body;
    const sql = `CALL acreditAmdContinues(?,?,?,?,?,?,?,?,?);`;
    connection.query(sql, [
        idService, 
        phone, 
        nameClient, 
        typeService, 
        periodTime, 
        dateNormal, 
        dateComplet, 
        dateStart, 
        dateFinish
    ], 
    (err, rows) => {
            if(err) {
                res.status(500).json({message:"Error del servidor."});
            } else {
                res.status(200).json({message:"Servicio actualizado."});
            }
        });
} 

module.exports = { acreditAndContinues };