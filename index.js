const express = require("express");
const app = express();
const bdParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouter = require("./api/apiRouter");
const session = require("express-session");

mongoose.connect("mongodb+srv://quannguyen:adgadg123@cluster0-2uuxf.azure.mongodb.net/shop?retryWrites=true",{useNewUrlParser: true}, err => {
    if(err) console.log(err);
    else console.log("Connected");
})

app.use(session({
  secret: "ahihi",
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
  }
}))

app.use(cors({ origin: ["https://xcommerce-client.herokuapp.com"], credentials: true }))

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");

  if(req.headers.origin){
    console.log(req.headers.origin)
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader("Access-Control-Allow-Origin", " ");

 
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);
  
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bdParser.urlencoded({extended:false}))
app.use(bdParser.json());

app.use("/api", apiRouter);
app.listen(process.env.PORT || 6969 , err => {
    if(err) console.log(err);
    else console.log("Server start 6969")
})
    