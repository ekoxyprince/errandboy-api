const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const errorHandler = require('./middlewares/errorhandler')

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:!0}))
app.use(bodyParser.json());

app.use('/api/v1/auth',authRoutes)
app.use(errorHandler)

module.exports = app