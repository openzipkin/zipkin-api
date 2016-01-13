"use strict";

window.SwaggerDocs = angular.module("SwaggerDocs", ["ngAnimate", "ngCookies", "ngTouch", "ngSanitize", "ui.router", "ui.bootstrap", "hc.marked", "mohsen1.json-schema-view"]);
"use strict";

SwaggerDocs.config(function Router($stateProvider, $urlRouterProvider) {
  /*
    Routing Hierarchy
   =================
    home
   ├── info
   ├── models (TODO)
   ├── tags (TODO)
   │    └── tag/operations
   │
   └── paths
       └── path
           └── operations
               ├── parameters/parameter
               ├── responses/response
               └── try (TODO)
  */

  $stateProvider.state("home", {
    url: "/",
    controller: "MainCtrl",
    templateUrl: "app/main/main.html"
  }).state("home.paths", {
    url: "paths/:pathName",
    controller: "PathCtrl",
    templateUrl: "app/path/path.html"
  }).state("home.paths.operations", { url: "/:operationName" }).state("home.paths.operations.parameters", { url: "/parameters/:parameterName" }).state("home.paths.operations.responses", { url: "/responses/:responseCode" });

  $urlRouterProvider.otherwise("/");
});
/*
 * Digest Swagger document to make it ready for Swagger Docs
*/

"use strict";


SwaggerDocs.service("Digest", function highlight() {
  /*
   * Process Swagger document.
   *
   * @param swagger {object} - A Swagger document object representation
   * @param callback {function} - Will get resolved with Swagger document object
   *
  */
  this.process = function (swagger, callback) {
    var resolve = window.JsonRefs.resolveRefs;

    resolve(swagger, callback);
  };
});
"use strict";

SwaggerDocs.controller("MainCtrl", function MainCtrl($http, $rootScope, Digest) {
  // Initialize rendering of the app by assigning $rootScope variables
  getConfigs();

  /*
   * Gets configurations from embedded script or remote file
  */
  function getConfigs() {
    // use embedded configurations if it's available
    if (angular.isObject(window.swaggerDocsConfiguration)) {
      assignConfigs(window.swaggerDocsConfiguration);
      return;
    }

    // get configuration file remotely
    $http.get("./config.json").then(function (resp) {
      if (!angular.isObject(resp.data)) {
        throw new Error("Configuration should be an object.");
      }

      assignConfigs(resp.data);
    }, function () {
      throw new Error("Failed to load configurations.");
    });
  }

  /*
   * Gets Swagger specs from embedded script or remote file
  */
  function getSwagger() {
    // if specs is embedded in the document, use them
    if (angular.isObject(window.swaggerDocsSpecs)) {
      assignSwaggerSpecs(window.swaggerDocsSpecs);
      return;
    }

    // get specs file remotely
    $http.get($rootScope.config.loadSwaggerFrom).then(function (resp) {
      // if response data is string, it could be YAML.
      if (angular.isString(resp.data)) {
        var specs = window.jsyaml.load(resp.data);

        if (!angular.isObject(specs)) {
          throw new Error("Failed to parse Swagger YAML.");
        }

        assignSwaggerSpecs(specs);
        return;
      }

      if (!angular.isObject(resp.data)) {
        throw new Error("Swagger specs should be an object.");
      }

      assignSwaggerSpecs(resp.data);
    }, function () {
      throw new Error("Failed to load Swagger specs.");
    });
  }

  /*
   * Assigns configuration object to $rootScope
   * @param config {object} - The configuration object
  */
  function assignConfigs(config) {
    $rootScope.config = config;

    // once configuration is set, get Swagger specs
    getSwagger();
  }

  /*
   * Assigns Swagger specs to $rootScope
   * @param swagger {object} - the Swagger specs object
  */
  function assignSwaggerSpecs(swagger) {
    Digest.process(swagger, function (err, resolved) {
      // TODO: handle error
      if (err) {
        return console.error(err);
      }

      $rootScope.swagger = resolved;
    });
  }
});
"use strict";


