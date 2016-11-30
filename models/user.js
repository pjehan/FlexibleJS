var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin: Boolean,
    role: String // Can be super_admin, admin or editor
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
