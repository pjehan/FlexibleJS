var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var moment = require("moment");
var spawn = require('child_process').spawn;

const backupDir = path.join(__dirname, '../public/backup/');

function createBackup(dbname, callback) {
  const filename = dbname + '_db_' + moment().format('YYYYMMDDHHmmss') + '.gz';
  const backupPath = backupDir + filename;

  // Create backup dir if not exists
  if (!fs.existsSync(backupDir)){
    fs.mkdirSync(backupDir);
  }

  spawn('mongodump', [
    '--db', dbname,
    '--gzip',
    '--archive=' + backupPath
  ]).on('close', function() {
    callback('/backup/' + filename);
  });
}

router.get('/export-database', function(req, res) {
  const dbname = req.app.locals.config.db.name;
  createBackup(dbname, function(filepath) {
    res.json({path: filepath});
  });
});

router.post('/import-database/:name', function(req, res) {
  const dbname = req.app.locals.config.db.name;
  const fieldName = req.params.name;
  const form = new multiparty.Form();

  // Upload images
  form.parse(req, function(err, fields, files) {
    var file = files[fieldName][0];

    createBackup(dbname, function(filepath) {
      spawn('mongorestore', [
        '--db', dbname,
        '--gzip',
        '--drop',
        '--archive=' + file.path
      ]).on('error', function(err) {
        console.log(err);
      }).on('close', function() {
        res.json({success: true});
      });
    });
  });
});

module.exports = router;
