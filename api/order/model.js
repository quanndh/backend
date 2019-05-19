const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;


const orderModel = new Schema({
    buyerEmail: {type: String, require: true},
    orderedItems: [
        {type: Object, require: true}
    ], 
    address: {type: Object, require: true},
})

module.exports = model("orders", orderModel);