const connection = require("../database.js");
const plantilla = require("../plantillas/plantilla");
const mailer = require("../shared/mailer")
const pdf = require("html-pdf")
const path = require("path")
const fs = require("fs")
const Twig = require('twig');


exports.sendContrarecibo = async (req, res) =>{
    let archivo;
    let status;
    let file;
    let send_email;
    var tamplate = Twig.twig({
        data: plantilla.contrarecibo
    });

    console.log(req.body)

    let render_file = tamplate.render({ 
        shipping_date: req.body.shipping_date ,
        company_name: req.body.company_name,
        folio: req.body.folio,
        mount: req.body.mount,
        promise_date: req.body.promise_date,
        payment_deadline: req.body.payment_deadline
     })

    try{

        file = await createPdf(req,render_file);

        if(file == false){
            res.send({ message: "Error al enviar generar contrarecibo", status: false })
        }
        
        readFile(req,file);
   
        id_contrarecibo = await insertContrarecibo(file, req.body.promise_date);
   
        if(id_contrarecibo == false){
            res.send({ message: "Error al guardar contrarecibo", status: false })
        }
   
        insert_id_contrarecibo = await insertIdContrareciboInvoice(id_contrarecibo, req.body.id_invoice);
   
        if(insert_id_contrarecibo == false){
            res.send({ message: "Error al guardar contrarecibo", status: false })
        }
   
        res.send({ message: "Contrarecibo ingresado correctamente", status: true })

    }catch(err){
        console.log(err)
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

async function createPdf(req, render_file){
    return new Promise((resolve, reject)=>{
        pdf.create(render_file).toFile(path.join(__dirname,"../public/contrarecibos/contrarecibo-"+Date.now()+"-"+req.body.folio+".pdf"), (err, doc)=>{
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

async function insertContrarecibo(file, promise_date){
    return new Promise((resolve,reject)=>{
        let query = "INSERT INTO contrarecibo  values(null, ?, ?)"

        connection.query(query,[promise_date,file],(err,row)=>{
            if(err){
                console.log(err);
                resolve(false)
            }else{
                resolve(row.insertId)
            }
        })
    })
}

async function insertIdContrareciboInvoice(id_contrarecibo, id_invoice){
    return new Promise((resolve,reject)=>{
        let query = "UPDATE invoice set id_contrarecibo = ?, id_status = 2 where id_invoice = ?"

        connection.query(query,[id_contrarecibo, id_invoice],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row)
            }
        })

    })
}
