/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	/* globals importScripts:true, postMessage:true, Babel:true, ts:true*/

	importScripts('//cdn.bootcss.com/babel-standalone/6.4.4/babel.min.js', '//cdn.bootcss.com/typescript/2.1.4/typescript.min.js');

	function babelCompiler(code) {
	  var result = '';
	  try {
	    result = Babel.transform(code, {
	      presets: ['es2015', 'react', 'stage-0']
	    }).code;
	  } catch (err) {
	    console.error(err.message || err);
	  }
	  return result;
	}

	function tsCompiler(code) {
	  var compileOptions = {
	    module: ts.ModuleKind.ES2015,
	    target: ts.ScriptTarget.Latest,
	    jsx: 'preserve',
	    declaration: true
	  };
	  var result = '';
	  try {
	    result = ts.transpile(code, compileOptions);
	  } catch (err) {
	    console.error(err.message || err);
	  }
	  if (result) {
	    return babelCompiler(result);
	  }
	  return result;
	}

	onmessage = function onmessage(event) {
	  // eslint-disable-line
	  var data = event.data;
	  var code = data.code;
	  var editorMode = data.editorMode;
	  var compiler = editorMode === 'text/typescript' ? tsCompiler : babelCompiler;

	  var transformCode = compiler(code);

	  postMessage(transformCode);
	};

/***/ }
/******/ ]);