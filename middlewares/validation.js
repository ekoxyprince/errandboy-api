const User = require('../models/user')
const {check,body} = require('express-validator')

exports.user = check('email')
.notEmpty().withMessage('Kindly provide your email address.')
.isEmail().withMessage('Kindly provide a valid email address.')
.custom((email,{req})=>{
    return User.findOne({email:email})
    .then(user=>{
      if(user){
       return Promise.reject('The email address exists try using another email.')
      }
    })
})
.normalizeEmail();
exports.email = check('email')
.notEmpty().withMessage('The email address is missing from the request body')
.isEmail().withMessage('Kindly provide a valid email address.')
.normalizeEmail();
exports.password = body('password')
.notEmpty().withMessage('Password field is required')
.isLength({min:8,max:20}).withMessage('Password must not be less than 8 or greater than 20')
.matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
.withMessage('Password must contain atleast one lowercase, one uppercase, one digit and one special character')
.trim();
exports.fullname = body('fullname')
.notEmpty().withMessage('Kindly provide your fullname as field cannot be empty.')
.custom((value,{req})=>{
  if(/[0-9\d@$!%*?&]/.test(value)){
    throw new Error("Invalid name. kindly ensure the name provided is valid must contain only alphabets") 
  }else{
    return !0
  }
})
