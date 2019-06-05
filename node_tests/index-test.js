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

  QUnit.test('getTemplateFile returns correct classic template', function(assert) {
    assert.equal(
      EmberNewRelic.getTemplateFile(this.newRelicConfig),
      'new-relic.js'
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

  QUnit.test('getTemplateFile returns correct spa template', function(assert) {
    assert.equal(
      EmberNewRelic.getTemplateFile(this.newRelicConfig),
      'new-relic-spa.js'
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

    // simulate template replacement
    let template = fs.readFileSync(path.join(__dirname, '..', 'new-relic-templates/new-relic-spa.js'), 'utf-8');
    template = template.replace(/{{(.*?)}}/g, function(match, value) {
      return EmberNewRelic.getTemplateValue(newRelicConfig, value);
    });

    // get actual result
    let result = fs.readFileSync(path.join(builder.outputPath, EmberNewRelic.outputPath), 'utf-8');

    // here we test that the result includes the template and not just that it is equal
    // this is because the result file includes the fastboot guard wrapper
    assert.ok(result.indexOf(template) !== -1);

    await builder.cleanup();
  });

});

