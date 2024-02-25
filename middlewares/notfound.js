
module.exports = (req,res,next)=>{
    res.status(404).json({
        success:false,
        title:'Not Found',
        body:{
            status:404,
            data:{
                msg:'Resource not found',
                value:req.originalUrl,
                path:'route'
            }
        }
    })  
}