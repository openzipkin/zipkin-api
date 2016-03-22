'use strict';

const Sway = require('sway');
const read = require('fs').readFileSync;
const load = require('js-yaml').load;
const zipkinAPI = read('./zipkin-api.yaml').toString();

Sway.create({definition: load(zipkinAPI)}).then(api => {
  const result = api.validate();

  if (result.errors.length) {
    console.error('Validation failed.')
    console.error(JSON.stringify(result.errors));
    return;
  }

  if (result.warnings.length) {
    console.warn('Warnings:')
    console.warn(JSON.stringify(result.warnings));
  }

  console.log('Validation passed');
})
.catch(error=> {
  console.error('Error loading API');
  console.error(error);
});
