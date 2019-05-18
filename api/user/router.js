const express = require("express");
const Router = express.Router;
const userApiRouter = Router();
const userModel = require("./model");
const bcrypt = require("bcryptjs");

userApiRouter.post("/", (req, res) => {
    const {email, password, username} = req.body;

    const salt = bcrypt.genSaltSync(12);
    const hashPw = bcrypt.hashSync(password, salt);

    userModel.create({email, password: hashPw, username})
        .then(createdUser => res.status(200).redirect("https://localhost:3000"))
        .catch(err => res.status(500).send({success: 0, err: err}))
})

userApiRouter.get("/", (req, res) => {
    userModel.find({})
        .then(users => res.status(200).send({success: 1, data: users}))
        .catch(err => res.status(500).send({success: 0, err: err}))
})

userApiRouter.get("/:id", (req, res) => {
    userModel.findOne({_id : req.params.id})
        .then(user => res.status(200).send({success: 1, data: user}))
        .catch(err => res.status(500).send({success: 0, err: err}))

})

userApiRouter.put("/:id", (req, res) => {
    const salt = bcrypt.genSaltSync(12);
    const hashPw = bcrypt.hashSync(req.body.password, salt);
    userModel.update(
        {_id: req.params.id},
        {   
            password: hashPw,
            username: req.body.username,
        }
    )
    .then(savedUser => res.status(200).send({success: 1, data: savedUser}))
    .catch(err => res.status(500).send({success: 0, err: err}))
})

userApiRouter.delete("/:id", (req, res) => {
    userModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).send({success: 1})
    })
    .catch((err) => {
        res.status(500).send({success: 0})
    })
})


module.exports = userApiRouter;