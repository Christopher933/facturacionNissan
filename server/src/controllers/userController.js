const connection = require("../database.js");

user=[];


user.insertUser= (req,res)=>{
    console.log(req.body)
    const {user_name,password, rfc,company_name, phone, email, id_role} = req.body;
    sql= "insert into user values (null, ?,?,?,?,?) "
    sql2= "insert into provider_information values (null, ?,?,?,?)"
    response = false;
    let id;

    connection.query(sql,[user_name,password,id_role,email,1],(err,row)=>{
        let id = row.insertId;
        if(err){
            response= false;
        }else{
            response= true;
        }
        if(id_role==3){
            connection.query(sql2,[phone, company_name,rfc,id],(err,res)=>{
                if(err){
                    response= false;
                }else{
                    response= true;
                }
            })
        }
    })

    res.send(response);
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