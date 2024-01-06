const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    accountStatus: {
        type: String,
        default: "normal"
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String, 
    }

}, {
    timestamps: true
});

userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Export the model
module.exports = mongoose.model('User', userSchema);