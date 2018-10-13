## Module Report
### Unknown Global

**Global**: `Ember.onerror`

**Location**: `addon/instance-initializers/new-relic.js` at line 51

```js
  }

  Ember.onerror = handleError;

  on('error', handleError);
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `addon/instance-initializers/new-relic.js` at line 55

```js
  on('error', handleError);

  if (Ember.Logger) {
    Ember.Logger.error = function(...messages) {
      handleError(generateError(messages.join(' ')));
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `addon/instance-initializers/new-relic.js` at line 56

```js

  if (Ember.Logger) {
    Ember.Logger.error = function(...messages) {
      handleError(generateError(messages.join(' ')));
    };
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/new-relic-browser-test.js` at line 17

```js
    const newRelic = window.NREUM;

    assert.expect(Ember.Logger ? 8 : 6);

    assert.ok(newRelic,
```

### Unknown Global

**Global**: `Ember.onerror`

**Location**: `tests/acceptance/new-relic-browser-test.js` at line 40

```js
    };

    Ember.onerror(new Error('Awh crap'));

    const transitionError = new Error('Ember Transition Aborted Test');
```

### Unknown Global

**Global**: `Ember.onerror`

**Location**: `tests/acceptance/new-relic-browser-test.js` at line 46

```js
    transitionError.name = "TransitionAborted";

    Ember.onerror(transitionError);

    if (Ember.Logger) {
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/new-relic-browser-test.js` at line 48

```js
    Ember.onerror(transitionError);

    if (Ember.Logger) {
      Ember.Logger.error('Whoops', 'We done messed up', {});
    }
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/new-relic-browser-test.js` at line 49

```js

    if (Ember.Logger) {
      Ember.Logger.error('Whoops', 'We done messed up', {});
    }

```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/new-relic-browser-test.js` at line 66

```js
    };

    Ember.Logger.error('Whoops', 'We done messed up');
  });
});
```
