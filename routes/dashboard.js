var express = require('express');
var router = express.Router();
var moment = require('moment');
var google = require('googleapis');

router.get('/gapi-key', function(req, res) {
  const service_account_email = req.app.locals.config.gapi.email;
  const srevice_account_key_file = __dirname + '/../gapi_key.json';
  const view_id = req.app.locals.config.gapi.view_id;
  
  var jwtClient = new google.auth.JWT(
    service_account_email,
    srevice_account_key_file,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
  );
  
  jwtClient.authorize(function (err, token) {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({token: token, view_id: view_id});
  });
  
});

module.exports = router;
