var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var multiparty = require('multiparty');

var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

function getTemplates() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf-8'));
}

router.get('/', function(req, res, next) {
  return res.json(getTemplates());
});

router.get('/:name', function(req, res, next) {
  var templates = getTemplates();

  for (var i = 0; i < templates.length; i++) {
    if (templates[i].id == req.params.name) {
      return res.json(templates[i]);
    }
  }

  return res.status(404).send('Not Found');
});

module.exports = router;
