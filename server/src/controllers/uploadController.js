const multer = require('multer')
const path = require("path");
const connection = require("../database");
const fs = require('fs');

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

exports.uploadFile = (req, res) => {
    let { issue_date, payment_deadline, folio, mount, coin, id_user, shipping_date, id_branch } = req.body;
    let path_pdf = req.files[0].path;
    let path_xml = req.files[1].path;
    let new_path_pdf = path.join(__dirname,"../public/facturas/"+`${Date.now()}-pdf-${folio}.pdf`)
    let new_path_xml = path.join(__dirname,"../public/facturas/"+`${Date.now()}-xml-${folio}.xml`)
    console.log(path_pdf)
    console.log(path_xml)

    fs.rename(path_pdf, new_path_pdf, (err) => {
        if (err) throw err;
        console.log('Nombre Editado Satisfactoriamente');
      });
      fs.rename(path_xml, new_path_xml, (err) => {
        if (err) throw err;
        console.log('Nombre Editado Satisfactoriamente');
      });
    
    sql= "insert into invoice values (null, ?,?,?,?,?,?,?,?,?,?,?,?,?,?) "
    
     connection.query(sql,[issue_date,payment_deadline,mount, folio, coin, new_path_pdf,new_path_xml, id_user, 1, null,null,shipping_date,null, id_branch],(err,row)=>{
        if(err){
            console.log("error", err)
            res.send({ message: "error de conexion", status: false})
        }else{
            res.send({ message: "Factura Ingresada correctamente", status: true})
        }
    })
}