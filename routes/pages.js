var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var slugify = require('slug');

var ObjectId = require('mongodb').ObjectId;

var getTemplate = require('./templates').getTemplate;

function getPage(req, id, callback) {
  const db = req.app.locals.db;
  db.collection('pages').findOne({"_id" : ObjectId(id)}, function (err, item) {
    callback(item);
  });
}

function getPageBySlug(req, site_id, slug, callback) {
  const db = req.app.locals.db;

  db.collection('pages').findOne({"site_id": site_id, "slug": slug}, function (err, item) {
    callback(item);
  });
}

function generateSlug(req, site_id, slug, number, callback) {
  slug = slugify(slug, {lower: true});
  getPageBySlug(req, site_id, slug, function(page) {
    if (!page) {
      callback(slug);
    } else {
      if (number == null) {
        number = 1;
        slug = slug + '-1';
      } else {
        number = number + 1;
        slug = slug.replace(/\-([0-9]+)$/i, '-' + number);
      }
      generateSlug(req, site_id, slug, number, callback);
    }
  });
}

/**
* Delete page and children pages
* @param  {string} id Page id
*/
function deletePage(req, id) {
  const db = req.app.locals.db;
  getPage(req, id, function(item) {
    db.collection('pages').find({parent: item._id.toString()}).toArray(function(err, items){
      for (var i = 0; i < items.length; i++) {
        deletePage(items[i]._id);
      }
    });
    db.collection('pages').deleteOne({"_id" : ObjectId(item._id)});
  });
}

router.get('/', function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('pages').find({site_id: req.query.site_id, parent: null}).toArray(function(err, items){
    res.json(items);
  });
});

router.get('/dropdown/:language/:site_id', function(req, res, next) {
  const db = req.app.locals.db;

  db.collection('pages').find({ template: { $in: req.query.templates } }).toArray(function(err, items){
    var options = [];

    for (var i = 0; i < items.length; i++) {
      var page = items[i];
      var currentTemplate = getTemplate(req.params.site_id, page.template);

      var option = {
        value: page._id,
        text: 'Template ' + page.template + ' doesn\'t have a toString property'
      };

      if (page[req.params.language] && currentTemplate.toString) {
        option.text = page[req.params.language][currentTemplate.toString];
      }

      options.push(option)
    }

    res.json(options);
  });
});

router.get('/is-valid-slug', function(req, res, next) {
  getPageBySlug(req, req.query.site_id, req.query.slug, function(page) {
    res.json(page);
  });
});

router.get('/:id', function(req, res, next) {
  getPage(req, req.params.id, function(item) {
    res.json(item);
  })
});

router.get('/:id/:component_id/children', function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('pages').find({parent: req.params.id, component_id: req.params.component_id}).toArray(function(err, items){
    res.json(items);
  });
});

/**
* Create Page
* @return {json} JSON created object
*/
router.post('/', function(req, res, next) {
  const db = req.app.locals.db;

  var site_id = req.body.site_id;
  var template = req.body.template;
  var title = req.body.title;

  // For pages in list
  var parent = req.body.parent;
  var component_id = req.body.component_id;

  // Generate unique slug
  generateSlug(req, site_id, title, null, function(slug) {
    db.collection('pages').insertOne(
      {site_id: site_id, template: template, parent: parent, component_id: component_id, title: title, slug: slug, created_date: new Date(), updated_date: new Date()},
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
  const db = req.app.locals.db;

  var data = req.body;
  // Remove static fields
  delete data._id;
  delete data.template;
  delete data.parent;
  delete data.component_id;
  // Update updated date
  data.updated_date = new Date();

  getPageBySlug(req, data.site_id, data.slug, function(page) {
    if (page && page._id != req.params.id) {
      res.status(500).send('Slug already exists');
    } else {
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
    }
  });
});

router.delete('/:id', function(req, res, next) {
  getPage(req, req.params.id, function(page){
    deletePage(req, page._id);
    res.json(page);
  });
});

module.exports = router;
