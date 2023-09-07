const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const Order = require("../model/order");
const { isSeller } = require("../middleware/auth");
const Product = require("../model/product");

router.post("/create-order", async (req, res, next) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
  try {
    const cartItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shop._id;
      if (!cartItemsMap.has(shopId)) {
        cartItemsMap.set(shopId, []);
      }
      cartItemsMap.get(shopId).push(item);
      

    }

    const orders = [];

    for (const [shopId, items] of cartItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
// get orders for user
router.get("/orders-user/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const ordersUser = await Order.find({ ["user._id"]: id }).sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      orders: ordersUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get orders for shop
router.get("/orders-shop/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const ordersShop = await Order.find({ ["cart.shopId"]: id }).sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      orders: ordersShop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get order by id
router.get("/get-order/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return next(new ErrorHandler("order not found", 400));
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update status order
router.put("/update-status-order/:id", isSeller, async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return next(new ErrorHandler("order not found", 500));
    }

    if (req.body.status === "Delivered") {
      order.createdAt = Date.now();
      order.paymentInfo.status = "succeded";
    }

    order.status = req.body.status

    if (req.body.status === "Transferrd to deivery partner") {
      order.cart.forEach((item) => {
        return updateProduct(item._id, item.qty);
      });
    }

    async function updateProduct(id, qty) {
      const product = await Product.findById(id);

      product.productStock -= qty;
      product.sold_out += qty;

      await product.save();
    }

    await order.save();

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = router;
