const {port,database_name,database_url} = require('./config')
const app =require('./app')
const Server =  require('http').createServer(app)
const connectToDb = require('./utilities/database')

connectToDb(database_url,database_name)
.then(connected=>{
    console.log('connected to database');
    return connected
})
.then(connected=>{
    Server.listen(port,()=>{
        console.log(`Listening on port ${port}`)
})
})
.catch(error=>{
    console.log(error)
})