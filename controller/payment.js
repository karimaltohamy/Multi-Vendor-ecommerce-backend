const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const stripe = require("stripe")("sk_test_51MXOozKG4U03U9qEDkgoz4Kory5OS5p6GEug4OxUYpG50heJXNkuzRwMGaWbYuR23CoVBdLbLrZLY4nToAkaLSlA00z775sEGP")

router.post("/process", async (req, res, next) => {
    try {
        const myPayemnt = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "EGP",
            metadata: {
                company: "karim"
            }
        })
        
        res.status(200).json({
            success: true,
            client_secret: myPayemnt.client_secret
        })

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
        
    }
})


router.get("/stripeApiKey", (req, res, next) => {
    try {
        res.status(200).json({stripeApiKey: process.env.STRIPE_API_KEY})
        
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

module.exports = router