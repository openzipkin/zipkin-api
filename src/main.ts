import './style.css'

import SwaggerUIBundle from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
// @ts-ignore
import SwaggerUIStandalonePreset from 'swagger-ui/dist/swagger-ui-standalone-preset'


window.onload = function() {
    // Begin Swagger UI call region
    // End Swagger UI call region
    // @ts-ignore
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
