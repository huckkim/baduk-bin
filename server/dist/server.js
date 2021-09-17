/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BoardLogic/BadukGame.ts":
/*!*************************************!*\
  !*** ./src/BoardLogic/BadukGame.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.__esModule = true;
exports.BadukGameManager = exports.BadukGame = exports.calculateTerritory = exports.findSpaceSize = exports.killGroup = exports.killSurroundingGroups = exports.hasLiberties = exports.setupBoard = void 0;
var types_1 = __webpack_require__(/*! ../shared/types */ "./src/shared/types.ts");
var helper_1 = __webpack_require__(/*! ./helper */ "./src/BoardLogic/helper.ts");
/*----------------------------- GAME LOGIC ----------------------------- */
/**
 * setup Board with proper size and handicap
 * @param size
 * @param handicap
 * @returns Board object and color of player to move
 */
function setupBoard(size, handicap) {
    var board = new Array(size).fill(null).map(function () { return new Array(size).fill(null); });
    if (handicap.length == 0) {
        return [board, types_1.Color.BLACK];
    }
    handicap.forEach(function (coord) { board[coord.y][coord.x] = types_1.Color.BLACK; });
    return [board, types_1.Color.WHITE];
}
exports.setupBoard = setupBoard;
/**
 * pre: board at loc != null
 *
 * @param board
 * @param loc
 * @returns Checks if the group located at loc has any liberties
 */
function hasLiberties(board, loc) {
    var toVisit = [loc];
    var curr_player = board[loc.y][loc.x];
    var visisted = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (!visisted[curr.y][curr.x]) {
            // Empty space => liberty
            if (board[curr.y][curr.x] == null)
                return true;
            // if the stone is the same color go to it's neightbours
            else if (board[curr.y][curr.x] == curr_player) {
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            visisted[curr.y][curr.x] = true;
        }
    }
    return false;
}
exports.hasLiberties = hasLiberties;
/**
 * @param board
 * @param curr_player
 * @param move
 * @returns returns if a move is valid and if it is, the resulting board and the number of stones captured
 */
function playBoardMove(board, curr_player, move) {
    if (board[move.y][move.x] != null)
        return [false, board, 0, "can't play ontop of a stone"];
    return commitPlaceAndKill(board, curr_player, move);
}
/**
 *
 * @param board
 * @param curr_player
 * @param loc
 * @returns whether the move of placing a stone of curr_player at loc is valid, and if so
 *          the new board and the number of stones killed
 */
function commitPlaceAndKill(board, curr_player, loc) {
    board[loc.y][loc.x] = curr_player;
    if (hasLiberties(board, loc)) {
        var _a = killSurroundingGroups(board, loc), nboard = _a[0], killed = _a[1];
        return [true, nboard, killed, "Ok"];
    }
    else {
        var _b = killSurroundingGroups(board, loc), nboard = _b[0], killed = _b[1];
        if (killed == 0) {
            board[loc.y][loc.x] = null; // reset player
            return [false, board, 0, "Suicide is illegal"];
        }
        return [true, nboard, killed, "Ok"];
    }
}
/**
 * Finds the board after killing the surrounding enemy groups with no liberties
 * @param board
 * @param loc
 * @returns new board and number of enemy stones killed
 */
function killSurroundingGroups(board, loc) {
    var toVisit = [loc];
    var curr_player = board[loc.y][loc.x];
    var visisted = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    var killed = 0;
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (!visisted[curr.y][curr.x]) {
            if (board[curr.y][curr.x] == null)
                continue;
            else if (board[curr.y][curr.x] == curr_player) {
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            else {
                if (!hasLiberties(board, curr)) {
                    var _a = killGroup(board, curr), tboard = _a[0], tkilled = _a[1];
                    board = tboard;
                    killed += tkilled;
                }
            }
            visisted[curr.y][curr.x] = true;
        }
    }
    return [board, killed];
}
exports.killSurroundingGroups = killSurroundingGroups;
/**
 * pre: board at loc != null
 * @param board
 * @param loc
 * @returns returns board after killing the group at loc, and the number of stones killed
 */
function killGroup(board, loc) {
    var toVisit = [loc];
    var curr_player = board[loc.y][loc.x];
    var visited = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    var killed = 0;
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (!visited[curr.y][curr.x]) {
            if (board[curr.y][curr.x] == curr_player) {
                board[curr.y][curr.x] = null;
                killed += 1;
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            visited[curr.y][curr.x] = true;
        }
    }
    return [board, killed];
}
exports.killGroup = killGroup;
// pre: board at loc is empty
function findSpaceSize(board, loc) {
    var toVisit = [loc];
    var visited = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    var sz = 0;
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (!visited[curr.y][curr.x]) {
            if (board[curr.y][curr.x] == null) {
                sz += 1;
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            visited[curr.y][curr.x] = true;
        }
    }
    return sz;
}
exports.findSpaceSize = findSpaceSize;
/**
 * pre: dead groups are removed beforehand
 * @param board
 * @returns return territory points for [black, white]
 */
function calculateTerritory(board) {
    var visited = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    var black_territory = 0;
    var white_territory = 0;
    for (var i = 0; i < board.length; ++i) {
        for (var j = 0; j < board.length; ++j) {
            if (!visited[i][j] && board[i][j] === null) {
                var loc = new types_1.Coord(j, i);
                var color = helper_1.findBorderingColor(board, loc);
                var sz = findSpaceSize(board, loc);
                if (color === types_1.Color.BLACK) {
                    black_territory += sz;
                }
                else if (color === types_1.Color.WHITE) {
                    white_territory += sz;
                }
                // else color === null => empty board / disputed areas no points
                // mark as viewed
                helper_1.setVisited(board, visited, loc);
            }
        }
    }
    return [black_territory, white_territory];
}
exports.calculateTerritory = calculateTerritory;
/**
 * Class representing a game of Baduk
 * @param size
 * @param handicap
 * @param komi
 */
var BadukGame = /** @class */ (function () {
    function BadukGame(size, handicap, komi) {
        var _a = setupBoard(size, handicap), board = _a[0], curr_player = _a[1];
        this.board = board;
        this.prev_board = null;
        this.curr_player = curr_player;
        this.has_passed = false;
        this.komi = komi;
        this.black_captures = 0;
        this.white_captures = 0;
        this.is_over = false;
    }
    /**
     * @param move
     * @param curr_player
     * @returns returns whether the move was valid (boolean) or a winner (color) if the game is over
     */
    BadukGame.prototype.playMove = function (move, curr_player) {
        var _a;
        if (curr_player != this.curr_player)
            return [false, "Illegal move, not your turn"];
        else if (move == null) {
            if (this.has_passed == true) {
                // THE GAME IS DONE
                // Calculate winner
                this.is_over = true;
                _a = calculateTerritory(this.board), this.black_territory = _a[0], this.white_territory = _a[1];
                var black_score = this.black_captures + this.black_territory;
                var white_score = this.white_captures + this.white_territory;
                white_score += this.komi; // add Komi for white
                return [[(black_score > white_score) ? types_1.Color.BLACK : types_1.Color.WHITE, black_score, white_score], "Game over"];
            }
            else {
                this.has_passed = true;
            }
        }
        else {
            this.has_passed = false;
            var _b = playBoardMove(this.board, this.curr_player, move), valid = _b[0], nboard = _b[1], captures = _b[2], str = _b[3];
            // invalid move
            if (!valid) {
                return [false, "Illegal Move, " + str];
            }
            // ko, not valid move
            if (this.prev_board !== null && helper_1.isBoardEqual(this.prev_board, nboard)) {
                return [false, "Illegal Move, Ko"];
            }
            // update ko board
            this.prev_board = helper_1.cloneBoard(this.board);
            // update board state
            this.board = nboard;
            // update captured stones
            if (this.curr_player == types_1.Color.BLACK)
                this.black_captures += captures;
            else
                this.white_captures += captures;
        }
        // next players turn
        this.curr_player = this.curr_player == types_1.Color.BLACK ? types_1.Color.WHITE : types_1.Color.BLACK;
        return [true, "Valid Move"];
    };
    BadukGame.prototype.removeGroup = function (loc) {
        if (this.board[loc.y][loc.x] === types_1.Color.BLACK) {
            var _a = killGroup(this.board, loc), nboard = _a[0], killed = _a[1];
            this.white_captures += killed;
            this.board = nboard;
        }
        else if (this.board[loc.y][loc.x] === types_1.Color.WHITE) {
            var _b = killGroup(this.board, loc), nboard = _b[0], killed = _b[1];
            this.black_captures += killed;
            this.board = nboard;
        }
    };
    return BadukGame;
}());
exports.BadukGame = BadukGame;
;
// Single Game state manager
var BadukGameManager = /** @class */ (function () {
    function BadukGameManager(server) {
        this.server = server;
        this.has_started = false;
    }
    BadukGameManager.prototype.addBlack = function (socket) {
        this.black_client = socket;
        socket.emit("PLAYING_BLACK");
    };
    BadukGameManager.prototype.addWhite = function (socket) {
        this.white_client = socket;
        socket.emit("PLAYING_WHITE");
    };
    BadukGameManager.prototype.playMove = function (socket, x, y) {
        if (this.game.prev_board != null)
            console.log(helper_1.getNumsFromBoard(this.game.prev_board));
        var _a = this.game.playMove(new types_1.Coord(x, y), (socket.id === this.black_client.id) ? types_1.Color.BLACK : types_1.Color.WHITE), res = _a[0], msg = _a[1];
        if (typeof res !== "boolean") {
            this.server.emit("GAME_END", (res[0] === types_1.Color.BLACK) ? this.black_client : this.white_client, res[1], res[2], msg);
        }
        else {
            // Valid move
            if (res) {
                this.server.emit("UPDATE_BOARD", helper_1.getNumsFromBoard(this.game.board), this.game.black_captures, this.game.white_captures, msg);
            }
            else {
                socket.emit("ERROR", msg);
            }
        }
    };
    BadukGameManager.prototype.pass = function (socket) {
        var _a = this.game.playMove(null, (socket.id === this.black_client.id) ? types_1.Color.BLACK : types_1.Color.WHITE), res = _a[0], msg = _a[1];
        if (typeof res !== "boolean") {
            console.log("Game ended");
            console.log(res, msg);
            var winner = res[0], black_score = res[1], white_score = res[2];
            this.server.emit("GAME_END", winner === types_1.Color.BLACK ? 1 : -1, black_score, white_score, msg);
        }
        else {
            // Valid move
            if (res) {
                this.server.emit("UPDATE_BOARD", helper_1.getNumsFromBoard(this.game.board), this.game.black_captures, this.game.white_captures, msg);
            }
            else {
                socket.emit("ERROR", msg);
            }
        }
    };
    BadukGameManager.prototype.startGame = function () {
        this.has_started = true;
        this.game = new BadukGame(19, [], 6.5);
        this.server.emit("GAME_STARTED", helper_1.getNumsFromBoard(this.game.board));
        this.black_client.emit("BLACK_PLAYER");
        this.white_client.emit("WHITE_PLAYER");
    };
    return BadukGameManager;
}());
exports.BadukGameManager = BadukGameManager;


/***/ }),

