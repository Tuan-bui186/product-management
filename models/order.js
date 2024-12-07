const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    card_id: String,
    userInfo: {
      fullname: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "order");

module.exports = Order;
