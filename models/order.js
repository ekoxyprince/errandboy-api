const {model,Schema} = require('mongoose')

const orderSchema = new Schema({
    fromAddress:{
        type:String,
        required:true
    },
    toAddress:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true
    },
    dispatchStatus:{
        type:String,
        required:true
    }
})

module.exports = model('Order',orderSchema)