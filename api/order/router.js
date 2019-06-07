const express = require("express");
const Router = express.Router;
const orderApiRouter = Router();
const orderModel = require("./model");
const productModel = require("../product/model");
const nodemailer = require("nodemailer");

orderApiRouter.post("/", (req, res) => {
    const {buyerEmail, orderedItems, address} = req.body;
    orderModel.create({buyerEmail, orderedItems, address})
        .then(createdOrder => {
            async function main(){         
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: 'joanny84@ethereal.email',
                        pass: 'SSKQSwN2fQJcDjzXf4'
                    }
                });

                let info = await transporter.sendMail({
                  from: 'wantmorexx9x@gmail.com',
                  to: "joanny84@ethereal.email",
                  subject: "Confirm ✔", 
                  text: `Confirm your order
                    ${createdOrder.orderedItems.map(item => {
                        return "\tProduct: " + item.title + " ,quantity: " + item.qty +"\n";
                    })}
                  `
                });
              
                console.log("Message sent: %s", info.messageId);  
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
            main().catch(console.error);
            res.status(200).send({success: 1, data: createdOrder})
        })
        .catch(err => console.log(err))
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

orderApiRouter.get("/", (req, res) => {
    orderModel.find({})
    .then(orders => {
        res.status(200).send({success: 1, data: orders})
    })
    .catch(err => console.log(err));
})


  
orderApiRouter.get("/:email", (req, res) => {
    orderModel.find({buyerEmail: req.params.email})
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
        res.send({success: 1, data: orders, statistic: count, fav: fav})
    })
    .catch(err => console.log(err))
})

module.exports = orderApiRouter;
