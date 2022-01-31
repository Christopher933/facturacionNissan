const express= require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const morgan= require("morgan");
const db= require ("./database")
const cron = require('node-cron');
const fs = require('fs');

//settings
app.set("port", process.env.PORT || 3000);

//midleWares
app.use(morgan("dev"));
app.use(express.json())
app.use(cors());

//global variables

//router
app.use("/api",require("./routes/index.js"))

//public
app.use("/public/", express.static(path.join(__dirname, "./public")))

cron.schedule('0 0 1 1 *', () => {
    let date = new Date();
    let year = date.getFullYear();
    fs.mkdirSync(path.join(__dirname, `./public/pagos/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/acta_constitutiva/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/cedula_fiscal/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/comprobante_domicilio/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/contrarecibos/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/cuentas_bancarias/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/datos_representante_legal/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/facturas/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/INE/${year}`), { recursive: true })
    fs.mkdirSync(path.join(__dirname, `./public/opinion_cumplimiento/${year}`), { recursive: true })
});
               

//start server
app.listen(app.get("port"),()=>{
    console.log("puerto 3000")
})