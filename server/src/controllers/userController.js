const connection = require("../database.js");

user=[];


user.insertUser= (req,res)=>{
    console.log(req.body)
    let id_user = req.body.id_user;
    let user_name = req.body.user_name;
    let password = req.body.password;
    let id_role = req.body.id_role;
    let email = req.body.email;
    let status = 1;
    let id_branch = req.body.id_branch;
    let phone = req.body.phone || '';
    let company_name = req.body.company_name || '';
    let rfc = req.body.rfc || '';
    let id_regimen = req.body.id_regimen || null;
    console.log("phone",phone)

    let query = `call facturacionnissan.proc_add_user(?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?);`

    connection.query(query, [id_user, user_name, password, id_role, email, status, id_branch, phone, company_name,rfc,id_regimen], (err, rows)=>{
        if(err){
            res.send({ message: "Error de conexion", status: false })
        }else{
            console.log(rows)
            res.send({ message: "Usuario agregado correctamente", status: true })
        }
    })
}

user.getAllUsers = async(req,res)=>{
    
    console.log(req.body)
    let verify_user = await verifyUser(req);

    console.log("verify",verify_user)
    if(verify_user == false || verify_user.id_role > 2 || verify_user.status == 0){
        res.send({ status: false, message: "Error de Conexion" })
        return;
    }

    let total = await countRowsUsers(req);

    let allUsers = await getUsers(req)
    res.send({ message: "Consulta correcta", status: true, result: allUsers, total:total })
}

async function getUsers(req){
return new Promise((resolve,reject)=>{
    let limit = req.body.limit;
    let page = limit * (req.body.page - 1)
    let query = `
    select * from provider_information left join user 
    on provider_information.id_user = user.id_user
    where status LIke '%${req.body.id_status}%'
    and (email Like '%${req.body.parameter}%' 
    or user_name LIKE '%${req.body.parameter}%'
    or id_role LIKE '%${req.body.parameter}%')
    union
    select * from provider_information right join user
    on provider_information.id_user = user.id_user
    where status LIke '%${req.body.id_status}%'
    and (email Like '%${req.body.parameter}%' 
    or user_name LIKE '%${req.body.parameter}%'
    or id_role LIKE '%${req.body.parameter}%')
    order by user_name
    limit ${page},${limit}`

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

user.updateUser = async (req,res)=>{
    let user_info;
    let provider_info;
    console.log(req.body)

    let verify_user = await verifyUser(req);
    console.log("este", verify_user)

    if(verify_user.id_role == 1 || verify_user.id_role==2){
        user_info = await updateInfoUser(req)
        if(user_info == true){
            res.send({ message: "Datos de usuario actualizados", status: true })
            return;
        }else{
            res.send({ message: "Error de conexion", status: false })
            return;
        }
    }else{
        user_info = await updateInfoUser(req);

        if(user_info == false){
            res.send({ message: "Error de conexion", status: false })
            return;
        }
        provider_info = await updateInfoProvider(req)

        if(user_info == false){
            res.send({ message: "Error de conexion", status: false })
            return;
        }

        res.send({ message: "Datos de proveedor actualizados", status: true })
    }
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

async function countRowsUsers(req){
    return new Promise ((resolve, reject)=>{
        let query = `select count(*) as total from user where
        status LIke '%${req.body.id_status}%'
        and (email Like '%${req.body.parameter}%' 
        or user_name LIKE '%${req.body.parameter}%'
        or id_role LIKE '%${req.body.parameter}%')`

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

async function updateInfoProvider(req){
    return new Promise((resolve,reject)=>{
        let query = `update provider_information set phone = ? where id_user = ? `
        connection.query(query,[req.body.phone,req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}

async function updateInfoUser(req){
    return new Promise((resolve,reject)=>{
        let query = `update user set id_role = ?, status = ? where id_user = ? `

        connection.query(query,[req.body.id_role,req.body.status,req.body.id_user],(err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}


module.exports= user;