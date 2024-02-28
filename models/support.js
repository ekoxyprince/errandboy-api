const {model,Schema} = require("mongoose")

const supportSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    subject:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})

module.exports = model("Support",supportSchema)