const mongoose = require('mongoose');

const connectToDb = async(uri,dbName)=>{
    return mongoose.connect(uri,{
        dbName:dbName
    })
}
module.exports = connectToDb