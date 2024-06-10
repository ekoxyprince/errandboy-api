const { model, Schema } = require("mongoose");

const orderSchema = new Schema({
  paymentDetails: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },
  status: {
    type: String,
    required: true,
  },
  dispatchStatus: {
    type: String,
    required: true,
  },
  trackingDetails: {
    startLocation: {
      address: String,
      cords: {
        latitude: Number,
        longitude: Number,
      },
    },
    destination: {
      address: String,
      cords: {
        latitude: Number,
        longitude: Number,
      },
    },
    dispatchLocation: {
      address: String,
      cords: {
        latitude: Number,
        longitude: Number,
      },
    },
  },
  amount: Number,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userDetails: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  riderDetails: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Order", orderSchema);

// emmbed notificationn to the user model
// push notification with service aand webworkers
