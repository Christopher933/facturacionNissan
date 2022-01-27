const connection = require("../database.js");

const auth = [];

auth.authentication = (req,res)=>{
    console.log(req.body)
    const {user_name , password} = req.body;
    let sql = "call proc_login(?)"
    if(!user_name || !password){
        res.send({ message: "Campos incompletos", status: false })
        return;
    }
    connection.query(sql,[user_name],(err,row)=>{
        if(row[0].length == 0){
            res.send({ message: "Usuario o Contraseña incorrectos", status: false })
            return;
        }
        if(!row[0][0].user_name || row[0][0].password != password){
            res.send({ message: "Usuario o Contraseña incorrectos", status: false })
            return ;
        }else{
            console.log(row[0][0])
            res.send({ message: "Login correcto", status: true, result: 
            {
                id_user: row[0][0].id_user,
                user_name: row[0][0].user_name,
                id_role: row[0][0].id_role,
                id_branch: row[0][0].id_branch,
                id_enterprise: row[0][0].id_enterprise,
                first_name : row[0][0].first_name || "",
                last_name_1 : row[0][0].last_name_1 || "",
                last_name_2 : row[0][0].last_name_2 || "",
            }
         })
        }
    })
}


module.exports = auth;