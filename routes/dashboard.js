var express = require('express');
var router = express.Router();
var moment = require('moment');
var google = require('googleapis');

router.get('/gapi-key/:viewId/:email', function(req, res) {
  const service_account_key_file = __dirname + '/../gapi_key.json';
  const service_account_email = (req.params.email != 'undefined') ? req.params.email : req.app.locals.config.gapi.email;
  const view_id = (req.params.viewId != 'undefined') ? req.params.viewId : req.app.locals.config.gapi.viewId;

  var jwtClient = new google.auth.JWT(
    service_account_email,
    service_account_key_file,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
  );

  jwtClient.authorize(function (err, token) {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({token: token, viewId: view_id});
  });

});

module.exports = router;
