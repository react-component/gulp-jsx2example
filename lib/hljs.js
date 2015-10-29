'use strict'

var util = require('util')
var highlightjs = require('highlight.js')

var template = '<div class="highlight"><pre><code language="%s">%s</code></pre></div>'

exports.render = function(value, lang) {
  var code = {
    language: 'unknow',
    value: ''
  }

  if (lang && highlightjs.getLanguage(lang)) {
    try {
      code = highlightjs.highlight(lang, value)
    } catch (__) {}
  } else {
    try {
      code = highlightjs.highlightAuto(value, ['js', 'xml', 'css', 'html'])
    } catch (__) {}
  }

  return util.format(template, code.language, code.value)
}
