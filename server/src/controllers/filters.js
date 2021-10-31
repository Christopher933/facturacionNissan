const connection = require("../database.js");


exports.filterStatus= async(req,res)=>{

    let invoices = await getStatus(req);

    if(invoices == false){
        res.send({ message: "Error de Conexion", status: false })
    }else{
        res.send({ message: "Consulta Correcta", status: "true", result: invoices })
    }
}

exports.filterByDate = async (req, res)=>{

    let invoices = await getInvoiceByDate(req)

    if(invoices == false){
        res.send({ message: "Error de Conexion", status: false })
    }else{
        res.send({ message: "Consulta exitosa", status: true, result: invoices })
    }
}

exports.filterParameter = async(req, res)=>{

    const result = await getInvoicesByParameter(req);

    if(result == false){
        res.send({ message: "Error de conexion", status: false })
    }else{
        res.send({ message: "Consulta correcta", status: false, result: result })
    }
}

async function getStatus(req){
    return new Promise((resolve,reject)=>{
        let query = "select * from invoice inner join provider_information on invoice.id_user = provider_information.id_user where invoice.id_user=? and invoice.id_status =?"

        connection.query(query,[req.body.id_user,req.body.id_status],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row)
            }
        })
    })
}

async function getInvoiceByDate(req){
    console.log(req.body)
    return new Promise((resolve, reject)=>{
        let query = "select * from invoice inner join provider_information on invoice.id_user = provider_information.id_user where invoice.id_user=? and invoice.issue_date =?"
        connection.query(query,[req.body.id_user, req.body.issue_date],(err, row)=>{
            console.log(row)
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row)
            }
        })
    })
}

async function getInvoicesByParameter(req){
    return new Promise((resolve, reject)=>{
        let query = `select * from invoice inner join provider_information on 
        invoice.id_user = provider_information.id_user where invoice.id_user=? 
        and (invoice.folio LIKE '%${req.body.parameter}%' or provider_information.rfc LIKE '%${req.body.parameter}%'
        or provider_information.company_name LIKE '%${req.body.parameter}%'
        or invoice.issue_date LIKE '${req.body.issue_date}'
        or invoice.id_status LIKE '${req.body.id_status}')`

        connection.query(query,[req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row)
            }
        })
    })
}