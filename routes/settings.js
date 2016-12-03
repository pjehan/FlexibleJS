var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

const backupDir = path.join(__dirname, '../public/backup/');

router.get('/export-database', function(req, res) {
  const dbname = req.app.locals.config.db.name;
  const filename = dbname + '_db.gz';
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
    res.json({path: '/backup/' + filename});
  });
});

module.exports = router;
