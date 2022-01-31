const connection = require("../database.js");
const plantilla = require("../plantillas/plantilla");
const mailer = require("../shared/mailer")
const pdf = require("html-pdf")
const path = require("path")
const fs = require("fs")
const multer = require('multer');
const notification = require('../controllers/notificationsController')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,`../public/pagos/${(new Date()).getFullYear()}`))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-`+ file.originalname)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.array('archivo')

exports.sendPago = async (req, res) =>{
    console.log(req.body)
    let path_pdf = req.files[0].path;
    const { id_contrarecibo,id_user, created_by, email, company_name, rfc, full_name} = req.body
    
    let query = "call proc_insert_payment(?,?,?,?,?,?,?)"

    connection.query(query,[id_contrarecibo,id_user, created_by,path_pdf, company_name, rfc, full_name], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de Conexion", status: false  })
        }else{
            sendEmail(email , path_pdf, row[0][0].id)
            res.send({ message: "Pago Ingresado correctamente", status: true })
        }
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

exports.reSendPago = (req,res)=>{

}

function sendEmail(email, file, folio){
    fs.readFile(file,(err,data)=>{
        let ext = path.extname(file)
        var mailOptions = {
            from: 'christopher.sandoval93@gmail.com',
            to: email,
            subject: 'Comprobante de pago Nissan',
            text: 'That was easy!',
            attachments: [{'filename': 'contrarecibo-folio-'+folio+ext, 'content': data}]
          };
        mailer.sendEmail( mailOptions );
    })
}


