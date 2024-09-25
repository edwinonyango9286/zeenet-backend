const mongoose = require('mongoose');


const brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        minlength: 2,
        maxlength: 32,
    },

},
    { timestamps: true }
);


module.exports = mongoose.model('Brand', brandSchema);