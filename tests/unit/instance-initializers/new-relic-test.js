import Ember from 'ember';
import NewRelicInitializer from '../../../instance-initializers/new-relic';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | new relic', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  NewRelicInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
