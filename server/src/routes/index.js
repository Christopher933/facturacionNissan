const express = require ("express");
const router = express.Router();
const connection = require("../database.js")
const authController= require("../controllers/authController.js");
const perfilController = require("../controllers/perfilController");
const userController = require("../controllers/userController.js");
const uploadController =require("../controllers/uploadController.js")
const statusFacturas = require ("../controllers/statusFacturaController");
const contrarecibo = require ("../controllers/contrarecibo.controller")
const pago = require("../controllers/pago.controller")
const filter = require("../controllers/filters")
const empresa = require("../controllers/empresas")

const download = require("../controllers/downloadFile.controller")
router.post("/auth",authController.authentication);

router.get("/perfil/:id",perfilController.getUser)

router.post("/getAllUsers",userController.getAllUsers)

router.post("/updateUser",userController.updateUser)

router.post("/update_profile",perfilController.updatePerfil)

router.post("/insert_user",userController.insertUser)

router.post("/upload_file",uploadController.upload,uploadController.uploadFile);

router.post("/get_facturas", statusFacturas.getFacturas)

router.post("/downloadArchive",download.downloadFile)

router.post("/sendContrarecibo", contrarecibo.sendContrarecibo)

router.post("/downloadContrarecibo", contrarecibo.downloadContarecibo)

router.post("/resendContrarecibo", contrarecibo.resendContrarecibo)

router.post("/insertPayment",pago.upload,pago.sendPago)

router.post("/downloadPayment",pago.downloadPayment)

router.post("/uploadBankAccounts",perfilController.upload,perfilController.uploadBankAccounts)

router.get("/getBankAccounts/:id", perfilController.getBankAccounts)

router.post("/addEnterprise", empresa.addEnterprise)

router.post("/getEnterprises", empresa.getAllEnterprises)

router.post("/updateEnterprise", empresa.updateEnterprise)

router.post("/addBranch", empresa.addBranch);

router.post("/getAllBranchs", empresa.getAllBranchs)

router.post("/updateBranch", empresa.updateBranch)


module.exports = router;