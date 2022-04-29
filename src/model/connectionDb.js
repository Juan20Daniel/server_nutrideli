const mysql = require('mysql');

const myConnection = mysql.createConnection({
    host:'blm6sa0xiy6cr1xmvucx-mysql.services.clever-cloud.com',
    user:'uv4mjxhpa5rgynsl',
    password:'HmzvttHf7Wi8RA44QDDU',
    database:'blm6sa0xiy6cr1xmvucx'
});
myConnection.connect(function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The connection to the database was successful");
    }
});

module.exports = myConnection;