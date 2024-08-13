const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: String,
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpires: Date,
  otpToken: String,
  otpTokenExpires: Date,
  emailVerified: {
    default: false,
    type: Boolean,
  },
  role: {
    type: String,
    required: true,
  },
  image: String,
  city: String,
  state: String,
  address: String,
  phone: {
    type: Number,
    unique: true,
  },
  accountNumber: Number,
  accountName: String,
  bankName: String,
  riderStatus: {
    type: String,
    default: "unverified",
    enum: ["verified", "unverified", "pending"],
  },
  notifications:[
    {
      title:String,
      message:String,
      createdAt:String,
      isSeen:{
        type:Boolean,
        default:false
      }
    }
  ]
});
module.exports = model("User", userSchema);
