const Order = require("../models/order");
const Support = require("../models/support");
const User = require("../models/user");
const Notification = require("../models/notification");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utilities/trycatch");
const { validationResult } = require("express-validator");
const PaymentService = require("../services/payment");
const paymentInstance = new PaymentService();

exports.getRecentOrders = (req, res, next) => {
  Order.find({ userDetails: req.user._id })
    .populate("userDetails")
    .populate("paymentDetails")
    .limit(10)
    .sort({ _id: -1 })
    .then((orders) => {
      res.status(200).json({
        success: true,
        body: {
          title: "Response Success",
          status: 200,
          data: { msg: "orders fetched successfully", orders },
        },
      });
    })
    .catch((error) => {
      next(error);
    });
};
exports.getTotalOrders = (req, res, next) => {
  Order.find({ userDetails: req.user._id })
    .populate("userDetails","fullname,email,phone")
    .populate("paymentDetails","status,amount")
    .sort({ _id: -1 })
    .then((orders) => {
      res.status(200).json({
        success: true,
        body: {
          title: "Response Success",
          status: 200,
          data: { msg: "orders fetched successfully", orders },
        },
      });
    })
    .catch((error) => {
      next(error);
    });
};
exports.updateDetails = (req, res, next) => {
  const { fullname, state, city, address, phone } = req.body;
  const user = req.user;
  const file = req.file;
  user.fullname = fullname || user.fullname;
  user.state = state || user.state;
  user.city = city || user.city;
  user.address = address || user.address;
  user.phone = phone || user.phone;
  if (file && typeof file !== "undefined") {
    fs.unlinkSync(`./public${user.image}`);
    user.image = `${file.destination}${file.filename}`.slice(8);
  }
  user
    .save()
    .then((user) => {
      res.status(200).json({
        success: true,
        body: {
          title: "Response Success",
          status: 200,
          data: { msg: "Updated successfully", user },
        },
      });
    })
    .catch((error) => {
      next(error);
    });
};
exports.updatePassword = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      body: { title: "Validation Error", status: 422, data: errors },
    });
  }
  const user = req.user;
  const { password, currentPassword } = req.body;
  const doMatch = await bcrypt.compare(currentPassword, user.password);
  if (!doMatch) {
    return res.status(400).json({
      success: false,
      body: {
        title: "Authentication Error",
        status: 401,
        data: {
          path: "password",
          value: password,
          location: "body",
          msg: "Incorrect Password.",
        },
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: "Updated successfully", user: updatedUser },
    },
  });
});
exports.postSupport = (req, res, next) => {
  const { subject, description } = req.body;
  Support.create({
    user: req.user._id,
    subject: subject,
    description: description,
    status: "opened",
  })
    .then((support) => {
      res.status(200).json({
        success: true,
        body: {
          title: "Response Success",
          status: 200,
          data: { msg: `support ticked created`, support },
        },
      });
    })
    .catch((error) => next(error));
};

exports.createOrder = catchAsync(async (req, res) => {
  const body = req.body;
  const user = req.user;
  const order = await Order.create({
    status: "processing",
    dispatchStatus: "active",
    amount: body.amount,
    userDetails: user._id,
    trackingDetails: {
      startLocation: {
        address: body.startLocation.address,
        cords: body.startLocation.cords,
      },
      destination: {
        address: body.destination.address,
        cords: body.destination.cords,
      },
    },
  });
  res.status(201).json({
    success: true,
    body: {
      title: "Payment Started",
      status: 201,
      data: { msg: "Order created", order },
    },
  });
});
exports.requestService = catchAsync(async (req, res) => {
  const body = req.body; // how would the the rider get the orderID
  const user = req.user;
  const order = await Order.findById(body.orderId);
  if (order.dispatchStatus != "active")
    return res.status(400).json({
      success: false,
      body: {
        status: 400,
        title: "Bad Request",
        data: {
          msg: "Order not available",
          value: id,
          path: "id",
          location: "body",
        },
      },
    });
  order.dispatchStatus = "progress";
  order.riderDetails = user._id;
  order.trackingDetails.dispatchLocation = {
    address: body.address,
    cords: body.cords,
  };
  await order.save();
  res.status(201).json({
    success: true,
    body: {
      title: "Request successful",
      status: 200,
      data: { msg: "Order assigned to you." },
    },
  });
});
exports.startPayment = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      success: false,
      body: {
        status: 400,
        title: "Bad Request",
        data: {
          msg: "No order found!",
          value: id,
          path: "id",
          location: "body",
        },
      },
    });
  }
  const response = await paymentInstance.startPayment({
    email: req.user.email,
    full_name: req.user.fullname,
    amount: order.amount,
    orderId: id,
  });
  res.status(201).json({
    success: true,
    body: { title: "Payment Started", status: 201, data: response },
  });
});
exports.createPayment = catchAsync(async (req, res, next) => {
  const response = await paymentInstance.createPayment(req.query);
  const newStatus = response.status === "success" ? "completed" : "pending";
  const order = await Order.findOne({ _id: response.orderId });
  order.status = newStatus;
  order.paymentDetails = response._id;
  const newOrder = await order.save();
  res.status(201).json({
    success: true,
    body: {
      title: "Payment Created",
      status: 201,
      data: { payment: response, order: newOrder },
    },
  });
});

