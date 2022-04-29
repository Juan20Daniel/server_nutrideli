const express = require('express');
const cors = require('cors');
const connection = require('./src/model/connectionDb');
const { createService } = require('./src/controllers/createService');
const { lookServices } = require('./src/controllers/lookServices');
const { isLooked } = require('./src/controllers/isLooked');
const { updateService } = require('./src/controllers/updateService');
const { deleteService } = require('./src/controllers/deleteService');
const { updateHistoryPayment } = require('./src/controllers/updateHistoryPayment');
const app = express();
const port = process.env.PORT || 3001;
const cron = require('node-cron');
const messages = {
    dayTwo:"Tu fecha limite para pagar el servicio de comida nutriciona, esta por terminar. ",
    dayOne:"Tu fecha limite para pagar el servicio de comida nutriciona, vence mañana. ",
    today:"Tu fecha limite para pagar el servicio de comida nutriciona, es hoy, favor de realizarlo. ",
    remainigDays:"Tu fecha limite para realizar el pago, a terminado, favor de realizarlo. ",
    acreditAndTerm:"Su pago se a acreditado, gracias"
}
app.use(cors());
app.use(express.json());
//Enviamos mensaje 
app.get('/api/look-services', lookServices);
app.post('/api/create-service', createService);
app.post('/api/service-is-looked', isLooked);
app.post('/api/update-service', updateService);
app.put('/api/delete-service/:idService', deleteService);
app.post('/api/update-history-payments', updateHistoryPayment);
app.post('/api/detail-actions', (req, res) => {
    const { idService, dateComplet, dateNormal, dateFinish, stateService, action } = req.body; 
    const sql =`
        CALL detailActions(?,?,?,?,?,?);
    `;
    connection.query(sql, [idService, dateComplet, dateNormal, dateFinish, stateService, action], (err, rows) => {
        if(err) {
            res.status(500).json({message:"No se pudo realizar la acción por un error en el servidor"});
        } else {
            if(action === "continues") {
                // sendMessage(phone+'@c.us', `Debido a que solicitaste un nuevo servicio, el pago del anterior, 
                // queda pospuesto y se sumara el precio del nuevo servicio. Tu nueva fecha de pago es el: ${dateNormal}, le recordaremos con anticipación.`);
                res.status(200).json({paymentsHistory:rows[1], service:rows[2]});
            } else {
                res.status(200).json(rows[0]);
            }
        }
    });
});

cron.schedule('* * * * *', () => {
    var ahora = Date.now() + 900000;
    console.log(ahora);
    connection.query(`SELECT nameClient, phone, payment, dateNormal, dateFinish, idService, dayTwo, dayOne, today FROM 
        services INNER JOIN controlPayments ON services.idService = controlPayments.idServiceControl
        INNER JOIN messageAlerts ON services.idService = messageAlerts.idServiceMess;`, (err, rows) => {
        if(err) {
            console.log(err);
        } else {
            if(rows.length !== 0) {
                rows.forEach(service => {
                    verifyPayment(service);
                });
            } else {
                console.log("Not data in the database, pls add one");
            }
        }
    });
});

//Un día 48000
const verifyPayment = service => {
    const { phone, payment, payDate, dateFinish, idService, dayTwo, dayOne, today } = service;
    var now = Date.now();
    if(dateFinish - 600000 <= now && dayTwo === 'notNotificate') {
        console.log("The message was sent to client");
        updateServiceNotificate('notificate', dayOne, today, idService);
        console.log(messages.dayTwo);
        var message = messages.dayTwo+ ' fecha limite: '+payDate;
        console.log(service);
        //sendMessage(phone+'@c.us', message);
    }
    if(dateFinish - 300000 <= now && dayOne === 'notNotificate') {
        console.log("The message was sent to client: ");
        updateServiceNotificate(dayTwo, 'notificate', today, idService);
        console.log(messages.dayOne);
        var message = messages.dayOne+ ' fecha limite: '+payDate;
        console.log(service);
        //sendMessage(phone+'@c.us', message);
    }
    if(dateFinish <= now && today === 'notNotificate') {
        addMoreTime(dateFinish, idService);
        updateServiceNotificate(dayTwo, dayOne, 'notificate', idService);
        var message = messages.today+ ' fecha limite: '+payDate;
        whenServiceFinish(idService, phone, message);
        console.log(service);
    }
    if(dateFinish <= now && payment === 'No pagado' && today === 'notificate') {
        addMoreTime(dateFinish, idService);
        console.log("The time to give the payment has expired");
        console.log(messages.remainigDays);
        var message = messages.remainigDays+ ' fecha limite: '+payDate;
        console.log(service);
        //sendMessage(phone+'@c.us', message);
    }
}
const updateServiceNotificate = (dayTwo, dayOne, today, idService) => {
    const sql = `UPDATE messageAlerts SET dayTwo='${dayTwo}', dayOne='${dayOne}', today='${today}' WHERE idServiceMess=${idService};`;
    connection.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        } else {
            console.log("The notification was updated");
        }
    });
}
const addMoreTime = (dateFinish, idService) => {
    var newDataFinish = dateFinish + 300000;
    const sql = `UPDATE controlPayments SET dateFinish=${newDataFinish} WHERE idServiceControl=${idService};`;
    connection.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        } else {
            console.log("The dataFinish was update to an new date");
        }
    });
}
const whenServiceFinish = (idService, phone, message) => {
    const sql = `UPDATE services SET stateService='Finalizado', looked=0 WHERE idService=${idService};`;
    connection.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        } else {
            //sendMessage(phone+'@c.us', message);
            console.log("The message was sent to client");
            console.log(messages.today);
        }
    });
}
app.listen(port, () => {
    console.log("The server is running on the port: ",port);
});