import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | new relic browser');

test('Loading New Relic Browser', function(assert) {
  visit('/');

  andThen(function() {
    var newRelic = window.NREUM;

    assert.expect(8);

    assert.ok(newRelic,
      'The New Relic object (NREUM) should be added to the window');

    assert.ok(typeof newRelic.noticeError === 'function',
      'New Relic Browser should be loaded');

    /* Now our errors are tracking, let's check they are
    caught by the extra Ember events like onerror */

    window.NREUM.noticeError = function(error) {

      assert.ok(true,
        'noticeError should be called by Ember.onerror');

      assert.ok(error instanceof Error,
        'noticeError should receive an error object');

      assert.ok(error.name !== 'TransitionAborted',
        'noticeError should not be called by Ember.onerror on TransitionAborted errors.');
    };

    Ember.onerror(new Error('Awh crap'));

    const transitionError = new Error('Ember Transition Aborted Test');
    transitionError.name = "TransitionAborted";
    Ember.onerror(transitionError);

    Ember.Logger.error('Whoops', 'We done messed up', {});

  });
});
