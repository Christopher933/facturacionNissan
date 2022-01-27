const connection = require("../database.js");

sucursal = [];

sucursal.addBranch = (req, res) =>{
    let query = `insert into provider_branch values
    (
    null,
    '${req.body.name_branch}',
    '${req.body.street}',
    '${req.body.colony}',
    '${req.body.city}',
    '${req.body.state}',
    '${req.body.zip_code}',
    '${req.body.id_provider}',
    '${req.body.phone}',
    '${req.body.email}',
    1
    )`
    console.log(req.body)
    connection.query(query, (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de Conexion", status: false })
        }else{
            res.send({ message: "Sucursal ingresada correctamente", status: true })
        }
    })
}

sucursal.getAllBranchs = async(req,res)=>{
    
    let all_enterprises = await getBranchs(req)

    if(all_enterprises == false){
        res.send({ status: false, message: "Error de Conexion" })
        return;
    }
    let total = await countRowsBranchs(req);
    res.send({ message: "Consulta correcta", status: true, result: all_enterprises, total:total })
}

sucursal.updateBranch = async (req, res)  =>{
    let query = `UPDATE provider_branch set 
    street = '${req.body.street}',
    colony = '${req.body.colony}',
    city = '${req.body.city}',
    state = '${req.body.state}',
    zip_code = '${req.body.zip_code}',
    phone = '${req.body.phone}',
    email = '${req.body.email}',
    is_active = ${req.body.is_active} 
    where id_provider_branch = ${req.body.id_provider_branch}`

    connection.query(query, (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Sucursal Actualizada", status: true })
        }
    })
}


async function getBranchs(req){
    return new Promise((resolve,reject)=>{
        let limit = req.body.limit;
        let page = limit * (req.body.page - 1)
        let query = `call proc_branchs_provider (?, ?, ?, ?, ?)`
    
        connection.query(query,[req.body.id_user,req.body.is_active, req.body.parameter, page, limit ], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0])
            }
        })
    })
}


async function countRowsBranchs(req){
    return new Promise ((resolve, reject)=>{
        let query = `call proc_count_branchs_provider(?,?,?)`

        connection.query(query,[req.body.id_user,req.body.is_active, req.body.parameter],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0][0].total)
            }
        })
    })
}


sucursal.getBranch = (req, res) =>{
    let query = "select * from branch where id_enterprise = ?"
    
    connection.query(query,[req.body.id_enterprise], (err, row)=>{
        if(err){
            console.log(err)
            return res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Consulta correcta", status: false, result: row })
        }
    })
}

module.exports = sucursal;