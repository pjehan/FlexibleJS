var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')

const templateDir = path.join(__dirname, '../templates')

var getSites = function getSites() {
  var sites = []
  var files = fs.readdirSync(templateDir)

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      sites.push(JSON.parse(fs.readFileSync(path.join(templateDir, file)), 'utf-8'))
    }
  })

  return sites
}

var getSite = function getSite(siteId) {
  var sites = getSites()

  for (var i = 0; i < sites.length; i++) {
    if (sites[i].id === siteId) {
      return sites[i]
    }
  }
}

var getTemplate = function getTemplate(siteId, templateId) {
  var site = getSite(siteId)

  for (var i = 0; i < site.templates.length; i++) {
    if (site.templates[i].id === templateId) {
      return site.templates[i]
    }
  }
}

router.get('/', function(req, res) {
  return res.json(getSites())
})

router.get('/:site', function(req, res) {
  var site = getSite(req.params.site)
  return (site) ? res.json(site) : res.status(404).send('Not Found')
})

router.get('/:site/:name', function(req, res) {
  var template = getTemplate(req.params.site, req.params.name)
  return (template) ? res.json(template) : res.status(404).send('Not Found')
})

module.exports = {
  router: router,
  getSites: getSites,
  getSite: getSite,
  getTemplate: getTemplate
}
