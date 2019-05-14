const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;


const productModel = new Schema({
    title: {type: String, require: true},
    discription: {type: String, require: true}, 
    imageUrl: {type: String, require: true},
    price: {type: Number, require: true, default: 0},
    category: {type: String, require: true, enum: ["interior", "imported", "handmade"]},
    stock: {type:Number, required: true, default: 0},
})

module.exports = model("products", productModel);