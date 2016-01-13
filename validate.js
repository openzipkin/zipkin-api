'use strict';

const SwaggerTools = require('swagger-tools');
const read = require('fs').readFileSync;
const load = require('js-yaml').load;
const zipkinAPI = read('./zipkin-api.yaml').toString();

SwaggerTools.specs.v2.validate(load(zipkinAPI), (error, result)=> {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  
  if (result.warnings && result.warnings.length) {
    console.log('Found warnings: ');
    console.log(result.warnings);
  } 

  console.log('Spec is valid');
});
