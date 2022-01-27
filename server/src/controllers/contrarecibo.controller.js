const connection = require("../database.js");
const plantilla = require("../plantillas/plantilla");
const mailer = require("../shared/mailer")
const pdf = require("html-pdf")
const path = require("path")
const fs = require("fs")
const Twig = require('twig');
const notification = require('../controllers/notificationsController')


exports.sendContrarecibo = async (req, res) =>{
    console.log(req.body)
    let array_invoices = [];
    array_invoices = req.body.invoices;
    let file;
    var date =  new Date();
    var temp_string = date.toISOString();
    let format_date = temp_string.split("T");
    let path_file = path.join(__dirname,"../public/contrarecibos/contrarecibo-"+Date.now()+".pdf")
    const {  promise_date,company_name, rfc, invoices, id_invoice, email,payment_deadline,created_by,full_name,
        id_user,
        name_branch,
        name_enterprise } = req.body;

    id_contrarecibo = await insertContrarecibo(path_file, req);

    if(id_contrarecibo == false){
        res.send({ message: "Error al guardar contrarecibo", status: false })
    }

    let list_invoices = "";
    let total = 0;
    await array_invoices.forEach(item =>{
        total += item.mount;
        list_invoices += `<tr style=" padding: 10px 20px;
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(5,1fr);
        align-items: center;
        border-radius: 4px;">
            <td>
                ${ item.folio }
            </td>
            <td>
                ${ item.name_branch }
            </td>
            <td>
                ${ item.payment_deadline }
            </td>
            <td>
                ${ item.mount }
            </td>
        </tr>`;
    })

    let editable  = plantilla.contrarecibo;
    var regex = new RegExp("{{ list_invoices }}" , 'g');
    editable = editable.replace(regex, list_invoices);

    var tamplate = Twig.twig({
        data: editable
    });


    let render_file = tamplate.render({
        id_contrarecibo: id_contrarecibo, 
        created_by: req.body.full_name,
        shipping_date: format_date[0],
        promise_date: req.body.promise_date,
        company_name: req.body.company_name,
        total: total,
     })

    try{

        file = await createPdf(req,render_file, path_file);

        if(file == false){
            res.send({ message: "Error al enviar generar contrarecibo", status: false })
        }

        readFile(req,file);
   
        insert_id_contrarecibo = await insertIdContrareciboInvoice(id_contrarecibo, array_invoices);
   
        if(insert_id_contrarecibo == false){
            res.send({ message: "Error al guardar contrarecibo", status: false })
        }
        res.send({ message: "Contrarecibo ingresado correctamente", status: true })

    }catch(err){
        console.log(err)
        res.send({ message: "Error al enviar generar contrarecibo", status: false })
    }
}

exports.resendContrarecibo = async (req,res) =>{

    path_contrarecibo = await findContrarecibo(req.body.id_contrarecibo);
    if(path_contrarecibo == false){
        res.send({ message: "Error al buscar contrarecibo", status: false })
        return;
    }
    read_file = await readFile(path_contrarecibo)
    if(read_file == false){
        res.send({ message: "Error al leer el archivo", status: true })
        return;
    }
    res.send({ message: "Correo enviado correctamente", status: true })

}

exports.downloadContarecibo = async (req, res) =>{
    console.log(req.body)
    contrarecibo = await findContrarecibo(req.body.id_contrarecibo) 
    if(contrarecibo == false){
        res.send({ message: "Error de conexion", status: false })
    }else{
        res.download(contrarecibo)
    }
    
}


async function findContrarecibo(id_contrarecibo){
    return new Promise((resolve, reject)=>{
        let query = "Select * from contrarecibo where id_contrarecibo = ?"

        connection.query(query, [id_contrarecibo],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false);
            }else{
                console.log(row[0].path_contrarecibo)
                resolve(row[0].path_contrarecibo);
            }
        })
    })
}

