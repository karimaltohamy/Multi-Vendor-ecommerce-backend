const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const sendSellerToken = require("../utils/sendSellerToken");

router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  const { email } = req.body;

  try {
    const shopEmail = await Shop.findOne({ email });

    if (shopEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) res.status(500).json({ message: "Error delete file" });
      });
      return next(new ErrorHandler("Shop already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const shop = {
      
      shopName: req.body.shopName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      zipCode: req.body.zipCode,
      avatar: fileUrl,
    };
    const newShop = await Shop.create(shop);

    res.status(201).json({
      success: true,
      newShop,
      message: "Successful registration, you must login in",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// loggin

router.post("/login-shop", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields", 404));
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) {
      return next(new ErrorHandler("User doesn't exists!", 404));
    }

    const isPasswordValid = await shop.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 404));
    }

    return sendSellerToken(shop, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/shop-logout", async (req, res, next) => {
  try {
    res
      .status(201)
      .cookie("seller_token", null)
      .json({ success: true, message: "logout successfull" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/shop/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const getShop = await Shop.findById(id);

    res.status(201).json({
      success: true,
      shop: getShop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = router;
