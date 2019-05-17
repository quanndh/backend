const express = require("express");
const Router = express.Router;
const productApiRouter = Router();
const productModel = require("./model");

productApiRouter.post("/", (req, res) => {
    const {title, imageUrl, discription, price, category, stock} = req.body;
    productModel.create({title, imageUrl, discription, price, category, stock})
        .then(createdProduct => res.status(200).send({success: 1, data: createdProduct}))
})

productApiRouter.get("/", (req, res) => {
    productModel.find({})
        .then(products => res.status(200).send({success: 1, data: products}))
        .catch(err => res.status(500).send({success: 0, err: err}))
})

productApiRouter.get("/:id", (req, res) => {
    productModel.findOne({_id : req.params.id})
        .then(product => res.status(200).send({success: 1, data: product}))
        .catch(err => res.status(500).send({success: 0, err: err}))

})

productApiRouter.get("/category/:category", (req, res) => {
    productModel.find({category: req.params.category})
        .then(products => {res.status(200).send({success: 1, data: products})})
        .catch(err => res.status(500).send({success: 0, err: err}))
})

productApiRouter.put("/:id", (req, res) => {
    productModel.update(
        {_id: req.params.id},
        {
            title: req.body.title,
            price: req.body.price,
            discription: req.body.discription,
            category: req.body.category
        }
    )
    .then(savedProduct => res.status(200).send({success: 1, data: savedProduct}))
    .catch(err => res.status(500).send({success: 0, err: err}))
})

productApiRouter.delete("/:id", (req, res) => {
    productModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).send({success: 1})
    })
    .catch((err) => {
        res.status(500).send({success: 0})
    })
})

// productApiRouter.post("/:id/feedback", (req, res) => {
//     productModel.findByIdAndUpdate( 
//         req.params.id,
//         {
//             $push: {
//                 feedback: { createdBy: req.body.userId, content: req.body.content }
//             }
//         }
//     )
//     .then(updatedProduct => res.status(200).send({success: 1, data: updatedProduct}))
//     .catch(err => res.status(500).send({success: 0, err: err}))

// })



module.exports = productApiRouter;