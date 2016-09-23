var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var slug = require('slug');

var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

function getPage(id, callback) {
  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;
    db.collection('pages').findOne({"_id" : ObjectId(id)}, function (err, item) {
      callback(item);
    });
  });
}

/**
 * Delete page and children pages
 * @param  {string} id Page id
 */
function deletePage(id) {
  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;
    getPage(id, function(item) {
      db.collection('pages').find({parent: item._id.toString()}).toArray(function(err, items){
        for (var i = 0; i < items.length; i++) {
          deletePage(items[i]._id);
        }
      });
      db.collection('pages').deleteOne({"_id" : ObjectId(item._id)});
    });
  });
}

router.get('/', function(req, res, next) {
  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;
    db.collection('pages').find({site_id: req.query.site_id, parent: null}).toArray(function(err, items){
      res.json(items);
    });
  });
});

router.get('/:id', function(req, res, next) {
  getPage(req.params.id, function(item) {
    res.json(item);
  })
});

router.get('/:id/:component_id/children', function(req, res, next) {
  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;
    db.collection('pages').find({parent: req.params.id, component_id: req.params.component_id}).toArray(function(err, items){
      res.json(items);
    });
  });
});

/**
 * Create Page
 * @return {json} JSON created object
 */
router.post('/', function(req, res, next) {
  var site_id = req.body.site_id;
  var template = req.body.template;
  var title = req.body.title;

  // For pages in list
  var parent = req.body.parent;
  var component_id = req.body.component_id;

  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;
    db.collection('pages').insertOne(
      {site_id: site_id, template: template, parent: parent, component_id: component_id, title: title, slug: slug(title, {lower: true}), created_date: new Date(), updated_date: new Date()},
      function(err, template) {
        if (err) throw err;
        res.json(template.ops[0]);
      }
    );
  });
});

/**
 * Update Page
 * @param  {ObjectId} '/:id'  Identifier
 * @return {json}             JSON updated object
 */
router.put('/:id', function(req, res, next) {
  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;

    var data = req.body;
    // Remove static fields
    delete data._id;
    delete data.template;
    delete data.parent;
    delete data.component_id;
    // Update updated date
    data.updated_date = new Date();

    db.collection('pages').findAndModify(
      {"_id" : ObjectId(req.params.id)},
      {},
      { $set: data},
      {new: true},
      function(err, object) {
        if (err) throw err;
        res.json(object.value);
      }
    );
  });
});

router.delete('/:id', function(req, res, next) {
  mongodb.connect('mongodb://localhost:27017/wb', function(err, db) {
    if (err) throw err;
    getPage(req.params.id, function(page){
      deletePage(page._id);
      res.json(page);
    });
  });
});

module.exports = router;
