const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;


const userModel = new Schema({
    account: {type: String, require: true, unique: true},
    password: {type: String, require: true}, 
    name: {type: String, require: true},
})

module.exports = model("users", userModel);