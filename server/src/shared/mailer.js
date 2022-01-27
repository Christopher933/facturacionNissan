var nodemailer = require('nodemailer');
const fs = require("fs")

exports.sendEmail = async( mailOptions ) =>{
  let archivo;
    const transporter = nodemailer.createTransport({
        service: 'gmail', //al usar un servicio bien conocido, no es necesario proveer un nombre de servidor.
        auth: {
          user: 'christopher.sandoval93@gmail.com',
          pass: 'xqtajmfbbapfqcrd'
        },
      })
  
      console.log("sending email", mailOptions);
      transporter.sendMail(mailOptions, function (error, info) {
        console.log("senMail returned!");
        if (error) {
          console.log("ERROR!!!!!!", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
}