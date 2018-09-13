import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

/* https://github.com/emberjs/ember-qunit/pull/304 */

start({ setupEmberOnerrorValidation: false });
