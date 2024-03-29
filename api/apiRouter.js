const express = require("express");
const Router = express.Router;

const apiRouter = Router();
const productApiRouter = require("./product/router");
const userApiRouter = require("./user/router");
const authApiRouter = require("./auth/router");
const orderApiRouter = require("./order/router");

apiRouter.get("/", (req, res) => {
    res.send("hello");
})

apiRouter.use("/login", authApiRouter);

apiRouter.use("/users", userApiRouter);

apiRouter.use("/products", productApiRouter);



apiRouter.use((req, res, next) => {
    if(req.session.user){
        next();
    } else {
        res.status(401).send({success: 0, message: "Ban chua dang nhap"})
    }
})

apiRouter.use("/order", orderApiRouter);

module.exports = apiRouter;