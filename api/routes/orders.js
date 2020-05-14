const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
/*- Notes:
- THink about adding a reqest Id for each reuqest/order that comes in. Add it in the schema 
*/
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            orderID: doc.id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.post("/", (req, res, next) => {
  //Finding the product by the name instead of the ID
  /*  Product.find(req.body.productName)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    }); */
  Product.findById(req.body.productId)
    .then((result) => {
      console.log("Finding product by ID result==> " + result);

      if (!result) {
        res.status(404).json({
          message: "Product ID Not Found",
        });
      } else {
        let productName = result.name;
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
        });

        order.save().then((result) => {
          res.status(200).json({
            message: "Order Stored",
            createdOrder: {
              orderID: result._id,
              productID: result.product,
              productName: productName,
              quantity: result.quantity,
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/" + result._id,
            },
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Invalid Json Body product ID",
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: "Order Not Found -  OrderID not found",
        });
      } else {
        res.status(200).json({
          message: "Order Found",
          details: result,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders",
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Order not found - invalid OrderID",
        err: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({
    _id: req.params.orderId,
  })
    .then((result) => {
      res.status(200).json({
        message: "Order " + req.params.orderId + " has been deleted",
        result: "SUCCESS",
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Order Not found to Delete",
        result: "FAIL",
      });
    });
});
module.exports = router;
