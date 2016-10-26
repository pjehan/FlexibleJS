var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var multiparty = require('multiparty');

var ObjectId = require('mongodb').ObjectId;

var getSites = function getSites() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf-8'));
}

var getSite = function getSite(site_id) {
  var sites = getSites();

  for (var i = 0; i < sites.length; i++) {
    if (sites[i].id == site_id) {
      return sites[i];
    }
  }
}

var getTemplate = function getTemplate(site_id, template_id) {
  var site = getSite(site_id);

  for (var i = 0; i < site.templates.length; i++) {
    if (site.templates[i].id == template_id) {
      return site.templates[i];
    }
  }
}

router.get('/', function(req, res) {
  return res.json(getSites());
});

router.get('/:site', function(req, res) {
  var site = getSite(req.params.site);
  return (site) ? res.json(site) : res.status(404).send('Not Found');
});

router.get('/:site/:name', function(req, res) {
  var template = getTemplate(req.params.site, req.params.name);
  return (template) ? res.json(template) : res.status(404).send('Not Found');
});

module.exports = {
  router: router,
  getSites: getSites,
  getSite: getSite,
  getTemplate: getTemplate
};
