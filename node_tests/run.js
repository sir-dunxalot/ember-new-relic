// jshint node: true
var testrunner = require('qunit');

var tests = [
  {
    code: {
      path: '../index.js',
      namespace: 'EmberNewRelic',
    },
    tests: 'index-test.js',
  },
];

testrunner.run(tests, function(error, report) {

  if (error) {
    console.error('error:', error);
    process.exitCode = 2;
  }

  if (report.failed > 0) {
    process.exitCode = 1;
  }
});
