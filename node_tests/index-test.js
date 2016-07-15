/* globals QUnit, test, EmberNewRelic */

QUnit.module("ember-new-relic | When config['ember-new-relic'].spaMonitoring is false", {
  setup() {
    this.newRelicConfig = {
        spaMonitoring: false,
        applicationId: 'test application ID',
        licenseKey: 'test license key',
    };
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
  setup() {
    this.newRelicConfig = {
        spaMonitoring: true,
        applicationId: 'test application ID',
        licenseKey: 'test license key',
    };
  },
});

/*
skip('contentFor head-footer returns SPA tracking code', 0, function(assert) {
  // TODO
});
*/

test('wantsSPAMonitoring(newRelicConfig) returns true', function(assert) {
  assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), true);
});
