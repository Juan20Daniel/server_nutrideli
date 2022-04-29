const connection = require('../model/connectionDb');

const updateHistoryPayment = (req, res) => {
    const { idHistory } = req.body;
    const sql = "CALL updateDebtHistory(?);";
    connection.query(sql, [idHistory], (err, rows) => {
        if(err) {
            res.status(500).json({message: err});
        } else {
            const result = Object.values(JSON.parse(JSON.stringify(rows)));
            res.status(200).json(result[0]);
        }
    });
}

module.exports = { updateHistoryPayment };