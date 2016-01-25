import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | new relic browser');

test('Loading New Relic Browser', function(assert) {
  visit('/');

  andThen(function() {
    var expectedError = new Error('Awh crap');
    var newRelic = window.NREUM;

    assert.expect(4);

    assert.ok(newRelic,
      'The New Relic object (NREUM) should be added to the window');

    assert.ok(typeof newRelic.noticeError === 'function',
      'New Relic Browser should be loaded');

    /* Now our errors are tracking, let's check they are
    caught by the extra Ember events like onerror */

    window.NREUM.noticeError = function(actualError) {

      assert.ok(true,
        'noticeError should be called by Ember.onerror');

      assert.equal(actualError, expectedError,
        'noticeError should receive the error object');

    };

    Ember.onerror(expectedError);

  });
});
