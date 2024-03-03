window.onload = function () {
  //<editor-fold desc="Changeable Configuration Block">

  // Changes from defaults include the url and skipping the first standalone
  // preset, as that loads the TopBar. We don't need to load arbitrary API
  // definitions and forms increase the XSS attack surface.
  window.ui = SwaggerUIBundle({
    url: "https://zipkin.io/zipkin-api/zipkin2-api.yaml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
        SwaggerUIBundle.presets.apis,

      // Retain defaults, except index zero, which is the TopBar.
      // https://github.com/swagger-api/swagger-ui/blob/v5.11.8/src/standalone/presets/standalone/index.js#L10
      SwaggerUIStandalonePreset.slice(1)
    ],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};
