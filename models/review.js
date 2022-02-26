const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const rewviewSchema = new Schema({
    body: String,
    rating: Number  

})

module.exports = mongoose.model("Review", rewviewSchema);