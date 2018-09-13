import Ember from 'ember';
import { on } from 'rsvp';
import { isNone } from '@ember/utils';

export function initialize() {
  const { NREUM } = window;

  if (!NREUM) {
    return;
  }

  function mustIgnoreError(error) {

    /* Ember 2.X seems to not catch `TransitionAborted` errors caused by
    regular redirects. We don't want these errors to show up in NewRelic
    so we have to filter them ourselfs.

    See https://github.com/emberjs/ember.js/issues/12505
    */

    if (isNone(error)) {
      return false;
    }

    return error.name === 'TransitionAborted';
  }

  function handleError(error) {

    if (mustIgnoreError(error)) {
      return;
    }

    try {
      NREUM.noticeError(error);
    } catch(e) {
      // Ignore
    }

    console.error(error); // eslint-disable-line  no-console
  }

  function generateError(cause, stack) {
    const error = new Error(cause);

    error.stack = stack;

    return error;
  }

  Ember.onerror = handleError;

  on('error', handleError);

  if (Ember.Logger) {
    Ember.Logger.error = function(...messages) {
      handleError(generateError(messages.join(' ')));
    };
  }
}

export default {
  name: 'new-relic',
  initialize
};
