const {model,Schema} = require('mongoose')

const userSchema = new Schema({
   email:{
      type:String,
      required:true,
      unique:true
   },
   fullname:String,
   password:{
      type:String,
      required:true
   },
   resetToken:String,
   resetTokenExpires:Date,
   otpToken:String,
   otpTokenExpires:Date,
   emailVerified:{
      default:false,
      type:Boolean
   },
   role:{
      type:String,
      required:true
   }
})
module.exports = model('User',userSchema)