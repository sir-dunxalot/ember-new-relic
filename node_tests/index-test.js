/* globals QUnit */

const broccoli = require('broccoli');
const fs = require('fs');
const path = require('path');
const EmberNewRelic = require('../index.js');

QUnit.module('ember-new-relic | When config[\'ember-new-relic\'].spaMonitoring is false', function(hooks) {

  hooks.before(function() {
    EmberNewRelic.isValidNewRelicConfig = false;
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
      spaMonitoring: false,
      applicationId: 'test application ID',
      licenseKey: 'test license key'
    });
  });

  QUnit.test('wantsSPAMonitoring(newRelicConfig) returns false', function(assert) {
    assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), false);
  });

  QUnit.test('getNewRelicTrackingCode returns classicTrackingCode', function(assert) {
    assert.equal(
      EmberNewRelic.getNewRelicTrackingCode(this.newRelicConfig),
      EmberNewRelic.classicTrackingCode(this.newRelicConfig)
    );
  });
});

QUnit.module('ember-new-relic | When config[\'ember-new-relic\'].spaMonitoring is true', function(hooks) {

  hooks.before(function() {
    EmberNewRelic.isValidNewRelicConfig = false;
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
      spaMonitoring: true,
      applicationId: 'test application ID',
      licenseKey: 'test license key',
      agent: 'js-agent.newrelic.com/nr-spa-963.min.js',
    });
  });

  QUnit.test('contentFor head-footer returns script tag with src to outputPath if importToVendor option is false and newRelicConfig is valid', function(assert) {
    let newRelicConfigAfterRemovingOurCustomConfig = Object.assign({}, this.newRelicConfig);
    delete newRelicConfigAfterRemovingOurCustomConfig.spaMonitoring;

    let original = EmberNewRelic.spaTrackingCode;
    EmberNewRelic.spaTrackingCode = function() { return 'spa!'; };

    EmberNewRelic.newRelicConfig = this.newRelicConfig;
    EmberNewRelic.importToVendor = false;
    EmberNewRelic.isValidNewRelicConfig = false;

    try {
      assert.equal(
        EmberNewRelic.contentFor('head-footer'),
        undefined
      );

      EmberNewRelic.isValidNewRelicConfig = true;
      assert.equal(
        EmberNewRelic.contentFor('head-footer'),
        EmberNewRelic.asScriptTag(EmberNewRelic.outputPath)
      );
    } finally {
      EmberNewRelic.spaTrackingCode = original;
    }
  });

  QUnit.test('wantsSPAMonitoring(newRelicConfig) returns true', function(assert) {
    assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), true);
  });

  QUnit.test('getNewRelicTrackingCode returns spaTrackingCode', function(assert) {
    assert.equal(
      EmberNewRelic.getNewRelicTrackingCode(this.newRelicConfig),
      EmberNewRelic.spaTrackingCode(this.newRelicConfig)
    );
  });

});

QUnit.module('ember-new-relic | When outputPath, applicationId, and licenseKey are defined', function(hooks) {

  hooks.before(function() {
    EmberNewRelic.isValidNewRelicConfig = false;
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
      spaMonitoring: true,
      applicationId: 'test application ID',
      licenseKey: 'test license key',
      agent: 'js-agent.newrelic.com/nr-spa-963.min.js',
    });
  });

  QUnit.test('writeTrackingCodeTree returns a tree containing a file that has the tracking code when newRelicConfig is valid', async function(assert) {
    let newRelicConfig = EmberNewRelic.newRelicConfig = this.newRelicConfig;
    let tree = EmberNewRelic.writeTrackingCodeTree();

    // Tree should be undefined
    assert.equal(tree, undefined);

    // When NewRelicConfig is valid, tree will be `ok`.
    EmberNewRelic.isValidNewRelicConfig = true;
    tree = EmberNewRelic.writeTrackingCodeTree();

    assert.ok(tree);

    let builder = new broccoli.Builder(tree);
    await builder.build();

    let contents = fs.readFileSync(path.join(builder.outputPath, EmberNewRelic.outputPath), 'utf-8');
    assert.equal(contents, EmberNewRelic.getNewRelicTrackingCode(newRelicConfig));

    await builder.cleanup();
  });

});

