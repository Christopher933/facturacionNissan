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
    let first_name = req.body.first_name || '';
    let last_name_1 = req.body.last_name_1 || '';
    let last_name_2 = req.body.last_name_2 || '';
    let phone = req.body.phone || '';
    let company_name = req.body.company_name || '';
    let rfc = req.body.rfc || '';
    let id_regimen = req.body.id_regimen || null;

    let query = `call facturacionnissan.proc_add_user(?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?);`

    connection.query(query, [id_user, user_name, password, id_role, email, status, id_branch, phone, company_name,rfc,id_regimen, first_name,last_name_1,last_name_2], (err, rows)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            console.log(rows)
            res.send({ message: "Usuario agregado correctamente", status: true })
        }
    })
}

user.getAllUsers = async(req,res)=>{
    console.log(req.body)

    let total = await countRowsUsers(req);
    let allUsers = await getUsers(req)
    res.send({ message: "Consulta correcta", status: true, result: allUsers, total:total })
}


async function getUsers(req){
return new Promise((resolve,reject)=>{
    let limit = req.body.limit;
    let page = limit * (req.body.page - 1)
    const { id_user, parameter, id_status } = req.body;
    let query = `call proc_get_all_users(?,?,?,?,?)`
    connection.query(query,[id_user, parameter, id_status, limit, page], (err, row)=>{
        if(err){
            console.log(err)
            resolve([])
        }else{
            resolve(row[0])
        }
    })
})
}

user.updateUser = async (req,res)=>{
    console.log(req.body)
    const { id_user, status, id_role, email } = req.body;
    const first_name = req.body.first_name || '';
    const last_name_1 = req.body.last_name_1 || '';
    const last_name_2 = req.body.last_name_2 || '';
    const phone = req.body.phone || '';
    let query = ` call proc_update_user (?,?,?,?,?,?,?,?)`

    connection.query(query, [id_user, status, id_role, email, first_name, last_name_1, last_name_2, phone], (err,row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Usuario actualizado correctamente", status: true })
        }
    })
}


async function countRowsUsers(req){
    return new Promise ((resolve, reject)=>{
        let query = `call proc_count_all_users(?,?,?)`
        const { id_user, parameter, id_status } = req.body
        connection.query(query,[id_user, parameter, id_status],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0][0].total)
            }
        })
    })
}





module.exports= user;