SwaggerDocs.controller("OperationCtrl", function OperationCtrl($rootScope, $scope, $stateParams) {
  /*
   * Determines if this operations should be highlighted
   *
   * @param operationName {string}
   *
   * @return {boolean} - true if this operation should be highlighted
  */
  $scope.shouldHighlight = function setShouldHighlight(operationName) {
    // If there is a prameterName in state, let it highlight the parameter
    return !$stateParams.parameterName &&

    // if there is a responseCode in state, let it highlight the response
    !$stateParams.responseCode &&

    // if state's operationName equals operationName argument
    $stateParams.operationName === operationName;
  };

  /*
   * Generate a single digit int number for group of a response code
   * For example group code for response code 304 is 3
   *
   * @param responseCode {number} - response code number
   *
   * @returns {number} - a single digit number
  */
  $scope.getResponseCodeGroup = function (responseCode) {
    return Math.floor(parseInt(responseCode, 10) / 100);
  };
});
"use strict";


SwaggerDocs.controller("ParameterCtrl", function ParameterCtrl($rootScope, $scope, $stateParams) {
  /*
   * Determines if this operations should be highlighted
   *
   * @param parameterName {string}
   * @param operationName {string}
   *
   * @return {boolean} - true if this parameter should be highlighted
  */
  $scope.shouldHighlight = function setShouldHighlight(parameterName, operationName) {
    return $stateParams.parameterName && $stateParams.operationName && $stateParams.parameterName === parameterName && $stateParams.operationName === operationName;
  };

  /*
   * Gets schema of a parameter.
   * A parameter can have a type of schema property, if type is presents, the schema
   * itself is the schema
   *
   * @param parameter {object} - the parameter object
   *
   * @returns {object} - the schema to show
  */
  $scope.getSchema = function (parameter) {
    if (parameter.type) {
      return parameter;
    }

    return parameter.schema;
  };
});
"use strict";


SwaggerDocs.controller("PathCtrl", function PathCtrl($rootScope, $scope, $stateParams) {
  // decode UI components of a path name, it might contain invalid characters
  $scope.pathName = window.decodeURIComponent($stateParams.pathName);


  /*
   * Determines if this path should be highlighted
   *
   * @param pathName {string}
   *
   * @return {boolean} - true if this operation should be highlighted
  */
  $scope.shouldHighlight = function setShouldHighlight(pathName) {
    // if there is an operationName in state, let it highlight the operations
    return !$stateParams.operationName &&

    // If there is a prameterName in state, let it highlight the parameter
    !$stateParams.parameterName &&

    // if there is a responseCode in state, let it highlight the response
    !$stateParams.responseCode &&

    // if state's pathName equals pathName argument
    $stateParams.pathName === pathName;
  };

  /*
   * filter paths object based on current pathName.
   * If there is no pathName present it will return all paths
   *
   * @param paths {object} - The Swagger document paths object
   *
   * @returns {object} - filtered paths
  */
  $scope.filterPaths = function (paths) {
    if ($scope.pathName && angular.isObject(paths)) {
      return (function (_ref) {
        _ref[$scope.pathName] = paths[$scope.pathName];
        return _ref;
      })({});
    } else {
      return paths;
    }
  };
});
"use strict";


SwaggerDocs.controller("ResponseCtrl", function ResponseCtrl($rootScope, $scope, $stateParams) {
  /*
   * Determines if this response should be highlighted
   *
   * @param responseCode {string}
   *
   * @return {boolean} - true if this operation should be highlighted
  */
  $scope.shouldHighlight = function setShouldHighlight(responseCode, operationName) {
    return $stateParams.responseCode && $stateParams.operationName === operationName && $stateParams.responseCode === responseCode;
  };

  /*
   * Get schema of a response
   *
   * @param response {object}
   *
   * @returns {object} - the schema
  */
  $scope.getSchema = function (response) {
    return response.schema;
  };
});
/*
 * This attribute directive will get an argument, when that argument is true
 * it will apply the "swagger-docs-highlighted" class to the element and bring
 * it to the view using Element#scrollIntoViewIfNeeded() method
 *
 * @param do {boolean} - determines if it should highlight or not
 *
 * @example
 * <div highlight="true">This div will be highlighted</div>
*/

"use strict";


