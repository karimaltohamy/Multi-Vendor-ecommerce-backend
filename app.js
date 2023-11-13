const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const globalError = require("./middleware/globalError");
const cors = require("cors");

app.use(
  cors({
    credentials: true,
    origin: "https://multi-vendor-ecommerce-theta.vercel.app",
    optionsSuccessStatus: 200, // For legacy browser support
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));


// routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const couponCode = require("./controller/couponCode");
const payment = require("./controller/payment")
const order = require("./controller/order")


app.use("/api/users", user);
app.use("/api/shops", shop);
app.use("/api/products", product);
app.use("/api/events", event);
app.use("/api/couponCodes", couponCode);
app.use("/api/payment", payment);
app.use("/api/orders", order);


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/.env" });
}

app.use(globalError);


module.exports = app;
