Ember New Relic [![Build Status](https://travis-ci.org/sir-dunxalot/ember-new-relic.svg?branch=master)](https://travis-ci.org/sir-dunxalot/ember-new-relic)
======

This Ember addon adds [New Relic Browser](http://newrelic.com/browser-monitoring) to your app. All PRs and issues are welcome.

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Configuration](#configuration)
    - [SPA Monitoring](#spa-monitoring)
  - [Environments](#environments)
- [Content Security Policy](#content-security-policy)
- [Development](#development)

## Installation

```sh
ember install ember-new-relic
```

## Usage

### Basic Usage

Add your `applicationId` and `licenseKey` to `environment/config.js`:

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

### Configuration

You might also want to specify your agent, beacon, or other properties:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    newRelic: {
      agent: 'js-agent.newrelic.com/nr-892.min.js',
      applicationId: '97bfuo3FFd3',
      beacon: 'bam.nr-data.net',
      errorBeacon: 'bam.nr-data.net',
      licenseKey: 'ef234SgE4',
      spaMonitoring: true,
      sa: 1,
    }
  };
}
```

Value and descriptions for all of the above can be found in your New Relic Browser's application settings.

It is likely you will only have to set `applicationId`, `licenseKey`, and `agent` to match your New Relic code snippet.

#### SPA Monitoring

New Relic released [SPA Monitoring](https://docs.newrelic.com/docs/browser/single-page-app-monitoring/get-started/welcome-single-page-app-monitoring) on July 12th 2016. By default, this addon does *not* use SPA Monitoring.

If you want to use New Relic SPA Monitoring, you must enable `spaMonitoring` in your configuration as follows:

```js
/* config/environment.js */

module.exports = function(environment) {
  environment === 'development';

  var ENV = {
    newRelic: {
      spaMonitoring: true,
    }
  };
}
```

This will replace the default New Relic code snippet with the New Relic SPA code snippet.

### Environments

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
    newRelic: {
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

## Development

Run the tests using `ember test` or by navigating to the `/tests` route in the browser.

Please accompany PRs for bugs and new functionality with test coverage.
