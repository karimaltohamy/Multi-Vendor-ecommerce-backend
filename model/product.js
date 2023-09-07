const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tages: {
    type: String,
    required: [true, "Please enter your product tages!"],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter your product originalPrice!"],
  },
  priceDiscount: {
    type: Number,
    required: [true, "Please enter your product priceDiscount!"],
  },
  productStock: {
    type: Number,
    required: [true, "Please enter your product productStock!"],
  },
  images: [
    {
      type: String,
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      productId: {

        type: String,
        required: true,
      },
      createdAt:{
        type: Date,
        default: Date.now(),
      
      }
    },
  ],
  ratings: {
    type: Number,
  },
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
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", ProductSchema);
