'use strict';

const path = require('path');

const mergeTrees = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');
const replace = require('broccoli-replace');
const fastbootTransform = require('fastboot-transform');

const templatesFolder = 'new-relic-templates';

const defaultBeacon = 'bam.nr-data.net';
const defaultAgentClassic = 'js-agent.newrelic.com/nr-1184.min.js';
const defaultAgentSPA = 'js-agent.newrelic.com/nr-spa-1184.min.js';

module.exports = {
  name: require('./package').name,

  outputPath: 'new-relic.js',

  newRelicConfig: null,

  importToVendor: true,

  included() {
    // Execute the included method of the parent class.
    this._super.included.apply(this, arguments);

    // Don't include the new relic script if running in a fastboot environment.
    if (process.env.EMBER_CLI_FASTBOOT) return;

    let env  = process.env.EMBER_ENV;
    let options = (this.app && this.app.options && this.app.options['ember-new-relic']) || {};

    let newRelicConfig = this.newRelicConfig = this.getNewRelicConfig(this.project.config(env).newRelic);

    let importToVendor = this.importToVendor = 'importToVendor' in options ? options.importToVendor : this.importToVendor;
    let outputPath = this.outputPath = 'outputPath' in options ? options.outputPath : this.outputPath;
    let isValidNewRelicConfig = this.isValidNewRelicConfig = newRelicConfig.applicationID && newRelicConfig.licenseKey;

    // Don't show the warning if they didn't provide an applicationID
    let showLackOfPropertiesWarning = newRelicConfig.applicationID && !isValidNewRelicConfig;
    if (showLackOfPropertiesWarning) {
      this._writeWarnLine('New Relic config needs `applicationId` and `licenseKey` properties in order to output New Relic script.');
    }

    if (!importToVendor && !outputPath) {
      throw this.ui.writeError(new Error('Cannot load external new-relic script from undefined output'));
    }

    if (importToVendor && isValidNewRelicConfig) {
      this.app.import('vendor/' + outputPath);
    }
  },

  /**
   A wrapper method to write a message with writeWarnLine or writeLine, depending on which version
   of ember-cli is used

   @param {string} msg Message to print
   */
  _writeWarnLine(msg) {
    if (this.ui.writeWarnLine) {
      this.ui.writeWarnLine(msg);
    } else {
      this.ui.writeLine(msg, 'WARNING');
    }
  },

  /**
   Translates the newRelicConfig into a decision: SPA, or no SPA?

   @param {{spaMonitoring: ?boolean}} newRelicConfig
   @returns {boolean}
  */
  wantsSPAMonitoring(newRelicConfig) {
    return !!newRelicConfig.spaMonitoring;
  },

  getNewRelicConfig: function(config) {
    let newRelicConfig = config || {};

    return {
      agent: newRelicConfig.agent,  // Default applied by tracker function
      applicationID: newRelicConfig.applicationId, // No default
      beacon: newRelicConfig.beacon || defaultBeacon,
      errorBeacon: newRelicConfig.errorBeacon || defaultBeacon,
      licenseKey: newRelicConfig.licenseKey, // No default
      sa: newRelicConfig.sa || 1,
      spaMonitoring: newRelicConfig.spaMonitoring || false,
    };
  },

  asScriptTag(path) {
    return `<script src="${path}"></script>`;
  },

  getTemplateValue(newRelicConfig, value) {
    if (value === 'newRelicConfig') {
      return JSON.stringify(newRelicConfig);
    } else {
      return newRelicConfig[value];
    }
  },

  getTemplateFile(newRelicConfig) {
    let wantsSPAMonitoring = this.wantsSPAMonitoring(newRelicConfig);
    return wantsSPAMonitoring ? 'new-relic-spa.js' : 'new-relic.js'
  },

  writeTrackingCodeTree(tree) {
    let newRelicConfig = this.newRelicConfig;
    let isValidNewRelicConfig = this.isValidNewRelicConfig;
    let outputPath = this.outputPath;
    let file;

    if (outputPath && isValidNewRelicConfig) {
      let wantsSPAMonitoring = this.wantsSPAMonitoring(newRelicConfig);
      let template = this.getTemplateFile(newRelicConfig);

      // set default agent, if none provided
      if (!newRelicConfig.agent) {
        newRelicConfig.agent = wantsSPAMonitoring ? defaultAgentSPA : defaultAgentClassic;
      }

      // pick up, move and rename code template file
      let templateFile = funnel(path.join(__dirname, templatesFolder), {
        files: [template],
        destDir: '/',
        getDestinationPath(relativePath) {
          if (relativePath === template) {
            return outputPath;
          }

          return relativePath;
        }
      });

      // replace template expressions with config
      let replacedTemplate = replace(templateFile, {
        files: [outputPath],
        patterns: [
          {
            match: /{{(.*?)}}/g,
            replacement: (match, value) => {
              return this.getTemplateValue(newRelicConfig, value);
            }
          }
        ]
      });

      file = fastbootTransform(replacedTemplate);
    }

    if (file) {
      if (tree) {
        return mergeTrees([tree, file]);
      } else {
        return file;
      }
    }

    return tree;
  },

  contentFor(type) {
    let isValidNewRelicConfig = this.isValidNewRelicConfig;
    let importToVendor = this.importToVendor;
    let outputPath = this.outputPath;

    if (type === 'head-footer' && !importToVendor && outputPath && isValidNewRelicConfig) {
      return this.asScriptTag(outputPath);
    }
  },

  treeForVendor(tree) {
    return this.importToVendor ? this.writeTrackingCodeTree(tree) : tree;
  },

  treeForPublic(tree) {
    return !this.importToVendor ? this.writeTrackingCodeTree(tree) : tree;
  }
};
