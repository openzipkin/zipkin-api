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

import {resolve} from 'node:path';
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    base:'/zipkin-api/',
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(resolve(__dirname, './zipkin-api.yaml')),
                    dest: '',
                },
                {
                    src: normalizePath(resolve(__dirname, './thrift')),
                    dest: './',
                },
                {
                    src: normalizePath(resolve(__dirname, './zipkin.proto')),
                    dest: '',
                },
                {
                    src: normalizePath(resolve(__dirname, './zipkin2-api.yaml')),
                    dest: '',
                },
            ],
        }),
    ],
})
