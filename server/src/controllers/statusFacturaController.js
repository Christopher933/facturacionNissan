const connection = require("../database");

exports.getFacturas = async (req , res) =>{
    const { id_role } = req.body
    let result;
    let count;

    count = await getCountInvoices(req);
    result = await getInvoicesByParameter(req);

    if(result == false){
        res.send({ message: "Error de conexion", status: false })
    }else{
        res.send({ message: "Consulta correcta", status: false, result: result, total: count })
    }
}

async function getInvoicesByParameter(req){
    let limit = req.body.limit;
    let page = limit * (req.body.page - 1)
    return new Promise((resolve, reject)=>{
        let query = `call facturacionnissan.proc_get_invoices_by_parameter(?,?,?,?,?,?,?)`

        connection.query(query,[req.body.id_user, limit, page,req.body.id_status,req.body.parameter ,req.body.issue_date, req.body.id_branch ],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log(row[0])
                resolve(row[0])
            }
        })
    })
}


async function getCountInvoices(req){
    return new Promise((resolve, reject)=>{
        let query = `call facturacionnissan.proc_count_invoices(?,?,?,?,?)`

        connection.query(query,[req.body.id_user,req.body.id_status,req.body.parameter ,req.body.issue_date, req.body.id_branch ],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log(row[0][0].total)
                resolve(row[0][0].total)
            }
        })
    })
}


