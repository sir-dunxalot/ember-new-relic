import Ember from 'ember';

export function initialize() {
  const { NREUM } = window;

  if (!NREUM) {
    return;
  }

  function handleError(error) {
    try {
      NREUM.noticeError(error);
    } catch(e) {
      // Ignore
    }

    console.error(error.stack);
  }

  function generateError(cause, stack) {
    const error = new Error(cause);

    error.stack = stack;

    return error;
  }

  Ember.onerror = handleError;

  Ember.RSVP.on('error', handleError);

  Ember.Logger.error = function(message, cause, stack) {
    handleError(generateError(cause, stack));
  };
}

export default {
  name: 'new-relic',
  initialize
};
