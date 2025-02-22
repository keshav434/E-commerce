const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userId: String,
    company: String,
    image: String  // New field to store the image URL or path
});

module.exports = mongoose.model("Product", productSchema);