/***/ "./src/BoardLogic/helper.ts":
/*!**********************************!*\
  !*** ./src/BoardLogic/helper.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.__esModule = true;
exports.cloneBoard = exports.alphaToCoord = exports.setVisited = exports.findBorderingColor = exports.getBoardFromStrings = exports.getNumsFromBoard = exports.getStringsFromBoard = exports.getCoordFromBoard = exports.selectGroup = exports.setColor = exports.isBoardEmpty = exports.isBoardEqual = void 0;
var types_1 = __webpack_require__(/*! ../shared/types */ "./src/shared/types.ts");
var BadukGame_1 = __webpack_require__(/*! ./BadukGame */ "./src/BoardLogic/BadukGame.ts");
/* ----------------------------- UTILITY ----------------------------- */
/**
 * @param board1
 * @param board2
 * @returns if board1 and board2 represent the same state
 */
function isBoardEqual(board1, board2) {
    for (var i = 0; i < board1.length; ++i) {
        for (var j = 0; j < board1.length; ++j) {
            if (board1[i][j] !== board2[i][j])
                return false;
        }
    }
    return true;
}
exports.isBoardEqual = isBoardEqual;
/**
 * @param board
 * @returns return if board is empty (has no stones)
 */
function isBoardEmpty(board) {
    for (var _i = 0, board_1 = board; _i < board_1.length; _i++) {
        var row = board_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var space = row_1[_a];
            if (space != null)
                return false;
        }
    }
    return true;
}
exports.isBoardEmpty = isBoardEmpty;
/**
 * sets each of the Coords given in moves to curr_player in board
 * @param board
 * @param moves Array of Coords to place stone
 * @param curr_player
 * @returns
 */
function setColor(board, moves, curr_player) {
    moves.forEach(function (move) {
        board[move.y][move.x] = curr_player;
    });
    return board;
}
exports.setColor = setColor;
;
/**
 * pre: board at loc != null
 * @param board
 * @param loc
 * @return a Board with only the group connected to the stone at loc placed
 */
function selectGroup(board, loc) {
    var toVisit = [loc];
    var curr_player = board[loc.y][loc.x];
    var checkGraph = Array(board.length).fill(null).map(function () { return new Array(board.length).fill("N"); });
    var size = board.length;
    var nboard = new Array(size).fill(null).map(function () { return new Array(size).fill(null); });
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (checkGraph[curr.y][curr.x] == "N") {
            nboard[curr.y][curr.x] = curr_player;
            if (board[curr.y][curr.x] == curr_player) {
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            checkGraph[curr.y][curr.x] = "D";
        }
    }
    return nboard;
}
exports.selectGroup = selectGroup;
/**
 * @param board
 * @return given a board, return an array of coords for location of black and white stones
 */
function getCoordFromBoard(board) {
    var black_coords = [];
    var white_coords = [];
    for (var i = 0; i < board.length; ++i) {
        for (var j = 0; j < board.length; ++j) {
            if (board[i][j] == types_1.Color.BLACK) {
                black_coords.push(new types_1.Coord(j, i));
            }
            else if (board[i][j] == types_1.Color.WHITE) {
                white_coords.push(new types_1.Coord(j, i));
            }
        }
    }
    return [black_coords, white_coords];
}
exports.getCoordFromBoard = getCoordFromBoard;
function getStringsFromBoard(board) {
    var nboard = [];
    for (var i = board.length - 1; i >= 0; --i) {
        var row = board[i].map(function (val) { return (val === null) ? '-' : ((val === types_1.Color.BLACK) ? 'X' : 'O'); });
        nboard.push(row);
    }
    return nboard;
}
exports.getStringsFromBoard = getStringsFromBoard;
function getNumsFromBoard(board) {
    var nboard = [];
    board.forEach(function (row) {
        var nrow = row.map(function (val) { return (val === null) ? 0 : ((val === types_1.Color.BLACK) ? 1 : -1); });
        nboard.push(nrow);
    });
    return nboard;
}
exports.getNumsFromBoard = getNumsFromBoard;
function getBoardFromStrings(board) {
    var nboard = BadukGame_1.setupBoard(board.length, [])[0];
    for (var i = 0; i < board.length; ++i) {
        for (var j = 0; j < board.length; ++j) {
            if (board[i][j] == 'X')
                nboard[i][j] = types_1.Color.BLACK;
            else if (board[i][j] == 'O')
                nboard[i][j] = types_1.Color.WHITE;
        }
    }
    return nboard;
}
exports.getBoardFromStrings = getBoardFromStrings;
/**
 * find the bordering color empty space at loc
 * pre: board at loc == null, if both colors or none are present return null
 * @param board
 * @param loc
 * @returns
 */
function findBorderingColor(board, loc) {
    var toVisit = [loc];
    var visited = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    var curr_color = null;
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (!visited[curr.y][curr.x]) {
            if (board[curr.y][curr.x] !== null) {
                if (curr_color === null)
                    curr_color = board[curr.y][curr.x];
                else if (curr_color != board[curr.y][curr.x])
                    return null;
            }
            else {
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            visited[curr.y][curr.x] = true;
        }
    }
    return curr_color;
}
exports.findBorderingColor = findBorderingColor;
function setVisited(board, visited, loc) {
    var toVisit = [loc];
    var tvisited = Array(board.length).fill(null).map(function () { return new Array(board.length).fill(false); });
    var sz = 0;
    while (toVisit.length != 0) {
        var curr = toVisit.pop();
        if (!tvisited[curr.y][curr.x]) {
            if (board[curr.y][curr.x] == null) {
                visited[curr.y][curr.x] = true;
                if (curr.y + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x, curr.y + 1));
                if (curr.y - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x, curr.y - 1));
                if (curr.x + 1 < board.length)
                    toVisit.push(new types_1.Coord(curr.x + 1, curr.y));
                if (curr.x - 1 >= 0)
                    toVisit.push(new types_1.Coord(curr.x - 1, curr.y));
            }
            tvisited[curr.y][curr.x] = true;
        }
    }
    return visited;
}
exports.setVisited = setVisited;
function alphaToCoord(str) {
    var x = str.charCodeAt(0) - 65;
    if (x >= 9)
        --x;
    var y = str.charCodeAt(1) - 49;
    return new types_1.Coord(x, y);
}
exports.alphaToCoord = alphaToCoord;
function cloneBoard(board) {
    var nboard = [];
    board.forEach(function (row) {
        var nrow = row.map(function (e) { return e; });
        nboard.push(nrow);
    });
    return nboard;
}
exports.cloneBoard = cloneBoard;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var http_1 = __importDefault(__webpack_require__(/*! http */ "http"));
var socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
var BadukGame_1 = __webpack_require__(/*! ./BoardLogic/BadukGame */ "./src/BoardLogic/BadukGame.ts");
var cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
// Configure Database
// Configure API
//  - GET newGame 
//    in: size, handicap, color, 
//   out: socket game room id
// internally a new room will be created that has as game manager
// the room will keep track of the state of the game and when it is done
// save the game to the database
//  - GET game
//    in: url / id
//   out: redirct to socket room?
var app = express_1["default"]();
var router = express_1["default"].Router();
var server = new http_1["default"].Server(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
var port = process.env.PORT || 2567;
app.use(cors_1["default"]());
server.listen(port, function () {
    console.log("server listening on port", port);
});
router.get('/basicTest', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send('/basicTest');
        return [2 /*return*/];
    });
}); });
var game = new BadukGame_1.BadukGameManager(io);
var clients = [];
// Starting point for users
io.on('connection', function (socket) {
    console.log("Connection established with:", socket.id);
    // Add Socket to list of clients
    clients.push(socket);
    socket.on("JOIN_GAME", function () {
    });
    socket.on("PLAY_MOVE", function (x, y, pass) {
        if (!game.has_started) {
            console.log("Game not started");
            socket.emit("ERROR", "Game not started");
        }
        else {
            console.log("Move", x, y, "entered");
            if (pass)
                game.pass(socket);
            else {
                game.playMove(socket, parseInt(x), parseInt(y));
            }
        }
    });
    socket.on("START_GAME", function () {
        if (clients.length < 2) {
            console.log("Not enough players");
            socket.emit("ERROR", "Not enough players");
        }
        else {
            console.log("Staring game");
            game.addBlack(clients[0]);
            game.addWhite(clients[1]);
            game.startGame();
        }
    });
    socket.on("disconnect", function () {
        console.log("Connection lost with:", socket.id);
        var i = clients.indexOf(socket);
        if (i > -1) {
            clients.splice(i, 1);
        }
        console.log(clients.length);
    });
});
if (true) {
    module.hot.accept();
    module.hot.dispose(function () { return console.log('Module disposed. '); });
}


/***/ }),

/***/ "./src/shared/types.ts":
/*!*****************************!*\
  !*** ./src/shared/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.__esModule = true;
exports.Coord = exports.Color = void 0;
var Color;
(function (Color) {
    Color[Color["BLACK"] = 0] = "BLACK";
    Color[Color["WHITE"] = 1] = "WHITE";
})(Color = exports.Color || (exports.Color = {}));
;
var Coord = /** @class */ (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coord;
}());
exports.Coord = Coord;


