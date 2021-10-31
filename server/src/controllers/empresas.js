const connection = require("../database.js");

empresa = [];

empresa.addEnterprise = async (req, res) =>{

    let enterprise = await getEnterprise(req);

    if(enterprise === false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }

    if(enterprise != undefined){
        res.send({ message: "RFC o Razon Social ya estan dado de alta", status: false })
        return;
    }

    let query = `insert into enterprise values
    (null,
    '${req.body.name_enterprise}',
    '${req.body.rfc}',
    1)`

    connection.query(query,(err,row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de Conexion", status: false })
        }else{
            res.send({ message: "Empresa ingresada correctamente", status: true })
        }
    })
}

empresa.addBranch = (req, res) =>{
    let query = `insert into branch values
    (
    null,
    '${req.body.name_branch}',
    '${req.body.street}',
    '${req.body.colony}',
    '${req.body.city}',
    '${req.body.state}',
    '${req.body.zip_code}',
    '${req.body.id_enterprise}',
    '${req.body.phone}',
    '${req.body.email}',
    1
    )`

    connection.query(query, (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de Conexion", status: false })
        }else{
            res.send({ message: "Sucursal ingresada correctamente", status: false })
        }
    })
}



empresa.getAllEnterprises = async(req,res)=>{
    
    console.log(req.body)
    let verify_user = await verifyUser(req);

    if(verify_user == false || verify_user.id_role > 2 || verify_user.status == 0){
        res.send({ status: false, message: "Error de Conexion" })
        return;
    }

    let total = await countRowsEnterprises();
    let all_enterprises = await getEnterprises()
    res.send({ message: "Consulta correcta", status: true, result: all_enterprises, total:total })
}



empresa.getAllBranchs = async(req,res)=>{
    
    let verify_user = await verifyUser(req);

    if(verify_user == false || verify_user.id_role > 2 || verify_user.status == 0){
        res.send({ status: false, message: "Error de Conexion" })
        return;
    }
    let all_enterprises = await getBranchs(req)

    if(all_enterprises == false){
        res.send({ status: false, message: "Error de Conexion" })
        return;
    }
    let total = await countRowsBranchs(req);
    res.send({ message: "Consulta correcta", status: true, result: all_enterprises, total:total })
}

empresa.updateEnterprise = async (req, res) =>{
    let query = `UPDATE enterprise set is_active = ${req.body.is_active} where id_enterprise = ${req.body.id_enterprise}`
    connection.query(query, (err, row)=>{
        if(err){
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Consulta Correcta", status: true })
        }
    })
}

empresa.updateBranch = async (req, res)  =>{
    let query = `UPDATE branch set 
    street = '${req.body.street}',
    colony = '${req.body.colony}',
    city = '${req.body.city}',
    state = '${req.body.state}',
    zip_code = '${req.body.zip_code}',
    id_enterprise = '${req.body.id_enterprise}',
    phone = '${req.body.phone}',
    email = '${req.body.email}',
    is_active = ${req.body.is_active} 
    where id_branch = ${req.body.id_branch}`

    connection.query(query, (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Sucursal Actualizada", status: true })
        }
    })
}

async function getEnterprises(){
return new Promise((resolve,reject)=>{
    let query = `select * from enterprise`

    connection.query(query, (err, row)=>{
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

async function getBranchs(req){
    return new Promise((resolve,reject)=>{
        let limit = req.body.limit;
        let page = limit * (req.body.page - 1)
        let query = `
        select 
        id_branch,
        name_branch,
        street,
        colony,
        city,
        state,
        zip_code,
        branch.id_enterprise,
        phone,
        email,
        name_enterprise,
        rfc,
        branch.is_active as is_active_branch
        from branch inner join enterprise on
        branch.id_enterprise = enterprise.id_enterprise
        where branch.is_active like '%${req.body.is_active}%'
        and
        (name_branch like '%${req.body.parameter}%'
        or city Like '%${req.body.parameter}%'
        or enterprise.name_enterprise LIKE '%${req.body.parameter}%')
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

async function countRowsEnterprises(){
    return new Promise ((resolve, reject)=>{
        let query = `select count(*) as total from enterprise`
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

async function countRowsBranchs(req){
    return new Promise ((resolve, reject)=>{
        let query = `select count(*) as total from branch inner join enterprise on
        branch.id_enterprise = enterprise.id_enterprise
        where name_branch like '%${req.body.parameter}%'
        or city like '%${req.body.parameter}%'
        or enterprise.name_enterprise LIKE '%${req.body.parameter}%'`

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

async function getEnterprise(req){
    return new Promise((resolve, reject) =>{
        let query = `select * from enterprise where id_enterprise = '${req.body.id_enterprise}'
        or name_enterprise = '${req.body.name_enterprise}'`
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

module.exports = empresa;