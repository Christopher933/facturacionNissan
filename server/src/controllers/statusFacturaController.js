const connection = require("../database");

exports.getFacturas = async (req , res) =>{
    const { id_rol } = req.body
    let result;
    let count;
    console.log(req.body)

    if(id_rol == 3){
        count = await getCountInvoices(req);
        result = await getInvoicesByParameter(req);
    }else{
        count = await getCountAllInvoices(req)
        result = await getAllInvoicesByParameter(req);
    }

    if(result == false){
        res.send({ message: "Error de conexion", status: false })
    }else{
        res.send({ message: "Consulta correcta", status: false, result: result, total: count[0].total })
    }
}

async function getInvoicesByParameter(req){
    let limit = req.body.limit;
    let page = limit * (req.body.page - 1)
    return new Promise((resolve, reject)=>{
        let query = `select *from invoice inner join provider_information on 
        invoice.id_user = provider_information.id_user where invoice.id_user=? 
        and invoice.issue_date LIKE '%${req.body.issue_date}%'
        and invoice.id_status LIKE '%${req.body.id_status}%'
        and (invoice.folio LIKE '%${req.body.parameter}%' or provider_information.rfc LIKE '%${req.body.parameter}%'
        or provider_information.company_name LIKE '%${req.body.parameter}%')
        order by  invoice.id_status,invoice.shipping_date
        limit ${page},${limit}`

        connection.query(query,[req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log(row)
                resolve(row)
            }
        })
    })
}

async function getAllInvoicesByParameter(req){
    let limit = req.body.limit;
    let page = limit * (req.body.page - 1)
    return new Promise((resolve, reject)=>{
        let query = `select * from invoice inner join provider_information on 
        invoice.id_user = provider_information.id_user where  
        invoice.issue_date LIKE '%${req.body.issue_date}%'
        and invoice.id_status LIKE '%${req.body.id_status}%'
        and (invoice.folio LIKE '%${req.body.parameter}%' or provider_information.rfc LIKE '%${req.body.parameter}%'
        or provider_information.company_name LIKE '%${req.body.parameter}%')
        order by  invoice.id_status,invoice.shipping_date
        limit ${page},${limit}`

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

async function getCountInvoices(req){
    let page = req.body.limit * req.body.page
    return new Promise((resolve, reject)=>{
        let query = `select count(*) as total from invoice inner join provider_information on 
        invoice.id_user = provider_information.id_user where invoice.id_user=? 
        and invoice.issue_date LIKE '%${req.body.issue_date}%'
        and invoice.id_status LIKE '%${req.body.id_status}%'
        and (invoice.folio LIKE '%${req.body.parameter}%' or provider_information.rfc LIKE '%${req.body.parameter}%'
        or provider_information.company_name LIKE '%${req.body.parameter}%')
        order by  invoice.id_status,invoice.shipping_date`

        connection.query(query,[req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log(row)
                resolve(row)
            }
        })
    })
}


async function getCountAllInvoices(req){
    let page = req.body.limit * req.body.page
    return new Promise((resolve, reject)=>{
        let query = `select count(*) as total from invoice inner join provider_information on 
        invoice.id_user = provider_information.id_user where 
        invoice.issue_date LIKE '%${req.body.issue_date}%'
        and invoice.id_status LIKE '%${req.body.id_status}%'
        and (invoice.folio LIKE '%${req.body.parameter}%' or provider_information.rfc LIKE '%${req.body.parameter}%'
        or provider_information.company_name LIKE '%${req.body.parameter}%')
        order by  invoice.id_status,invoice.shipping_date`

        connection.query(query,[req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log(row)
                resolve(row)
            }
        })
    })
}
