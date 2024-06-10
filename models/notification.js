const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  unread: {
    type: Boolean,
    default: true,
  },
  // type: String,
  content: String,
  // recipients: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
