'use strict'

var xtpl = require('xtpl')
var path = require('path')
var fs = require('fs')

var rootDir = path.join(__dirname, '../views')
var defaultTemplate = path.join(rootDir, 'example.xtpl')

function xrender(data, type) {
  type = type || 'home'
  var xtplPath = path.join(rootDir, type + '.xtpl')

  if (!fs.existsSync(xtplPath)) {
    xtplPath = defaultTemplate
  }
  return xtplRender(xtplPath, data)
}

function xtplRender(filepath, data) {
  var result = null,
    complete = false
  xtpl.renderFile(filepath, data, function(err, content) {
    complete = true
    result = content
  })
  while (complete) {
    return result
  }
}

module.exports = xrender
