const { query } = require("../database.js");
const connection = require("../database.js");
const plantilla = require("../plantillas/plantilla");
const mailer = require("../shared/mailer")
const pdf = require("html-pdf")
const path = require("path")
const fs = require("fs")
const multer = require('multer');



perfil = [];
let type_file =''
let file_ext = ''

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        for(const [clave, valor] of Object.entries(req.body)){
            if(clave == 'type_file'){
                type_file = valor;
            }
        }
        let array = file.mimetype.split("/")
        file_ext = array [1]


        if(type_file == "opinion_cumplimiento"){
            return cb(null, path.join(__dirname,"../public/opinion_cumplimiento"))
        }
        
        if(type_file == "CuentasBancarias"){
            return cb(null, path.join(__dirname,"../public/cuentas_bancarias"))
        }

        if(type_file == "ActaConstitutiva"){
            return cb(null, path.join(__dirname,"../public/acta_constitutiva"))
        }

        if(type_file == "ComprobanteDeDomicilio"){
            return cb(null, path.join(__dirname,"../public/comprobante_domicilio"))
        }

        if(type_file == "INE"){
            return cb(null, path.join(__dirname,"../public/INE"))
        }

        if(type_file == "CedulaFiscal"){
            return cb(null, path.join(__dirname,"../public/cedula_fiscal"))
        }

        if(type_file == "DatosRepresentanteLegal"){
            return cb(null, path.join(__dirname,"../public/datos_representante_legal"))
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-`+ type_file + "." + file_ext)
    }
})
const upload = multer({ storage: storage })
perfil.upload = upload.single('archivo')




perfil.uploadFilesPerfil = async (req, res) => {
    let path_file = req.file.path;
    let file = await insertFilePerfil(req, path_file)
    if(file == false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }
    res.send({ message: "Documento ingresado correctamente", status: true })
}

perfil.getFilesPerfil = async (req,res) =>{
    let files_perfil = await searchFilesPerfil(req.body.id_user)
    if(files_perfil == false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }
    res.send({ message: "Consulta correcta", status: true, result: files_perfil })
}

perfil.updateFilePerfil = async(req, res) =>{
    let path_file = req.file.path;
    let update_file = await updateFilePerfil(req, path_file)

    if(update_file == false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }
    res.send({ message: "Documento Actualizado", status: true})
}

function updateFilePerfil(req, path_file){
    return new Promise((resolve, reject )=>{
        let date = new Date()
        let query = `update perfil_files set path_file = ?, create_date = ?, month = ?, year = ?
        where id_perfil_files = ?`

        connection.query(query, [path_file, date, (date.getMonth() + 1), date.getFullYear(), req.body.id_perfil_files ], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}

async function searchFilesPerfil(id){
    return new Promise((resolve, reject)=>{
        let query = `SELECT * FROM facturacionnissan.perfil_files right join file_type on
        perfil_files.id_file_type = file_type.id_file_type 
        union
        SELECT * FROM facturacionnissan.perfil_files left join file_type on
        perfil_files.id_file_type = file_type.id_file_type where id_user = 3`
        connection.query(query,[id],(err, row)=>{
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

async function insertFilePerfil(req, path_file){
    return new Promise((resolve, reject)=>{
        let date = new Date();
        let query = "Insert into perfil_files values(null, ?, ?, ? , ?, ?, ?, ?)"
        connection.query(query,[req.body.id_file_type,path_file, date, 1 ,req.body.id_user,(date.getMonth()+1), date.getFullYear()], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row.insertId)
            }
        })
    })
}


perfil.uploadMonthlyCompliance = async (req, res) =>{
    let path_file = req.file.path;
    let date = new Date();

    if(req.body.month != (date.getMonth() + 1)){
        return res.send({ message: "Fecha incorrecta, favor de elegir el mes actual", status: false })
    }

    let monthly_compliance = await insertMonthlyCompliance(req, path_file)
    if(monthly_compliance == false){
        res.send({ message: "Error de conexion", status: false })
        return;
    }
    res.send({ message: "Cumplimiento del mes ingresado correctamente correctamente", status: true })
}

/* function existMonthlyCompliance(month, year){
    return new Promise((resolve, reject) =>{
        let query = `select * from monthly_compliance where year=${year} and month = ${month}`
        connection.query(query, (err, row)=>{
            if(err){
                resolve(false)
            }else{
                resolve(row[0])
            }
        })
    })
} */

function insertMonthlyCompliance(req, path_file){
    return new Promise((resolve, reject)=>{
        let create_date = new Date();
        let query = "Insert into monthly_compliance values(null, ?, ?,?, ?, ?, 1)"

        connection.query(query,[path_file, create_date, req.body.id_user,req.body.month, create_date.getFullYear()], (err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row.insertId)
            }
        })
    })
}

function getLastMonthlyCompliance(req){
    return new Promise((resolve,reject)=>{
        let date = new Date()
        let year = date.getFullYear();
        let query =`select * from monthly_compliance inner join
        status_file on monthly_compliance.id_status_file = status_file.id_status_file
        where id_user = ${req.body.id_user} and year = ${ year } order by month desc limit 1`

        connection.query(query,(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0])
            }
        })
    })
}

perfil.getLastMonthlyCompliance= async(req, res) =>{
    let date = new Date();
    let last_monthly_compliance = await getLastMonthlyCompliance(req)

    if(last_monthly_compliance == false || last_monthly_compliance == undefined){
        return res.send({ message: "Error de conexion", status: false , result:null})
    }

    if(last_monthly_compliance.id_status_file == 1 && last_monthly_compliance.month < (date.getMonth()+1)){
        let update_status = await UpdateStatusFile(last_monthly_compliance.id_monthly_compliance)
        if(update_status == false){
            return res.send({ message: "Error de conexion", status: false })
        }else{
            last_monthly_compliance = await getLastMonthlyCompliance(req);
        }
    }
    if(last_monthly_compliance == false || last_monthly_compliance == undefined){
        return res.send({ message: "Error de conexion", status: false , result:null})
    }

    res.send({ message: "Consulta correcta", status: true, result: last_monthly_compliance })
}

function UpdateStatusFile(id_monthly_compliance){
    return new Promise((resolve,reject)=>{
        let query = `update monthly_compliance set id_status_file = 2 where id_monthly_compliance = ${id_monthly_compliance}`
        connection.query(query,(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}

perfil.updateMonthlyCompliance = async (req, res) =>{
    let path_file = req.file.path;

    let update_compliance = await updateMonthlyCompliance(req, path_file);

    if(update_compliance == false){
        return res.send({ message: "Error de conexion", status:false })
    }
    res.send({ message: "Documento actualizado", status:true })
}

function updateMonthlyCompliance(req, file_url){
    let date = new Date()
    console.log(req.body)
    console.log(file_url)
    return new Promise((resolve, reject)=>{
        let date = new Date()
        let query = `update monthly_compliance set 
        file_compliance_url = ?, 
        create_date_compliance = ?,
        month = ?,
        id_status_file = ?
        where id_user = ? and id_monthly_compliance = ?`

        connection.query(query,[file_url,date,date.getMonth() + 1,1,req.body.id_user, req.body.id_monthly_compliance],(err, row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                console.log(true)
                resolve(true)
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
            id_provider: provider.id_provider,
            id_regimen: provider.id_regimen
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