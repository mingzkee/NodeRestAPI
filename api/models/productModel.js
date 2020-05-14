const mongoose = require("mongoose");
// DOne to define the model of the json object should look like
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: false },
});

module.exports = mongoose.model("Product", productSchema);
