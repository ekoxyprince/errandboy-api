
exports.user = (req,res,next)=>{
    if(req.user.role !== 'user'){
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