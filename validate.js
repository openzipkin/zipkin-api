'use strict';

const Sway = require('sway');
const read = require('fs').readFileSync;
const load = require('js-yaml').load;
const yamls = ['./zipkin-api.yaml', './zipkin2-api.yaml'];

yamls.forEach(yaml => {
  const zipkinAPI = read(yaml).toString();

  Sway.create({definition: load(zipkinAPI)}).then(api => {
    const result = api.validate();

    if (result.errors.length) {
      console.error(`Validation failed for ${yaml}`)
      console.error(JSON.stringify(result.errors));
      return;
    }

    if (result.warnings.length) {
      console.warn(`Warnings in ${yaml}:`)
      console.warn(JSON.stringify(result.warnings));
    }

    console.log(`Validation of ${yaml} passed`);
  })
  .catch(error=> {
    console.error(`Error loading ${yaml}`);
    console.error(error);
  });
});
