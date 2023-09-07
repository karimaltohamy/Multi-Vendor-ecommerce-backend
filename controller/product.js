const express = require("express");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Product = require("../model/product");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const fs = require("fs");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const Order = require("../model/order");

router.post(
  "/create-product",
  upload.array("images"),
  async (req, res, next) => {
    const { shopId } = req.body;
    try {
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("shop Id is invalid", 400));
      } else {
        const imagesUrls = req.files.map((file) => `${file.filename}`);
        const productData = req.body;
        productData.images = imagesUrls;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

router.get("/all-products-shop/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ shopId: id });

    if (!products) {
      return next(new ErrorHandler("id shop is invalid", 400));
    }

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/all-products", async (req, res, next) => {
  try {
    const allProducts = await Product.find();

    res.status(201).json({
      success: true,
      allProducts,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const getProduct = await Product.findById(id);

    res.status(201).json({
      success: true,
      product: getProduct,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.delete("/deleteProductShop/:id", isSeller, async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new ErrorHandler("product not found with this id", 400));
    }

    product.images.forEach((image) => {
      fs.unlink(`uploads/${image}`, (error) => {
        if (error) {
          console.error("Error deleting image:", image);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "The product has been removed",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// handle review
router.put("/add-review/:orderId", isAuthenticated, async (req, res, next)=> {
  const {productId, user, rating, comment} = req.body
  const {orderId} = req.params

  try {
   
    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(
      (rev) => rev.user._id === user._id
    );

    if (isReviewed) {
      product.reviews.forEach(ele => {
        if (ele.user._id === user._id) {
          ele.rating = rating, ele.comment = comment
        }
      })
    }else {
      product.reviews.push(req.body)
    }

    

    let avg = 0

    
      product.reviews.forEach(rev => {
        avg += rev.rating
      })
    

    product.ratings = avg / product.reviews.length
    console.log(avg);
   

    await product.save()

    await Order.findByIdAndUpdate(orderId, {$set: {"cart.$[element].isReviewed": true}}, {
      arrayFilters: [
        { 'element._id': productId },
      ],
    })

    res.status(201).json({
      success: true,
      product
    })

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
    
  }
})

module.exports = router;
