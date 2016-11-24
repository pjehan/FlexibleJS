var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin: Boolean,
    active: Boolean
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
