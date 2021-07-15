const express= require("express");
const app = express();
const morgan= require("morgan");

//settings
app.set("port", process.env.PORT || 3000);

//midleWares
app.use(morgan("dev"));


//start server
app.listen(app.get("port"),()=>{
    console.log("puerto 3000")
})