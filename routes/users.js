var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

var ObjectId = require('mongodb').ObjectId;

function insertUser(user, callback) {
  User.register(new User(user), user.password, function(err, account) {
    if (err) {
      callback({
        title: 'notification.newuser.alreadyexists.title',
        message: 'notification.newuser.alreadyexists.message'
      });
    }
    callback(null, account);
  });
}

function updateUser(req, user, callback) {

  const db = req.app.locals.db;
  var id = user._id;
  delete user._id;
  user.active = (user.active === 'true') ? true : false;
  db.collection('users').findAndModify(
    {"_id" : ObjectId(id)},
    {},
    { $set: user},
    {new: true},
    function(err, object) {
      if (err) {
        callback({
          title: 'notification.updateuser.error.title',
          message: 'notification.updateuser.error.message'
        });
      } else {
        callback(null, object.value);
      }
    }
  );
}

router.get('/currentuser', function(req, res) {
  return (req.user) ? res.json(req.user) : res.json({});
});

router.get('/', function(req, res) {
  const db = req.app.locals.db;
  db.collection('users').find().toArray(function (err, users) {
    if (err) throw err
    return res.json(users);
  });
});

router.post('/register', function(req, res) {
  const db = req.app.locals.db;
  db.collection('users').count(function (err, nbAccounts) {
    if (err) throw err
    var user = req.body;
    user.active = (nbAccounts === 0); // User is active if no user in database
    user.role = (nbAccounts === 0) ? 'super_admin' : 'editor'; // User is super admin if no user in database
    insertUser(user, function(err, account) {
      if (err) res.status(500).json(err); // Return notification
      res.json(account);
    })
  });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.json(req.user);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.json({});
});

router.post('/', function(req, res, next) {
  var user = req.body;

  insertUser(user, function(err, account) {
    if (err) res.status(500).json(err); // Return notification
    res.json(account);
  })
});

router.put('/', function(req, res, next) {
  var user = req.body;

  updateUser(req, user, function(err, user) {
    if (err) res.status(500).json(err); // Return notification
    res.json(user);
  })
});

router.delete('/:id', function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('users').deleteOne({"_id" : ObjectId(req.params.id)}, function(err) {
    if (err) throw err;
    res.json({});
  });
});

module.exports = router;
