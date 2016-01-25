# Ember New Relic

This is an early-stage addon for New Relic Browser. All PRs and issues are welcome.

- [Installation](#installation)
- [Usage](#usage)
- [Content Security Policy](#content-security-policy)

## Installation

```sh
ember install ember-new-relic
```

## Usage

Add your `applicationID` and `licenseKey` to `environment/config.js`:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    newRelic: {
      applicationId: '97bfuo3FFd3',
      licenseKey: 'ef234SgE4'
    }
  };
}
```

You might also want to specify your agent:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    newRelic: {
      agent: 'js-agent.newrelic.com/nr-768.min.js',
      applicationId: '97bfuo3FFd3',
      licenseKey: 'ef234SgE4'
    }
  };
}
```

All of the above can be found in your New Relic Browser's application settings.

To enable New Relic Browser in certain environments, just include `applicationId` for those environments only:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    newRelic: {
      licenseKey: 'ef234SgE4'
    }
  };

  if (environment !== test) {
    ENV.newRelic.applicationId = '97bfuo3FFd3';
  }
}
```

You can also use different application IDs for different environments:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    newRelic: {
      licenseKey: 'ef234SgE4'
    }
  };

  if (environment === 'development') {
    ENV.newRelic.applicationId = '97bfuo3FFd3';
  } else if (environment === 'production') {
    ENV.newRelic.applicationId = 'f99FJ930sp';
  }
}
```

## Content Security Policy

To avoid browser errors, add the following to your CSP:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    contentSecurityPolicy: {
      licenseKey: 'ef234SgE4',
      applicationId: '97bfuo3FFd3',
    },

    contentSecurityPolicy: {
      'connect-src': "'self' https://*.nr-data.net",
      'img-src': "'self' https://*.nr-data.net",
      'script-src': "'self' 'unsafe-inline' http://*.newrelic.com https://*.nr-data.net http://*.nr-data.net",
    },
  };
}
```
