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
const http_1 = __importDefault(__webpack_require__(/*! http */ "http"));
const app = express_1.default();
const server = new http_1.default.Server(app);
const port = process.env.PORT || 2567;
server.listen(port, () => {
    console.log("server listening on port", port);
});
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
/******/ 	__webpack_require__.h = () => ("fc3376228bd2021dfffb")
/******/ })();
/******/ 
/******/ }
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi41ODliODBjYmM3OTFjMzA5ODAyNC5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQ0FBa0MsbUJBQU8sQ0FBQyx3QkFBUztBQUNuRCwrQkFBK0IsbUJBQU8sQ0FBQyxrQkFBTTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELElBQUksSUFBVTtBQUNkLElBQUksaUJBQWlCO0FBQ3JCLElBQUksVUFBVTtBQUNkOzs7Ozs7Ozs7O1VDaEJBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xuY29uc3QgaHR0cF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJodHRwXCIpKTtcbmNvbnN0IGFwcCA9IGV4cHJlc3NfMS5kZWZhdWx0KCk7XG5jb25zdCBzZXJ2ZXIgPSBuZXcgaHR0cF8xLmRlZmF1bHQuU2VydmVyKGFwcCk7XG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAyNTY3O1xuc2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJzZXJ2ZXIgbGlzdGVuaW5nIG9uIHBvcnRcIiwgcG9ydCk7XG59KTtcbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4gY29uc29sZS5sb2coJ01vZHVsZSBkaXNwb3NlZC4gJykpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gKFwiZmMzMzc2MjI4YmQyMDIxZGZmZmJcIikiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=