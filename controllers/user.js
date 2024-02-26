const Order = require('../models/order')
const fs = require('fs')

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
        res.status(200).json({success:true,test:{file:req.file,files:req.file,body:req.body},body:{title:'Response Success',status:200,data:{msg:'Updated successfully',user}}})
    })
    .catch(error=>{
        next(error)
    })
}