// models/fruit.js

const mongoose = require("mongoose");
const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
    price: {
        type: Number,
        required: false,
        min: 0
    }
  });
  const Fruit = mongoose.model("Fruit", fruitSchema);

  module.exports = Fruit;