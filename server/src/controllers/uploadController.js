const multer = require('multer')
const path = require("path");
const connection = require("../database");
const fs = require('fs');
const notification = require('../controllers/notificationsController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../public/facturas"))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}`)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.array('archivos')

exports.uploadFile = async (req, res) => {
    const { issue_date, payment_deadline, folio, mount, coin, id_user, shipping_date, id_branch } = req.body;
    let path_pdf = req.files[0].path;
    let path_xml = req.files[1].path;
    let new_path_pdf = path.join(__dirname,"../public/facturas/"+`${Date.now()}-pdf-${folio}.pdf`)
    let new_path_xml = path.join(__dirname,"../public/facturas/"+`${Date.now()}-xml-${folio}.xml`)


    fs.rename(path_pdf, new_path_pdf, (err) => {
        if (err) throw err;
        console.log('Nombre Editado Satisfactoriamente');
      });
      fs.rename(path_xml, new_path_xml, (err) => {
        if (err) throw err;
        console.log('Nombre Editado Satisfactoriamente');
      });
    
    sql= "call proc_insert_invoice (?,?,?,?,?,?,?,?,?,?) "
    
     connection.query(sql,[issue_date,payment_deadline,mount, folio, coin, new_path_pdf,new_path_xml, id_user,shipping_date, id_branch],async (err,row)=>{
        if(err){
            console.log("error", err)
            res.send({ message: "error de conexion", status: false})
        }else{
            res.send({ message: "Factura Ingresada correctamente", status: true})
        }
    })
}

exports.rejectInvoice = (req, res) =>{
    const { created_by,id_user, id_invoice, folio, subject, note, full_name, company_name } = req.body;
    let query = `call proc_reject_invoice (?,?,?,?,?,?,?,?)`

    connection.query(query, [created_by,id_user, id_invoice,folio, subject, note, full_name, company_name ], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send( { message: "Factura rechazada, folio "+ folio, status: true } )
        }
    })
}



