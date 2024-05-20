const Order = require('../models/order')
const Support = require('../models/support')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const catchAsync = require('../utilities/trycatch')
const {validationResult} = require('express-validator')
const PaymentService = require('../services/payment')
const paymentInstance = new PaymentService()

exports.getRecentOrders = (req,res,next)=>{
    Order
    .find({user:req.user._id}).populate('user').limit(10).sort({_id:-1})
    .then(orders=>{
     res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'orders fetched successfully',orders}}})
    })
    .catch(error=>{
     next(error)
    })
}
exports.getTotalOrders = (req,res,next)=>{
    Order
    .find({user:req.user._id}).populate('user').sort({_id:-1})
    .then(orders=>{
        res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'orders fetched successfully',orders}}})  
    })
    .catch(error=>{
        next(error)
    })
}
exports.updateDetails = (req,res,next)=>{
    const {fullname,state,city,address} = req.body
    const user = req.user
    const file = req.file
    user.fullname = fullname || user.fullname
    user.state = state || user.state
    user.city = city || user.city
    user.address = address || user.address
    if(file&& typeof file !== 'undefined'){
    fs.unlinkSync(`./public${user.image}`)
    user.image = `${file.destination}${file.filename}`.slice(8)   
    }
    user.save()
    .then(user=>{
        res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'Updated successfully',user}}})
    })
    .catch(error=>{
        next(error)
    })
}
exports.updatePassword = catchAsync(async(req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
     return res.status(422).json({success:false,body:{title:'Validation Error',status:422,data:errors}})
    }
    const user = req.user
    const {password,currentPassword} = req.body
   const doMatch = await bcrypt.compare(currentPassword,user.password)
   if(!doMatch){
    return res.status(400).json({success:false,body:{title:'Authentication Error',status:401,data:{path:'password',value:password,location:'body',msg:'Incorrect Password.'}}})
   }
   const hashedPassword = await bcrypt.hash(password,12)
   user.password = hashedPassword
   const updatedUser = await user.save()
   res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:'Updated successfully',user:updatedUser}}})
})
exports.postSupport = (req,res,next)=>{
    const {subject,description} = req.body
    Support.create({
        user:req.user._id,
        subject:subject,
        description:description,
        status:'opened'
    })
    .then(support=>{
        res.status(200).json({success:true,body:{title:'Response Success',status:200,data:{msg:`support ticked created`,support}}})
    })
    .catch(error=>next(error))
}
exports.startPayment = catchAsync(async(req,res,next)=>{
    const {id} = req.body
    // const order = await Order.findById(id)
    // if(!order){
    //     return res.status(400).json({success:false,body:{status:400,title:'Bad Request',data:{msg:'No order found!',value:id,path:'id',location:'body'}}})
    // }
     const response = await paymentInstance.startPayment({
        email:req.user.email,
        full_name:req.user.fullname,
        // amount:order.total,
        amount:400,
        orderId:"83hbdebdv6"
        // orderId:id

     })
     res.status(201).json({success:true,body:{title:'Payment Started',status:201,data:response}})
})
exports.createPayment = catchAsync(async(req,res,next)=>{
    const response = await paymentInstance.createPayment(req.query)
    const newStatus = response.status === 'success'?'completed':'pending'
    const order = await Order.findOne({_id:response.orderId})
    order.status = newStatus
    const newOrder = await order.save()
    res.status(201).json({success:true,body:{title:'Payment Created',status:201,data:{payment:response,order:newOrder}}})
})
exports.getPayment = catchAsync(async(req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({success:false,body:{status:422,title:'Validation Error',data:errors}});
    }
    const response = await paymentInstance.paymentReceipt(req.query)
    res.status(200).json({success:true,body:{title:'Payment Details',status:200,data:response}})
})