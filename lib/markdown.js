'use strict';
var marked = require('marked');
var renderer = new marked.Renderer();
var hljs = require('highlight.js');
var fs = require('fs');

renderer.code = function(code, lang) {
  var renderHtml = '';
  var ret = '';
  if (lang && hljs.getLanguage(lang)) {
    try {
      ret += hljs.highlight(lang, code).value;
    } catch (__) {}
  } else {
    try {
      ret += hljs.highlightAuto(code).value;
    } catch (__) {}
  }
  ret = renderHtml + '<div class="highlight"><pre class="hljs"><code class="' + lang + '">' + ret + '</code></pre></div>';
  return ret; // use external default escaping
}
renderer.heading = function(text, level) {
  var escapedText = text.replace(/\s+/g, '-')
  escapedText = escapedText.toLowerCase();
  escapedText = escapedText.replace(/^-+?|-+?$/, '');
  return '<h' + level + '>' + text + '<a id="user-content-' + escapedText + '" name="' +
    escapedText +
    '" class="anchor" aria-hidden="true" href="#' +
    escapedText +
    '"><span class="octicon octicon-link"></span></a></h' + level + '>';
}
renderer.link = function(href, title, text) {
  if (href.indexOf('http') === 0) {
    return '<a href="' + href + '" title="' + title + '">' + text + '</a>'
  }
  var fileindex = href.lastIndexOf('/')
  var filename = href.substr(fileindex + 1)
  if (/^([-\w]+)\.md$/.test(filename)) {
    href = href.replace(/\.md$/, '.html')
  }
  title = title || text;
  return '<a href="' + href + '" title="' + title + '">' + text + '</a>'
}

marked.setOptions({
  renderer: renderer
});

function formatMarkdown(str) {
  var markdownHtml = marked(str);
  return markdownHtml;
}

module.exports = function(filepath) {
  var content = fs.readFileSync(filepath, 'utf8');
  var result = formatMarkdown(content);
  return result;
};
