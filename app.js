const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
mongoose.connect(
  "mongodb+srv://admin:oPDc059vji8t6UfX@node-api-lp6rx.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
//Use to log req and errors when you hit the url
mongoose.Promise = global.Promise;
app.use(morgan("dev"));
//Makes a folder statis so its publicly available so everyone has access to it
// to access the image in the browser localhost:3000/'imgName'
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    req.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE",
      "GET"
    );
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle the request
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//Error handling here cause if it reaches here then no routes matched the url request
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.json({
    error: {
      status: error.status,
      message: error.message,
    },
  });
});
module.exports = app;
