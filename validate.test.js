/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const Sway = require('sway');
const read = require('fs').readFileSync;
const load = require('js-yaml').load;

function validateSwagger(yaml, validationCallback) {
  const zipkinAPI = read(yaml).toString();
  Sway.create({definition: load(zipkinAPI)}).then(api => {
    validationCallback(api.validate());
  });
}

describe('Zipkin Http Api', () => {
  it('/api/v1 yaml should have no swagger syntax errors', done => {
    validateSwagger('./zipkin-api.yaml', result => {
      expect(result.errors).toHaveLength(0);
      done();
    });
  });

  it('/api/v1 yaml should have no swagger syntax errors', done => {
    validateSwagger('./zipkin2-api.yaml', result => {
      expect(result.errors).toHaveLength(0);
      done();
    });
  });
});
