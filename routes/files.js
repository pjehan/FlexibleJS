var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var multiparty = require('multiparty')
var async = require('async')
var jimp = require('jimp')
var spawn = require('child_process').spawn

const fileDir = path.join(__dirname, '/../public/uploads/')
var imageWidth = null
var imageHeight = null
var imageMaxWidth = null
var imageMaxHeight = null

function createFile(filename, data, number, callback) {
  var filePath = fileDir + filename
  fs.stat(filePath, function(err, stat) {
    if (err == null) {
      // File exists. Rename file.
      let nextNumber = 1
      if (number == null) {
        filename = filename.replace(/(\.[\w\d_-]+)$/i, '-' + nextNumber + '$1')
      } else {
        nextNumber = number + 1
        filename = filename.replace(/-([0-9]+)(\.[\w\d_-]+)$/i, '-' + nextNumber + '$2')
      }
      createFile(filename, data, nextNumber, callback)
    } else if (err.code === 'ENOENT') {
      // Create directory if not exists
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir)
      }
      // Create new file
      fs.writeFile(filePath, data, function(err) {
        if (err) throw err
        // Resize file
        jimp.read(filePath, function(err, image) {
          if (!err) {
            var width = null
            var height = null
            if (imageWidth || imageHeight) {
              width = imageWidth || jimp.AUTO
              height = imageHeight || jimp.AUTO
              if (imageWidth && imageHeight) {
                image.cover(width, height).write(filePath)
              } else {
                image.resize(width, height).write(filePath)
              }
            } else if (image.bitmap.width > imageMaxWidth || image.bitmap.height > imageMaxHeight) {
              width = imageMaxWidth || jimp.AUTO
              height = imageMaxHeight || jimp.AUTO
              if (imageMaxWidth && imageMaxHeight) {
                image.scaleToFit(width, height).write(filePath)
              } else {
                image.resize(width, height).write(filePath)
              }
            }
          }
        })
        callback(err, filename)
      })
    } else {
      console.log('Error during file upload: ', err.code)
    }
  })
}

function uploadFile(file, callback) {
  fs.readFile(file.path, function(err, data) {
    if (err) throw err
    var filename = file.originalFilename
    createFile(filename, data, null, function(err, filename) {
      if (err) throw err
      callback(err, filename)
    })
  })
}

router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form()

  // Upload images
  form.parse(req, function(err, fields, files) {
    if (err) throw err

    imageWidth = parseInt(fields.flexibleImageWidth[0])
    imageHeight = parseInt(fields.flexibleImageHeight[0])
    imageMaxWidth = parseInt(fields.flexibleImageMaxWidth[0])
    imageMaxHeight = parseInt(fields.flexibleImageMaxHeight[0])

    var originalFilenames = []
    async.eachSeries(Object.keys(files), function(fieldKey, fieldNext) {
      if (files.hasOwnProperty(fieldKey)) {
        async.eachSeries(Object.keys(files[fieldKey]), function(fileKey, fileNext) {
          var file = files[fieldKey][fileKey]

          if (file.size > 0) {
            uploadFile(file, function(err, filename) {
              if (err) throw err
              originalFilenames.push(filename)
              fileNext()
            })
          } else {
            fileNext()
          }
        }, function(err) {
          if (err) throw err
          fieldNext()
        })
      } else {
        fieldNext()
      }
    }, function(err) {
      if (err) throw err
      res.json(originalFilenames)
    })
  })
})

router.get('/backup', function(req, res, next) {
  var zip = spawn('zip', ['-rj', '-', fileDir])

  res.contentType('zip')
  zip.stdout.on('data', function(data) {
    res.write(data)
  })

  zip.on('exit', function(code) {
    if (code !== 0) {
      res.statusCode = 500
      console.log('zip process exited with code ' + code)
      res.end()
    } else {
      res.end()
    }
  })
})

router.get('/restore', function(req, res, next) {
  var form = new multiparty.Form()

  form.parse(req, function(err, fields, files) {
    if (err) throw err
    console.log(files)
  })
})

module.exports = router
