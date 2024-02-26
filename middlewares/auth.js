const jwt = require('jsonwebtoken');
const {jwt_secret} = require('../config');
const {promisify} = require('util');
const User = require('../models/user')

module.exports = async(req,res,next)=>{
    try {
        const token = req.headers['authorization']&&req.headers['authorization'].split(" ")[1]
        const decoded = await promisify(jwt.verify)(token,jwt_secret)
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(401).json({success:false,body:{title:'Authentication Error',status:401,data:{msg:'Invalid authentication creditials',path:'jsonwebtoken',value:token,location:'headers'}}})
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}