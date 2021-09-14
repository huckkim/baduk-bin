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
const TestResolver_1 = __importDefault(__webpack_require__(/*! ./Resolvers/TestResolver */ "./src/Resolvers/TestResolver.ts"));
const TestEntity_1 = __importDefault(__webpack_require__(/*! ./Entities/TestEntity */ "./src/Entities/TestEntity.ts"));
const server = new apollo_server_1.ApolloServer({ resolvers: TestResolver_1.default, entities: TestEntity_1.default });
const app = express_1.default();
const port = process.env.PORT || 2567;
server.listen().then(({ url }) => console.log(`Server started at ${url}`));
if (true) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
}


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("29d2e1c55799b5b4fc6b")
/******/ })();
/******/ 
/******/ }
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi4wYTUzMTcwNDdhNDcwYTJiZmM1My5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQ0FBa0MsbUJBQU8sQ0FBQyx3QkFBUztBQUNuRCx3QkFBd0IsbUJBQU8sQ0FBQyxvQ0FBZTtBQUMvQyx1Q0FBdUMsbUJBQU8sQ0FBQyxpRUFBMEI7QUFDekUscUNBQXFDLG1CQUFPLENBQUMsMkRBQXVCO0FBQ3BFLGtEQUFrRCxtRUFBbUU7QUFDckg7QUFDQTtBQUNBLHdCQUF3QixLQUFLLHNDQUFzQyxJQUFJO0FBQ3ZFLElBQUksSUFBVTtBQUNkLElBQUksaUJBQWlCO0FBQ3JCLElBQUksVUFBVTtBQUNkOzs7Ozs7Ozs7O1VDaEJBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xuY29uc3QgYXBvbGxvX3NlcnZlcl8xID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXJcIik7XG5jb25zdCBUZXN0UmVzb2x2ZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9SZXNvbHZlcnMvVGVzdFJlc29sdmVyXCIpKTtcbmNvbnN0IFRlc3RFbnRpdHlfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9FbnRpdGllcy9UZXN0RW50aXR5XCIpKTtcbmNvbnN0IHNlcnZlciA9IG5ldyBhcG9sbG9fc2VydmVyXzEuQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzOiBUZXN0UmVzb2x2ZXJfMS5kZWZhdWx0LCBlbnRpdGllczogVGVzdEVudGl0eV8xLmRlZmF1bHQgfSk7XG5jb25zdCBhcHAgPSBleHByZXNzXzEuZGVmYXVsdCgpO1xuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMjU2NztcbnNlcnZlci5saXN0ZW4oKS50aGVuKCh7IHVybCB9KSA9PiBjb25zb2xlLmxvZyhgU2VydmVyIHN0YXJ0ZWQgYXQgJHt1cmx9YCkpO1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBjb25zb2xlLmxvZygnTW9kdWxlIGRpc3Bvc2VkLiAnKSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCIyOWQyZTFjNTU3OTliNWI0ZmM2YlwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==