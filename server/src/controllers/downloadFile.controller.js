const path = require("path")


exports.downloadFile =(req , res)=>{
    let name = []
    console.log("entre",req.body.path)
    let file = req.body.path
    name = file.split(/[\\//]/);

    console.log("este",file)
    console.log(path.join(file))
    res.download(file)
}