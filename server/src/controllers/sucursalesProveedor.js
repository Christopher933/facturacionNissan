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
        let query = `
        select 
        id_provider_branch,
        name_branch,
        street,
        colony,
        city,
        state,
        zip_code,
        provider_branch.id_provider,
        provider_branch.phone,
        email,
        company_name,
        rfc,
        provider_branch.is_active as is_active_branch
        from provider_branch inner join provider_information on
        provider_branch.id_provider = provider_information.id_provider
        where provider_branch.is_active like '%${req.body.is_active}%'
        and
        (name_branch like '%${req.body.parameter}%'
        or city Like '%${req.body.parameter}%'
        or colony LIKE '%${req.body.parameter}%'
        or provider_branch.email LIKE '%${req.body.parameter}%')
        order by name_branch
        limit ${page},${limit}
        `
    
        connection.query(query, (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row)
            }
        })
    })
}

async function verifyUser(req){
    return new Promise((resolve,reject)=>{
        let query = `select * from user where id_user = ?`
        connection.query(query,[req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log("es el",row[0])
                resolve(row[0])
            }
        })
    })
}

async function countRowsBranchs(req){
    return new Promise ((resolve, reject)=>{
        let query = `select count(*) as total from provider_branch inner join provider_information on
        provider_branch.id_provider = provider_information.id_provider
        where provider_branch.is_active like '%${req.body.is_active}%'
        and
        (name_branch like '%${req.body.parameter}%'
        or city Like '%${req.body.parameter}%'
        or colony LIKE '%${req.body.parameter}%'
        or provider_branch.email LIKE '%${req.body.parameter}%')`

        connection.query(query,(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0].total)
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