const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    price:{
        type:Float32Array,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Product', productSchema);