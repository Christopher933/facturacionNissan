const connection = require("../database");

notification = [];

notification.insertUserNotification = (params) =>{
    let query = `call proc_insert_user_notification (?,?,?,?)`
    let date = new Date();
    var temp_string = date.toISOString();
    let format_date = temp_string.split("T");
    connection.query(query, [params.title_notification, params.message_user_notification, format_date[0], params.id_user], (err, row)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Query correcto")
        }
    })
}

notification.insertAdminNotification = async (params) =>{
    let query = `call proc_insert_admin_notification (?,?,?,?)`
    let date = new Date();
    var temp_string = date.toISOString();
    let format_date = temp_string.split("T");
    let users = [];
    users = await getUsersAdmin();
    users.forEach(element => {
        connection.query(query, [params.title_notification, params.message_admin_notification, format_date[0], element.id_user], (err, row)=>{
            if(err){
                console.log(err)
            }else{
                console.log("Query correcto")
            }
        })
    });
}

notification.getNotifications = async (req,res) =>{
    let notifications = await getAllNotifications(req);
    if(notifications == false){
        return res.send({ message: "Error de conexion", status: false })
    }
    let total = await getCountNotifications(req)

    res.send({ message: "Consulta Correcta", status: true, result: notifications, total: total })
}

notification.getNotitficationsNoRead = async (req,res) => {
    let query = `call get_count_notifications_read (?)`
    connection.query(query, [req.body.id_user], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: 'Error de conexion', status: false })
        }else{
            res.send({ message: 'Consulta Correcta', status: true, total: row[0][0].total})
        }
    })
}

notification.readNotification = (req, res) =>{
    console.log(req.body)
    let query = `call proc_read_notification(?,?)`
    connection.query(query,[req.body.id_user, req.body.id_notification], (err, row)=>{
        if(err){
            console.log(err)
            res.send({ message: "Error de conexion", status: false })
        }else{
            res.send({ message: "Consulta Corecta", status: true })
        }
    })
}

function getAllNotifications(req){
    return new Promise((resolve,reject)=>{
        let limit = req.body.limit;
        let page = limit * (req.body.page - 1)
        let query = `call get_notifications (?,?,?,?,?)`
        connection.query(query, [req.body.id_user, req.body.parameter, req.body.date,limit,page], (err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0])
            }
        })
    })
}

function getCountNotifications(req){
    return new Promise((resolve,reject)=>{
        let query = `call get_count_notifications (?,?,?)`
        connection.query(query, [req.body.id_user, req.body.parameter, req.body.date], (err,row)=>{
            if(err){
                console.log(err)
                resolve(false)
            }else{
                resolve(row[0][0].total)
            }
        })
    })
}

async function getUsersAdmin(){
    return new Promise((resolve, reject)=>{
        let query = `call proc_get_users_admin`
        connection.query(query,(err, row)=>{
            if(err){
                console.log(err)
                resolve(false);
            }else{
                console.log(row[0])
                resolve(row[0])
            }
        })
    })
}

module.exports = notification;