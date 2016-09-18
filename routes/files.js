var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var multiparty = require('multiparty');
var async = require('async');
var jimp = require("jimp");

var imageDir = __dirname + "/../public/uploads/";
var imageMaxWidth = 1360;
var imageMaxHeight = 1080;

function createFile(filename, data, number, callback) {
  var filePath = imageDir + filename;
  fs.stat(filePath, function(err, stat) {
    if (err == null) {
      // File exists. Rename file.
      if (number == null) {
        nextNumber = 1;
        filename = filename.replace(/(\.[\w\d_-]+)$/i, '-' + nextNumber + '$1');
      } else {
        nextNumber = number + 1;
        filename = filename.replace(/\-([0-9]+)(\.[\w\d_-]+)$/i, '-' + nextNumber + '$2');
      }
      createFile(filename, data, nextNumber, callback)
    } else if(err.code == 'ENOENT') {
      // Create new file
      fs.writeFile(filePath, data, function (err) {
        if (err) throw err;
        jimp.read(filePath, function(err, image){
          if (!err && (image.bitmap.width > imageMaxWidth || image.bitmap.height > imageMaxHeight)) {
            image.scaleToFit(imageMaxWidth, imageMaxHeight).write(filePath);
          }
        });
        callback(err, filename);
      });
    } else {
      console.log('Error during file upload: ', err.code);
    }
  });
}

function uploadFile(file, callback) {
  fs.readFile(file.path, function (err, data) {
    if (err) throw err;
    var filename = file.originalFilename;
    createFile(filename, data, null, function(err, filename) {
      if (err) throw err;
      callback(err, filename);
    })
  });
}

router.post('/upload/:name', function(req, res, next) {
  var fieldName = req.params.name;
  var form = new multiparty.Form();

  // Upload images
  form.parse(req, function(err, fields, files) {
    var originalFilenames = [];
    async.eachSeries(Object.keys(files), function (fieldKey, fieldNext){
      if (files.hasOwnProperty(fieldKey)) {

        async.eachSeries(Object.keys(files[fieldKey]), function (fileKey, fileNext){
          var file = files[fieldKey][fileKey];
          if (file.fieldName == fieldName && file.size > 0) {
            uploadFile(file, function(err, filename) {
              originalFilenames.push(filename);
              fileNext();
            });
          }
        }, function(err) {
          fieldNext();
        });

      } else {
        fieldNext();
      }
    }, function(err) {
      res.json(originalFilenames);
    });
  });
});

module.exports = router;