exports.getPayment = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      body: { status: 422, title: "Validation Error", data: errors },
    });
  }
  const response = await paymentInstance.paymentReceipt(req.query);
  res.status(200).json({
    success: true,
    body: { title: "Payment Details", status: 200, data: response },
  });
});

exports.upgradeAccount = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user.phone) {
    throw new Error(
      "Please update your details before applying for rider role"
    );
  }
  user.riderStatus = "pending";
  const updatedUser = await user.save();

  try {
    // await email(
    //   user.email,
    //   user.fullname,
    //   user.phone,
    //   "Steps to follow",
    //   "visit the head office"
    // );
  } catch (err) {
 throw new Error(err)
  }

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    return res.statu(400).json({
      success: false,
      title: "No admin found",
      data: { msg: "NO admin found" },
    });
  }

  await Notification.create({
    title: "New rider application",
    user: admin._id,
    content: `A new rider application with the following details
    ${user.fullname}
    ${user.phone}`,
  });
  res.status(200).json({
    success: true,
    title: "Successful account upgrade",
    data: {
      user: updatedUser,
      msg: "User applied for account upgrade",
    },
  });
});

exports.checkNewOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.find({
    dispatchStatus: "active",
    status: "completed",
  });

  if (!newOrder) {
    return res.status(400).json({
      success: false,
      body: {
        status: 400,
        title: "Bad Request",
        data: {
          msg: "No new Order available",
        },
      },
    });
  }

  res.status(200).json({
    success: true,
    body: { title: "New Order available", status: 200, data: newOrder },
  });
});

exports.markOrderByRider = catchAsync(async (req, res, next) => {
  // upload a signed signature of the reciever
  const id = req.param.id;
  const order = await Order.findById(id);
  const user = req.user;

  if (user.role === "dispatch") order.dispatchStatus = "delivered";
  else if (user.role === "user") order.status = "recieved";
  await order.save();

  if (!order) {
    return res.status(404).json({
      success: false,
      body: {
        title: "Order not found",
        status: 404,
        data: { msg: "Order not found" },
      },
    });
  }

  res.status(200).json({
    success: true,
    body: {
      title: "Order delivered successfully",
      status: 201,
      data: { msg: "Order delivered successfully" },
    },
  });
});

exports.getAllUndeliveredOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    status: "completed",
    dispatchStatus: "progress",
  }).limit(5);

  if (!orders) {
    return res.status(404).json({
      success: false,
      body: {
        title: "Order not found",
        status: 404,
        data: { msg: "Order not found" },
      },
    });
  }

  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: "orders fetched successfully", orders },
    },
  });
});
exports.getOrderById = catchAsync(async(req,res)=>{
  const {id} = req.params
  const order = await Order
  .findOne({_id:id})
  .populate("userDetails","fullname email phone")
  .populate("paymentDetails","status amount")
  .populate("riderDetails","fullname email phone")
  res.status(200).json({
    success: true,
    body: {
      title: "Response Success",
      status: 200,
      data: { msg: "order fetched successfully", order },
    }, 
  })

})
exports.getAllOrders = catchAsync(async(req,res)=>{
  const {type} = req.query
  const query = {}
  if(type && type != "all"){
   query['dispatchStatus'] = type =="pending"?"progress":"delivered"
  }
  const orders  = await Order.find(query)
  .populate("userDetails","fullname email phone")
  .populate("paymentDetails","status amount")
  .populate("riderDetails","fullname email phone")
  res.status(200).json({
    success:true,
    body:{
      title:"Response successful",
      status:200,
      data:{msg:"Orders fetched",orders}
    }
  })

})
exports.getNotification = catchAsync(async(req,res)=>{
  res.status(200).json({
    success:true,
    body:{
      title:"Response successful",
      status:200,
      data:{msg:"Notifications fetched",notifications:req.user.notifications}
    }
  })

})