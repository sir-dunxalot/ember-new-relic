/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    newRelic: {
      applicationId: '13358812', // A dedicated app for testing this addon
      licenseKey: 'fd2c3e04d0',
    },

    contentSecurityPolicy: {
      'connect-src': "'self' https://*.nr-data.net",
      'img-src': "'self' https://*.nr-data.net",
      'script-src': "'self' 'unsafe-inline' http://*.newrelic.com https://*.nr-data.net",
    },
  };
};
