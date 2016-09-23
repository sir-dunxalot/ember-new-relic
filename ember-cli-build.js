/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var options;

  switch (process.env.TEST_SCENARIO) {
    case undefined:
    case '1':
      break;
    case '2':
      options = {
        loadExternal: true,
        outputPath: ''
      };
      break;
  }

  var app = new EmberAddon(defaults, {
    // Add options here
    'ember-new-relic': options
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
