const router = require('express').Router()
const auth = require('../middlewares/auth');
const {subscriber} = require('../middlewares/role');
const controller = require('../controllers/user')
const upload = require('../middlewares/fileupload')
const {password} = require('../middlewares/validation')

router
.route('/orders')
.get([auth,subscriber],controller.getTotalOrders)

router
.route('/recent_orders')
.get([auth,subscriber],controller.getRecentOrders)

router
.route('/details')
.patch([auth,subscriber],upload.single('image'),controller.updateDetails)

router
.route('/password')
.patch([auth,subscriber],[password],controller.updatePassword)

router
.route('/support')
.post([auth,subscriber],controller.postSupport)


module.exports = router