const express = require("express");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const fs = require("fs");
const { isSeller } = require("../middleware/auth");

router.post("/create-event", upload.array("images"), async (req, res, next) => {
  const { shopId } = req.body;
  try {
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("shop Id is invalid", 400));
    } else {
      const imagesUrls = req.files.map((file) => `${file.filename}`);
      const eventData = req.body;
      eventData.images = imagesUrls;
      eventData.shop = shop;

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/all-events-shop/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const events = await Event.find({ shopId: id });

    if (!events) {
      return next(new ErrorHandler("id shop is invalid", 400));
    }

    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/all-events", async (req, res, next) => {
  try {
    const events = await Event.find();

    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.delete("/deleteEventShop/:id", isSeller, async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return next(new ErrorHandler("event not found with this id", 400));
    }

    event.images.forEach((image) => {
      fs.unlink(`uploads/${image}`, (error) => {
        if (error) {
          console.error("Error deleting image:", image);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "The event has been removed",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = router;
