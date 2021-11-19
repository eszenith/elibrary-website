//this makes connection to mysql with database 'library' which have all tables for this web application
var mysql = require('mysql');

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'estig@123',
    database:'library'
});

con.connect(function(err) {
    if(err) throw err;
    console.log("connected");

});

module.exports = con;

