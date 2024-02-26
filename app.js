const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const errorHandler = require('./middlewares/errorhandler')
const notFoundHandler = require('./middlewares/notfound')
const client = require('./config').client
const logger = require('morgan')
const helmet = require('helmet')

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:!0}))
app.use(bodyParser.json());
app.use(cors({origin:client}))
app.use(logger('dev'))
app.use(helmet())

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/user',userRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app