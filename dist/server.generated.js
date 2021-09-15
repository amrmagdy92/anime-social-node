/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/***/ ((module) => {

eval("const config = {\n  env: 'development',\n  port: 3000,\n  MySQLURI: 'localhost:1433'\n};\nmodule.exports = config;\n\n//# sourceURL=webpack://anime-social-node/./config/config.js?");

/***/ }),

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var express = __webpack_require__(/*! express */ \"express\");\n\nvar app = express();\napp.use(express.json());\napp.use(express.urlencoded({\n  extended: true\n})); // TODO: Set routes here\n\n//# sourceURL=webpack://anime-social-node/./server/app.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const config = __webpack_require__(/*! ../config/config */ \"./config/config.js\");\n\nconst cluster = __webpack_require__(/*! cluster */ \"cluster\");\n\nconst process = __webpack_require__(/*! process */ \"process\");\n\nconst http = __webpack_require__(/*! http */ \"http\");\n\nconst CPU_COUNT = __webpack_require__(/*! os */ \"os\").cpus().length;\n\nconst app = __webpack_require__(/*! ./app */ \"./server/app.js\");\n\nif (cluster.isMaster) {\n  console.info(`Master process is running at ${process.pid}`);\n\n  for (let i = 0; i < CPU_COUNT; i++) {\n    cluster.fork();\n    console.log(`Created worker #${i + 1}`);\n  }\n\n  cluster.on('exit', (worker, code, signal) => {\n    console.error(`Worker(${worker.process.pid}) died with code(${code}) and signal(${signal})`);\n    cluster.fork();\n  });\n} else {\n  http.createServer(app).listen(config.port);\n  console.log(`Server(${process.pid}) is listening at port(${config.port})`);\n}\n\n;\n\n//# sourceURL=webpack://anime-social-node/./server/server.js?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("cluster");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server/server.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;