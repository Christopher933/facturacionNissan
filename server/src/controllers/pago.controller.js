const connection = require("../database.js");
const plantilla = require("../plantillas/plantilla");
const mailer = require("../shared/mailer")
const pdf = require("html-pdf")
const path = require("path")
const fs = require("fs")
const multer = require('multer');
const { query } = require("../database.js");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../public/facturas"))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-`+ file.originalname)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.array('archivo')

exports.sendPago = async (req, res) =>{
    console.log(req.body)
    console.log(req.files)
    let {folio, date_sent } = req.body;
    let path_pdf = req.files[0].path;

      id_payment = await insertPago(req, path_pdf);

      if(id_payment == false){
          res.send({ message: "Error de conexion", status:false })
          return;
      }
      insert_id = await insertIdPago(req, id_payment);

      if(insert_id == false){
          res.send({ message: "Error de Conexion", status: false })
          return
      }else{
          sendEmail(req, path_pdf)
          res.send({ message: "Pago ingresado correctamente", status: true })
      }

}

async function insertPago(req, path_pdf){
    return new Promise((resolve, reject)=>{
        let query = "Insert into payment values(null, ?, ?)"

        connection.query(query,[req.body.date_sent, path_pdf], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row.insertId)
            }
        })
    })
}

async function insertIdPago(req,id_payment){
    return new Promise((resolve, reject)=>{
        let query = "Update invoice set  id_payment = ?, id_status = 3 where id_invoice = ?"

        connection.query(query,[id_payment, req.body.id_invoice],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}

exports.downloadPayment = async (req, res) =>{
    payment = await findPayment(req.body.id_payment) 
    if(payment == false){
        res.send({ message: "Error de conexion", status: false })
    }else{
        res.download(payment)
    }
    
}

async function findPayment(id_payment){
    return new Promise((resolve, reject)=>{
        let query = "Select * from payment where id_payment = ?"

        connection.query(query, [id_payment],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false);
            }else{
                console.log(row[0].path_payment)
                resolve(row[0].path_payment);
            }
        })
    })
}

function sendEmail(req, file){
    fs.readFile(file,(err,data)=>{
        let ext = path.extname(file)
        var mailOptions = {
            from: 'christopher.sandoval93@gmail.com',
            to: req.body.email,
            subject: 'Comprobante de pago Nissan',
            text: 'That was easy!',
            attachments: [{'filename': 'contrarecibo-folio-'+req.body.folio+ext, 'content': data}]
          };
        mailer.sendEmail( mailOptions );
    })
}


