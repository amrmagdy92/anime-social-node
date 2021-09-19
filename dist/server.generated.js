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

/***/ "./server/Controllers/Comments/Comments.js":
/*!*************************************************!*\
  !*** ./server/Controllers/Comments/Comments.js ***!
  \*************************************************/
/***/ ((module) => {

eval("// FIXME: Create the logic for each of the functions exported here\n// MARK: This is where the logic from the SQL file is called\nmodule.exports = {\n  createComment: () => {},\n  updateComment: () => {},\n  deleteComment: () => {},\n  getComments: () => {},\n  reaction: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Comments/Comments.js?");

/***/ }),

/***/ "./server/Controllers/FlagReasons/FlagReasons.js":
/*!*******************************************************!*\
  !*** ./server/Controllers/FlagReasons/FlagReasons.js ***!
  \*******************************************************/
/***/ ((module) => {

eval("// FIXME: Create the logic for each of the functions exported here\nmodule.exports = {\n  getFlagReasons: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/FlagReasons/FlagReasons.js?");

/***/ }),

/***/ "./server/Controllers/Flags/Flags.js":
/*!*******************************************!*\
  !*** ./server/Controllers/Flags/Flags.js ***!
  \*******************************************/
/***/ ((module) => {

eval("// FIXME: Create the logic for each of the functions exported here\nmodule.exports = {\n  createFlag: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Flags/Flags.js?");

/***/ }),

/***/ "./server/Controllers/Follows/Follows.js":
/*!***********************************************!*\
  !*** ./server/Controllers/Follows/Follows.js ***!
  \***********************************************/
/***/ ((module) => {

eval("// FIXME: Create the logic for each of the functions exported here\nmodule.exports = {\n  follow: () => {},\n  unfollow: () => {},\n  blockUser: () => {},\n  unblockUser: () => {},\n  getSearchFollowings: () => {},\n  getFollowings: () => {},\n  getFollowers: () => {},\n  getBlockedUsers: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Follows/Follows.js?");

/***/ }),

/***/ "./server/Controllers/Polls/Polls.js":
/*!*******************************************!*\
  !*** ./server/Controllers/Polls/Polls.js ***!
  \*******************************************/
/***/ ((module) => {

eval("// FIXME: Create the logic for each of the functions exported here\nmodule.exports = {\n  addVote: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Polls/Polls.js?");

/***/ }),

/***/ "./server/Controllers/Posts/Posts.js":
/*!*******************************************!*\
  !*** ./server/Controllers/Posts/Posts.js ***!
  \*******************************************/
/***/ ((module) => {

eval("// FIXME: Create the logic for each of the functions exported here\nmodule.exports = {\n  createPost: () => {},\n  updatePost: () => {},\n  deletePost: () => {},\n  hide: () => {},\n  reaction: () => {},\n  getPosts: () => {}\n};\n\n//# sourceURL=webpack://anime-social-node/./server/Controllers/Posts/Posts.js?");

/***/ }),

/***/ "./server/Routes/CommentsRoute.js":
/*!****************************************!*\
  !*** ./server/Routes/CommentsRoute.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst CommentsController = __webpack_require__(/*! ../Controllers/Comments/Comments */ \"./server/Controllers/Comments/Comments.js\");\n\nrouter.get('/', CommentsController.getComments());\nrouter.post('/create', CommentsController.createComment());\nrouter.post('/reaction', CommentsController.reaction());\nrouter.post('/update/:comment_id', CommentsController.updateComment());\nrouter.delete('/delete/:comment_id', CommentsController.deleteComment());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/CommentsRoute.js?");

/***/ }),

/***/ "./server/Routes/FlagReasonsRoute.js":
/*!*******************************************!*\
  !*** ./server/Routes/FlagReasonsRoute.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst FlagReasonsController = __webpack_require__(/*! ../Controllers/FlagReasons/FlagReasons */ \"./server/Controllers/FlagReasons/FlagReasons.js\");\n\nrouter.get('/', FlagReasonsController.getFlagReasons());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/FlagReasonsRoute.js?");

