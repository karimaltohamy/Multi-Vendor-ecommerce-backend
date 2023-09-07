const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your couponCode name!"],
  },
  value: {
    type: Number,
    required: [true, "Please enter your couponCode value!"],
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  selectedProduct: {
    type: String,
    required: [true, "Please enter your couponCode min amount!"],
  },
  shop: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("CouponCode", couponCodeSchema);
