const express= require("express");
require("./db/config");
const User = require('./db/User');
const app = express();

app.use(express.json()); //middleware[help us to get that file body in the route]

app.post("/register", async (req,resp)=>{
    let user = new User(req.body);
    let result = await user.save();
    resp.send(result);
})


app.listen(4000);
