const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your event product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your event product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your event product category!"],
  },
  tages: {
    type: String,
    required: [true, "Please enter your event product tages!"],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter your event product originalPrice!"],
  },
  priceDiscount: {
    type: Number,
    required: [true, "Please enter your event product priceDiscount!"],
  },
  productStock: {
    type: Number,
    required: [true, "Please enter your event product productStock!"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "running",
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", EventSchema);
