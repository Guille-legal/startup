const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['customer', 'admin', 'employee']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
