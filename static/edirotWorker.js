/* globals importScripts:true, postMessage:true, Babel:true, ts:true*/


importScripts(
  '//cdn.bootcss.com/babel-standalone/6.4.4/babel.min.js',
  '//cdn.bootcss.com/typescript/2.1.4/typescript.min.js'
);

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
    result = ts.transpile(
      code,
      compileOptions
    );
  } catch (err) {
    console.error(err.message || err);
  }
  if (result) {
    return babelCompiler(result);
  }
  return result;
}

onmessage = function(event) { // eslint-disable-line
  var data = event.data;
  var code = data.code;
  var editorMode = data.editorMode;
  var compiler = editorMode === 'text/typescript' ?
    tsCompiler : babelCompiler;

  var transformCode = compiler(code);

  postMessage(transformCode);
};
