const router = require('express').Router()
const auth = require('../middlewares/auth');
const {subscriber} = require('../middlewares/role');
const controller = require('../controllers/user')
const upload = require('../middlewares/fileupload')

router
.route('/orders')
.get([auth,subscriber],controller.getTotalOrders)

router
.route('/recent_orders')
.get([auth,subscriber],controller.getRecentOrders)

router
.route('/details')
.patch([auth,subscriber],upload.single('image'),controller.updateDetails)


module.exports = router