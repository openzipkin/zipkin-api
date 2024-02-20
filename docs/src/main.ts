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

import './style.css'

import SwaggerUIBundle from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
// @ts-ignore
import SwaggerUIStandalonePreset from 'swagger-ui/dist/swagger-ui-standalone-preset'


window.onload = function() {
    // Begin Swagger UI call region
    // End Swagger UI call region
    SwaggerUIBundle({
        url: "https://zipkin.io/zipkin-api/zipkin2-api.yaml",
        dom_id: '#app',
        layout: "StandaloneLayout",
        presets: [
            // @ts-ignore
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            // @ts-ignore
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        deepLinking: true,
    })
}
