const express = require("express");
const Router = express.Router;
const productApiRouter = Router();
const productModel = require("./model");
const orderModel = require("../order/model");

productApiRouter.post("/", (req, res) => {
    const {title, imageUrl, discription, price, category, stock} = req.body;
    productModel.create({title, imageUrl, discription, price, category, stock})
        .then(createdProduct => res.status(200).send({success: 1, data: createdProduct}))
})

function countOccurrences(arr) {
    var newarr = arr.reduce(function(newarr, curr){
      if(typeof(newarr[curr]) == "undefined"){
          newarr[curr] = 1;
      } else {
        newarr[curr]++
      }
      return newarr;
    }, {})
    return newarr;
  }

productApiRouter.get("/", (req, res) => {
    const limit = req.query.perPage || 8;
    const page = req.query.page || 1;
    const skip = limit * (page - 1);
    let nPages;
    productModel.count({}, (err, count) => {
        if(err) console.log(err)
        else nPages =  Math.ceil(count / limit)
    })
    productModel.find({})
    .limit(limit)
    .skip(skip)
    .then(products => res.status(200).send({success: 1, data: products, nPages: nPages}))
    .catch(err => res.status(500).send({success: 0, err: err}))
})

productApiRouter.get("/sale", (req, res) => {
    console.log(req.session.user)
    if(!req.session.user){
        console.log("no")
        productModel.find({})
        .then(products => {
            let index = Math.floor(Math.random() * products.length)
            res.status(200).send({success: 1, data: products[index]})
        })
        .catch(err => res.status(500).send({success: 0, err: err}))
    } else {
        console.log("yes")
        orderModel.find({buyerEmail: req.session.user.email})
        .then(orders => {
            let items = [];
            let category = [];
            for(let i = 0; i < orders.length; i++){
                for(let j = 0; j < orders[i].orderedItems.length; j++){
                    items.push(orders[i].orderedItems[j])
                    category.push(orders[i].orderedItems[j].category)
                }
            }
            let count = countOccurrences(category)
            let fav = "";
            let max = 0;
            for(keys in count){
                if(count[keys] > max){
                    max = count[keys]
                    fav = keys
                }
            }
            productModel.find({category: fav})
            .then(products => {
                let index = Math.floor(Math.random() * products.length)
                res.send({success: 1, data: products[index]})
            }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
   
    
        
})


productApiRouter.get("/filter", (req, res) => {
    const limit = req.query.perPage || 8;
    const page = req.query.page || 1;
    const skip = limit * (page - 1);
    let nPages;
    
    if(req.query.category !== "all"){
        productModel.count({$and: [ { price: { $gte: req.query.price*1 } }, {category: req.query.category}, { price: { $lte: req.query.price2*1 } }]}, (err, count) => {
            if(err) console.log(err)
            else nPages =  Math.ceil(count / limit)
        })
        productModel.find({$and: [ { price: { $gte: req.query.price*1 } }, {category: req.query.category}, { price: { $lte: req.query.price2*1 } }]})
            .limit(limit)
            .skip(skip)
            .then(products => {res.status(200).send({success: 1, data: products, nPages: nPages})})
            .catch(err => res.status(500).send({success: 0, err: err}))
    } else {
        productModel.count({$and: [ { price: { $gte: req.query.price*1 } }, { price: { $lte: req.query.price2*1 } }]}, (err, count) => {
            if(err) console.log(err)
            else nPages =  Math.ceil(count / limit)
        })
        productModel.find({$and: [ { price: { $gte: req.query.price*1 } }, { price: { $lte: req.query.price2*1 } }]} )
            .limit(limit)
            .skip(skip)
            .then(products => {res.status(200).send({success: 1, data: products, nPages: nPages})})
            .catch(err => res.status(500).send({success: 0, err: err}))
    } 
})




productApiRouter.get("/:id", (req, res) => {
    productModel.findOne({_id : req.params.id})
        .then(product => res.status(200).send({success: 1, data: product}))
        .catch(err => res.status(500).send({success: 0, err: err}))

})




productApiRouter.get("/category/:category", (req, res) => {
    productModel.find({category: req.params.category})
    .then(products => res.status(200).send({success: 1, data: products}))
    .catch(err => console.log(err))
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