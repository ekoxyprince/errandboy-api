const router = require("express").Router();
const auth = require("../middlewares/auth");
const { subscriber, dispatch } = require("../middlewares/role");
const controller = require("../controllers/user");
const upload = require("../middlewares/fileupload");
const { password } = require("../middlewares/validation");

router.route("/orders").get([auth, subscriber], controller.getTotalOrders);

router
  .route("/recent_orders")
  .get([auth, subscriber], controller.getRecentOrders);

router
  .route("/details")
  .patch([auth, subscriber], upload.single("image"), controller.updateDetails);

router
  .route("/password")
  .patch([auth, subscriber], [password], controller.updatePassword);

router.route("/support").post([auth, subscriber], controller.postSupport);
router
  .route("/order")
  .get([auth, subscriber])
  .post([auth, subscriber], controller.createOrder);
router
  .route("/payment")
  .get([auth], controller.createPayment)
  .post([auth], controller.startPayment);
router.route("/payment_details").get([auth], controller.getPayment);
router
  .route("/dispatch_request")
  .post([auth, dispatch], controller.requestService);

///////
router.route("/new_order").get([auth, dispatch], controller.checkNewOrder);
router
  .route("/mark_delivery/:id")
  .patch([auth, dispatch, subscriber], controller.markOrderByRider);
router
  .route("/uncompleted_orders")
  .get([auth, subscriber], controller.getAllUndeliveredOrder);
router
  .route("/upgrade_account")
  .patch([auth, subscriber], controller.upgradeAccount);

module.exports = router;
