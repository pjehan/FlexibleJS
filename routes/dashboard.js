var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var google = require('googleapis')

router.get('/gapi-key/:viewId/:email', function(req, res) {
  const serviceAccountKeyFile = path.join(__dirname, '/../gapi_key.json')

  fs.stat(serviceAccountKeyFile, (err, stats) => {
    if (err) return res.status(500).json(err)

    var serviceAccountEmail = req.params.email
    var viewId = req.params.viewId

    if (typeof req.app.locals.config.gapi !== 'undefined') {
      serviceAccountEmail = req.app.locals.config.gapi.email
      viewId = req.app.locals.config.gapi.viewId
    }

    try {
      var jwtClient = new google.auth.JWT(
        serviceAccountEmail,
        serviceAccountKeyFile,
        null,
        ['https://www.googleapis.com/auth/analytics.readonly']
      )
    } catch (err) {
      return res.status(500).json(err)
    }


    jwtClient.authorize(function(err, token) {
      if (err) return res.status(500).json(err)
      return res.json({token: token, viewId: viewId})
    })
  })
})

module.exports = router
