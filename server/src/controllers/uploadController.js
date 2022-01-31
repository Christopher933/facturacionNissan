const multer = require('multer')
const path = require("path");
const connection = require("../database");
const fs = require('fs');
const notification = require('../controllers/notificationsController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,`../public/facturas/${(new Date()).getFullYear()}`))
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
    let new_path_pdf = path.join(__dirname,`../public/facturas/${(new Date()).getFullYear()}/${Date.now()}-pdf-${folio}.pdf`)
    let new_path_xml = path.join(__dirname,`../public/facturas/${(new Date()).getFullYear()}/${Date.now()}-xml-${folio}.xml`)


    fs.rename(path_pdf, new_path_pdf, (err) => {
        if (err) throw err;
        console.log('Nombre Editado Satisfactoriamente');
      });
      fs.rename(path_xml, new_path_xml, (err) => {
        if (err) throw err;
        console.log('Nombre Editado Satisfactoriamente');
      });
    
    sql= "call proc_insert_invoice (?,?,?,?,?,?,?,?,?) "
    
     connection.query(sql,[issue_date,payment_deadline,mount, folio, coin, new_path_pdf,new_path_xml, id_user, id_branch],async (err,row)=>{
        if(err){
            console.log("error", err)
            res.send({ message: "error de conexion", status: false})
        }else{
            res.send({ message: "Factura Ingresada correctamente", status: true})
        }
    })
}

exports.updateInfoInvoice = (req,res)=>{
    const { issue_date, payment_deadline, mount , folio , coin, id_user , id_branch, id_invoice , update_by } = req.body;
    let query = `call proc_update_invoice_info(?,?,?,?,?,?,?,?,?)`

    connection.query(query, [issue_date, payment_deadline, mount , folio , coin, id_user , id_branch, id_invoice , update_by ], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            console.log(row.affectedRows)
            if(row.affectedRows == 0){
                res.send({ message: "No es posible actualizar datos", status: false })
            }else{
                res.send({ message: "Se actualizaron los datos", status: true })
            }
        }
    })

}

exports.updateFilesInvoice = async (req, res)=>{
    const { update_by, id_user, id_invoice, folio, old_pdf, old_xml } = req.body;
    let path_pdf = req.files[0].path;
    let path_xml = req.files[1].path;
    let new_path_pdf = path.join(__dirname,`../public/facturas/${(new Date()).getFullYear()}/${Date.now()}-pdf-${folio}.pdf`)
    let new_path_xml = path.join(__dirname,`../public/facturas/${(new Date()).getFullYear()}/${Date.now()}-xml-${folio}.xml`)
    console.log(req.body)
    console.log(req.files)

    await renameFiles(path_pdf, new_path_pdf);
    await renameFiles(path_xml, new_path_xml);

    let query = `call proc_update_invoice_files(?,?,?,?,?,?)`

    connection.query(query, [update_by, id_user,new_path_pdf,new_path_xml, id_invoice, folio], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            console.log(row.affectedRows)
            if(row.affectedRows == 0){
                fs.unlinkSync(new_path_pdf)
                fs.unlinkSync(new_path_xml)
                res.send({ message: "No es posible actualizar los archivos", status: false })
            }else{
                fs.unlinkSync(old_pdf)
                fs.unlinkSync(old_xml)
                res.send({ message: "Se actualizaron los archivos", status: true })
            }
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


exports.getNotes = (req, res) =>{
    const { id_invoice } = req.body;
    let query = `call proc_get_notes(?)`
    connection.query(query, [id_invoice], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Consulta correcta", status : true, result : row[0] })
        }
    })
}


function renameFiles(old_path, new_path){
    return new Promise((resolve, reject)=>{
        fs.rename(old_path, new_path, (err) => {
            if (err) throw err;
            console.log('Nombre Editado Satisfactoriamente');
            resolve(true)
          });
    })
}



