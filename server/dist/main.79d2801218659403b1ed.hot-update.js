"use strict";
exports.id = "main";
exports.ids = null;
exports.modules = {

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
const resolvers_1 = __importDefault(__webpack_require__(/*! ./resolvers */ "./src/resolvers.ts"));
const type_defs_1 = __importDefault(__webpack_require__(/*! ./type-defs */ "./src/type-defs.ts"));
const server = new apollo_server_1.ApolloServer({ resolvers: resolvers_1.default, entities: type_defs_1.default });
const app = express_1.default();
const port = process.env.PORT || 2567;
server.listen().then(({ url }) => console.log(`Server started at ${url}`));
if (true) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
}


/***/ }),

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = {
    Query: {
        testMessage: () => 'Hello World!'
    },
};


/***/ }),

/***/ "./src/type-defs.ts":
/*!**************************!*\
  !*** ./src/type-defs.ts ***!
  \**************************/
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


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1408b58bf5d916e08efa")
/******/ })();
/******/ 
/******/ }
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi43OWQyODAxMjE4NjU5NDAzYjFlZC5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQ0FBa0MsbUJBQU8sQ0FBQyx3QkFBUztBQUNuRCx3QkFBd0IsbUJBQU8sQ0FBQyxvQ0FBZTtBQUMvQyxvQ0FBb0MsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN6RCxvQ0FBb0MsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN6RCxrREFBa0QsK0RBQStEO0FBQ2pIO0FBQ0E7QUFDQSx3QkFBd0IsS0FBSyxzQ0FBc0MsSUFBSTtBQUN2RSxJQUFJLElBQVU7QUFDZCxJQUFJLGlCQUFpQjtBQUNyQixJQUFJLFVBQVU7QUFDZDs7Ozs7Ozs7Ozs7QUNoQmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWU7QUFDZjtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7OztBQ05hO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHdCQUF3QixtQkFBTyxDQUFDLG9DQUFlO0FBQy9DLGtCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7VUNWQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvcmVzb2x2ZXJzLnRzIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyLy4vc3JjL3R5cGUtZGVmcy50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xuY29uc3QgYXBvbGxvX3NlcnZlcl8xID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXJcIik7XG5jb25zdCByZXNvbHZlcnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZXNvbHZlcnNcIikpO1xuY29uc3QgdHlwZV9kZWZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vdHlwZS1kZWZzXCIpKTtcbmNvbnN0IHNlcnZlciA9IG5ldyBhcG9sbG9fc2VydmVyXzEuQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzOiByZXNvbHZlcnNfMS5kZWZhdWx0LCBlbnRpdGllczogdHlwZV9kZWZzXzEuZGVmYXVsdCB9KTtcbmNvbnN0IGFwcCA9IGV4cHJlc3NfMS5kZWZhdWx0KCk7XG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAyNTY3O1xuc2VydmVyLmxpc3RlbigpLnRoZW4oKHsgdXJsIH0pID0+IGNvbnNvbGUubG9nKGBTZXJ2ZXIgc3RhcnRlZCBhdCAke3VybH1gKSk7XG5pZiAobW9kdWxlLmhvdCkge1xuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IGNvbnNvbGUubG9nKCdNb2R1bGUgZGlzcG9zZWQuICcpKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICAgIFF1ZXJ5OiB7XG4gICAgICAgIHRlc3RNZXNzYWdlOiAoKSA9PiAnSGVsbG8gV29ybGQhJ1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhcG9sbG9fc2VydmVyXzEgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlclwiKTtcbmV4cG9ydHMuZGVmYXVsdCA9IGFwb2xsb19zZXJ2ZXJfMS5ncWwgYFxuXHR0eXBlIFF1ZXJ5e1xuICAgIFwiXCJcIlxuICAgIFRlc3QgTWVzc2FnZVxuICAgIFwiXCJcIlxuICAgIHRlc3RNZXNzYWdlOiBTdHJpbmchXG4gIH1cbmA7XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCIxNDA4YjU4YmY1ZDkxNmUwOGVmYVwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==