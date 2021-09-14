"use strict";
exports.id = "main";
exports.ids = null;
exports.modules = {

/***/ "./src/Entities/TestEntity.ts":
/*!************************************!*\
  !*** ./src/Entities/TestEntity.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports["default"] = apollo_server_1.gql `
	type Query{
    """
    Test Message
    """
    testMessage: String!
  }
`;


/***/ }),

/***/ "./src/Resolvers/TestResolver.ts":
/*!***************************************!*\
  !*** ./src/Resolvers/TestResolver.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = {
    Query: {
        testMessage: () => 'Hello World!'
    },
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
const TestResolver_1 = __importDefault(__webpack_require__(/*! ./Resolvers/TestResolver */ "./src/Resolvers/TestResolver.ts"));
const TestEntity_1 = __importDefault(__webpack_require__(/*! ./Entities/TestEntity */ "./src/Entities/TestEntity.ts"));
const server = new apollo_server_1.ApolloServer({ resolvers: TestResolver_1.default, entities: TestEntity_1.default });
const app = express_1.default();
const port = process.env.PORT || 2567;
server.listen(port, () => {
    console.log("server listening on port", port);
});
if (true) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
}


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("apollo-server");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("0a5317047a470a2bfc53")
/******/ })();
/******/ 
/******/ }
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi44OGU3YWFmMTY3ZDA5Y2Y0ZjNmNS5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsd0JBQXdCLG1CQUFPLENBQUMsb0NBQWU7QUFDL0Msa0JBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNWYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBZTtBQUNmO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7O0FDTmE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQ0FBa0MsbUJBQU8sQ0FBQyx3QkFBUztBQUNuRCx3QkFBd0IsbUJBQU8sQ0FBQyxvQ0FBZTtBQUMvQyx1Q0FBdUMsbUJBQU8sQ0FBQyxpRUFBMEI7QUFDekUscUNBQXFDLG1CQUFPLENBQUMsMkRBQXVCO0FBQ3BFLGtEQUFrRCxtRUFBbUU7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsSUFBSSxJQUFVO0FBQ2QsSUFBSSxpQkFBaUI7QUFDckIsSUFBSSxVQUFVO0FBQ2Q7Ozs7Ozs7Ozs7O0FDbEJBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7OztVQ0FBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvRW50aXRpZXMvVGVzdEVudGl0eS50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL3NyYy9SZXNvbHZlcnMvVGVzdFJlc29sdmVyLnRzIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJhcG9sbG8tc2VydmVyXCIiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYXBvbGxvX3NlcnZlcl8xID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXJcIik7XG5leHBvcnRzLmRlZmF1bHQgPSBhcG9sbG9fc2VydmVyXzEuZ3FsIGBcblx0dHlwZSBRdWVyeXtcbiAgICBcIlwiXCJcbiAgICBUZXN0IE1lc3NhZ2VcbiAgICBcIlwiXCJcbiAgICB0ZXN0TWVzc2FnZTogU3RyaW5nIVxuICB9XG5gO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgdGVzdE1lc3NhZ2U6ICgpID0+ICdIZWxsbyBXb3JsZCEnXG4gICAgfSxcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGV4cHJlc3NfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZXhwcmVzc1wiKSk7XG5jb25zdCBhcG9sbG9fc2VydmVyXzEgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlclwiKTtcbmNvbnN0IFRlc3RSZXNvbHZlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1Jlc29sdmVycy9UZXN0UmVzb2x2ZXJcIikpO1xuY29uc3QgVGVzdEVudGl0eV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL0VudGl0aWVzL1Rlc3RFbnRpdHlcIikpO1xuY29uc3Qgc2VydmVyID0gbmV3IGFwb2xsb19zZXJ2ZXJfMS5BcG9sbG9TZXJ2ZXIoeyByZXNvbHZlcnM6IFRlc3RSZXNvbHZlcl8xLmRlZmF1bHQsIGVudGl0aWVzOiBUZXN0RW50aXR5XzEuZGVmYXVsdCB9KTtcbmNvbnN0IGFwcCA9IGV4cHJlc3NfMS5kZWZhdWx0KCk7XG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAyNTY3O1xuc2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJzZXJ2ZXIgbGlzdGVuaW5nIG9uIHBvcnRcIiwgcG9ydCk7XG59KTtcbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4gY29uc29sZS5sb2coJ01vZHVsZSBkaXNwb3NlZC4gJykpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjBhNTMxNzA0N2E0NzBhMmJmYzUzXCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9