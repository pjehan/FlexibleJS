var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var filesize = require('filesize');
var archiver = require('archiver');
var unzip =  require('unzip-stream');
var moment = require("moment");
var spawn = require('child_process').spawn;

const backupDir = path.join(__dirname, '../public/backup/');

function createDbBackup(dbname, callback) {
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

function createFilesBackup(dbname, callback) {
  return new Promise((resolve, reject) => {
    const filename = dbname + '_files_' + moment().format('YYYYMMDDHHmmss') + '.zip';
    var archive = archiver('zip');
    var output = fs.createWriteStream(backupDir + filename);

    // Create backup dir if not exists
    if (!fs.existsSync(backupDir)){
      fs.mkdirSync(backupDir);
    }

    output.on('close', function() {
      resolve('/backup/' + filename);
    });

    archive.on('error', function(err) {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(path.join(__dirname, '../public/uploads/'), false);
    archive.finalize();
  })
}

router.get('/export-database', function(req, res) {
  const dbname = req.app.locals.config.db.name;
  createDbBackup(dbname, function(filepath) {
    res.json({path: filepath});
  });
});

router.post('/import-database/:name', function(req, res) {
  const dbname = req.app.locals.config.db.name;
  const fieldName = req.params.name;
  const form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    var file = files[fieldName][0];

    createDbBackup(dbname, function(filepath) {
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

router.get('/export-files', (req, res) => {
  const dbname = req.app.locals.config.db.name;
  createFilesBackup(dbname)
  .then((filepath) => {
    res.json({path: filepath});
  })
  .catch((err) => {
    console.log(err);
    res.statut(500).json(err);
  })
})

router.post('/import-files/:name', (req, res) => {
  const dbname = req.app.locals.config.db.name;
  const fieldName = req.params.name;
  const form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) throw err;

    // Create files backup before import
    createFilesBackup(dbname)
    .then((filepath) => {
      var file = files[fieldName][0];
      fs.createReadStream(file.path).pipe(unzip.Extract({ path: path.join(__dirname, '../public/uploads/') }));
      res.json({success: true});
    })
    .catch((err) => {
      console.log(err);
      res.statut(500).json(err);
    })

  });
})

router.get('/list-backup-files', (req, res) => {
  fs.readdir(backupDir, (err, files) => {
    if (err) throw err;

    let listFiles = [];

    files.forEach(file => {
      let stats = fs.statSync(backupDir + file);
      listFiles.push({
        filename: file,
        size: filesize(stats.size),
        createdAt: moment(stats.birthtime).format("DD MMM YYYY HH:mm:ss")
      });
    });

    res.json({files: listFiles});
  })
})

router.delete('/delete-file/:filename', (req, res) => {
  fs.unlink(backupDir + req.params.filename, err => {
    if (err) throw err;
    res.json({sucess: true});
  });
})

module.exports = router;
