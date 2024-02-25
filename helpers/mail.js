const nodemailer = require('nodemailer')
const config = require('../config')

const transporter = nodemailer.createTransport({
    tls:{
        rejectUnauthorized:false
    },
    auth:{
        user:config.email_user,
        pass:config.email_pass
    },
    host:config.email_server,
    port:config.email_port,
    secure:true
})

module.exports = async(to,name,subject,message)=>{
    try {        
    const emailInfo = await transporter.sendMail({
           from:`"Errand Boy"<${config.email_user}>`,
           to:to,
           text:`Errand Boy Delivery`,
           subject:subject,
           html:`<div style="color:green;">${message}<div>`
       })
    console.log(emailInfo)
    } catch (error) {
      console.log(error)  
    }
}