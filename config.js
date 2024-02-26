const dotenv = require('dotenv').config()

module.exports = {
    port:process.env.PORT,
    database_url:process.env.NODE_ENV ==='development'?
    process.env.LOCAL_DATABASE_URL:
    process.env.REMOTE_DATABASE_URL,
    database_name:process.env.DATABASE_NAME,
    email_user:process.env.EMAIL_USER,
    email_pass:process.env.EMAIL_PASS,
    email_server:process.env.EMAIL_SERVER,
    email_port:process.env.EMAIL_PORT,
    jwt_secret:process.env.JWT_SECRET,
    server:process.env.NODE_ENV ==='development'?
    process.env.LOCAL_SERVER:
    process.env.DEPLOYED_SERVER,
    client:process.env.CLIENT
}