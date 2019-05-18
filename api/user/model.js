const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;


const userModel = new Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}, 
    username: {type: String, require: true},
})

module.exports = model("users", userModel);