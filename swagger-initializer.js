window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // Changes from defaults include the url and skipping the first standalone
  // preset, as that loads the TopBar which has XSS problems.
  window.ui = SwaggerUIBundle({
    url: "https://zipkin.io/zipkin-api/zipkin2-api.yaml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset.slice(1) // index zero is the TopBar
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};
