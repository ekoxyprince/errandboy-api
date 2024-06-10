const router = require("express").Router();
const controller = require("../controllers/admin");
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/role");

router.route("/verify_rider").post([auth, admin], controller.verifyRider);
router
  .route("/approve_rider/:id")
  .patch([auth, admin], controller.approveRider);
router
  .route("/unread_notification")
  .get([auth, admin], controller.UnreadNotifications);
router
  .route("/mark_notification/:id")
  .patch([auth, admin], controller.markNotification);
router.route("/get_all_users").get([auth, admin], controller.getAllUsers);
router.route("/demote_rider").patch([auth, admin], controller.demoteRider);
router
  .route("/getYearlyStats/:year")
  .get([auth, admin], controller.getYearlyStats);
router
  .route("/getMonthlyStats/:year/:month")
  .get([auth, admin], controller.getMonthlyOrders);
router
  .route("/getDailyOrders/:date")
  .get([auth, admin], controller.getDailyOrders);

module.exports = router;
