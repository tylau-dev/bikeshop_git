var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    lastName: String,
    firstName: String,
    age: Number
});

var newUser = new UserModel({
    lastName: "Doe",
    firstName: "John",
    age: 43
});

module.exports = {}