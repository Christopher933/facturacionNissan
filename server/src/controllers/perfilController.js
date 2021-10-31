const { query } = require("../database.js");
const connection = require("../database.js");
const plantilla = require("../plantillas/plantilla");
const mailer = require("../shared/mailer")
const pdf = require("html-pdf")
const path = require("path")
const fs = require("fs")
const multer = require('multer');



perfil = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../public/cuentas_bancarias"))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-`+ file.originalname)
    }
})

const upload = multer({ storage: storage })

perfil.upload = upload.single('archivo')

perfil.uploadBankAccounts = async (req, res) => {
    let path_file = req.file.path;
    console.log("path", path_file)
    let bank_accounts = await insertBankAccounts(req, path_file)
    if(bank_accounts == false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }
    res.send({ message: "Cuentas bancarias ingresadas correctamente", status: false })
}

perfil.getBankAccounts = async (req,res) =>{
    console.log(req.params)
    let bank_accounts = await searchBankAccounts(req.params.id)
    if(bank_accounts == false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }
    res.send({ message: "Consulta correcta", status: true, data: bank_accounts })
}

async function searchBankAccounts(id){
    return new Promise((resolve, reject)=>{
        let query = `select * from bank_accounts where id_user = ?`
        connection.query(query,[id],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row)
            }
        })
    })
}

async function insertBankAccounts(req, path_file){
    return new Promise((resolve, reject)=>{
        let create_date = new Date();

        let query = "Insert into bank_accounts values(null, ?, ?,?)"

        connection.query(query,[path_file, create_date,req.body.id_user], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row.insertId)
            }
        })
    })
}

perfil.getUser = async(req, res)=>{
    let provider;
    let user = await getInfoUser(req)

    if(user == false){
        res.send({ status: false, message: "Error de conexion" })
        return;
    }

    if(user.id_role == 3){
        provider = await getInfoProvider(req)
        res.send({ message:"Informacion de Proveedor Correcta", status: true, 
        result: {
            user_name : provider.user_name,
            id_role : provider.id_role,
            phone: provider.phone,
            email: provider.email,
            company_name : provider.company_name,
            rfc : provider.rfc,
        } })
    }else{
        res.send({ message:"Informacion de Usuario Correcta", status: true, result: {
            user_name : user.user_name,
            id_role : user.id_role,
            email: user.email,
        } })
    }
}

perfil.updatePerfil =  (req,res)=>{
    let {id_user,email,phone} = req.body;
    console.log(req.body)
    sql= "update provider_information set phone = ? where id_user=?"
    sql2= "update user set email = ? where id_user=?"
     connection.query(sql2,[email,id_user],(err,row)=>{
         connection.query(sql,[phone,id_user],(err,row)=>{
            res.send(true);
         })
    })
}


async function getInfoUser(req){
    return new Promise((resolve, reject)=>{
        let query = `SELECT * From user where id_user=?`

        connection.query(query,[req.params.id],(err,row)=>{
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

async function getInfoProvider(req){
    return new Promise((resolve,reject)=>{
        let query= "select * from user inner join provider_information on user.id_user = provider_information.id_user where user.id_user=?"
        connection.query(query,[req.params.id],(err, row)=>{
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


module.exports = perfil;