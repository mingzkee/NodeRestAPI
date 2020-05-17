const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file based on file type
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error("Error in Storing your image - allowed jpeg and png only"),
      false
    );
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Product = require("../models/productModel");
//Use ROuter to register different routes
router.get("/", (req, res, next) => {
  //Can find based on conditions using .where and .limit(pagenation)

  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      if (docs.length >= 0) {
        docs.map((elem) => {
          //console.log("Each Element ---> " + elem);
        });

        res.status(200).json({
          count: docs.length,
          products: docs.map((elem) => {
            return {
              _id: elem._id,
              name: elem.name,
              price: elem.price,
              productImage: elem.productImage,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + elem._id,
              },
            };
          }),
        });
      } else {
        res.status(200).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Request Error",
        details: err,
      });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  // Parse the body through post request
  console.log("TEST TEST");
  console.log("FILE PATH==> " + req.file);
  let imagePath;
  if (req.file == undefined) {
    imagePath = null;
  } else {
    imagePath = req.file.path;
  }

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: imagePath,
  });
  product
    .save()
    .then((result) => {
      console.log("RESULT OF Post Product" + result);
      res.status(200).json({
        message: "Created a new product",
        createdProduct: product,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Invalid Body Request",
        sample: {
          name: "String",
          price: "Number",
        },
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Removed " + id + "from database",
        details: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not remove id from database",
        details: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "ProductId not Found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Invalid Product ID",
        details: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  /*Sample body request -  needs to be in an array so that it is iterable 
  [
	{"propName":"name",
	"value":"Patched Object"
	}
	] 
  */
  const id = req.params.productId;
  let updateOps = {};
  for (let ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update(
    {
      _id: id,
    },
    { $set: updateOps }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Patched Object Successful",
        modified: updateOps,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + req.params.productId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
