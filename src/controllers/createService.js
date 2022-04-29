const connection = require('../model/connectionDb');

const createService = (req, res) => {
    var referens = Date.now();
    const { 
        idService, 
        phone, 
        nameClient, 
        typeService, 
        periodTime, 
        dateNormal, 
        dateComplet, 
        dateStart, 
        dateFinish, 
        action 
    } = req.body;
    const sql = `CALL actiones(?,?,?,?,?,?,?,?,?,?,?);`;
    connection.query(sql, 
    [   idService,
        phone,
        nameClient,
        typeService,
        periodTime,
        referens,
        dateNormal,
        dateComplet,
        dateStart,
        dateFinish, 
        action ], (err, rows) => {
        if(err) {
            res.status(500).json({message:"Hubo un error en el servidor al crear el servicio."});
        } else {
            if(action === "creation") {
                res.status(200).json(rows[1]);
            } else {
                res.status(200).json(rows[0]);
            }
        }
    });
}

module.exports = { createService };