SwaggerDocs.directive("highlight", function highlight($parse) {
  return {
    restrict: "A",
    link: function (scope, element, attributes) {
      scope.$watch(attributes.highlight, apply);

      apply(attributes.highlight);

      function apply(newValue) {
        if (newValue === true ||

        // if the new value is expression and needs parsing, parse it
        (angular.isString(newValue) && $parse(newValue)(scope))) {
          angular.element("*").removeClass("swagger-docs-highlighted");
          element.scrollIntoViewIfNeeded(true);
          element.addClass("swagger-docs-highlighted");
        }
      }
    }
  };
});
// from https://github.com/panzi/scrollIntoViewIfNeeded/blob/master/scrollintoview.js

"use strict";

(function ($, undefined) {
  $.fn.scrollIntoView = function () {
    if (this.length > 0) this[0].scrollIntoView();
    return this;
  };

  $.fn.scrollIntoViewIfNeeded = document.createElement("div").scrollIntoViewIfNeeded ? function (arg) {
    if (this.length > 0) this[0].scrollIntoViewIfNeeded(arg);
    return this;
  } : function () {
    if (this.length > 0) {
      var doc = $(document);
      var win = $(window);
      var scroll_top = doc.scrollTop();
      var scroll_left = doc.scrollLeft();
      var win_height = win.innerHeight();
      var win_width = win.innerWidth();
      var offset = this.offset();
      var x = offset.left;
      var y = offset.top;
      var width = this.width();
      var height = this.height();

      if (width >= win_width) {
        if (x > scroll_left || x + width < scroll_left + win_width) {
          this[0].scrollIntoView();
          return this;
        }
      } else {
        if (x < scroll_left || x + width > scroll_left + win_width) {
          this[0].scrollIntoView();
          return this;
        }
      }

      if (height >= win_height) {
        if (y > scroll_top || y + height < scroll_top + win_height) {
          this[0].scrollIntoView();
          return this;
        }
      } else {
        if (y < scroll_top || y + height > scroll_top + win_height) {
          this[0].scrollIntoView();
          return this;
        }
      }
    }

    return this;
  };
})(jQuery);
"use strict";

SwaggerDocs.controller("NavbarCtrl", function NavbarCtrl($scope) {
  $scope.time = new Date();
});
"use strict";

