const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const errorHandler = require('./middlewares/errorhandler')
const notFoundHandler = require('./middlewares/notfound')

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:!0}))
app.use(bodyParser.json());

app.use('/api/v1/auth',authRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app