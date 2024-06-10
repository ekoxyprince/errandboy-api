const User = require("../models/user");
const Notification = require("../models/notification");
const Order = require("../models/order");
const catchAsync = require("../utilities/trycatch");
const email = require("../helpers/mail");
// const { dispatch } = require("../middlewares/role");

exports.verifyRider = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return res.status(404).json({
      success: false,
      body: {
        title: "Email is empty",
        status: 404,
        data: {
          msg: "Please provide an email address",
        },
      },
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      body: {
        title: "User not found",
        status: 404,
        data: {
          msg: "The user doesn't exist in the database",
        },
      },
    });
  }
  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: "User successfully fetched", user },
    },
  });
});

exports.approveRider = catchAsync(async (req, res, next) => {
  const _id = req.param.id;
  const user = await User.findOne({ _id });

  if (!user) {
    return res.status(404).json({
      success: false,
      body: {
        title: "Response not successful",
        status: 400,
        data: { msg: "User not found" },
      },
    });
  }
  (user.riderStatus = "verified"), (user.role = "dispatch");
  const rider = await user.save();
  try {
    await email(rider.email, "successful verified", "Congratulations...");
  } catch (err) {
    res.status(500).json({
      status: true,
      message: "There was an error trying to send the email please try again",
    });
  }
  res.status(200).json({
    status: true,
    body: {
      title: "Rider approved",
      status: 400,
      data: { msg: "Rider successfully approved!" },
    },
  });
});

exports.UnreadNotifications = catchAsync(async (req, res, next) => {
  const notification = await Notification.find({ unread: true }).populate({
    path: "user",
    select: "role",
    match: { role: "admin" },
  });

  if (!notification) {
    return res.status(200).json({
      status: "success",
      messeage: "No new notification",
    });
  }
  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: "Notification successfully fetched", notification },
    },
  });
});

exports.markNotification = catchAsync(async (req, res, next) => {
  const _id = req.param.id;
  const notification = await Notification.findByIdAndUpdate(_id, {
    unread: false,
  });
  if (!notification) {
    return res.status(404).json({
      success: false,
      body: {
        title: "Notification not found",
        status: 404,
        data: {
          msg: "No unread notification found ",
        },
      },
    });
  }
  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: "Notification successfully read", notification },
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    status: 200,
    data: { msg: "All users", users },
  });
});

// exports.getAllOrders = catchAsync(async (req, res, next) => {
//   const orders = await Order.find();

//   res.status(200).json({
//     success: true,
//     status: 200,
//     data: { msg: "all orders successfully fetched", orders },
//   });
// });

exports.demoteRider = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = User.findByIdAndUpdate(email, {
    role: "user",
    riderStatus: "unverified",
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      body: {
        title: "No rider found",
        status: 200,
        data: { msg: "The rider  is not found" },
      },
    });
  }
  res.status(200).json({
    success: true,
    body: {
      title: "Rider successfully demoted",
      status: 200,
      data: { msg: "Rider removed from rider role", user },
    },
  });
});

// Implement a route for the admin to know the orders processed in a month, week, day, year
// implement a 000000

exports.getYearlyStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        status: "completed",
        dispatchStatus: "delivered",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        NumOrders: { $sum: 1 },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $sort: { NumOrders: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

exports.getMonthlyOrders = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const month = req.params.month * 1;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        status: "completed",
        dispatchStatus: "delivered",
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: true,
    data: {
      totalOrders: orders.length > 0 ? orders[0].totalOrders : 0,
    },
  });
});

exports.getDailyOrders = catchAsync(async (req, res, next) => {
  const date = req.params.date;

  const orders = await Order.find({
    createdAt: date,
    status: "completed",
    dispatchStatus: "delivered",
  });

  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: `Orders for ${date}`, orders },
    },
  });
});
