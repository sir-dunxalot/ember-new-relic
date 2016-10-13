/* globals QUnit, test, EmberNewRelic */

var objectAssign = require('object-assign');
var broccoli = require('broccoli');
var fs = require('fs');
var path = require('path');

QUnit.module("ember-new-relic | When config['ember-new-relic'].spaMonitoring is false", {
  setup: function() {
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
        spaMonitoring: false,
        applicationId: 'test application ID',
        licenseKey: 'test license key',
    });
  },
});

test('wantsSPAMonitoring(newRelicConfig) returns false', function(assert) {
  assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), false);
});

test('getNewRelicTrackingCode returns classicTrackingCode', function(assert) {
  assert.equal(
    EmberNewRelic.getNewRelicTrackingCode(this.newRelicConfig),
    EmberNewRelic.classicTrackingCode(this.newRelicConfig));
});

QUnit.module("ember-new-relic | When config['ember-new-relic'].spaMonitoring is true", {
  setup: function() {
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
        spaMonitoring: true,
        applicationId: 'test application ID',
        licenseKey: 'test license key',
        agent: 'js-agent.newrelic.com/nr-spa-963.min.js',
    });
  },
});

test('contentFor head-footer returns script tag with src to outputPath if importToVendor option is false', function(assert) {
  var newRelicConfigAfterRemovingOurCustomConfig = objectAssign({}, this.newRelicConfig);
  delete newRelicConfigAfterRemovingOurCustomConfig.spaMonitoring;

  var original = EmberNewRelic.spaTrackingCode;
  EmberNewRelic.spaTrackingCode = function() { return 'spa!'; };

  EmberNewRelic.newRelicConfig = this.newRelicConfig;
  EmberNewRelic.importToVendor = false;

  try {
    assert.equal(
        EmberNewRelic.contentFor('head-footer'),
        EmberNewRelic.asScriptTag(EmberNewRelic.outputPath));
  } finally {
    EmberNewRelic.spaTrackingCode = original;
  }
});

test('wantsSPAMonitoring(newRelicConfig) returns true', function(assert) {
  assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), true);
});

test('getNewRelicTrackingCode returns spaTrackingCode', function(assert) {
  assert.equal(
    EmberNewRelic.getNewRelicTrackingCode(this.newRelicConfig),
    EmberNewRelic.spaTrackingCode(this.newRelicConfig));
});

QUnit.module("ember-new-relic | When outputPath, applicationId, and licenseKey are defined", {
  setup: function() {
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
        spaMonitoring: true,
        applicationId: 'test application ID',
        licenseKey: 'test license key',
        agent: 'js-agent.newrelic.com/nr-spa-963.min.js',
    });
  }
});

test('writeTrackingCodeTree returns a tree containing a file that has the tracking code.', function(assert) {
  var newRelicConfig = EmberNewRelic.newRelicConfig = this.newRelicConfig;
  var tree = EmberNewRelic.writeTrackingCodeTree();
  var builder = new broccoli.Builder(tree);

  // Stop the test runner for async tests.
  stop();

  return builder.build().then(function(results){
    var contents;

    // Start up the test runner for async tests, because then assert will have the appropriate context.
    start();

    contents = fs.readFileSync(path.join(results.directory, EmberNewRelic.outputPath), 'utf-8');
    assert.equal(contents, EmberNewRelic.getNewRelicTrackingCode(newRelicConfig));
  });
});
