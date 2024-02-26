
exports.subscriber = (req,res,next)=>{
    const subscriber = ["user","dispatch"]
    const index = subscriber.findIndex(el=>el === req.user.role)
    if(index<0){
        return res.status(403).json({success:false,body:{title:'Forbidden Request',status:403,data:{msg:'Unauthorized request sent.',path:'user_info'}}})
    }
    next()
}
exports.dispatch = (req,res,next)=>{
    if(req.user.role !== 'dispatch'){
        return res.status(403).json({success:false,body:{title:'Forbidden Request',status:403,data:{msg:'Unauthorized request sent.',path:'user_info'}}})
    }
    next()
}
exports.admin = (req,res,next)=>{
    if(req.user.role !== 'admin'){
        return res.status(403).json({success:false,body:{title:'Forbidden Request',status:403,data:{msg:'Unauthorized request sent.',path:'user_info'}}})
    }
    next()
}