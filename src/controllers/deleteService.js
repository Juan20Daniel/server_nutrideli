const connection = require('../model/connectionDb');

const deleteService = (req, res) => {
    const { idService } = req.params;
    const { state } = req.body;
    connection.query(`UPDATE services SET stateService='${state}' WHERE idService=${idService}`, (err, rows) => {
        if(err) {
            res.status(500).json({message:"Error de servidor"});
        } else {
            res.status(200).json({message:"The service was move to the view service deletes"})
        }
    });
}

module.exports = { deleteService }