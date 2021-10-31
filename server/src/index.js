const express= require("express");
const app = express();
const cors = require("cors");
const morgan= require("morgan");
const db= require ("./database")

//settings
app.set("port", process.env.PORT || 3000);

//midleWares
app.use(morgan("dev"));
app.use(express.json())
app.use(cors());

//global variables

//router
app.use("/api",require("./routes/index.js"))

//public
app.use(express.static("./src/public"))

//start server
app.listen(app.get("port"),()=>{
    console.log("puerto 3000")
})