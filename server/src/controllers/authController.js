const connection = require("../database.js");

const auth = [];

auth.authentication = (req,res)=>{
    const {user_name , password} = req.body;
    let sql = "select * from user where user_name= ?"
    if(!user_name || !password){
        return
    }
    connection.query(sql,[user_name],(err,row)=>{
        console.log(row)
        if(!row[0].user_name){
            console.log("Usuario incorrecto")
            return false;
        }
        if(row[0].password != password){
            console.log("contraseña incorrecta");
            return false;
        }

        res.json({
            id_user: row[0].id_user,
            user_name: row[0].user_name,
            id_role: row[0].id_role,
        })
    })
}


module.exports = auth;