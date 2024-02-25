const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')
const {user,email,fullname,password} = require('../middlewares/validation')

router
.route('/signup')
.post([user,fullname,password],controller.setUserDetails)
router
.route('/signin')
.post([email,password],controller.signin)
router
.route('/forgot_password')
.post([email],controller.forgotPassword)
router
.route('/reset_password/:token')
.get(controller.resetPassword)
router
.route('/reset_password')
.patch([password],controller.setNewPassword)

module.exports = router