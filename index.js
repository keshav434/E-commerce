const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");

const jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

const app = express();

app.use(express.json()); //middleware[help us to get that file body in the route]
app.use(cors());

function verifyToken(req, resp, next){
  let token = req.headers['authorization'];
  if(token){
    token =  token.split(' ')[1]; // Corrected typo here
    jwt.verify(token, jwtKey, (err, valid)=>{
      if(err){
        resp.status(401).send({result:"Please provide a valid token"}) // Typo corrected in the error message as well
      }else{
          next();
      }
    })
  }else{
    resp.status(403).send({result:"Please add token with header"})
  }
}

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtKey, { expiresIn: "2hr" }, (err, token) => {
    if (err) {
      resp.send({ result: "Something went wrong pls try after sometime" });
    }
    resp.send({ result, auth: token });
  });
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: "2hr" }, (err, token) => {
        if (err) {
          resp.send({ result: "Something went wrong pls try after sometime" });
        }
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ result: "no user found" });
    }
  } else {
    resp.send({ result: "no user found" });
  }
});
app.get("/products",verifyToken, async (req, resp) => {
  const products = await Product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "No Product found" });
  }
});

app.post("/add-product", verifyToken, async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.delete("/product/:id", verifyToken, async (req, resp) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
}),
  app.get("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send({ result: "result not found" });
    }
  }),
  app.put("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result) {
      resp.send(result);
    } else {
      resp.send({ result: "result not found" });
    }
  }),
  app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Product.find({
      $or: [
        {
          name: { $regex: req.params.key },
        },
        {
          company: { $regex: req.params.key },
        },
        {
          category: { $regex: req.params.key },
        },
      ],
    });
    if (result) {
      resp.send(result);
    } else {
      resp.send({ result: "result not found" });
    }
  }),


  app.listen(4000);
