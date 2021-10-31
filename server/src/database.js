const mysql = require("mysql");
const {promisify} = require("util");

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "AzUl1a23",
    database: "facturacionnissan"
})

connection.getConnection((err,connect)=>{
    if(err){
        console.log("Connection error")
    }

    if(connect){
        connect.release();
        console.log("DB is connected");
        return;
    }
});

connection.query = promisify(connection.query)

module.exports = connection;