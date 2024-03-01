///
/// Copyright 2018-2024 The OpenZipkin Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
/// in compliance with the License. You may obtain a copy of the License at
///
/// http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software distributed under the License
/// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
/// or implied. See the License for the specific language governing permissions and limitations under
/// the License.
///

/*
 * Copyright 2018-2019 The OpenZipkin Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import {describe, it, expect} from "vitest";
import {load} from 'protobufjs'
import {create} from 'sway'
import {readFileSync as read} from 'fs'
import {load as loady} from 'js-yaml'

describe('Zipkin Http Api', () => {

  function validateSwagger(yaml: string, validationCallback:Function) {
    const zipkinAPI = read(yaml).toString();
    create({definition: loady(zipkinAPI) as string}).then(api => {
      validationCallback(api.validate());
    });
  }

  it('/api/v1 yaml should have no swagger syntax errors', () => {
    validateSwagger('zipkin-api.yaml', (result: { errors: any; }) => {
      expect(result.errors).toHaveLength(0);
    });
  });

  it('/api/v2 yaml should have no swagger syntax errors', () => {
    validateSwagger('zipkin2-api.yaml', (result: { errors: any; }) => {
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('Zipkin Protocol Buffers Api', () => {

  function validateProto(proto: any, validationCallback: Function) {
    load(proto, (err:any, root) => {
      if (err) throw err;
      validationCallback(root);
    });
  }

  it('should include core data structures', () => {
    validateProto('zipkin.proto', (root:any) => {
      expect(root.lookupType("zipkin.proto3.Endpoint")).toBeDefined();
      expect(root.lookupType("zipkin.proto3.Annotation")).toBeDefined();
      expect(root.lookupType("zipkin.proto3.Span")).toBeDefined();
      expect(root.lookupType("zipkin.proto3.ListOfSpans")).toBeDefined();
    });
  });

  it('should include reporting service', () => {
    validateProto('zipkin.proto', (root:any) => {
      // lookup is different for services vs messages
      expect(root.lookup("SpanService")).toBeDefined();
      expect(root.lookupType("zipkin.proto3.ReportResponse")).toBeDefined();
    });
  });
});
