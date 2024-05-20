
module.exports = (err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const errorStack = process.env.NODE_ENV==='production'?err.stack:'Contact the site developer.'
    const errorMessage = process.env.NODE_ENV==='production'?err.message:'Something went wrong.'
    res.status(statusCode).json({
        success:false,
        body:{
            title:'Internal Server Error',
            status:statusCode,
            data:{
              errors:[{
                path:err.path,
                value:err.value,
                stack:errorStack,
                msg:errorMessage
              }]
            }
        }
    })
}