/***/ }),

/***/ "./server/Routes/FlagsRoute.js":
/*!*************************************!*\
  !*** ./server/Routes/FlagsRoute.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst FlagsController = __webpack_require__(/*! ../Controllers/Flags/Flags */ \"./server/Controllers/Flags/Flags.js\");\n\nrouter.post('/create', FlagsController.createFlag());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/FlagsRoute.js?");

/***/ }),

/***/ "./server/Routes/PollsRoute.js":
/*!*************************************!*\
  !*** ./server/Routes/PollsRoute.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst PollsController = __webpack_require__(/*! ../Controllers/Polls/Polls */ \"./server/Controllers/Polls/Polls.js\");\n\nrouter.post('/vote', PollsController.addVote());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/PollsRoute.js?");

/***/ }),

/***/ "./server/Routes/PostsRoute.js":
/*!*************************************!*\
  !*** ./server/Routes/PostsRoute.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var router = __webpack_require__(/*! express */ \"express\").Router();\n\nconst PostsController = __webpack_require__(/*! ../Controllers/Posts/Posts */ \"./server/Controllers/Posts/Posts.js\");\n\nrouter.get('/', PostsController.getPosts());\nrouter.post('/create', PostsController.createPost());\nrouter.post('/hide', PostsController.hide());\nrouter.post('/reaction', PostsController.reaction());\nrouter.post('/update/:post_id', PostsController.updatePost());\nrouter.delete('/update/:post_id', PostsController.deletePost());\nmodule.exports = router;\n\n//# sourceURL=webpack://anime-social-node/./server/Routes/PostsRoute.js?");

/***/ }),

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var express = __webpack_require__(/*! express */ \"express\");\n\nconst FollowController = __webpack_require__(/*! ./Controllers/Follows/Follows */ \"./server/Controllers/Follows/Follows.js\");\n\nconst PostsRouter = __webpack_require__(/*! ./Routes/PostsRoute */ \"./server/Routes/PostsRoute.js\");\n\nconst CommentsRouter = __webpack_require__(/*! ./Routes/CommentsRoute */ \"./server/Routes/CommentsRoute.js\");\n\nconst FlagsRouter = __webpack_require__(/*! ./Routes/FlagsRoute */ \"./server/Routes/FlagsRoute.js\");\n\nconst FlagReasonsRouter = __webpack_require__(/*! ./Routes/FlagReasonsRoute */ \"./server/Routes/FlagReasonsRoute.js\");\n\nconst PollsRouter = __webpack_require__(/*! ./Routes/PollsRoute */ \"./server/Routes/PollsRoute.js\");\n\nvar app = express();\napp.use(express.json());\napp.use(express.urlencoded({\n  extended: true\n})); // FIXME: Need to find a better route structure for the Follows logic\n// Follows\n\napp.post('/api/follow', FollowController.follow());\napp.post('/api/unfollow', FollowController.unfollow());\napp.post('/api/block-user', FollowController.blockUser());\napp.post('/api/unblock-user', FollowController.unblockUser());\napp.get('/api/search-followings', FollowController.getSearchFollowings());\napp.get('/api/followings', FollowController.getFollowings());\napp.get('/api/followers', FollowController.getFollowers());\napp.get('/api/blocked-users', FollowController.getBlockedUsers()); // Posts\n\napp.use('/api/posts', PostsRouter); // Comments\n\napp.use('/api/comments', CommentsRouter); // Flags\n\napp.use('/api/flags', FlagsRouter); // Flag Reasons\n\napp.use('/api/flag-reasons', FlagReasonsRouter); //Polls\n\napp.use('/api/polls', PollsRouter);\nmodule.exports = app;\n\n//# sourceURL=webpack://anime-social-node/./server/app.js?");

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