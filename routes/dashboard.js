var express = require('express')
var router = express.Router()
var path = require('path')
var google = require('googleapis')

router.get('/gapi-key/:viewId/:email', function(req, res) {
  const serviceAccountKeyFile = path.join(__dirname, '/../gapi_key.json')
  const serviceAccountEmail = (req.params.email !== 'undefined') ? req.params.email : req.app.locals.config.gapi.email
  const viewId = (req.params.viewId !== 'undefined') ? req.params.viewId : req.app.locals.config.gapi.viewId

  var jwtClient = new google.auth.JWT(
    serviceAccountEmail,
    serviceAccountKeyFile,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
  )

  jwtClient.authorize(function(err, token) {
    if (err) {
      console.log(err)
      return
    }
    return res.json({token: token, viewId: viewId})
  })
})

module.exports = router
