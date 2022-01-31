const path = require("path")


exports.downloadFile =(req , res)=>{
    let name = []
    let file = req.body.path
    name = file.split(/[\\//]/);

    console.log(path.join(file))
    res.download(file)
}