SwaggerDocs.controller("SidebarCtrl", function SidebarCtrl($scope) {
  $scope.encodeURIComponent = window.encodeURIComponent;

  /*
   * Determines if the given path should be shown or not based on current filter
   * @param {string} pathName
   * @return {boolean} - true if the path should be shown, false otherwise
  */
  $scope.showPath = function (pathName, filter) {
    if (filter === undefined) filter = "";


    // Remove whitespace from beginning and end of the filter
    filter = filter.trim();

    // TODO: use edit distance or something more interesting
    return pathName.indexOf(filter) > -1;
  };
});
angular.module("SwaggerDocs").run(["$templateCache", function($templateCache) {$templateCache.put("app/main/main.html","<div ng-include=\"\'components/navbar/navbar.html\'\"></div><div class=\"container\"><div class=\"row\"><div class=\"col-md-3\" ng-include=\"\'components/sidebar/sidebar.html\'\"></div><div class=\"col-md-9\" ui-view=\"\"><div ng-include=\"\'components/info/info.html\'\"></div></div></div><div ng-include=\"\'components/footer/footer.html\'\"></div></div>");
$templateCache.put("app/parameter/parameter.html","<div class=\"parameter\" ng-controller=\"ParameterCtrl\" highlight=\"shouldHighlight(parameter.name, operationName)\"><a class=\"operation-name\" ui-sref=\"home.paths.operations.parameters({ parameterName: parameter.name, pathName: pathName, operationName: operationName })\"><h5 class=\"parameter-name\"><span class=\"name\">{{parameter.name}}</span> <span class=\"label label-danger\" ng-if=\"parameter.required\">Required</span> <span class=\"in\">{{parameter.in}} parameter</span></h5></a><div class=\"description\" marked=\"parameter.description\"></div><json-schema-view schema=\"getSchema(parameter)\" open=\"-1\"></json-schema-view></div>");
$templateCache.put("app/operation/operation.html","<div class=\"{{operationName}} operation\" ng-controller=\"OperationCtrl\" highlight=\"shouldHighlight(operationName)\"><header><a ui-sref=\"home.paths.operations({operationName: operationName, pathName: pathName})\"><h4>{{operationName | uppercase}} <span class=\"path-name\">{{pathName}}</span></h4></a></header><section><div marked=\"swagger.paths[pathName][operationName].description\"></div><h4 ng-if=\"swagger.paths[pathName][operationName].parameters.length\">Parameters</h4><div ng-repeat=\"parameter in swagger.paths[pathName][operationName].parameters\"><div ng-include=\"\'app/parameter/parameter.html\'\"></div></div><h4 ng-if=\"swagger.paths[pathName][operationName].responses\">Responses</h4><div ng-repeat=\"(responseCode, response) in swagger.paths[pathName][operationName].responses\"><div ng-include=\"\'app/response/response.html\'\"></div></div></section></div>");
$templateCache.put("app/path/path.html","<div ng-controller=\"PathCtrl\"><div class=\"path\" highlight=\"shouldHighlight(pathName)\" ng-repeat=\"(pathName, path) in filterPaths(swagger.paths)\"><header><a ui-sref=\"home.paths({pathName: pathName})\"><h2>{{pathName}}</h2></a></header><section><div marked=\"swagger.paths[pathName].description\"></div><div ng-repeat=\"(operationName, operation) in swagger.paths[pathName]\"><div ng-include=\"\'app/operation/operation.html\'\"></div></div></section></div></div>");
$templateCache.put("app/response/response.html","<div class=\"response\" ng-controller=\"ResponseCtrl\" highlight=\"shouldHighlight(responseCode, operationName)\"><a class=\"response-code\" ui-sref=\"home.paths.operations.responses({ responseCode: responseCode, operationName: operationName, pathName: pathName })\"><h5 class=\"response-code response-code-{{getResponseCodeGroup(responseCode)}}xx\">{{responseCode}}</h5></a><p marked=\"response.description\"></p><h6 ng-if=\"getSchema(response)\">Schema</h6><json-schema-view ng-if=\"getSchema(response)\" schema=\"getSchema(response)\" open=\"1\"></json-schema-view><h6 ng-if=\"response.headers\">Header</h6><div ng-repeat=\"(headerName, header) in response.headers\"><p><b>{{headerName}}</b> <span>({{header.type}})</span></p><div class=\"description\" marked=\"header.description\"></div></div></div>");
$templateCache.put("components/info/info.html","<div class=\"info\"><h1 class=\"title\">{{swagger.info.title}}</h1><p class=\"version\"><b>Version</b> {{swagger.info.version}}</p><p class=\"terms\" ng-if=\"swagger.info.termsOfService\"><b>Terms of Service</b> <a href=\"{{swagger.info.termsOfService}}\">{{swagger.info.termsOfService}}</a></p><div class=\"description\" marked=\"swagger.info.description\" ng-if=\"swagger.info.description\"></div></div>");
$templateCache.put("components/footer/footer.html","<div class=\"footer main-footer\"><hr><p>Powered by <a href=\"http://swagger.io\" target=\"_blank\">Swagger</a></p></div>");
$templateCache.put("components/sidebar/sidebar.html","<div ng-controller=\"SidebarCtrl\" class=\"side-bar\"><div class=\"filter\"><input type=\"text\" placeholder=\"Filter paths\" ng-model=\"pathsFilter\"></div><a class=\"all-paths path-name-link\" ui-sref=\"home.paths({pathName: null})\">All Paths</a> <a ng-repeat=\"(pathName, path) in swagger.paths\" ng-if=\"showPath(pathName, pathsFilter)\" class=\"path-name-link\" ui-sref=\"home.paths({pathName: encodeURIComponent(pathName)})\"><h5>{{pathName}}</h5></a></div>");
$templateCache.put("components/navbar/navbar.html","<nav class=\"navbar navbar-static-top sd-navbar\" ng-controller=\"NavbarCtrl\"><div class=\"container\"><div class=\"navbar-header\"><a class=\"navbar-brand sd-brand\" href=\"#/\">{{swagger.info.title}}</a></div><div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-6\"><ul class=\"nav navbar-nav navbar-right\"><li><a class=\"sd-alpha-link\" target=\"_blank\" href=\"https://github.com/mohsen1/swagger-docs\">Alpha</a></li></ul></div></div></nav>");}]);