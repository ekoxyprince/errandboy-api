const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const catchAsync = require('../utilities/trycatch')
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const mail = require('../helpers/mail');
const user = require('../models/user');
const { jwt_secret,server } = require('../config');
const {promisify} = require('util')
const crypto = require('crypto')

exports.setUserDetails = catchAsync(async(req,res,next)=>{
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    return res.status(422).json({success:false,body:{title:'Validation Error',status:422,data:errors}})
   }
   const {email,fullname,password} = req.body
   const hashedPassword = await bcrypt.hash(password,12)
   const createdUser = await User.create({email:email,fullname:fullname,password:hashedPassword,role:'user',image:'/static/default.png'})
   res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{user:createdUser,msg:'Account created successfully.'}}})
})
exports.signin = catchAsync(async(req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({success:false,body:{title:'Validation Error',status:422,data:errors}})
    }
    const {email,password} = req.body
    const existingUser = await User.findOne({email:email})
    if(!existingUser || existingUser.role === 'admin'){
    return res.status(400).json({success:false,body:{title:'Authentication Error',status:401,data:{path:'email',value:email,location:'body',msg:'No user found.'}}}) 
    }else if(!await bcrypt.compare(password,existingUser['password'])){
    return res.status(400).json({success:false,body:{title:'Authentication Error',status:401,data:{path:'password',value:password,location:'body',msg:'Incorrect Password.'}}})
    }
    const accessToken = jwt.sign({id:existingUser._id},jwt_secret)
    res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'Signin was successful',user:existingUser,accessToken}}})
})
exports.forgotPassword = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({success:false,body:{title:'Validation Error',status:422,data:errors}})
    }
    const {email} = req.body
    User.findOne({email:email})
    .then(user=>{
     if(!user){
        return res.status(401).json({success:false,body:{title:'Unauthorized request',status:401,data:{path:'email',location:'body',value:email,msg:'No user found!'}}})
     }
     return promisify(crypto.randomBytes)(32)
     .then(buffer=>{
        user.resetToken = buffer.toString('hex')
        user.resetTokenExpires = Date.now()+1800000
        return user.save()
     })
     .then(updatedUser=>{
        mail(email,updatedUser.fullname,'Reset Link',`${server}/api/v1/auth/reset_password/${updatedUser.resetToken}`)
        res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'Reset link has been sent',user:updatedUser}}})  
     })
    })
    .catch(error=>{
        next(error)
    })
}
exports.resetPassword = (req,res,next)=>{
    const {token} = req.params
    User.findOne({resetToken:token,resetTokenExpires:{$gt:Date.now()}})
    .then(user=>{
       if(!user){
        return res.status(400).json({success:false,body:{title:'Bad Request',status:400,data:{msg:'Invalid token please try again.',path:'token',value:token,location:'params'}}})  
       }
       res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'Request successful.',user:user}}})
    })
    .catch(error=>{
        next(error)
    })
}
exports.setNewPassword = catchAsync(async(req,res,next)=>{
    const {token,password} = req.body
    const user =  await User.findOne({resetToken:token,resetTokenExpires:{$gt:Date.now()}})
       if(!user){
        return res.status(400).json({success:false,body:{title:'Bad Request',status:400,data:{msg:'Invalid token please try again.',path:'token',value:token,location:'params'}}})  
       }
    const hashedPassword = await bcrypt.hash(password,12)
    user.password = hashedPassword
    const updatedUser = await user.save()
    mail(updatedUser.email,updatedUser.fullname,'Password changed','Password changed successfully')
    res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'Password has been changed.',user:updatedUser}}})
})