async function createPdf(req, render_file, path_file){
    return new Promise((resolve, reject)=>{
        pdf.create(render_file).toFile(path_file, (err, doc)=>{
            if(err){
                console.log("err",err)
                resolve(false)
            }else{
                console.log("file",doc.filename)
                resolve(doc.filename)
            }
        })
    })

}


async function readFile(req,archivo){
        fs.readFile(archivo, (err, data)=> { 
            var mailOptions = {
                from: 'christopher.sandoval93@gmail.com',
                to: req.body.email,
                subject: 'Contrarecibo Nissan',
                text: 'That was easy!',
                attachments: [{'filename': 'contrarecibo-folio-'+req.body.folio+'.pdf', 'content': data}]
              };
            mailer.sendEmail( mailOptions );
        });
}

async function insertContrarecibo(file, req){
    return new Promise((resolve,reject)=>{
        let query = "call proc_insert_contrarecibo(?, ?, ?,?,?,?, ?)"
        const { promise_date, created_by, id_user, name_branch, name_enterprise, full_name } = req.body

        connection.query(query,[promise_date,file,created_by, id_user, name_branch, name_enterprise, full_name],(err,row)=>{
            if(err){
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa",row)
                console.log(err);
                resolve(false)
            }else{
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa",row[0])
                resolve(row[0][0].id)
            }
        })
    })
}

async function insertIdContrareciboInvoice(id_contrarecibo, array_invoices){
    return new Promise((resolve,reject)=>{
        let query = "call proc_insert_id_contrarecibo_invoice(?,?)"
        array_invoices.forEach((element, index) =>{
            connection.query(query,[id_contrarecibo, element.id_invoice],(err,row)=>{
                if(err){
                    console.log(err)
                    resolve(false)
                }
                if(index == array_invoices.length - 1){
                    resolve(true)
                }
            })
        })
    })
}

exports.getInvoicesInProgress = (req,res) =>{
    let query = `call facturacionnissan.proc_get_invoices_pending( ?, ?);`

    connection.query(query, [req.body.id_user, req.body.id_invoice], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Consulta Correcta", status: true, result: row[0] })
        }
    })
}


exports.getAllContrarecibos = async (req, res) =>{
    let contrarecibos = await getContrarecibos(req);
    if(contrarecibos == false){
        return res.send({  message: "Error de conexion", status: false })
    }
    let total = await getCountAllContrarecibos(req)

    res.send({ message: "Consulta Correcta", status: true, result: contrarecibos, total: total })
}


function getContrarecibos(req){
    return new Promise((resolve,reject)=>{
        let query = `call get_all_contrarecibo(?,?,?,?,?,?)`
        const { id_user, id_status_contrarecibo, promise_date,parameter } = req.body;
        let limit = req.body.limit;
        let page = limit * (req.body.page - 1)
        connection.query(query, [ id_user, id_status_contrarecibo, promise_date,parameter, page, limit], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0])
            }
        })
    })
} 

function getCountAllContrarecibos(req){
    return new Promise((resolve, reject)=>{
        let query =`call get_count_all_contrarecibo (?,?,?,?)`
        const { id_user, id_status_contrarecibo, promise_date,parameter } = req.body;
        connection.query(query, [ id_user, id_status_contrarecibo, promise_date,parameter], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0].length)
            }
        })
    })
}

exports.getInvoicesByContrarecibo = (req, res)=>{
    let query = `call proc_get_invoices_by_contrarecibo (?)`

    connection.query(query, [req.body.id_contrarecibo], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de Conexion", status: false })
        }else{
            res.send({ message: "Consulta correcta", status: true, result: row[0] })
        }
    })
}

function setNotification(title_notification, full_name, id_contrarecibo, name_enterprise, name_branch){
    let data = {
        title_notification: title_notification,
        message_admin_notification: `${full_name} creo contrarecibo con el numero de folio: ${ id_contrarecibo } de la empresa ${name_enterprise} de la sucursal ${name_branch}`
    }
    notification.insertAdminNotification(data)
}