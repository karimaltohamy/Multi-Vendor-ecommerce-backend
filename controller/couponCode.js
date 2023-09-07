const express = require("express");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const isSeller = require("../middleware/auth");
const CouponCode = require("../model/couponCode");

router.post("/create-couponCode", async (req, res, next) => {
  const { name } = req.body;


  try {
    const findcouponCode = await CouponCode.find({ name: name });

    if (findcouponCode.length !== 0) {
      return next(new ErrorHandler("couponCode already exists", 400));
    }

    const couponCode = await CouponCode.create(req.body);

    res.status(201).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/all-couponCodes/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const couponCodes = await CouponCode.find({ shop: id });

    if (!couponCodes) {
      return next(new ErrorHandler("id shop is invalid", 400));
      
    }

    res.status(201).json({
      success: true,
      couponCodes,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/getCouponCode/:name", async (req, res, next) => {
  const {name} = req.params
  try {
    const couponCode = await CouponCode.findOne({name})

    
    res.status(201).json({
      success: true,
      couponCode
    })
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
})

module.exports = router;
