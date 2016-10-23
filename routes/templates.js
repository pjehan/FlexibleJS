var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var multiparty = require('multiparty');

var ObjectId = require('mongodb').ObjectId;

function getSites() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf-8'));
}

router.get('/', function(req, res) {
  return res.json(getSites());
});

router.get('/:site', function(req, res) {
  var sites = getSites();

  for (var i = 0; i < sites.length; i++) {
    if (sites[i].id == req.params.site) {
      return res.json(sites[i]);
    }
  }

  return res.status(404).send('Not Found');
});

router.get('/:site/:name', function(req, res) {
  var sites = getSites();

  for (var i = 0; i < sites.length; i++) {
    if (sites[i].id == req.params.site) {
      for (var j = 0; j < sites[i].templates.length; j++) {
        if (sites[i].templates[j].id == req.params.name) {
          return res.json(sites[i].templates[j]);
        }
      }
    }
  }

  return res.status(404).send('Not Found');
});

module.exports = router;