/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!******************************************************!*\
  !*** ./node_modules/webpack/hot/log-apply-result.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!*****************************************!*\
  !*** ./node_modules/webpack/hot/log.js ***!
  \*****************************************/
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!***********************************************!*\
  !*** ./node_modules/webpack/hot/poll.js?1000 ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?1000";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 0;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

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
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
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
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("183f42718271abfff29a")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						return setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						blockingPromises = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			}).catch(function(err) { if(err.code !== "MODULE_NOT_FOUND") throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./node_modules/webpack/hot/poll.js?1000");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RztXQUNIO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNO1dBQ047V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHOztXQUVIO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQTtXQUNBLEdBQUc7O1dBRUg7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQSxpQkFBaUIscUNBQXFDO1dBQ3REOztXQUVBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxRQUFRO1dBQ1I7V0FDQTtXQUNBLFFBQVE7V0FDUjtXQUNBLE1BQU07V0FDTixLQUFLO1dBQ0wsSUFBSTtXQUNKLEdBQUc7V0FDSDs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7O1dBRUE7V0FDQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOztXQUVBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDs7V0FFQTtXQUNBO1dB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V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRSxJQUFJO1dBQ047V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0EsRUFBRSx3QkFBd0IsZ0RBQWdEO1dBQzFFOzs7OztVRTVkQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvQm9hcmRMb2dpYy9CYWR1a0dhbWUudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvQm9hcmRMb2dpYy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL3NyYy9zaGFyZWQvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcInNvY2tldC5pb1wiIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IHVwZGF0ZSBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0IHVwZGF0ZSBtYW5pZmVzdCBmaWxlbmFtZSIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvaG90IG1vZHVsZSByZXBsYWNlbWVudCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvcmVxdWlyZSBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkJhZHVrR2FtZU1hbmFnZXIgPSBleHBvcnRzLkJhZHVrR2FtZSA9IGV4cG9ydHMuY2FsY3VsYXRlVGVycml0b3J5ID0gZXhwb3J0cy5maW5kU3BhY2VTaXplID0gZXhwb3J0cy5raWxsR3JvdXAgPSBleHBvcnRzLmtpbGxTdXJyb3VuZGluZ0dyb3VwcyA9IGV4cG9ydHMuaGFzTGliZXJ0aWVzID0gZXhwb3J0cy5zZXR1cEJvYXJkID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3R5cGVzXCIpO1xudmFyIGhlbHBlcl8xID0gcmVxdWlyZShcIi4vaGVscGVyXCIpO1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBHQU1FIExPR0lDIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKipcbiAqIHNldHVwIEJvYXJkIHdpdGggcHJvcGVyIHNpemUgYW5kIGhhbmRpY2FwXG4gKiBAcGFyYW0gc2l6ZVxuICogQHBhcmFtIGhhbmRpY2FwXG4gKiBAcmV0dXJucyBCb2FyZCBvYmplY3QgYW5kIGNvbG9yIG9mIHBsYXllciB0byBtb3ZlXG4gKi9cbmZ1bmN0aW9uIHNldHVwQm9hcmQoc2l6ZSwgaGFuZGljYXApIHtcbiAgICB2YXIgYm9hcmQgPSBuZXcgQXJyYXkoc2l6ZSkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KHNpemUpLmZpbGwobnVsbCk7IH0pO1xuICAgIGlmIChoYW5kaWNhcC5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gW2JvYXJkLCB0eXBlc18xLkNvbG9yLkJMQUNLXTtcbiAgICB9XG4gICAgaGFuZGljYXAuZm9yRWFjaChmdW5jdGlvbiAoY29vcmQpIHsgYm9hcmRbY29vcmQueV1bY29vcmQueF0gPSB0eXBlc18xLkNvbG9yLkJMQUNLOyB9KTtcbiAgICByZXR1cm4gW2JvYXJkLCB0eXBlc18xLkNvbG9yLldISVRFXTtcbn1cbmV4cG9ydHMuc2V0dXBCb2FyZCA9IHNldHVwQm9hcmQ7XG4vKipcbiAqIHByZTogYm9hcmQgYXQgbG9jICE9IG51bGxcbiAqXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm5zIENoZWNrcyBpZiB0aGUgZ3JvdXAgbG9jYXRlZCBhdCBsb2MgaGFzIGFueSBsaWJlcnRpZXNcbiAqL1xuZnVuY3Rpb24gaGFzTGliZXJ0aWVzKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciBjdXJyX3BsYXllciA9IGJvYXJkW2xvYy55XVtsb2MueF07XG4gICAgdmFyIHZpc2lzdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoIXZpc2lzdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgLy8gRW1wdHkgc3BhY2UgPT4gbGliZXJ0eVxuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgdGhlIHN0b25lIGlzIHRoZSBzYW1lIGNvbG9yIGdvIHRvIGl0J3MgbmVpZ2h0Ym91cnNcbiAgICAgICAgICAgIGVsc2UgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBjdXJyX3BsYXllcikge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmhhc0xpYmVydGllcyA9IGhhc0xpYmVydGllcztcbi8qKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEBwYXJhbSBtb3ZlXG4gKiBAcmV0dXJucyByZXR1cm5zIGlmIGEgbW92ZSBpcyB2YWxpZCBhbmQgaWYgaXQgaXMsIHRoZSByZXN1bHRpbmcgYm9hcmQgYW5kIHRoZSBudW1iZXIgb2Ygc3RvbmVzIGNhcHR1cmVkXG4gKi9cbmZ1bmN0aW9uIHBsYXlCb2FyZE1vdmUoYm9hcmQsIGN1cnJfcGxheWVyLCBtb3ZlKSB7XG4gICAgaWYgKGJvYXJkW21vdmUueV1bbW92ZS54XSAhPSBudWxsKVxuICAgICAgICByZXR1cm4gW2ZhbHNlLCBib2FyZCwgMCwgXCJjYW4ndCBwbGF5IG9udG9wIG9mIGEgc3RvbmVcIl07XG4gICAgcmV0dXJuIGNvbW1pdFBsYWNlQW5kS2lsbChib2FyZCwgY3Vycl9wbGF5ZXIsIG1vdmUpO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIG1vdmUgb2YgcGxhY2luZyBhIHN0b25lIG9mIGN1cnJfcGxheWVyIGF0IGxvYyBpcyB2YWxpZCwgYW5kIGlmIHNvXG4gKiAgICAgICAgICB0aGUgbmV3IGJvYXJkIGFuZCB0aGUgbnVtYmVyIG9mIHN0b25lcyBraWxsZWRcbiAqL1xuZnVuY3Rpb24gY29tbWl0UGxhY2VBbmRLaWxsKGJvYXJkLCBjdXJyX3BsYXllciwgbG9jKSB7XG4gICAgYm9hcmRbbG9jLnldW2xvYy54XSA9IGN1cnJfcGxheWVyO1xuICAgIGlmIChoYXNMaWJlcnRpZXMoYm9hcmQsIGxvYykpIHtcbiAgICAgICAgdmFyIF9hID0ga2lsbFN1cnJvdW5kaW5nR3JvdXBzKGJvYXJkLCBsb2MpLCBuYm9hcmQgPSBfYVswXSwga2lsbGVkID0gX2FbMV07XG4gICAgICAgIHJldHVybiBbdHJ1ZSwgbmJvYXJkLCBraWxsZWQsIFwiT2tcIl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgX2IgPSBraWxsU3Vycm91bmRpbmdHcm91cHMoYm9hcmQsIGxvYyksIG5ib2FyZCA9IF9iWzBdLCBraWxsZWQgPSBfYlsxXTtcbiAgICAgICAgaWYgKGtpbGxlZCA9PSAwKSB7XG4gICAgICAgICAgICBib2FyZFtsb2MueV1bbG9jLnhdID0gbnVsbDsgLy8gcmVzZXQgcGxheWVyXG4gICAgICAgICAgICByZXR1cm4gW2ZhbHNlLCBib2FyZCwgMCwgXCJTdWljaWRlIGlzIGlsbGVnYWxcIl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0cnVlLCBuYm9hcmQsIGtpbGxlZCwgXCJPa1wiXTtcbiAgICB9XG59XG4vKipcbiAqIEZpbmRzIHRoZSBib2FyZCBhZnRlciBraWxsaW5nIHRoZSBzdXJyb3VuZGluZyBlbmVteSBncm91cHMgd2l0aCBubyBsaWJlcnRpZXNcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnMgbmV3IGJvYXJkIGFuZCBudW1iZXIgb2YgZW5lbXkgc3RvbmVzIGtpbGxlZFxuICovXG5mdW5jdGlvbiBraWxsU3Vycm91bmRpbmdHcm91cHMoYm9hcmQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIGN1cnJfcGxheWVyID0gYm9hcmRbbG9jLnldW2xvYy54XTtcbiAgICB2YXIgdmlzaXN0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIga2lsbGVkID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdID09IG51bGwpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBlbHNlIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55ICsgMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSAtIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCArIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggLSAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghaGFzTGliZXJ0aWVzKGJvYXJkLCBjdXJyKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2EgPSBraWxsR3JvdXAoYm9hcmQsIGN1cnIpLCB0Ym9hcmQgPSBfYVswXSwgdGtpbGxlZCA9IF9hWzFdO1xuICAgICAgICAgICAgICAgICAgICBib2FyZCA9IHRib2FyZDtcbiAgICAgICAgICAgICAgICAgICAga2lsbGVkICs9IHRraWxsZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JvYXJkLCBraWxsZWRdO1xufVxuZXhwb3J0cy5raWxsU3Vycm91bmRpbmdHcm91cHMgPSBraWxsU3Vycm91bmRpbmdHcm91cHM7XG4vKipcbiAqIHByZTogYm9hcmQgYXQgbG9jICE9IG51bGxcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnMgcmV0dXJucyBib2FyZCBhZnRlciBraWxsaW5nIHRoZSBncm91cCBhdCBsb2MsIGFuZCB0aGUgbnVtYmVyIG9mIHN0b25lcyBraWxsZWRcbiAqL1xuZnVuY3Rpb24ga2lsbEdyb3VwKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciBjdXJyX3BsYXllciA9IGJvYXJkW2xvYy55XVtsb2MueF07XG4gICAgdmFyIHZpc2l0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIga2lsbGVkID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXRlZFtjdXJyLnldW2N1cnIueF0pIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtjdXJyLnldW2N1cnIueF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGtpbGxlZCArPSAxO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbYm9hcmQsIGtpbGxlZF07XG59XG5leHBvcnRzLmtpbGxHcm91cCA9IGtpbGxHcm91cDtcbi8vIHByZTogYm9hcmQgYXQgbG9jIGlzIGVtcHR5XG5mdW5jdGlvbiBmaW5kU3BhY2VTaXplKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB2aXNpdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgdmFyIHN6ID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXRlZFtjdXJyLnldW2N1cnIueF0pIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN6ICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpdGVkW2N1cnIueV1bY3Vyci54XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN6O1xufVxuZXhwb3J0cy5maW5kU3BhY2VTaXplID0gZmluZFNwYWNlU2l6ZTtcbi8qKlxuICogcHJlOiBkZWFkIGdyb3VwcyBhcmUgcmVtb3ZlZCBiZWZvcmVoYW5kXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEByZXR1cm5zIHJldHVybiB0ZXJyaXRvcnkgcG9pbnRzIGZvciBbYmxhY2ssIHdoaXRlXVxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVUZXJyaXRvcnkoYm9hcmQpIHtcbiAgICB2YXIgdmlzaXRlZCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChmYWxzZSk7IH0pO1xuICAgIHZhciBibGFja190ZXJyaXRvcnkgPSAwO1xuICAgIHZhciB3aGl0ZV90ZXJyaXRvcnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW2ldW2pdICYmIGJvYXJkW2ldW2pdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvYyA9IG5ldyB0eXBlc18xLkNvb3JkKGosIGkpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IGhlbHBlcl8xLmZpbmRCb3JkZXJpbmdDb2xvcihib2FyZCwgbG9jKTtcbiAgICAgICAgICAgICAgICB2YXIgc3ogPSBmaW5kU3BhY2VTaXplKGJvYXJkLCBsb2MpO1xuICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykge1xuICAgICAgICAgICAgICAgICAgICBibGFja190ZXJyaXRvcnkgKz0gc3o7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yID09PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaXRlX3RlcnJpdG9yeSArPSBzejtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZWxzZSBjb2xvciA9PT0gbnVsbCA9PiBlbXB0eSBib2FyZCAvIGRpc3B1dGVkIGFyZWFzIG5vIHBvaW50c1xuICAgICAgICAgICAgICAgIC8vIG1hcmsgYXMgdmlld2VkXG4gICAgICAgICAgICAgICAgaGVscGVyXzEuc2V0VmlzaXRlZChib2FyZCwgdmlzaXRlZCwgbG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JsYWNrX3RlcnJpdG9yeSwgd2hpdGVfdGVycml0b3J5XTtcbn1cbmV4cG9ydHMuY2FsY3VsYXRlVGVycml0b3J5ID0gY2FsY3VsYXRlVGVycml0b3J5O1xuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBnYW1lIG9mIEJhZHVrXG4gKiBAcGFyYW0gc2l6ZVxuICogQHBhcmFtIGhhbmRpY2FwXG4gKiBAcGFyYW0ga29taVxuICovXG52YXIgQmFkdWtHYW1lID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEJhZHVrR2FtZShzaXplLCBoYW5kaWNhcCwga29taSkge1xuICAgICAgICB2YXIgX2EgPSBzZXR1cEJvYXJkKHNpemUsIGhhbmRpY2FwKSwgYm9hcmQgPSBfYVswXSwgY3Vycl9wbGF5ZXIgPSBfYVsxXTtcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgICAgICB0aGlzLnByZXZfYm9hcmQgPSBudWxsO1xuICAgICAgICB0aGlzLmN1cnJfcGxheWVyID0gY3Vycl9wbGF5ZXI7XG4gICAgICAgIHRoaXMuaGFzX3Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmtvbWkgPSBrb21pO1xuICAgICAgICB0aGlzLmJsYWNrX2NhcHR1cmVzID0gMDtcbiAgICAgICAgdGhpcy53aGl0ZV9jYXB0dXJlcyA9IDA7XG4gICAgICAgIHRoaXMuaXNfb3ZlciA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbW92ZVxuICAgICAqIEBwYXJhbSBjdXJyX3BsYXllclxuICAgICAqIEByZXR1cm5zIHJldHVybnMgd2hldGhlciB0aGUgbW92ZSB3YXMgdmFsaWQgKGJvb2xlYW4pIG9yIGEgd2lubmVyIChjb2xvcikgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgICAqL1xuICAgIEJhZHVrR2FtZS5wcm90b3R5cGUucGxheU1vdmUgPSBmdW5jdGlvbiAobW92ZSwgY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoY3Vycl9wbGF5ZXIgIT0gdGhpcy5jdXJyX3BsYXllcilcbiAgICAgICAgICAgIHJldHVybiBbZmFsc2UsIFwiSWxsZWdhbCBtb3ZlLCBub3QgeW91ciB0dXJuXCJdO1xuICAgICAgICBlbHNlIGlmIChtb3ZlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc19wYXNzZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFRIRSBHQU1FIElTIERPTkVcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgd2lubmVyXG4gICAgICAgICAgICAgICAgdGhpcy5pc19vdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfYSA9IGNhbGN1bGF0ZVRlcnJpdG9yeSh0aGlzLmJvYXJkKSwgdGhpcy5ibGFja190ZXJyaXRvcnkgPSBfYVswXSwgdGhpcy53aGl0ZV90ZXJyaXRvcnkgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICB2YXIgYmxhY2tfc2NvcmUgPSB0aGlzLmJsYWNrX2NhcHR1cmVzICsgdGhpcy5ibGFja190ZXJyaXRvcnk7XG4gICAgICAgICAgICAgICAgdmFyIHdoaXRlX3Njb3JlID0gdGhpcy53aGl0ZV9jYXB0dXJlcyArIHRoaXMud2hpdGVfdGVycml0b3J5O1xuICAgICAgICAgICAgICAgIHdoaXRlX3Njb3JlICs9IHRoaXMua29taTsgLy8gYWRkIEtvbWkgZm9yIHdoaXRlXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtbKGJsYWNrX3Njb3JlID4gd2hpdGVfc2NvcmUpID8gdHlwZXNfMS5Db2xvci5CTEFDSyA6IHR5cGVzXzEuQ29sb3IuV0hJVEUsIGJsYWNrX3Njb3JlLCB3aGl0ZV9zY29yZV0sIFwiR2FtZSBvdmVyXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNfcGFzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFzX3Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9iID0gcGxheUJvYXJkTW92ZSh0aGlzLmJvYXJkLCB0aGlzLmN1cnJfcGxheWVyLCBtb3ZlKSwgdmFsaWQgPSBfYlswXSwgbmJvYXJkID0gX2JbMV0sIGNhcHR1cmVzID0gX2JbMl0sIHN0ciA9IF9iWzNdO1xuICAgICAgICAgICAgLy8gaW52YWxpZCBtb3ZlXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSwgXCJJbGxlZ2FsIE1vdmUsIFwiICsgc3RyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGtvLCBub3QgdmFsaWQgbW92ZVxuICAgICAgICAgICAgaWYgKHRoaXMucHJldl9ib2FyZCAhPT0gbnVsbCAmJiBoZWxwZXJfMS5pc0JvYXJkRXF1YWwodGhpcy5wcmV2X2JvYXJkLCBuYm9hcmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSwgXCJJbGxlZ2FsIE1vdmUsIEtvXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIGtvIGJvYXJkXG4gICAgICAgICAgICB0aGlzLnByZXZfYm9hcmQgPSBoZWxwZXJfMS5jbG9uZUJvYXJkKHRoaXMuYm9hcmQpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGJvYXJkIHN0YXRlXG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbmJvYXJkO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGNhcHR1cmVkIHN0b25lc1xuICAgICAgICAgICAgaWYgKHRoaXMuY3Vycl9wbGF5ZXIgPT0gdHlwZXNfMS5Db2xvci5CTEFDSylcbiAgICAgICAgICAgICAgICB0aGlzLmJsYWNrX2NhcHR1cmVzICs9IGNhcHR1cmVzO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGVfY2FwdHVyZXMgKz0gY2FwdHVyZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmV4dCBwbGF5ZXJzIHR1cm5cbiAgICAgICAgdGhpcy5jdXJyX3BsYXllciA9IHRoaXMuY3Vycl9wbGF5ZXIgPT0gdHlwZXNfMS5Db2xvci5CTEFDSyA/IHR5cGVzXzEuQ29sb3IuV0hJVEUgOiB0eXBlc18xLkNvbG9yLkJMQUNLO1xuICAgICAgICByZXR1cm4gW3RydWUsIFwiVmFsaWQgTW92ZVwiXTtcbiAgICB9O1xuICAgIEJhZHVrR2FtZS5wcm90b3R5cGUucmVtb3ZlR3JvdXAgPSBmdW5jdGlvbiAobG9jKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW2xvYy55XVtsb2MueF0gPT09IHR5cGVzXzEuQ29sb3IuQkxBQ0spIHtcbiAgICAgICAgICAgIHZhciBfYSA9IGtpbGxHcm91cCh0aGlzLmJvYXJkLCBsb2MpLCBuYm9hcmQgPSBfYVswXSwga2lsbGVkID0gX2FbMV07XG4gICAgICAgICAgICB0aGlzLndoaXRlX2NhcHR1cmVzICs9IGtpbGxlZDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQgPSBuYm9hcmQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5ib2FyZFtsb2MueV1bbG9jLnhdID09PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBraWxsR3JvdXAodGhpcy5ib2FyZCwgbG9jKSwgbmJvYXJkID0gX2JbMF0sIGtpbGxlZCA9IF9iWzFdO1xuICAgICAgICAgICAgdGhpcy5ibGFja19jYXB0dXJlcyArPSBraWxsZWQ7XG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbmJvYXJkO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQmFkdWtHYW1lO1xufSgpKTtcbmV4cG9ydHMuQmFkdWtHYW1lID0gQmFkdWtHYW1lO1xuO1xuLy8gU2luZ2xlIEdhbWUgc3RhdGUgbWFuYWdlclxudmFyIEJhZHVrR2FtZU1hbmFnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQmFkdWtHYW1lTWFuYWdlcihzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICAgIHRoaXMuaGFzX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgQmFkdWtHYW1lTWFuYWdlci5wcm90b3R5cGUuYWRkQmxhY2sgPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIHRoaXMuYmxhY2tfY2xpZW50ID0gc29ja2V0O1xuICAgICAgICBzb2NrZXQuZW1pdChcIlBMQVlJTkdfQkxBQ0tcIik7XG4gICAgfTtcbiAgICBCYWR1a0dhbWVNYW5hZ2VyLnByb3RvdHlwZS5hZGRXaGl0ZSA9IGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgdGhpcy53aGl0ZV9jbGllbnQgPSBzb2NrZXQ7XG4gICAgICAgIHNvY2tldC5lbWl0KFwiUExBWUlOR19XSElURVwiKTtcbiAgICB9O1xuICAgIEJhZHVrR2FtZU1hbmFnZXIucHJvdG90eXBlLnBsYXlNb3ZlID0gZnVuY3Rpb24gKHNvY2tldCwgeCwgeSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lLnByZXZfYm9hcmQgIT0gbnVsbClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlbHBlcl8xLmdldE51bXNGcm9tQm9hcmQodGhpcy5nYW1lLnByZXZfYm9hcmQpKTtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nYW1lLnBsYXlNb3ZlKG5ldyB0eXBlc18xLkNvb3JkKHgsIHkpLCAoc29ja2V0LmlkID09PSB0aGlzLmJsYWNrX2NsaWVudC5pZCkgPyB0eXBlc18xLkNvbG9yLkJMQUNLIDogdHlwZXNfMS5Db2xvci5XSElURSksIHJlcyA9IF9hWzBdLCBtc2cgPSBfYVsxXTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiR0FNRV9FTkRcIiwgKHJlc1swXSA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykgPyB0aGlzLmJsYWNrX2NsaWVudCA6IHRoaXMud2hpdGVfY2xpZW50LCByZXNbMV0sIHJlc1syXSwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFZhbGlkIG1vdmVcbiAgICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiVVBEQVRFX0JPQVJEXCIsIGhlbHBlcl8xLmdldE51bXNGcm9tQm9hcmQodGhpcy5nYW1lLmJvYXJkKSwgdGhpcy5nYW1lLmJsYWNrX2NhcHR1cmVzLCB0aGlzLmdhbWUud2hpdGVfY2FwdHVyZXMsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdChcIkVSUk9SXCIsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJhZHVrR2FtZU1hbmFnZXIucHJvdG90eXBlLnBhc3MgPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2FtZS5wbGF5TW92ZShudWxsLCAoc29ja2V0LmlkID09PSB0aGlzLmJsYWNrX2NsaWVudC5pZCkgPyB0eXBlc18xLkNvbG9yLkJMQUNLIDogdHlwZXNfMS5Db2xvci5XSElURSksIHJlcyA9IF9hWzBdLCBtc2cgPSBfYVsxXTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgZW5kZWRcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMsIG1zZyk7XG4gICAgICAgICAgICB2YXIgd2lubmVyID0gcmVzWzBdLCBibGFja19zY29yZSA9IHJlc1sxXSwgd2hpdGVfc2NvcmUgPSByZXNbMl07XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiR0FNRV9FTkRcIiwgd2lubmVyID09PSB0eXBlc18xLkNvbG9yLkJMQUNLID8gMSA6IC0xLCBibGFja19zY29yZSwgd2hpdGVfc2NvcmUsIG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBtb3ZlXG4gICAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW1pdChcIlVQREFURV9CT0FSRFwiLCBoZWxwZXJfMS5nZXROdW1zRnJvbUJvYXJkKHRoaXMuZ2FtZS5ib2FyZCksIHRoaXMuZ2FtZS5ibGFja19jYXB0dXJlcywgdGhpcy5nYW1lLndoaXRlX2NhcHR1cmVzLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoXCJFUlJPUlwiLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBCYWR1a0dhbWVNYW5hZ2VyLnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGFzX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWUgPSBuZXcgQmFkdWtHYW1lKDE5LCBbXSwgNi41KTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW1pdChcIkdBTUVfU1RBUlRFRFwiLCBoZWxwZXJfMS5nZXROdW1zRnJvbUJvYXJkKHRoaXMuZ2FtZS5ib2FyZCkpO1xuICAgICAgICB0aGlzLmJsYWNrX2NsaWVudC5lbWl0KFwiQkxBQ0tfUExBWUVSXCIpO1xuICAgICAgICB0aGlzLndoaXRlX2NsaWVudC5lbWl0KFwiV0hJVEVfUExBWUVSXCIpO1xuICAgIH07XG4gICAgcmV0dXJuIEJhZHVrR2FtZU1hbmFnZXI7XG59KCkpO1xuZXhwb3J0cy5CYWR1a0dhbWVNYW5hZ2VyID0gQmFkdWtHYW1lTWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY2xvbmVCb2FyZCA9IGV4cG9ydHMuYWxwaGFUb0Nvb3JkID0gZXhwb3J0cy5zZXRWaXNpdGVkID0gZXhwb3J0cy5maW5kQm9yZGVyaW5nQ29sb3IgPSBleHBvcnRzLmdldEJvYXJkRnJvbVN0cmluZ3MgPSBleHBvcnRzLmdldE51bXNGcm9tQm9hcmQgPSBleHBvcnRzLmdldFN0cmluZ3NGcm9tQm9hcmQgPSBleHBvcnRzLmdldENvb3JkRnJvbUJvYXJkID0gZXhwb3J0cy5zZWxlY3RHcm91cCA9IGV4cG9ydHMuc2V0Q29sb3IgPSBleHBvcnRzLmlzQm9hcmRFbXB0eSA9IGV4cG9ydHMuaXNCb2FyZEVxdWFsID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3R5cGVzXCIpO1xudmFyIEJhZHVrR2FtZV8xID0gcmVxdWlyZShcIi4vQmFkdWtHYW1lXCIpO1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVVRJTElUWSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyoqXG4gKiBAcGFyYW0gYm9hcmQxXG4gKiBAcGFyYW0gYm9hcmQyXG4gKiBAcmV0dXJucyBpZiBib2FyZDEgYW5kIGJvYXJkMiByZXByZXNlbnQgdGhlIHNhbWUgc3RhdGVcbiAqL1xuZnVuY3Rpb24gaXNCb2FyZEVxdWFsKGJvYXJkMSwgYm9hcmQyKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2FyZDEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZDEubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGlmIChib2FyZDFbaV1bal0gIT09IGJvYXJkMltpXVtqXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmlzQm9hcmRFcXVhbCA9IGlzQm9hcmRFcXVhbDtcbi8qKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcmV0dXJucyByZXR1cm4gaWYgYm9hcmQgaXMgZW1wdHkgKGhhcyBubyBzdG9uZXMpXG4gKi9cbmZ1bmN0aW9uIGlzQm9hcmRFbXB0eShib2FyZCkge1xuICAgIGZvciAodmFyIF9pID0gMCwgYm9hcmRfMSA9IGJvYXJkOyBfaSA8IGJvYXJkXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBib2FyZF8xW19pXTtcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCByb3dfMSA9IHJvdzsgX2EgPCByb3dfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IHJvd18xW19hXTtcbiAgICAgICAgICAgIGlmIChzcGFjZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuaXNCb2FyZEVtcHR5ID0gaXNCb2FyZEVtcHR5O1xuLyoqXG4gKiBzZXRzIGVhY2ggb2YgdGhlIENvb3JkcyBnaXZlbiBpbiBtb3ZlcyB0byBjdXJyX3BsYXllciBpbiBib2FyZFxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gbW92ZXMgQXJyYXkgb2YgQ29vcmRzIHRvIHBsYWNlIHN0b25lXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHNldENvbG9yKGJvYXJkLCBtb3ZlcywgY3Vycl9wbGF5ZXIpIHtcbiAgICBtb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb3ZlKSB7XG4gICAgICAgIGJvYXJkW21vdmUueV1bbW92ZS54XSA9IGN1cnJfcGxheWVyO1xuICAgIH0pO1xuICAgIHJldHVybiBib2FyZDtcbn1cbmV4cG9ydHMuc2V0Q29sb3IgPSBzZXRDb2xvcjtcbjtcbi8qKlxuICogcHJlOiBib2FyZCBhdCBsb2MgIT0gbnVsbFxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gbG9jXG4gKiBAcmV0dXJuIGEgQm9hcmQgd2l0aCBvbmx5IHRoZSBncm91cCBjb25uZWN0ZWQgdG8gdGhlIHN0b25lIGF0IGxvYyBwbGFjZWRcbiAqL1xuZnVuY3Rpb24gc2VsZWN0R3JvdXAoYm9hcmQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIGN1cnJfcGxheWVyID0gYm9hcmRbbG9jLnldW2xvYy54XTtcbiAgICB2YXIgY2hlY2tHcmFwaCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChcIk5cIik7IH0pO1xuICAgIHZhciBzaXplID0gYm9hcmQubGVuZ3RoO1xuICAgIHZhciBuYm9hcmQgPSBuZXcgQXJyYXkoc2l6ZSkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KHNpemUpLmZpbGwobnVsbCk7IH0pO1xuICAgIHdoaWxlICh0b1Zpc2l0Lmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBjdXJyID0gdG9WaXNpdC5wb3AoKTtcbiAgICAgICAgaWYgKGNoZWNrR3JhcGhbY3Vyci55XVtjdXJyLnhdID09IFwiTlwiKSB7XG4gICAgICAgICAgICBuYm9hcmRbY3Vyci55XVtjdXJyLnhdID0gY3Vycl9wbGF5ZXI7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdID09IGN1cnJfcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGVja0dyYXBoW2N1cnIueV1bY3Vyci54XSA9IFwiRFwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuYm9hcmQ7XG59XG5leHBvcnRzLnNlbGVjdEdyb3VwID0gc2VsZWN0R3JvdXA7XG4vKipcbiAqIEBwYXJhbSBib2FyZFxuICogQHJldHVybiBnaXZlbiBhIGJvYXJkLCByZXR1cm4gYW4gYXJyYXkgb2YgY29vcmRzIGZvciBsb2NhdGlvbiBvZiBibGFjayBhbmQgd2hpdGUgc3RvbmVzXG4gKi9cbmZ1bmN0aW9uIGdldENvb3JkRnJvbUJvYXJkKGJvYXJkKSB7XG4gICAgdmFyIGJsYWNrX2Nvb3JkcyA9IFtdO1xuICAgIHZhciB3aGl0ZV9jb29yZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYm9hcmQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtpXVtqXSA9PSB0eXBlc18xLkNvbG9yLkJMQUNLKSB7XG4gICAgICAgICAgICAgICAgYmxhY2tfY29vcmRzLnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoaiwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYm9hcmRbaV1bal0gPT0gdHlwZXNfMS5Db2xvci5XSElURSkge1xuICAgICAgICAgICAgICAgIHdoaXRlX2Nvb3Jkcy5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGosIGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JsYWNrX2Nvb3Jkcywgd2hpdGVfY29vcmRzXTtcbn1cbmV4cG9ydHMuZ2V0Q29vcmRGcm9tQm9hcmQgPSBnZXRDb29yZEZyb21Cb2FyZDtcbmZ1bmN0aW9uIGdldFN0cmluZ3NGcm9tQm9hcmQoYm9hcmQpIHtcbiAgICB2YXIgbmJvYXJkID0gW107XG4gICAgZm9yICh2YXIgaSA9IGJvYXJkLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciByb3cgPSBib2FyZFtpXS5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gKHZhbCA9PT0gbnVsbCkgPyAnLScgOiAoKHZhbCA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykgPyAnWCcgOiAnTycpOyB9KTtcbiAgICAgICAgbmJvYXJkLnB1c2gocm93KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ib2FyZDtcbn1cbmV4cG9ydHMuZ2V0U3RyaW5nc0Zyb21Cb2FyZCA9IGdldFN0cmluZ3NGcm9tQm9hcmQ7XG5mdW5jdGlvbiBnZXROdW1zRnJvbUJvYXJkKGJvYXJkKSB7XG4gICAgdmFyIG5ib2FyZCA9IFtdO1xuICAgIGJvYXJkLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgbnJvdyA9IHJvdy5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gKHZhbCA9PT0gbnVsbCkgPyAwIDogKCh2YWwgPT09IHR5cGVzXzEuQ29sb3IuQkxBQ0spID8gMSA6IC0xKTsgfSk7XG4gICAgICAgIG5ib2FyZC5wdXNoKG5yb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiBuYm9hcmQ7XG59XG5leHBvcnRzLmdldE51bXNGcm9tQm9hcmQgPSBnZXROdW1zRnJvbUJvYXJkO1xuZnVuY3Rpb24gZ2V0Qm9hcmRGcm9tU3RyaW5ncyhib2FyZCkge1xuICAgIHZhciBuYm9hcmQgPSBCYWR1a0dhbWVfMS5zZXR1cEJvYXJkKGJvYXJkLmxlbmd0aCwgW10pWzBdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2ldW2pdID09ICdYJylcbiAgICAgICAgICAgICAgICBuYm9hcmRbaV1bal0gPSB0eXBlc18xLkNvbG9yLkJMQUNLO1xuICAgICAgICAgICAgZWxzZSBpZiAoYm9hcmRbaV1bal0gPT0gJ08nKVxuICAgICAgICAgICAgICAgIG5ib2FyZFtpXVtqXSA9IHR5cGVzXzEuQ29sb3IuV0hJVEU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ib2FyZDtcbn1cbmV4cG9ydHMuZ2V0Qm9hcmRGcm9tU3RyaW5ncyA9IGdldEJvYXJkRnJvbVN0cmluZ3M7XG4vKipcbiAqIGZpbmQgdGhlIGJvcmRlcmluZyBjb2xvciBlbXB0eSBzcGFjZSBhdCBsb2NcbiAqIHByZTogYm9hcmQgYXQgbG9jID09IG51bGwsIGlmIGJvdGggY29sb3JzIG9yIG5vbmUgYXJlIHByZXNlbnQgcmV0dXJuIG51bGxcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gZmluZEJvcmRlcmluZ0NvbG9yKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB2aXNpdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgdmFyIGN1cnJfY29sb3IgPSBudWxsO1xuICAgIHdoaWxlICh0b1Zpc2l0Lmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBjdXJyID0gdG9WaXNpdC5wb3AoKTtcbiAgICAgICAgaWYgKCF2aXNpdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyX2NvbG9yID09PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBjdXJyX2NvbG9yID0gYm9hcmRbY3Vyci55XVtjdXJyLnhdO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJfY29sb3IgIT0gYm9hcmRbY3Vyci55XVtjdXJyLnhdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXJyX2NvbG9yO1xufVxuZXhwb3J0cy5maW5kQm9yZGVyaW5nQ29sb3IgPSBmaW5kQm9yZGVyaW5nQ29sb3I7XG5mdW5jdGlvbiBzZXRWaXNpdGVkKGJvYXJkLCB2aXNpdGVkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB0dmlzaXRlZCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChmYWxzZSk7IH0pO1xuICAgIHZhciBzeiA9IDA7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoIXR2aXNpdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHZpc2l0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmlzaXRlZDtcbn1cbmV4cG9ydHMuc2V0VmlzaXRlZCA9IHNldFZpc2l0ZWQ7XG5mdW5jdGlvbiBhbHBoYVRvQ29vcmQoc3RyKSB7XG4gICAgdmFyIHggPSBzdHIuY2hhckNvZGVBdCgwKSAtIDY1O1xuICAgIGlmICh4ID49IDkpXG4gICAgICAgIC0teDtcbiAgICB2YXIgeSA9IHN0ci5jaGFyQ29kZUF0KDEpIC0gNDk7XG4gICAgcmV0dXJuIG5ldyB0eXBlc18xLkNvb3JkKHgsIHkpO1xufVxuZXhwb3J0cy5hbHBoYVRvQ29vcmQgPSBhbHBoYVRvQ29vcmQ7XG5mdW5jdGlvbiBjbG9uZUJvYXJkKGJvYXJkKSB7XG4gICAgdmFyIG5ib2FyZCA9IFtdO1xuICAgIGJvYXJkLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgbnJvdyA9IHJvdy5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGU7IH0pO1xuICAgICAgICBuYm9hcmQucHVzaChucm93KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmJvYXJkO1xufVxuZXhwb3J0cy5jbG9uZUJvYXJkID0gY2xvbmVCb2FyZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcbnZhciBodHRwXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImh0dHBcIikpO1xudmFyIHNvY2tldF9pb18xID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTtcbnZhciBCYWR1a0dhbWVfMSA9IHJlcXVpcmUoXCIuL0JvYXJkTG9naWMvQmFkdWtHYW1lXCIpO1xudmFyIGNvcnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiY29yc1wiKSk7XG4vLyBDb25maWd1cmUgRGF0YWJhc2Vcbi8vIENvbmZpZ3VyZSBBUElcbi8vICAtIEdFVCBuZXdHYW1lIFxuLy8gICAgaW46IHNpemUsIGhhbmRpY2FwLCBjb2xvciwgXG4vLyAgIG91dDogc29ja2V0IGdhbWUgcm9vbSBpZFxuLy8gaW50ZXJuYWxseSBhIG5ldyByb29tIHdpbGwgYmUgY3JlYXRlZCB0aGF0IGhhcyBhcyBnYW1lIG1hbmFnZXJcbi8vIHRoZSByb29tIHdpbGwga2VlcCB0cmFjayBvZiB0aGUgc3RhdGUgb2YgdGhlIGdhbWUgYW5kIHdoZW4gaXQgaXMgZG9uZVxuLy8gc2F2ZSB0aGUgZ2FtZSB0byB0aGUgZGF0YWJhc2Vcbi8vICAtIEdFVCBnYW1lXG4vLyAgICBpbjogdXJsIC8gaWRcbi8vICAgb3V0OiByZWRpcmN0IHRvIHNvY2tldCByb29tP1xudmFyIGFwcCA9IGV4cHJlc3NfMVtcImRlZmF1bHRcIl0oKTtcbnZhciByb3V0ZXIgPSBleHByZXNzXzFbXCJkZWZhdWx0XCJdLlJvdXRlcigpO1xudmFyIHNlcnZlciA9IG5ldyBodHRwXzFbXCJkZWZhdWx0XCJdLlNlcnZlcihhcHApO1xudmFyIGlvID0gbmV3IHNvY2tldF9pb18xLlNlcnZlcihzZXJ2ZXIsIHtcbiAgICBjb3JzOiB7XG4gICAgICAgIG9yaWdpbjogJyonLFxuICAgICAgICBtZXRob2RzOiBbJ0dFVCcsICdQT1NUJ11cbiAgICB9XG59KTtcbnZhciBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAyNTY3O1xuYXBwLnVzZShjb3JzXzFbXCJkZWZhdWx0XCJdKCkpO1xuc2VydmVyLmxpc3Rlbihwb3J0LCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXJ2ZXIgbGlzdGVuaW5nIG9uIHBvcnRcIiwgcG9ydCk7XG59KTtcbnJvdXRlci5nZXQoJy9iYXNpY1Rlc3QnLCBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICByZXMuc2VuZCgnL2Jhc2ljVGVzdCcpO1xuICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgfSk7XG59KTsgfSk7XG52YXIgZ2FtZSA9IG5ldyBCYWR1a0dhbWVfMS5CYWR1a0dhbWVNYW5hZ2VyKGlvKTtcbnZhciBjbGllbnRzID0gW107XG4vLyBTdGFydGluZyBwb2ludCBmb3IgdXNlcnNcbmlvLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiBlc3RhYmxpc2hlZCB3aXRoOlwiLCBzb2NrZXQuaWQpO1xuICAgIC8vIEFkZCBTb2NrZXQgdG8gbGlzdCBvZiBjbGllbnRzXG4gICAgY2xpZW50cy5wdXNoKHNvY2tldCk7XG4gICAgc29ja2V0Lm9uKFwiSk9JTl9HQU1FXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB9KTtcbiAgICBzb2NrZXQub24oXCJQTEFZX01PVkVcIiwgZnVuY3Rpb24gKHgsIHksIHBhc3MpIHtcbiAgICAgICAgaWYgKCFnYW1lLmhhc19zdGFydGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgbm90IHN0YXJ0ZWRcIik7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdChcIkVSUk9SXCIsIFwiR2FtZSBub3Qgc3RhcnRlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTW92ZVwiLCB4LCB5LCBcImVudGVyZWRcIik7XG4gICAgICAgICAgICBpZiAocGFzcylcbiAgICAgICAgICAgICAgICBnYW1lLnBhc3Moc29ja2V0KTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdhbWUucGxheU1vdmUoc29ja2V0LCBwYXJzZUludCh4KSwgcGFyc2VJbnQoeSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKFwiU1RBUlRfR0FNRVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChjbGllbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGVub3VnaCBwbGF5ZXJzXCIpO1xuICAgICAgICAgICAgc29ja2V0LmVtaXQoXCJFUlJPUlwiLCBcIk5vdCBlbm91Z2ggcGxheWVyc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcmluZyBnYW1lXCIpO1xuICAgICAgICAgICAgZ2FtZS5hZGRCbGFjayhjbGllbnRzWzBdKTtcbiAgICAgICAgICAgIGdhbWUuYWRkV2hpdGUoY2xpZW50c1sxXSk7XG4gICAgICAgICAgICBnYW1lLnN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKFwiZGlzY29ubmVjdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiBsb3N0IHdpdGg6XCIsIHNvY2tldC5pZCk7XG4gICAgICAgIHZhciBpID0gY2xpZW50cy5pbmRleE9mKHNvY2tldCk7XG4gICAgICAgIGlmIChpID4gLTEpIHtcbiAgICAgICAgICAgIGNsaWVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGNsaWVudHMubGVuZ3RoKTtcbiAgICB9KTtcbn0pO1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb25zb2xlLmxvZygnTW9kdWxlIGRpc3Bvc2VkLiAnKTsgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkNvb3JkID0gZXhwb3J0cy5Db2xvciA9IHZvaWQgMDtcbnZhciBDb2xvcjtcbihmdW5jdGlvbiAoQ29sb3IpIHtcbiAgICBDb2xvcltDb2xvcltcIkJMQUNLXCJdID0gMF0gPSBcIkJMQUNLXCI7XG4gICAgQ29sb3JbQ29sb3JbXCJXSElURVwiXSA9IDFdID0gXCJXSElURVwiO1xufSkoQ29sb3IgPSBleHBvcnRzLkNvbG9yIHx8IChleHBvcnRzLkNvbG9yID0ge30pKTtcbjtcbnZhciBDb29yZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb29yZCh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIHJldHVybiBDb29yZDtcbn0oKSk7XG5leHBvcnRzLkNvb3JkID0gQ29vcmQ7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHQnW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIG9wdGltaXphdGlvbi5tb2R1bGVJZHM6IFwibmFtZWRcIiBmb3IgbW9kdWxlIG5hbWVzLidcblx0XHRcdCk7XG5cdH1cbn07XG4iLCJ2YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdHZhciBtZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cdHZhciBzdGFjayA9IGVyci5zdGFjaztcblx0aWYgKCFzdGFjaykge1xuXHRcdHJldHVybiBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPCAwKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2UgKyBcIlxcblwiICsgc3RhY2s7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0YWNrO1xuXHR9XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKGNhY2hlZE1vZHVsZS5lcnJvciAhPT0gdW5kZWZpbmVkKSB0aHJvdyBjYWNoZWRNb2R1bGUuZXJyb3I7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdHRyeSB7XG5cdFx0dmFyIGV4ZWNPcHRpb25zID0geyBpZDogbW9kdWxlSWQsIG1vZHVsZTogbW9kdWxlLCBmYWN0b3J5OiBfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSwgcmVxdWlyZTogX193ZWJwYWNrX3JlcXVpcmVfXyB9O1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uaS5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHsgaGFuZGxlcihleGVjT3B0aW9ucyk7IH0pO1xuXHRcdG1vZHVsZSA9IGV4ZWNPcHRpb25zLm1vZHVsZTtcblx0XHRleGVjT3B0aW9ucy5mYWN0b3J5LmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGV4ZWNPcHRpb25zLnJlcXVpcmUpO1xuXHR9IGNhdGNoKGUpIHtcblx0XHRtb2R1bGUuZXJyb3IgPSBlO1xuXHRcdHRocm93IGU7XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuX193ZWJwYWNrX3JlcXVpcmVfXy5jID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBleGVjdXRpb24gaW50ZXJjZXB0b3Jcbl9fd2VicGFja19yZXF1aXJlX18uaSA9IFtdO1xuXG4iLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhbGwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmh1ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5oKCkgKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1yRiA9ICgpID0+IChcIm1haW4uXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmgoKSArIFwiLmhvdC11cGRhdGUuanNvblwiKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCIxODNmNDI3MTgyNzFhYmZmZjI5YVwiKSIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJ2YXIgY3VycmVudE1vZHVsZURhdGEgPSB7fTtcbnZhciBpbnN0YWxsZWRNb2R1bGVzID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jO1xuXG4vLyBtb2R1bGUgYW5kIHJlcXVpcmUgY3JlYXRpb25cbnZhciBjdXJyZW50Q2hpbGRNb2R1bGU7XG52YXIgY3VycmVudFBhcmVudHMgPSBbXTtcblxuLy8gc3RhdHVzXG52YXIgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzID0gW107XG52YXIgY3VycmVudFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4vLyB3aGlsZSBkb3dubG9hZGluZ1xudmFyIGJsb2NraW5nUHJvbWlzZXM7XG5cbi8vIFRoZSB1cGRhdGUgaW5mb1xudmFyIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzO1xudmFyIHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckQgPSBjdXJyZW50TW9kdWxlRGF0YTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5pLnB1c2goZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0dmFyIG1vZHVsZSA9IG9wdGlvbnMubW9kdWxlO1xuXHR2YXIgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUob3B0aW9ucy5yZXF1aXJlLCBvcHRpb25zLmlkKTtcblx0bW9kdWxlLmhvdCA9IGNyZWF0ZU1vZHVsZUhvdE9iamVjdChvcHRpb25zLmlkLCBtb2R1bGUpO1xuXHRtb2R1bGUucGFyZW50cyA9IGN1cnJlbnRQYXJlbnRzO1xuXHRtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0Y3VycmVudFBhcmVudHMgPSBbXTtcblx0b3B0aW9ucy5yZXF1aXJlID0gcmVxdWlyZTtcbn0pO1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMgPSB7fTtcbl9fd2VicGFja19yZXF1aXJlX18uaG1ySSA9IHt9O1xuXG5mdW5jdGlvbiBjcmVhdGVSZXF1aXJlKHJlcXVpcmUsIG1vZHVsZUlkKSB7XG5cdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXHRpZiAoIW1lKSByZXR1cm4gcmVxdWlyZTtcblx0dmFyIGZuID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcblx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuXHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcblx0XHRcdFx0dmFyIHBhcmVudHMgPSBpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHM7XG5cdFx0XHRcdGlmIChwYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuXHRcdFx0XHRcdHBhcmVudHMucHVzaChtb2R1bGVJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcblx0XHRcdFx0Y3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcblx0XHRcdH1cblx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuXHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcblx0XHRcdFx0XHRyZXF1ZXN0ICtcblx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuXHRcdFx0XHRcdG1vZHVsZUlkXG5cdFx0XHQpO1xuXHRcdFx0Y3VycmVudFBhcmVudHMgPSBbXTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlcXVpcmUocmVxdWVzdCk7XG5cdH07XG5cdHZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiByZXF1aXJlW25hbWVdO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHJlcXVpcmVbbmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXHRmb3IgKHZhciBuYW1lIGluIHJlcXVpcmUpIHtcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlcXVpcmUsIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcihuYW1lKSk7XG5cdFx0fVxuXHR9XG5cdGZuLmUgPSBmdW5jdGlvbiAoY2h1bmtJZCkge1xuXHRcdHJldHVybiB0cmFja0Jsb2NraW5nUHJvbWlzZShyZXF1aXJlLmUoY2h1bmtJZCkpO1xuXHR9O1xuXHRyZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZHVsZUhvdE9iamVjdChtb2R1bGVJZCwgbWUpIHtcblx0dmFyIF9tYWluID0gY3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZDtcblx0dmFyIGhvdCA9IHtcblx0XHQvLyBwcml2YXRlIHN0dWZmXG5cdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcblx0XHRfYWNjZXB0ZWRFcnJvckhhbmRsZXJzOiB7fSxcblx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuXHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuXHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuXHRcdF9zZWxmSW52YWxpZGF0ZWQ6IGZhbHNlLFxuXHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuXHRcdF9tYWluOiBfbWFpbixcblx0XHRfcmVxdWlyZVNlbGY6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGN1cnJlbnRQYXJlbnRzID0gbWUucGFyZW50cy5zbGljZSgpO1xuXHRcdFx0Y3VycmVudENoaWxkTW9kdWxlID0gX21haW4gPyB1bmRlZmluZWQgOiBtb2R1bGVJZDtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuXHRcdH0sXG5cblx0XHQvLyBNb2R1bGUgQVBJXG5cdFx0YWN0aXZlOiB0cnVlLFxuXHRcdGFjY2VwdDogZnVuY3Rpb24gKGRlcCwgY2FsbGJhY2ssIGVycm9ySGFuZGxlcikge1xuXHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBbaV1dID0gZXJyb3JIYW5kbGVyO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0aG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwXSA9IGVycm9ySGFuZGxlcjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRlY2xpbmU6IGZ1bmN0aW9uIChkZXApIHtcblx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG5cdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG5cdFx0fSxcblx0XHRkaXNwb3NlOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG5cdFx0fSxcblx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuXHRcdH0sXG5cdFx0aW52YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fc2VsZkludmFsaWRhdGVkID0gdHJ1ZTtcblx0XHRcdHN3aXRjaCAoY3VycmVudFN0YXR1cykge1xuXHRcdFx0XHRjYXNlIFwiaWRsZVwiOlxuXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdFx0XHRtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2V0U3RhdHVzKFwicmVhZHlcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJyZWFkeVwiOlxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRcdFx0bW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicHJlcGFyZVwiOlxuXHRcdFx0XHRjYXNlIFwiY2hlY2tcIjpcblx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VcIjpcblx0XHRcdFx0Y2FzZSBcImFwcGx5XCI6XG5cdFx0XHRcdFx0KHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyA9IHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyB8fCBbXSkucHVzaChcblx0XHRcdFx0XHRcdG1vZHVsZUlkXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvLyBpZ25vcmUgcmVxdWVzdHMgaW4gZXJyb3Igc3RhdGVzXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIE1hbmFnZW1lbnQgQVBJXG5cdFx0Y2hlY2s6IGhvdENoZWNrLFxuXHRcdGFwcGx5OiBob3RBcHBseSxcblx0XHRzdGF0dXM6IGZ1bmN0aW9uIChsKSB7XG5cdFx0XHRpZiAoIWwpIHJldHVybiBjdXJyZW50U3RhdHVzO1xuXHRcdFx0cmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG5cdFx0fSxcblx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0cmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG5cdFx0fSxcblx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0dmFyIGlkeCA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuXHRcdFx0aWYgKGlkeCA+PSAwKSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0fSxcblxuXHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuXHRcdGRhdGE6IGN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuXHR9O1xuXHRjdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG5cdHJldHVybiBob3Q7XG59XG5cbmZ1bmN0aW9uIHNldFN0YXR1cyhuZXdTdGF0dXMpIHtcblx0Y3VycmVudFN0YXR1cyA9IG5ld1N0YXR1cztcblx0dmFyIHJlc3VsdHMgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcblx0XHRyZXN1bHRzW2ldID0gcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0cyk7XG59XG5cbmZ1bmN0aW9uIHRyYWNrQmxvY2tpbmdQcm9taXNlKHByb21pc2UpIHtcblx0c3dpdGNoIChjdXJyZW50U3RhdHVzKSB7XG5cdFx0Y2FzZSBcInJlYWR5XCI6XG5cdFx0XHRzZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuXHRcdFx0YmxvY2tpbmdQcm9taXNlcy5wdXNoKHByb21pc2UpO1xuXHRcdFx0d2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gc2V0U3RhdHVzKFwicmVhZHlcIik7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdGNhc2UgXCJwcmVwYXJlXCI6XG5cdFx0XHRibG9ja2luZ1Byb21pc2VzLnB1c2gocHJvbWlzZSk7XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZm4pIHtcblx0aWYgKGJsb2NraW5nUHJvbWlzZXMubGVuZ3RoID09PSAwKSByZXR1cm4gZm4oKTtcblx0dmFyIGJsb2NrZXIgPSBibG9ja2luZ1Byb21pc2VzO1xuXHRibG9ja2luZ1Byb21pc2VzID0gW107XG5cdHJldHVybiBQcm9taXNlLmFsbChibG9ja2VyKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZm4pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gaG90Q2hlY2soYXBwbHlPblVwZGF0ZSkge1xuXHRpZiAoY3VycmVudFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcblx0fVxuXHRyZXR1cm4gc2V0U3RhdHVzKFwiY2hlY2tcIilcblx0XHQudGhlbihfX3dlYnBhY2tfcmVxdWlyZV9fLmhtck0pXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHVwZGF0ZSkge1xuXHRcdFx0aWYgKCF1cGRhdGUpIHtcblx0XHRcdFx0cmV0dXJuIHNldFN0YXR1cyhhcHBseUludmFsaWRhdGVkTW9kdWxlcygpID8gXCJyZWFkeVwiIDogXCJpZGxlXCIpLnRoZW4oXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc2V0U3RhdHVzKFwicHJlcGFyZVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHVwZGF0ZWRNb2R1bGVzID0gW107XG5cdFx0XHRcdGJsb2NraW5nUHJvbWlzZXMgPSBbXTtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDKS5yZWR1Y2UoZnVuY3Rpb24gKFxuXHRcdFx0XHRcdFx0cHJvbWlzZXMsXG5cdFx0XHRcdFx0XHRrZXlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yQ1trZXldKFxuXHRcdFx0XHRcdFx0XHR1cGRhdGUuYyxcblx0XHRcdFx0XHRcdFx0dXBkYXRlLnIsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZS5tLFxuXHRcdFx0XHRcdFx0XHRwcm9taXNlcyxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZWRNb2R1bGVzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb21pc2VzO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0W10pXG5cdFx0XHRcdCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGlmIChhcHBseU9uVXBkYXRlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpbnRlcm5hbEFwcGx5KGFwcGx5T25VcGRhdGUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNldFN0YXR1cyhcInJlYWR5XCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB1cGRhdGVkTW9kdWxlcztcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcblx0aWYgKGN1cnJlbnRTdGF0dXMgIT09IFwicmVhZHlcIikge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gaW50ZXJuYWxBcHBseShvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuYWxBcHBseShvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCk7XG5cblx0dmFyIHJlc3VsdHMgPSBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycy5tYXAoZnVuY3Rpb24gKGhhbmRsZXIpIHtcblx0XHRyZXR1cm4gaGFuZGxlcihvcHRpb25zKTtcblx0fSk7XG5cdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gdW5kZWZpbmVkO1xuXG5cdHZhciBlcnJvcnMgPSByZXN1bHRzXG5cdFx0Lm1hcChmdW5jdGlvbiAocikge1xuXHRcdFx0cmV0dXJuIHIuZXJyb3I7XG5cdFx0fSlcblx0XHQuZmlsdGVyKEJvb2xlYW4pO1xuXG5cdGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuXHRcdHJldHVybiBzZXRTdGF0dXMoXCJhYm9ydFwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHRocm93IGVycm9yc1swXTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuXHR2YXIgZGlzcG9zZVByb21pc2UgPSBzZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuXG5cdHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0aWYgKHJlc3VsdC5kaXNwb3NlKSByZXN1bHQuZGlzcG9zZSgpO1xuXHR9KTtcblxuXHQvLyBOb3cgaW4gXCJhcHBseVwiIHBoYXNlXG5cdHZhciBhcHBseVByb21pc2UgPSBzZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuXHR2YXIgZXJyb3I7XG5cdHZhciByZXBvcnRFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcblx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcblx0fTtcblxuXHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG5cdHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0aWYgKHJlc3VsdC5hcHBseSkge1xuXHRcdFx0dmFyIG1vZHVsZXMgPSByZXN1bHQuYXBwbHkocmVwb3J0RXJyb3IpO1xuXHRcdFx0aWYgKG1vZHVsZXMpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gobW9kdWxlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChbZGlzcG9zZVByb21pc2UsIGFwcGx5UHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRyZXR1cm4gc2V0U3RhdHVzKFwiZmFpbFwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRyZXR1cm4gaW50ZXJuYWxBcHBseShvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChsaXN0KSB7XG5cdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0XHRcdGlmIChsaXN0LmluZGV4T2YobW9kdWxlSWQpIDwgMCkgbGlzdC5wdXNoKG1vZHVsZUlkKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBsaXN0O1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNldFN0YXR1cyhcImlkbGVcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gb3V0ZGF0ZWRNb2R1bGVzO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYXBwbHlJbnZhbGlkYXRlZE1vZHVsZXMoKSB7XG5cdGlmIChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMpIHtcblx0XHRpZiAoIWN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzKSBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IFtdO1xuXHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0oXG5cdFx0XHRcdFx0bW9kdWxlSWQsXG5cdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnNcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyA9IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBjaHVua3Ncbi8vIFwiMVwiIG1lYW5zIFwibG9hZGVkXCIsIG90aGVyd2lzZSBub3QgbG9hZGVkIHlldFxudmFyIGluc3RhbGxlZENodW5rcyA9IF9fd2VicGFja19yZXF1aXJlX18uaG1yU19yZXF1aXJlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5obXJTX3JlcXVpcmUgfHwge1xuXHRcIm1haW5cIjogMVxufTtcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBjaHVuayBpbnN0YWxsIGZ1bmN0aW9uIG5lZWRlZFxuXG4vLyBubyBjaHVuayBsb2FkaW5nXG5cbi8vIG5vIGV4dGVybmFsIGluc3RhbGwgY2h1bmtcblxuZnVuY3Rpb24gbG9hZFVwZGF0ZUNodW5rKGNodW5rSWQsIHVwZGF0ZWRNb2R1bGVzTGlzdCkge1xuXHR2YXIgdXBkYXRlID0gcmVxdWlyZShcIi4vXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmh1KGNodW5rSWQpKTtcblx0dmFyIHVwZGF0ZWRNb2R1bGVzID0gdXBkYXRlLm1vZHVsZXM7XG5cdHZhciBydW50aW1lID0gdXBkYXRlLnJ1bnRpbWU7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8odXBkYXRlZE1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0Y3VycmVudFVwZGF0ZVttb2R1bGVJZF0gPSB1cGRhdGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHRpZih1cGRhdGVkTW9kdWxlc0xpc3QpIHVwZGF0ZWRNb2R1bGVzTGlzdC5wdXNoKG1vZHVsZUlkKTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgY3VycmVudFVwZGF0ZVJ1bnRpbWUucHVzaChydW50aW1lKTtcbn1cblxudmFyIGN1cnJlbnRVcGRhdGVDaHVua3M7XG52YXIgY3VycmVudFVwZGF0ZTtcbnZhciBjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcztcbnZhciBjdXJyZW50VXBkYXRlUnVudGltZTtcbmZ1bmN0aW9uIGFwcGx5SGFuZGxlcihvcHRpb25zKSB7XG5cdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmYpIGRlbGV0ZSBfX3dlYnBhY2tfcmVxdWlyZV9fLmYucmVxdWlyZUhtcjtcblx0Y3VycmVudFVwZGF0ZUNodW5rcyA9IHVuZGVmaW5lZDtcblx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRNb2R1bGVFZmZlY3RzKHVwZGF0ZU1vZHVsZUlkKSB7XG5cdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG5cdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cblx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y2hhaW46IFtpZF0sXG5cdFx0XHRcdGlkOiBpZFxuXHRcdFx0fTtcblx0XHR9KTtcblx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuXHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuXHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuXHRcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFtb2R1bGUgfHxcblx0XHRcdFx0KG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCAmJiAhbW9kdWxlLmhvdC5fc2VsZkludmFsaWRhdGVkKVxuXHRcdFx0KVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcblx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG5cdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuXHRcdFx0XHRcdGNoYWluOiBjaGFpbixcblx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG5cdFx0XHRcdHZhciBwYXJlbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbcGFyZW50SWRdO1xuXHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG5cdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcblx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG5cdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG5cdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcblx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG5cdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcblx0XHRcdFx0cXVldWUucHVzaCh7XG5cdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcblx0XHRcdFx0XHRpZDogcGFyZW50SWRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcblx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcblx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuXHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gYltpXTtcblx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcblx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuXHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuXHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG5cdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUobW9kdWxlKSB7XG5cdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyBtb2R1bGUuaWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcblx0XHQpO1xuXHR9O1xuXG5cdGZvciAodmFyIG1vZHVsZUlkIGluIGN1cnJlbnRVcGRhdGUpIHtcblx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGN1cnJlbnRVcGRhdGUsIG1vZHVsZUlkKSkge1xuXHRcdFx0dmFyIG5ld01vZHVsZUZhY3RvcnkgPSBjdXJyZW50VXBkYXRlW21vZHVsZUlkXTtcblx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cblx0XHRcdHZhciByZXN1bHQ7XG5cdFx0XHRpZiAobmV3TW9kdWxlRmFjdG9yeSkge1xuXHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZE1vZHVsZUVmZmVjdHMobW9kdWxlSWQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0ge1xuXHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcblx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG5cdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuXHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcblx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcblx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuXHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuXHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuXHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcblx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcblx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuXHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuXHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG5cdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuXHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcblx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGVycm9yOiBhYm9ydEVycm9yXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAoZG9BcHBseSkge1xuXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IG5ld01vZHVsZUZhY3Rvcnk7XG5cdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcblx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcblx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG5cdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjdXJyZW50VXBkYXRlID0gdW5kZWZpbmVkO1xuXG5cdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cblx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuXHRmb3IgKHZhciBqID0gMDsgaiA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGorKykge1xuXHRcdHZhciBvdXRkYXRlZE1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2pdO1xuXHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0aWYgKFxuXHRcdFx0bW9kdWxlICYmXG5cdFx0XHQobW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkIHx8IG1vZHVsZS5ob3QuX21haW4pICYmXG5cdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG5cdFx0XHRhcHBsaWVkVXBkYXRlW291dGRhdGVkTW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmUgJiZcblx0XHRcdC8vIHdoZW4gY2FsbGVkIGludmFsaWRhdGUgc2VsZi1hY2NlcHRpbmcgaXMgbm90IHBvc3NpYmxlXG5cdFx0XHQhbW9kdWxlLmhvdC5fc2VsZkludmFsaWRhdGVkXG5cdFx0KSB7XG5cdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG5cdFx0XHRcdG1vZHVsZTogb3V0ZGF0ZWRNb2R1bGVJZCxcblx0XHRcdFx0cmVxdWlyZTogbW9kdWxlLmhvdC5fcmVxdWlyZVNlbGYsXG5cdFx0XHRcdGVycm9ySGFuZGxlcjogbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG5cblx0cmV0dXJuIHtcblx0XHRkaXNwb3NlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChjaHVua0lkKSB7XG5cdFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gdW5kZWZpbmVkO1xuXG5cdFx0XHR2YXIgaWR4O1xuXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG5cdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcblx0XHRcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG5cdFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuXHRcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG5cdFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuXHRcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuXHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0ZGlzcG9zZUhhbmRsZXJzW2pdLmNhbGwobnVsbCwgZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJEW21vZHVsZUlkXSA9IGRhdGE7XG5cblx0XHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcblx0XHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcblx0XHRcdFx0ZGVsZXRlIF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG5cblx0XHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuXHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG5cdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHR2YXIgY2hpbGQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcblx0XHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcblx0XHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuXHRcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuXHRcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cblx0XHRcdHZhciBkZXBlbmRlbmN5O1xuXHRcdFx0Zm9yICh2YXIgb3V0ZGF0ZWRNb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuXHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBvdXRkYXRlZE1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRpZiAobW9kdWxlKSB7XG5cdFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9XG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcblx0XHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG5cdFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YXBwbHk6IGZ1bmN0aW9uIChyZXBvcnRFcnJvcikge1xuXHRcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG5cdFx0XHRmb3IgKHZhciB1cGRhdGVNb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oYXBwbGllZFVwZGF0ZSwgdXBkYXRlTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW3VwZGF0ZU1vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbdXBkYXRlTW9kdWxlSWRdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHJ1biBuZXcgcnVudGltZSBtb2R1bGVzXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRVcGRhdGVSdW50aW1lLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVSdW50aW1lW2ldKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuXHRcdFx0Zm9yICh2YXIgb3V0ZGF0ZWRNb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuXHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBvdXRkYXRlZE1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuXHRcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPVxuXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcblx0XHRcdFx0XHRcdHZhciBlcnJvckhhbmRsZXJzID0gW107XG5cdFx0XHRcdFx0XHR2YXIgZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzID0gW107XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG5cdFx0XHRcdFx0XHRcdHZhciBhY2NlcHRDYWxsYmFjayA9XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvckhhbmRsZXIgPVxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZS5ob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBlbmRlbmN5XTtcblx0XHRcdFx0XHRcdFx0aWYgKGFjY2VwdENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGFjY2VwdENhbGxiYWNrKSAhPT0gLTEpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGFjY2VwdENhbGxiYWNrKTtcblx0XHRcdFx0XHRcdFx0XHRlcnJvckhhbmRsZXJzLnB1c2goZXJyb3JIYW5kbGVyKTtcblx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MucHVzaChkZXBlbmRlbmN5KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBjYWxsYmFja3MubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3Nba10uY2FsbChudWxsLCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZXJyb3JIYW5kbGVyc1trXSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckhhbmRsZXJzW2tdKGVyciwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba10sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyMik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogb3V0ZGF0ZWRNb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcblx0XHRcdGZvciAodmFyIG8gPSAwOyBvIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgbysrKSB7XG5cdFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW29dO1xuXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpdGVtLnJlcXVpcmUobW9kdWxlSWQpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVyciwge1xuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRtb2R1bGU6IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcblx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyMik7XG5cdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG91dGRhdGVkTW9kdWxlcztcblx0XHR9XG5cdH07XG59XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkucmVxdWlyZSA9IGZ1bmN0aW9uIChtb2R1bGVJZCwgYXBwbHlIYW5kbGVycykge1xuXHRpZiAoIWN1cnJlbnRVcGRhdGUpIHtcblx0XHRjdXJyZW50VXBkYXRlID0ge307XG5cdFx0Y3VycmVudFVwZGF0ZVJ1bnRpbWUgPSBbXTtcblx0XHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IFtdO1xuXHRcdGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuXHR9XG5cdGlmICghX193ZWJwYWNrX3JlcXVpcmVfXy5vKGN1cnJlbnRVcGRhdGUsIG1vZHVsZUlkKSkge1xuXHRcdGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gX193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXTtcblx0fVxufTtcbl9fd2VicGFja19yZXF1aXJlX18uaG1yQy5yZXF1aXJlID0gZnVuY3Rpb24gKFxuXHRjaHVua0lkcyxcblx0cmVtb3ZlZENodW5rcyxcblx0cmVtb3ZlZE1vZHVsZXMsXG5cdHByb21pc2VzLFxuXHRhcHBseUhhbmRsZXJzLFxuXHR1cGRhdGVkTW9kdWxlc0xpc3Rcbikge1xuXHRhcHBseUhhbmRsZXJzLnB1c2goYXBwbHlIYW5kbGVyKTtcblx0Y3VycmVudFVwZGF0ZUNodW5rcyA9IHt9O1xuXHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IHJlbW92ZWRDaHVua3M7XG5cdGN1cnJlbnRVcGRhdGUgPSByZW1vdmVkTW9kdWxlcy5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwga2V5KSB7XG5cdFx0b2JqW2tleV0gPSBmYWxzZTtcblx0XHRyZXR1cm4gb2JqO1xuXHR9LCB7fSk7XG5cdGN1cnJlbnRVcGRhdGVSdW50aW1lID0gW107XG5cdGNodW5rSWRzLmZvckVhY2goZnVuY3Rpb24gKGNodW5rSWQpIHtcblx0XHRpZiAoXG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJlxuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSB1bmRlZmluZWRcblx0XHQpIHtcblx0XHRcdHByb21pc2VzLnB1c2gobG9hZFVwZGF0ZUNodW5rKGNodW5rSWQsIHVwZGF0ZWRNb2R1bGVzTGlzdCkpO1xuXHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IHRydWU7XG5cdFx0fVxuXHR9KTtcblx0aWYgKF9fd2VicGFja19yZXF1aXJlX18uZikge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uZi5yZXF1aXJlSG1yID0gZnVuY3Rpb24gKGNodW5rSWQsIHByb21pc2VzKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVDaHVua3MgJiZcblx0XHRcdFx0IV9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlQ2h1bmtzLCBjaHVua0lkKSAmJlxuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJlxuXHRcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZFxuXHRcdFx0KSB7XG5cdFx0XHRcdHByb21pc2VzLnB1c2gobG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpKTtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJNID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiByZXF1aXJlKFwiLi9cIiArIF9fd2VicGFja19yZXF1aXJlX18uaG1yRigpKTtcblx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7IGlmKGVyci5jb2RlICE9PSBcIk1PRFVMRV9OT1RfRk9VTkRcIikgdGhyb3cgZXJyOyB9KTtcbn0iLCIiLCIvLyBtb2R1bGUgY2FjaGUgYXJlIHVzZWQgc28gZW50cnkgaW5saW5pbmcgaXMgZGlzYWJsZWRcbi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L3BvbGwuanM/MTAwMFwiKTtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=