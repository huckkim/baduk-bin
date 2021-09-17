/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BoardLogic/BadukGame.ts":
/*!*************************************!*\
  !*** ./src/BoardLogic/BadukGame.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.__esModule = true;
exports.calculateTerritory = exports.findSpaceSize = exports.killGroup = exports.killSurroundingGroups = exports.hasLiberties = exports.setupBoard = void 0;
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
exports["default"] = BadukGame;
;


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

/***/ "./src/Rooms/BadukGameRoom.ts":
/*!************************************!*\
  !*** ./src/Rooms/BadukGameRoom.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.__esModule = true;
exports.BadukGameRoom = void 0;
var helper_1 = __webpack_require__(/*! ../BoardLogic/helper */ "./src/BoardLogic/helper.ts");
var types_1 = __webpack_require__(/*! ../shared/types */ "./src/shared/types.ts");
// Single Game state manager
var BadukGameRoom = /** @class */ (function () {
    function BadukGameRoom(server, roomID) {
        this.spectators = [];
        this.black_client = null;
        this.white_client = null;
        this.game = null;
        this.server = server;
        this.has_started = false;
        this.roomID = roomID;
    }
    BadukGameRoom.prototype.addBlack = function (socket) {
        this.black_client = socket;
    };
    BadukGameRoom.prototype.addWhite = function (socket) {
        this.white_client = socket;
    };
    BadukGameRoom.prototype.addRandom = function (socket) {
        if (Math.random()) {
            this.addBlack(socket);
        }
        else {
            this.addWhite(socket);
        }
    };
    BadukGameRoom.prototype.addOther = function (socket) {
        if (this.black_client === null) {
            this.black_client = socket;
        }
        else if (this.white_client === null) {
            this.white_client = socket;
        }
        else {
            this.spectators.push(socket);
        }
    };
    BadukGameRoom.prototype.startGame = function () {
        this.black_client.emit("PLAYING_BLACK");
        this.white_client.emit("PLAYING_WHITE");
        this.server.to(this.roomID).emit("START_GAME", helper_1.getNumsFromBoard(this.game.board));
    };
    BadukGameRoom.prototype.playMove = function (socket, x, y) {
        var color = (socket.id == this.black_client.id) ? types_1.Color.BLACK : (socket.id === this.white_client.id) ? types_1.Color.WHITE : null;
        if (color === null) {
            socket.emit('ERROR', 'You are not a player');
        }
        else {
            var _a = this.game.playMove(new types_1.Coord(x, y), color), res = _a[0], msg = _a[1];
            if (res) {
                this.server.to(this.roomID).emit("UPDATE_BOARD", helper_1.getNumsFromBoard(this.game.board), this.game.black_captures, this.game.white_captures, msg);
            }
            else {
                socket.emit('ERROR', msg);
            }
        }
    };
    BadukGameRoom.prototype.playPass = function (socket) {
        var color = (socket.id == this.black_client.id) ? types_1.Color.BLACK : (socket.id === this.white_client.id) ? types_1.Color.WHITE : null;
        if (color === null) {
            socket.emit('ERROR', 'You are not a player');
        }
        // Handle removing groups
        var _a = this.game.playMove(null, color), res = _a[0], msg = _a[1];
    };
    return BadukGameRoom;
}());
exports.BadukGameRoom = BadukGameRoom;
exports["default"] = BadukGameRoom;


/***/ }),

/***/ "./src/Rooms/RoomManager.ts":
/*!**********************************!*\
  !*** ./src/Rooms/RoomManager.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var BadukGameRoom_1 = __importDefault(__webpack_require__(/*! ./BadukGameRoom */ "./src/Rooms/BadukGameRoom.ts"));
var uuid_1 = __webpack_require__(/*! uuid */ "uuid");
var RoomManager = function (io) {
    var rooms = new Map();
    io.on('connection', function (socket) {
        console.log("Connection established with:", socket.id);
        // Create a new game
        // - size of board
        // - handicap for black
        // - game creator color: black, white, random
        socket.on('CREATE_GAME', function (size, handicap, color) {
            var roomID = uuid_1.v4();
            var game_state = new BadukGameRoom_1["default"](io, roomID);
            socket.join(roomID);
            if (color == 'black') {
                game_state.addBlack(socket);
            }
            else if (color == 'white') {
                game_state.addWhite(socket);
            }
            else {
                game_state.addRandom(socket);
            }
            rooms.set(roomID, game_state);
            socket.emit('ROOM_ID', roomID);
        });
        socket.on('JOIN_GAME', function (roomID) {
            var game_state = rooms.get(roomID);
            socket.join(roomID);
            game_state.addOther(socket);
        });
        socket.on('PLAY_MOVE', function (x, y, pass, roomID) {
            var game_state = rooms.get(roomID);
            if (pass) {
                game_state.playPass(socket);
            }
            else {
                game_state.playMove(socket, parseInt(x), parseInt(y));
            }
        });
    });
};
exports["default"] = RoomManager;
/*
  socket.on("PLAY_MOVE", (x: string, y: string, pass: boolean) => {
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

  socket.on("START_GAME", () => {
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
  })

  socket.on("disconnect", () => {
    console.log("Connection lost with:", socket.id);
    let i = clients.indexOf(socket);
    if (i > -1) {
      clients.splice(i, 1);
    }
    console.log(clients.length)
  })
  */


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var http_1 = __importDefault(__webpack_require__(/*! http */ "http"));
var socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
var cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
var RoomManager_1 = __importDefault(__webpack_require__(/*! ./Rooms/RoomManager */ "./src/Rooms/RoomManager.ts"));
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
/**
 *  Socket.IO Room + Game Management
 *    - RoomManager stores instances of GameRoom
 *    - GameRoom takes in players and manages game states
 */
// SOcket IO Room Manager
RoomManager_1["default"](io);
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

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

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
/******/ 		__webpack_require__.h = () => ("1ff8e87041f6be88dedc")
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNO1dBQ047V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHOztXQUVIO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQTtXQUNBLEdBQUc7O1dBRUg7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQSxpQkFBaUIscUNBQXFDO1dBQ3REOztXQUVBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxRQUFRO1dBQ1I7V0FDQTtXQUNBLFFBQVE7V0FDUjtXQUNBLE1BQU07V0FDTixLQUFLO1dBQ0wsSUFBSTtXQUNKLEdBQUc7V0FDSDs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7O1dBRUE7V0FDQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOztXQUVBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDs7V0FFQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7O1dBRUE7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsRUFBRTs7V0FFRjtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBOztX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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0EsRUFBRSx3QkFBd0IsZ0RBQWdEO1dBQzFFOzs7OztVRTVkQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvQm9hcmRMb2dpYy9CYWR1a0dhbWUudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvQm9hcmRMb2dpYy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvUm9vbXMvQmFkdWtHYW1lUm9vbS50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL3NyYy9Sb29tcy9Sb29tTWFuYWdlci50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL3NyYy9tYWluLnRzIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyLy4vc3JjL3NoYXJlZC90eXBlcy50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9sb2ctYXBwbHktcmVzdWx0LmpzIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyLy4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy5qcyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiY29yc1wiIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwic29ja2V0LmlvXCIiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJ1dWlkXCIiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBcIiIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgdXBkYXRlIGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svcnVudGltZS9nZXQgdXBkYXRlIG1hbmlmZXN0IGZpbGVuYW1lIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svcnVudGltZS9ob3QgbW9kdWxlIHJlcGxhY2VtZW50Iiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svcnVudGltZS9yZXF1aXJlIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY2FsY3VsYXRlVGVycml0b3J5ID0gZXhwb3J0cy5maW5kU3BhY2VTaXplID0gZXhwb3J0cy5raWxsR3JvdXAgPSBleHBvcnRzLmtpbGxTdXJyb3VuZGluZ0dyb3VwcyA9IGV4cG9ydHMuaGFzTGliZXJ0aWVzID0gZXhwb3J0cy5zZXR1cEJvYXJkID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3R5cGVzXCIpO1xudmFyIGhlbHBlcl8xID0gcmVxdWlyZShcIi4vaGVscGVyXCIpO1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBHQU1FIExPR0lDIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKipcbiAqIHNldHVwIEJvYXJkIHdpdGggcHJvcGVyIHNpemUgYW5kIGhhbmRpY2FwXG4gKiBAcGFyYW0gc2l6ZVxuICogQHBhcmFtIGhhbmRpY2FwXG4gKiBAcmV0dXJucyBCb2FyZCBvYmplY3QgYW5kIGNvbG9yIG9mIHBsYXllciB0byBtb3ZlXG4gKi9cbmZ1bmN0aW9uIHNldHVwQm9hcmQoc2l6ZSwgaGFuZGljYXApIHtcbiAgICB2YXIgYm9hcmQgPSBuZXcgQXJyYXkoc2l6ZSkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KHNpemUpLmZpbGwobnVsbCk7IH0pO1xuICAgIGlmIChoYW5kaWNhcC5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gW2JvYXJkLCB0eXBlc18xLkNvbG9yLkJMQUNLXTtcbiAgICB9XG4gICAgaGFuZGljYXAuZm9yRWFjaChmdW5jdGlvbiAoY29vcmQpIHsgYm9hcmRbY29vcmQueV1bY29vcmQueF0gPSB0eXBlc18xLkNvbG9yLkJMQUNLOyB9KTtcbiAgICByZXR1cm4gW2JvYXJkLCB0eXBlc18xLkNvbG9yLldISVRFXTtcbn1cbmV4cG9ydHMuc2V0dXBCb2FyZCA9IHNldHVwQm9hcmQ7XG4vKipcbiAqIHByZTogYm9hcmQgYXQgbG9jICE9IG51bGxcbiAqXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm5zIENoZWNrcyBpZiB0aGUgZ3JvdXAgbG9jYXRlZCBhdCBsb2MgaGFzIGFueSBsaWJlcnRpZXNcbiAqL1xuZnVuY3Rpb24gaGFzTGliZXJ0aWVzKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciBjdXJyX3BsYXllciA9IGJvYXJkW2xvYy55XVtsb2MueF07XG4gICAgdmFyIHZpc2lzdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoIXZpc2lzdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgLy8gRW1wdHkgc3BhY2UgPT4gbGliZXJ0eVxuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgdGhlIHN0b25lIGlzIHRoZSBzYW1lIGNvbG9yIGdvIHRvIGl0J3MgbmVpZ2h0Ym91cnNcbiAgICAgICAgICAgIGVsc2UgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBjdXJyX3BsYXllcikge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmhhc0xpYmVydGllcyA9IGhhc0xpYmVydGllcztcbi8qKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEBwYXJhbSBtb3ZlXG4gKiBAcmV0dXJucyByZXR1cm5zIGlmIGEgbW92ZSBpcyB2YWxpZCBhbmQgaWYgaXQgaXMsIHRoZSByZXN1bHRpbmcgYm9hcmQgYW5kIHRoZSBudW1iZXIgb2Ygc3RvbmVzIGNhcHR1cmVkXG4gKi9cbmZ1bmN0aW9uIHBsYXlCb2FyZE1vdmUoYm9hcmQsIGN1cnJfcGxheWVyLCBtb3ZlKSB7XG4gICAgaWYgKGJvYXJkW21vdmUueV1bbW92ZS54XSAhPSBudWxsKVxuICAgICAgICByZXR1cm4gW2ZhbHNlLCBib2FyZCwgMCwgXCJjYW4ndCBwbGF5IG9udG9wIG9mIGEgc3RvbmVcIl07XG4gICAgcmV0dXJuIGNvbW1pdFBsYWNlQW5kS2lsbChib2FyZCwgY3Vycl9wbGF5ZXIsIG1vdmUpO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIG1vdmUgb2YgcGxhY2luZyBhIHN0b25lIG9mIGN1cnJfcGxheWVyIGF0IGxvYyBpcyB2YWxpZCwgYW5kIGlmIHNvXG4gKiAgICAgICAgICB0aGUgbmV3IGJvYXJkIGFuZCB0aGUgbnVtYmVyIG9mIHN0b25lcyBraWxsZWRcbiAqL1xuZnVuY3Rpb24gY29tbWl0UGxhY2VBbmRLaWxsKGJvYXJkLCBjdXJyX3BsYXllciwgbG9jKSB7XG4gICAgYm9hcmRbbG9jLnldW2xvYy54XSA9IGN1cnJfcGxheWVyO1xuICAgIGlmIChoYXNMaWJlcnRpZXMoYm9hcmQsIGxvYykpIHtcbiAgICAgICAgdmFyIF9hID0ga2lsbFN1cnJvdW5kaW5nR3JvdXBzKGJvYXJkLCBsb2MpLCBuYm9hcmQgPSBfYVswXSwga2lsbGVkID0gX2FbMV07XG4gICAgICAgIHJldHVybiBbdHJ1ZSwgbmJvYXJkLCBraWxsZWQsIFwiT2tcIl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgX2IgPSBraWxsU3Vycm91bmRpbmdHcm91cHMoYm9hcmQsIGxvYyksIG5ib2FyZCA9IF9iWzBdLCBraWxsZWQgPSBfYlsxXTtcbiAgICAgICAgaWYgKGtpbGxlZCA9PSAwKSB7XG4gICAgICAgICAgICBib2FyZFtsb2MueV1bbG9jLnhdID0gbnVsbDsgLy8gcmVzZXQgcGxheWVyXG4gICAgICAgICAgICByZXR1cm4gW2ZhbHNlLCBib2FyZCwgMCwgXCJTdWljaWRlIGlzIGlsbGVnYWxcIl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0cnVlLCBuYm9hcmQsIGtpbGxlZCwgXCJPa1wiXTtcbiAgICB9XG59XG4vKipcbiAqIEZpbmRzIHRoZSBib2FyZCBhZnRlciBraWxsaW5nIHRoZSBzdXJyb3VuZGluZyBlbmVteSBncm91cHMgd2l0aCBubyBsaWJlcnRpZXNcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnMgbmV3IGJvYXJkIGFuZCBudW1iZXIgb2YgZW5lbXkgc3RvbmVzIGtpbGxlZFxuICovXG5mdW5jdGlvbiBraWxsU3Vycm91bmRpbmdHcm91cHMoYm9hcmQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIGN1cnJfcGxheWVyID0gYm9hcmRbbG9jLnldW2xvYy54XTtcbiAgICB2YXIgdmlzaXN0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIga2lsbGVkID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdID09IG51bGwpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBlbHNlIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55ICsgMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSAtIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCArIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggLSAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghaGFzTGliZXJ0aWVzKGJvYXJkLCBjdXJyKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2EgPSBraWxsR3JvdXAoYm9hcmQsIGN1cnIpLCB0Ym9hcmQgPSBfYVswXSwgdGtpbGxlZCA9IF9hWzFdO1xuICAgICAgICAgICAgICAgICAgICBib2FyZCA9IHRib2FyZDtcbiAgICAgICAgICAgICAgICAgICAga2lsbGVkICs9IHRraWxsZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JvYXJkLCBraWxsZWRdO1xufVxuZXhwb3J0cy5raWxsU3Vycm91bmRpbmdHcm91cHMgPSBraWxsU3Vycm91bmRpbmdHcm91cHM7XG4vKipcbiAqIHByZTogYm9hcmQgYXQgbG9jICE9IG51bGxcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnMgcmV0dXJucyBib2FyZCBhZnRlciBraWxsaW5nIHRoZSBncm91cCBhdCBsb2MsIGFuZCB0aGUgbnVtYmVyIG9mIHN0b25lcyBraWxsZWRcbiAqL1xuZnVuY3Rpb24ga2lsbEdyb3VwKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciBjdXJyX3BsYXllciA9IGJvYXJkW2xvYy55XVtsb2MueF07XG4gICAgdmFyIHZpc2l0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIga2lsbGVkID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXRlZFtjdXJyLnldW2N1cnIueF0pIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtjdXJyLnldW2N1cnIueF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGtpbGxlZCArPSAxO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbYm9hcmQsIGtpbGxlZF07XG59XG5leHBvcnRzLmtpbGxHcm91cCA9IGtpbGxHcm91cDtcbi8vIHByZTogYm9hcmQgYXQgbG9jIGlzIGVtcHR5XG5mdW5jdGlvbiBmaW5kU3BhY2VTaXplKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB2aXNpdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgdmFyIHN6ID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXRlZFtjdXJyLnldW2N1cnIueF0pIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN6ICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpdGVkW2N1cnIueV1bY3Vyci54XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN6O1xufVxuZXhwb3J0cy5maW5kU3BhY2VTaXplID0gZmluZFNwYWNlU2l6ZTtcbi8qKlxuICogcHJlOiBkZWFkIGdyb3VwcyBhcmUgcmVtb3ZlZCBiZWZvcmVoYW5kXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEByZXR1cm5zIHJldHVybiB0ZXJyaXRvcnkgcG9pbnRzIGZvciBbYmxhY2ssIHdoaXRlXVxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVUZXJyaXRvcnkoYm9hcmQpIHtcbiAgICB2YXIgdmlzaXRlZCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChmYWxzZSk7IH0pO1xuICAgIHZhciBibGFja190ZXJyaXRvcnkgPSAwO1xuICAgIHZhciB3aGl0ZV90ZXJyaXRvcnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW2ldW2pdICYmIGJvYXJkW2ldW2pdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvYyA9IG5ldyB0eXBlc18xLkNvb3JkKGosIGkpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IGhlbHBlcl8xLmZpbmRCb3JkZXJpbmdDb2xvcihib2FyZCwgbG9jKTtcbiAgICAgICAgICAgICAgICB2YXIgc3ogPSBmaW5kU3BhY2VTaXplKGJvYXJkLCBsb2MpO1xuICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykge1xuICAgICAgICAgICAgICAgICAgICBibGFja190ZXJyaXRvcnkgKz0gc3o7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yID09PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaXRlX3RlcnJpdG9yeSArPSBzejtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZWxzZSBjb2xvciA9PT0gbnVsbCA9PiBlbXB0eSBib2FyZCAvIGRpc3B1dGVkIGFyZWFzIG5vIHBvaW50c1xuICAgICAgICAgICAgICAgIC8vIG1hcmsgYXMgdmlld2VkXG4gICAgICAgICAgICAgICAgaGVscGVyXzEuc2V0VmlzaXRlZChib2FyZCwgdmlzaXRlZCwgbG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JsYWNrX3RlcnJpdG9yeSwgd2hpdGVfdGVycml0b3J5XTtcbn1cbmV4cG9ydHMuY2FsY3VsYXRlVGVycml0b3J5ID0gY2FsY3VsYXRlVGVycml0b3J5O1xuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBnYW1lIG9mIEJhZHVrXG4gKiBAcGFyYW0gc2l6ZVxuICogQHBhcmFtIGhhbmRpY2FwXG4gKiBAcGFyYW0ga29taVxuICovXG52YXIgQmFkdWtHYW1lID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEJhZHVrR2FtZShzaXplLCBoYW5kaWNhcCwga29taSkge1xuICAgICAgICB2YXIgX2EgPSBzZXR1cEJvYXJkKHNpemUsIGhhbmRpY2FwKSwgYm9hcmQgPSBfYVswXSwgY3Vycl9wbGF5ZXIgPSBfYVsxXTtcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgICAgICB0aGlzLnByZXZfYm9hcmQgPSBudWxsO1xuICAgICAgICB0aGlzLmN1cnJfcGxheWVyID0gY3Vycl9wbGF5ZXI7XG4gICAgICAgIHRoaXMuaGFzX3Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmtvbWkgPSBrb21pO1xuICAgICAgICB0aGlzLmJsYWNrX2NhcHR1cmVzID0gMDtcbiAgICAgICAgdGhpcy53aGl0ZV9jYXB0dXJlcyA9IDA7XG4gICAgICAgIHRoaXMuaXNfb3ZlciA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbW92ZVxuICAgICAqIEBwYXJhbSBjdXJyX3BsYXllclxuICAgICAqIEByZXR1cm5zIHJldHVybnMgd2hldGhlciB0aGUgbW92ZSB3YXMgdmFsaWQgKGJvb2xlYW4pIG9yIGEgd2lubmVyIChjb2xvcikgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgICAqL1xuICAgIEJhZHVrR2FtZS5wcm90b3R5cGUucGxheU1vdmUgPSBmdW5jdGlvbiAobW92ZSwgY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoY3Vycl9wbGF5ZXIgIT0gdGhpcy5jdXJyX3BsYXllcilcbiAgICAgICAgICAgIHJldHVybiBbZmFsc2UsIFwiSWxsZWdhbCBtb3ZlLCBub3QgeW91ciB0dXJuXCJdO1xuICAgICAgICBlbHNlIGlmIChtb3ZlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc19wYXNzZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFRIRSBHQU1FIElTIERPTkVcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgd2lubmVyXG4gICAgICAgICAgICAgICAgdGhpcy5pc19vdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfYSA9IGNhbGN1bGF0ZVRlcnJpdG9yeSh0aGlzLmJvYXJkKSwgdGhpcy5ibGFja190ZXJyaXRvcnkgPSBfYVswXSwgdGhpcy53aGl0ZV90ZXJyaXRvcnkgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICB2YXIgYmxhY2tfc2NvcmUgPSB0aGlzLmJsYWNrX2NhcHR1cmVzICsgdGhpcy5ibGFja190ZXJyaXRvcnk7XG4gICAgICAgICAgICAgICAgdmFyIHdoaXRlX3Njb3JlID0gdGhpcy53aGl0ZV9jYXB0dXJlcyArIHRoaXMud2hpdGVfdGVycml0b3J5O1xuICAgICAgICAgICAgICAgIHdoaXRlX3Njb3JlICs9IHRoaXMua29taTsgLy8gYWRkIEtvbWkgZm9yIHdoaXRlXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtbKGJsYWNrX3Njb3JlID4gd2hpdGVfc2NvcmUpID8gdHlwZXNfMS5Db2xvci5CTEFDSyA6IHR5cGVzXzEuQ29sb3IuV0hJVEUsIGJsYWNrX3Njb3JlLCB3aGl0ZV9zY29yZV0sIFwiR2FtZSBvdmVyXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNfcGFzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFzX3Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9iID0gcGxheUJvYXJkTW92ZSh0aGlzLmJvYXJkLCB0aGlzLmN1cnJfcGxheWVyLCBtb3ZlKSwgdmFsaWQgPSBfYlswXSwgbmJvYXJkID0gX2JbMV0sIGNhcHR1cmVzID0gX2JbMl0sIHN0ciA9IF9iWzNdO1xuICAgICAgICAgICAgLy8gaW52YWxpZCBtb3ZlXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSwgXCJJbGxlZ2FsIE1vdmUsIFwiICsgc3RyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGtvLCBub3QgdmFsaWQgbW92ZVxuICAgICAgICAgICAgaWYgKHRoaXMucHJldl9ib2FyZCAhPT0gbnVsbCAmJiBoZWxwZXJfMS5pc0JvYXJkRXF1YWwodGhpcy5wcmV2X2JvYXJkLCBuYm9hcmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSwgXCJJbGxlZ2FsIE1vdmUsIEtvXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIGtvIGJvYXJkXG4gICAgICAgICAgICB0aGlzLnByZXZfYm9hcmQgPSBoZWxwZXJfMS5jbG9uZUJvYXJkKHRoaXMuYm9hcmQpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGJvYXJkIHN0YXRlXG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbmJvYXJkO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGNhcHR1cmVkIHN0b25lc1xuICAgICAgICAgICAgaWYgKHRoaXMuY3Vycl9wbGF5ZXIgPT0gdHlwZXNfMS5Db2xvci5CTEFDSylcbiAgICAgICAgICAgICAgICB0aGlzLmJsYWNrX2NhcHR1cmVzICs9IGNhcHR1cmVzO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGVfY2FwdHVyZXMgKz0gY2FwdHVyZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmV4dCBwbGF5ZXJzIHR1cm5cbiAgICAgICAgdGhpcy5jdXJyX3BsYXllciA9IHRoaXMuY3Vycl9wbGF5ZXIgPT0gdHlwZXNfMS5Db2xvci5CTEFDSyA/IHR5cGVzXzEuQ29sb3IuV0hJVEUgOiB0eXBlc18xLkNvbG9yLkJMQUNLO1xuICAgICAgICByZXR1cm4gW3RydWUsIFwiVmFsaWQgTW92ZVwiXTtcbiAgICB9O1xuICAgIEJhZHVrR2FtZS5wcm90b3R5cGUucmVtb3ZlR3JvdXAgPSBmdW5jdGlvbiAobG9jKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW2xvYy55XVtsb2MueF0gPT09IHR5cGVzXzEuQ29sb3IuQkxBQ0spIHtcbiAgICAgICAgICAgIHZhciBfYSA9IGtpbGxHcm91cCh0aGlzLmJvYXJkLCBsb2MpLCBuYm9hcmQgPSBfYVswXSwga2lsbGVkID0gX2FbMV07XG4gICAgICAgICAgICB0aGlzLndoaXRlX2NhcHR1cmVzICs9IGtpbGxlZDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQgPSBuYm9hcmQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5ib2FyZFtsb2MueV1bbG9jLnhdID09PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBraWxsR3JvdXAodGhpcy5ib2FyZCwgbG9jKSwgbmJvYXJkID0gX2JbMF0sIGtpbGxlZCA9IF9iWzFdO1xuICAgICAgICAgICAgdGhpcy5ibGFja19jYXB0dXJlcyArPSBraWxsZWQ7XG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbmJvYXJkO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQmFkdWtHYW1lO1xufSgpKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQmFkdWtHYW1lO1xuO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5jbG9uZUJvYXJkID0gZXhwb3J0cy5hbHBoYVRvQ29vcmQgPSBleHBvcnRzLnNldFZpc2l0ZWQgPSBleHBvcnRzLmZpbmRCb3JkZXJpbmdDb2xvciA9IGV4cG9ydHMuZ2V0Qm9hcmRGcm9tU3RyaW5ncyA9IGV4cG9ydHMuZ2V0TnVtc0Zyb21Cb2FyZCA9IGV4cG9ydHMuZ2V0U3RyaW5nc0Zyb21Cb2FyZCA9IGV4cG9ydHMuZ2V0Q29vcmRGcm9tQm9hcmQgPSBleHBvcnRzLnNlbGVjdEdyb3VwID0gZXhwb3J0cy5zZXRDb2xvciA9IGV4cG9ydHMuaXNCb2FyZEVtcHR5ID0gZXhwb3J0cy5pc0JvYXJkRXF1YWwgPSB2b2lkIDA7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvdHlwZXNcIik7XG52YXIgQmFkdWtHYW1lXzEgPSByZXF1aXJlKFwiLi9CYWR1a0dhbWVcIik7XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBVVElMSVRZIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKipcbiAqIEBwYXJhbSBib2FyZDFcbiAqIEBwYXJhbSBib2FyZDJcbiAqIEByZXR1cm5zIGlmIGJvYXJkMSBhbmQgYm9hcmQyIHJlcHJlc2VudCB0aGUgc2FtZSBzdGF0ZVxuICovXG5mdW5jdGlvbiBpc0JvYXJkRXF1YWwoYm9hcmQxLCBib2FyZDIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvYXJkMS5sZW5ndGg7ICsraSkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJvYXJkMS5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKGJvYXJkMVtpXVtqXSAhPT0gYm9hcmQyW2ldW2pdKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuaXNCb2FyZEVxdWFsID0gaXNCb2FyZEVxdWFsO1xuLyoqXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEByZXR1cm5zIHJldHVybiBpZiBib2FyZCBpcyBlbXB0eSAoaGFzIG5vIHN0b25lcylcbiAqL1xuZnVuY3Rpb24gaXNCb2FyZEVtcHR5KGJvYXJkKSB7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBib2FyZF8xID0gYm9hcmQ7IF9pIDwgYm9hcmRfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHJvdyA9IGJvYXJkXzFbX2ldO1xuICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHJvd18xID0gcm93OyBfYSA8IHJvd18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgdmFyIHNwYWNlID0gcm93XzFbX2FdO1xuICAgICAgICAgICAgaWYgKHNwYWNlICE9IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0cy5pc0JvYXJkRW1wdHkgPSBpc0JvYXJkRW1wdHk7XG4vKipcbiAqIHNldHMgZWFjaCBvZiB0aGUgQ29vcmRzIGdpdmVuIGluIG1vdmVzIHRvIGN1cnJfcGxheWVyIGluIGJvYXJkXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEBwYXJhbSBtb3ZlcyBBcnJheSBvZiBDb29yZHMgdG8gcGxhY2Ugc3RvbmVcbiAqIEBwYXJhbSBjdXJyX3BsYXllclxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gc2V0Q29sb3IoYm9hcmQsIG1vdmVzLCBjdXJyX3BsYXllcikge1xuICAgIG1vdmVzLmZvckVhY2goZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgYm9hcmRbbW92ZS55XVttb3ZlLnhdID0gY3Vycl9wbGF5ZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvYXJkO1xufVxuZXhwb3J0cy5zZXRDb2xvciA9IHNldENvbG9yO1xuO1xuLyoqXG4gKiBwcmU6IGJvYXJkIGF0IGxvYyAhPSBudWxsXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm4gYSBCb2FyZCB3aXRoIG9ubHkgdGhlIGdyb3VwIGNvbm5lY3RlZCB0byB0aGUgc3RvbmUgYXQgbG9jIHBsYWNlZFxuICovXG5mdW5jdGlvbiBzZWxlY3RHcm91cChib2FyZCwgbG9jKSB7XG4gICAgdmFyIHRvVmlzaXQgPSBbbG9jXTtcbiAgICB2YXIgY3Vycl9wbGF5ZXIgPSBib2FyZFtsb2MueV1bbG9jLnhdO1xuICAgIHZhciBjaGVja0dyYXBoID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKFwiTlwiKTsgfSk7XG4gICAgdmFyIHNpemUgPSBib2FyZC5sZW5ndGg7XG4gICAgdmFyIG5ib2FyZCA9IG5ldyBBcnJheShzaXplKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoc2l6ZSkuZmlsbChudWxsKTsgfSk7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoY2hlY2tHcmFwaFtjdXJyLnldW2N1cnIueF0gPT0gXCJOXCIpIHtcbiAgICAgICAgICAgIG5ib2FyZFtjdXJyLnldW2N1cnIueF0gPSBjdXJyX3BsYXllcjtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55ICsgMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSAtIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCArIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggLSAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoZWNrR3JhcGhbY3Vyci55XVtjdXJyLnhdID0gXCJEXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ib2FyZDtcbn1cbmV4cG9ydHMuc2VsZWN0R3JvdXAgPSBzZWxlY3RHcm91cDtcbi8qKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcmV0dXJuIGdpdmVuIGEgYm9hcmQsIHJldHVybiBhbiBhcnJheSBvZiBjb29yZHMgZm9yIGxvY2F0aW9uIG9mIGJsYWNrIGFuZCB3aGl0ZSBzdG9uZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Q29vcmRGcm9tQm9hcmQoYm9hcmQpIHtcbiAgICB2YXIgYmxhY2tfY29vcmRzID0gW107XG4gICAgdmFyIHdoaXRlX2Nvb3JkcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2ldW2pdID09IHR5cGVzXzEuQ29sb3IuQkxBQ0spIHtcbiAgICAgICAgICAgICAgICBibGFja19jb29yZHMucHVzaChuZXcgdHlwZXNfMS5Db29yZChqLCBpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChib2FyZFtpXVtqXSA9PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICAgICAgd2hpdGVfY29vcmRzLnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoaiwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbYmxhY2tfY29vcmRzLCB3aGl0ZV9jb29yZHNdO1xufVxuZXhwb3J0cy5nZXRDb29yZEZyb21Cb2FyZCA9IGdldENvb3JkRnJvbUJvYXJkO1xuZnVuY3Rpb24gZ2V0U3RyaW5nc0Zyb21Cb2FyZChib2FyZCkge1xuICAgIHZhciBuYm9hcmQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gYm9hcmQubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIHJvdyA9IGJvYXJkW2ldLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiAodmFsID09PSBudWxsKSA/ICctJyA6ICgodmFsID09PSB0eXBlc18xLkNvbG9yLkJMQUNLKSA/ICdYJyA6ICdPJyk7IH0pO1xuICAgICAgICBuYm9hcmQucHVzaChyb3cpO1xuICAgIH1cbiAgICByZXR1cm4gbmJvYXJkO1xufVxuZXhwb3J0cy5nZXRTdHJpbmdzRnJvbUJvYXJkID0gZ2V0U3RyaW5nc0Zyb21Cb2FyZDtcbmZ1bmN0aW9uIGdldE51bXNGcm9tQm9hcmQoYm9hcmQpIHtcbiAgICB2YXIgbmJvYXJkID0gW107XG4gICAgYm9hcmQuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBucm93ID0gcm93Lm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiAodmFsID09PSBudWxsKSA/IDAgOiAoKHZhbCA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykgPyAxIDogLTEpOyB9KTtcbiAgICAgICAgbmJvYXJkLnB1c2gobnJvdyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ib2FyZDtcbn1cbmV4cG9ydHMuZ2V0TnVtc0Zyb21Cb2FyZCA9IGdldE51bXNGcm9tQm9hcmQ7XG5mdW5jdGlvbiBnZXRCb2FyZEZyb21TdHJpbmdzKGJvYXJkKSB7XG4gICAgdmFyIG5ib2FyZCA9IEJhZHVrR2FtZV8xLnNldHVwQm9hcmQoYm9hcmQubGVuZ3RoLCBbXSlbMF07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7ICsraSkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJvYXJkLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbaV1bal0gPT0gJ1gnKVxuICAgICAgICAgICAgICAgIG5ib2FyZFtpXVtqXSA9IHR5cGVzXzEuQ29sb3IuQkxBQ0s7XG4gICAgICAgICAgICBlbHNlIGlmIChib2FyZFtpXVtqXSA9PSAnTycpXG4gICAgICAgICAgICAgICAgbmJvYXJkW2ldW2pdID0gdHlwZXNfMS5Db2xvci5XSElURTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmJvYXJkO1xufVxuZXhwb3J0cy5nZXRCb2FyZEZyb21TdHJpbmdzID0gZ2V0Qm9hcmRGcm9tU3RyaW5ncztcbi8qKlxuICogZmluZCB0aGUgYm9yZGVyaW5nIGNvbG9yIGVtcHR5IHNwYWNlIGF0IGxvY1xuICogcHJlOiBib2FyZCBhdCBsb2MgPT0gbnVsbCwgaWYgYm90aCBjb2xvcnMgb3Igbm9uZSBhcmUgcHJlc2VudCByZXR1cm4gbnVsbFxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gbG9jXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBmaW5kQm9yZGVyaW5nQ29sb3IoYm9hcmQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIHZpc2l0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIgY3Vycl9jb2xvciA9IG51bGw7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoIXZpc2l0ZWRbY3Vyci55XVtjdXJyLnhdKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJfY29sb3IgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGN1cnJfY29sb3IgPSBib2FyZFtjdXJyLnldW2N1cnIueF07XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3Vycl9jb2xvciAhPSBib2FyZFtjdXJyLnldW2N1cnIueF0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpdGVkW2N1cnIueV1bY3Vyci54XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN1cnJfY29sb3I7XG59XG5leHBvcnRzLmZpbmRCb3JkZXJpbmdDb2xvciA9IGZpbmRCb3JkZXJpbmdDb2xvcjtcbmZ1bmN0aW9uIHNldFZpc2l0ZWQoYm9hcmQsIHZpc2l0ZWQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIHR2aXNpdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgdmFyIHN6ID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdHZpc2l0ZWRbY3Vyci55XVtjdXJyLnhdKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW2N1cnIueV1bY3Vyci54XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0dmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2aXNpdGVkO1xufVxuZXhwb3J0cy5zZXRWaXNpdGVkID0gc2V0VmlzaXRlZDtcbmZ1bmN0aW9uIGFscGhhVG9Db29yZChzdHIpIHtcbiAgICB2YXIgeCA9IHN0ci5jaGFyQ29kZUF0KDApIC0gNjU7XG4gICAgaWYgKHggPj0gOSlcbiAgICAgICAgLS14O1xuICAgIHZhciB5ID0gc3RyLmNoYXJDb2RlQXQoMSkgLSA0OTtcbiAgICByZXR1cm4gbmV3IHR5cGVzXzEuQ29vcmQoeCwgeSk7XG59XG5leHBvcnRzLmFscGhhVG9Db29yZCA9IGFscGhhVG9Db29yZDtcbmZ1bmN0aW9uIGNsb25lQm9hcmQoYm9hcmQpIHtcbiAgICB2YXIgbmJvYXJkID0gW107XG4gICAgYm9hcmQuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBucm93ID0gcm93Lm1hcChmdW5jdGlvbiAoZSkgeyByZXR1cm4gZTsgfSk7XG4gICAgICAgIG5ib2FyZC5wdXNoKG5yb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiBuYm9hcmQ7XG59XG5leHBvcnRzLmNsb25lQm9hcmQgPSBjbG9uZUJvYXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5CYWR1a0dhbWVSb29tID0gdm9pZCAwO1xudmFyIGhlbHBlcl8xID0gcmVxdWlyZShcIi4uL0JvYXJkTG9naWMvaGVscGVyXCIpO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3R5cGVzXCIpO1xuLy8gU2luZ2xlIEdhbWUgc3RhdGUgbWFuYWdlclxudmFyIEJhZHVrR2FtZVJvb20gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQmFkdWtHYW1lUm9vbShzZXJ2ZXIsIHJvb21JRCkge1xuICAgICAgICB0aGlzLnNwZWN0YXRvcnMgPSBbXTtcbiAgICAgICAgdGhpcy5ibGFja19jbGllbnQgPSBudWxsO1xuICAgICAgICB0aGlzLndoaXRlX2NsaWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuZ2FtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLmhhc19zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucm9vbUlEID0gcm9vbUlEO1xuICAgIH1cbiAgICBCYWR1a0dhbWVSb29tLnByb3RvdHlwZS5hZGRCbGFjayA9IGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgdGhpcy5ibGFja19jbGllbnQgPSBzb2NrZXQ7XG4gICAgfTtcbiAgICBCYWR1a0dhbWVSb29tLnByb3RvdHlwZS5hZGRXaGl0ZSA9IGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgdGhpcy53aGl0ZV9jbGllbnQgPSBzb2NrZXQ7XG4gICAgfTtcbiAgICBCYWR1a0dhbWVSb29tLnByb3RvdHlwZS5hZGRSYW5kb20gPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEJsYWNrKHNvY2tldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFdoaXRlKHNvY2tldCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJhZHVrR2FtZVJvb20ucHJvdG90eXBlLmFkZE90aGVyID0gZnVuY3Rpb24gKHNvY2tldCkge1xuICAgICAgICBpZiAodGhpcy5ibGFja19jbGllbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYmxhY2tfY2xpZW50ID0gc29ja2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMud2hpdGVfY2xpZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLndoaXRlX2NsaWVudCA9IHNvY2tldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdG9ycy5wdXNoKHNvY2tldCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJhZHVrR2FtZVJvb20ucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ibGFja19jbGllbnQuZW1pdChcIlBMQVlJTkdfQkxBQ0tcIik7XG4gICAgICAgIHRoaXMud2hpdGVfY2xpZW50LmVtaXQoXCJQTEFZSU5HX1dISVRFXCIpO1xuICAgICAgICB0aGlzLnNlcnZlci50byh0aGlzLnJvb21JRCkuZW1pdChcIlNUQVJUX0dBTUVcIiwgaGVscGVyXzEuZ2V0TnVtc0Zyb21Cb2FyZCh0aGlzLmdhbWUuYm9hcmQpKTtcbiAgICB9O1xuICAgIEJhZHVrR2FtZVJvb20ucHJvdG90eXBlLnBsYXlNb3ZlID0gZnVuY3Rpb24gKHNvY2tldCwgeCwgeSkge1xuICAgICAgICB2YXIgY29sb3IgPSAoc29ja2V0LmlkID09IHRoaXMuYmxhY2tfY2xpZW50LmlkKSA/IHR5cGVzXzEuQ29sb3IuQkxBQ0sgOiAoc29ja2V0LmlkID09PSB0aGlzLndoaXRlX2NsaWVudC5pZCkgPyB0eXBlc18xLkNvbG9yLldISVRFIDogbnVsbDtcbiAgICAgICAgaWYgKGNvbG9yID09PSBudWxsKSB7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnRVJST1InLCAnWW91IGFyZSBub3QgYSBwbGF5ZXInKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMuZ2FtZS5wbGF5TW92ZShuZXcgdHlwZXNfMS5Db29yZCh4LCB5KSwgY29sb3IpLCByZXMgPSBfYVswXSwgbXNnID0gX2FbMV07XG4gICAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIudG8odGhpcy5yb29tSUQpLmVtaXQoXCJVUERBVEVfQk9BUkRcIiwgaGVscGVyXzEuZ2V0TnVtc0Zyb21Cb2FyZCh0aGlzLmdhbWUuYm9hcmQpLCB0aGlzLmdhbWUuYmxhY2tfY2FwdHVyZXMsIHRoaXMuZ2FtZS53aGl0ZV9jYXB0dXJlcywgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdFUlJPUicsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJhZHVrR2FtZVJvb20ucHJvdG90eXBlLnBsYXlQYXNzID0gZnVuY3Rpb24gKHNvY2tldCkge1xuICAgICAgICB2YXIgY29sb3IgPSAoc29ja2V0LmlkID09IHRoaXMuYmxhY2tfY2xpZW50LmlkKSA/IHR5cGVzXzEuQ29sb3IuQkxBQ0sgOiAoc29ja2V0LmlkID09PSB0aGlzLndoaXRlX2NsaWVudC5pZCkgPyB0eXBlc18xLkNvbG9yLldISVRFIDogbnVsbDtcbiAgICAgICAgaWYgKGNvbG9yID09PSBudWxsKSB7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnRVJST1InLCAnWW91IGFyZSBub3QgYSBwbGF5ZXInKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBIYW5kbGUgcmVtb3ZpbmcgZ3JvdXBzXG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2FtZS5wbGF5TW92ZShudWxsLCBjb2xvciksIHJlcyA9IF9hWzBdLCBtc2cgPSBfYVsxXTtcbiAgICB9O1xuICAgIHJldHVybiBCYWR1a0dhbWVSb29tO1xufSgpKTtcbmV4cG9ydHMuQmFkdWtHYW1lUm9vbSA9IEJhZHVrR2FtZVJvb207XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEJhZHVrR2FtZVJvb207XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgQmFkdWtHYW1lUm9vbV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL0JhZHVrR2FtZVJvb21cIikpO1xudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCJ1dWlkXCIpO1xudmFyIFJvb21NYW5hZ2VyID0gZnVuY3Rpb24gKGlvKSB7XG4gICAgdmFyIHJvb21zID0gbmV3IE1hcCgpO1xuICAgIGlvLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gZXN0YWJsaXNoZWQgd2l0aDpcIiwgc29ja2V0LmlkKTtcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGdhbWVcbiAgICAgICAgLy8gLSBzaXplIG9mIGJvYXJkXG4gICAgICAgIC8vIC0gaGFuZGljYXAgZm9yIGJsYWNrXG4gICAgICAgIC8vIC0gZ2FtZSBjcmVhdG9yIGNvbG9yOiBibGFjaywgd2hpdGUsIHJhbmRvbVxuICAgICAgICBzb2NrZXQub24oJ0NSRUFURV9HQU1FJywgZnVuY3Rpb24gKHNpemUsIGhhbmRpY2FwLCBjb2xvcikge1xuICAgICAgICAgICAgdmFyIHJvb21JRCA9IHV1aWRfMS52NCgpO1xuICAgICAgICAgICAgdmFyIGdhbWVfc3RhdGUgPSBuZXcgQmFkdWtHYW1lUm9vbV8xW1wiZGVmYXVsdFwiXShpbywgcm9vbUlEKTtcbiAgICAgICAgICAgIHNvY2tldC5qb2luKHJvb21JRCk7XG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gJ2JsYWNrJykge1xuICAgICAgICAgICAgICAgIGdhbWVfc3RhdGUuYWRkQmxhY2soc29ja2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yID09ICd3aGl0ZScpIHtcbiAgICAgICAgICAgICAgICBnYW1lX3N0YXRlLmFkZFdoaXRlKHNvY2tldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnYW1lX3N0YXRlLmFkZFJhbmRvbShzb2NrZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm9vbXMuc2V0KHJvb21JRCwgZ2FtZV9zdGF0ZSk7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnUk9PTV9JRCcsIHJvb21JRCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oJ0pPSU5fR0FNRScsIGZ1bmN0aW9uIChyb29tSUQpIHtcbiAgICAgICAgICAgIHZhciBnYW1lX3N0YXRlID0gcm9vbXMuZ2V0KHJvb21JRCk7XG4gICAgICAgICAgICBzb2NrZXQuam9pbihyb29tSUQpO1xuICAgICAgICAgICAgZ2FtZV9zdGF0ZS5hZGRPdGhlcihzb2NrZXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdQTEFZX01PVkUnLCBmdW5jdGlvbiAoeCwgeSwgcGFzcywgcm9vbUlEKSB7XG4gICAgICAgICAgICB2YXIgZ2FtZV9zdGF0ZSA9IHJvb21zLmdldChyb29tSUQpO1xuICAgICAgICAgICAgaWYgKHBhc3MpIHtcbiAgICAgICAgICAgICAgICBnYW1lX3N0YXRlLnBsYXlQYXNzKHNvY2tldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnYW1lX3N0YXRlLnBsYXlNb3ZlKHNvY2tldCwgcGFyc2VJbnQoeCksIHBhcnNlSW50KHkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBSb29tTWFuYWdlcjtcbi8qXG4gIHNvY2tldC5vbihcIlBMQVlfTU9WRVwiLCAoeDogc3RyaW5nLCB5OiBzdHJpbmcsIHBhc3M6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoIWdhbWUuaGFzX3N0YXJ0ZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBub3Qgc3RhcnRlZFwiKTtcbiAgICAgIHNvY2tldC5lbWl0KFwiRVJST1JcIiwgXCJHYW1lIG5vdCBzdGFydGVkXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiTW92ZVwiLCB4LCB5LCBcImVudGVyZWRcIik7XG4gICAgICBpZiAocGFzcylcbiAgICAgICAgZ2FtZS5wYXNzKHNvY2tldCk7XG4gICAgICBlbHNlIHtcbiAgICAgICAgZ2FtZS5wbGF5TW92ZShzb2NrZXQsIHBhcnNlSW50KHgpLCBwYXJzZUludCh5KSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBzb2NrZXQub24oXCJTVEFSVF9HQU1FXCIsICgpID0+IHtcbiAgICBpZiAoY2xpZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk5vdCBlbm91Z2ggcGxheWVyc1wiKTtcbiAgICAgIHNvY2tldC5lbWl0KFwiRVJST1JcIiwgXCJOb3QgZW5vdWdoIHBsYXllcnNcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJTdGFyaW5nIGdhbWVcIik7XG4gICAgICBnYW1lLmFkZEJsYWNrKGNsaWVudHNbMF0pO1xuICAgICAgZ2FtZS5hZGRXaGl0ZShjbGllbnRzWzFdKTtcbiAgICAgIGdhbWUuc3RhcnRHYW1lKCk7XG4gICAgfVxuICB9KVxuXG4gIHNvY2tldC5vbihcImRpc2Nvbm5lY3RcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiBsb3N0IHdpdGg6XCIsIHNvY2tldC5pZCk7XG4gICAgbGV0IGkgPSBjbGllbnRzLmluZGV4T2Yoc29ja2V0KTtcbiAgICBpZiAoaSA+IC0xKSB7XG4gICAgICBjbGllbnRzLnNwbGljZShpLCAxKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coY2xpZW50cy5sZW5ndGgpXG4gIH0pXG4gICovXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcbnZhciBodHRwXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImh0dHBcIikpO1xudmFyIHNvY2tldF9pb18xID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTtcbnZhciBjb3JzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImNvcnNcIikpO1xudmFyIFJvb21NYW5hZ2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUm9vbXMvUm9vbU1hbmFnZXJcIikpO1xuLy8gQ29uZmlndXJlIERhdGFiYXNlXG4vLyBDb25maWd1cmUgQVBJXG4vLyAgLSBHRVQgbmV3R2FtZSBcbi8vICAgIGluOiBzaXplLCBoYW5kaWNhcCwgY29sb3IsIFxuLy8gICBvdXQ6IHNvY2tldCBnYW1lIHJvb20gaWRcbi8vIGludGVybmFsbHkgYSBuZXcgcm9vbSB3aWxsIGJlIGNyZWF0ZWQgdGhhdCBoYXMgYXMgZ2FtZSBtYW5hZ2VyXG4vLyB0aGUgcm9vbSB3aWxsIGtlZXAgdHJhY2sgb2YgdGhlIHN0YXRlIG9mIHRoZSBnYW1lIGFuZCB3aGVuIGl0IGlzIGRvbmVcbi8vIHNhdmUgdGhlIGdhbWUgdG8gdGhlIGRhdGFiYXNlXG4vLyAgLSBHRVQgZ2FtZVxuLy8gICAgaW46IHVybCAvIGlkXG4vLyAgIG91dDogcmVkaXJjdCB0byBzb2NrZXQgcm9vbT9cbnZhciBhcHAgPSBleHByZXNzXzFbXCJkZWZhdWx0XCJdKCk7XG52YXIgcm91dGVyID0gZXhwcmVzc18xW1wiZGVmYXVsdFwiXS5Sb3V0ZXIoKTtcbnZhciBzZXJ2ZXIgPSBuZXcgaHR0cF8xW1wiZGVmYXVsdFwiXS5TZXJ2ZXIoYXBwKTtcbnZhciBpbyA9IG5ldyBzb2NrZXRfaW9fMS5TZXJ2ZXIoc2VydmVyLCB7XG4gICAgY29yczoge1xuICAgICAgICBvcmlnaW46ICcqJyxcbiAgICAgICAgbWV0aG9kczogWydHRVQnLCAnUE9TVCddXG4gICAgfVxufSk7XG52YXIgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMjU2NztcbmFwcC51c2UoY29yc18xW1wiZGVmYXVsdFwiXSgpKTtcbnNlcnZlci5saXN0ZW4ocG9ydCwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKFwic2VydmVyIGxpc3RlbmluZyBvbiBwb3J0XCIsIHBvcnQpO1xufSk7XG4vKipcbiAqICBTb2NrZXQuSU8gUm9vbSArIEdhbWUgTWFuYWdlbWVudFxuICogICAgLSBSb29tTWFuYWdlciBzdG9yZXMgaW5zdGFuY2VzIG9mIEdhbWVSb29tXG4gKiAgICAtIEdhbWVSb29tIHRha2VzIGluIHBsYXllcnMgYW5kIG1hbmFnZXMgZ2FtZSBzdGF0ZXNcbiAqL1xuLy8gU09ja2V0IElPIFJvb20gTWFuYWdlclxuUm9vbU1hbmFnZXJfMVtcImRlZmF1bHRcIl0oaW8pO1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb25zb2xlLmxvZygnTW9kdWxlIGRpc3Bvc2VkLiAnKTsgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkNvb3JkID0gZXhwb3J0cy5Db2xvciA9IHZvaWQgMDtcbnZhciBDb2xvcjtcbihmdW5jdGlvbiAoQ29sb3IpIHtcbiAgICBDb2xvcltDb2xvcltcIkJMQUNLXCJdID0gMF0gPSBcIkJMQUNLXCI7XG4gICAgQ29sb3JbQ29sb3JbXCJXSElURVwiXSA9IDFdID0gXCJXSElURVwiO1xufSkoQ29sb3IgPSBleHBvcnRzLkNvbG9yIHx8IChleHBvcnRzLkNvbG9yID0ge30pKTtcbjtcbnZhciBDb29yZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb29yZCh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIHJldHVybiBDb29yZDtcbn0oKSk7XG5leHBvcnRzLkNvb3JkID0gQ29vcmQ7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHQnW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIG9wdGltaXphdGlvbi5tb2R1bGVJZHM6IFwibmFtZWRcIiBmb3IgbW9kdWxlIG5hbWVzLidcblx0XHRcdCk7XG5cdH1cbn07XG4iLCJ2YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdHZhciBtZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cdHZhciBzdGFjayA9IGVyci5zdGFjaztcblx0aWYgKCFzdGFjaykge1xuXHRcdHJldHVybiBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPCAwKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2UgKyBcIlxcblwiICsgc3RhY2s7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0YWNrO1xuXHR9XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoY2FjaGVkTW9kdWxlLmVycm9yICE9PSB1bmRlZmluZWQpIHRocm93IGNhY2hlZE1vZHVsZS5lcnJvcjtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0dHJ5IHtcblx0XHR2YXIgZXhlY09wdGlvbnMgPSB7IGlkOiBtb2R1bGVJZCwgbW9kdWxlOiBtb2R1bGUsIGZhY3Rvcnk6IF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLCByZXF1aXJlOiBfX3dlYnBhY2tfcmVxdWlyZV9fIH07XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikgeyBoYW5kbGVyKGV4ZWNPcHRpb25zKTsgfSk7XG5cdFx0bW9kdWxlID0gZXhlY09wdGlvbnMubW9kdWxlO1xuXHRcdGV4ZWNPcHRpb25zLmZhY3RvcnkuY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgZXhlY09wdGlvbnMucmVxdWlyZSk7XG5cdH0gY2F0Y2goZSkge1xuXHRcdG1vZHVsZS5lcnJvciA9IGU7XG5cdFx0dGhyb3cgZTtcblx0fVxuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGV4ZWN1dGlvbiBpbnRlcmNlcHRvclxuX193ZWJwYWNrX3JlcXVpcmVfXy5pID0gW107XG5cbiIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFsbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uaHUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmgoKSArIFwiLmhvdC11cGRhdGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5obXJGID0gKCkgPT4gKFwibWFpbi5cIiArIF9fd2VicGFja19yZXF1aXJlX18uaCgpICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjFmZjhlODcwNDFmNmJlODhkZWRjXCIpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsInZhciBjdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xudmFyIGluc3RhbGxlZE1vZHVsZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmM7XG5cbi8vIG1vZHVsZSBhbmQgcmVxdWlyZSBjcmVhdGlvblxudmFyIGN1cnJlbnRDaGlsZE1vZHVsZTtcbnZhciBjdXJyZW50UGFyZW50cyA9IFtdO1xuXG4vLyBzdGF0dXNcbnZhciByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMgPSBbXTtcbnZhciBjdXJyZW50U3RhdHVzID0gXCJpZGxlXCI7XG5cbi8vIHdoaWxlIGRvd25sb2FkaW5nXG52YXIgYmxvY2tpbmdQcm9taXNlcztcblxuLy8gVGhlIHVwZGF0ZSBpbmZvXG52YXIgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnM7XG52YXIgcXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbl9fd2VicGFja19yZXF1aXJlX18uaG1yRCA9IGN1cnJlbnRNb2R1bGVEYXRhO1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmkucHVzaChmdW5jdGlvbiAob3B0aW9ucykge1xuXHR2YXIgbW9kdWxlID0gb3B0aW9ucy5tb2R1bGU7XG5cdHZhciByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShvcHRpb25zLnJlcXVpcmUsIG9wdGlvbnMuaWQpO1xuXHRtb2R1bGUuaG90ID0gY3JlYXRlTW9kdWxlSG90T2JqZWN0KG9wdGlvbnMuaWQsIG1vZHVsZSk7XG5cdG1vZHVsZS5wYXJlbnRzID0gY3VycmVudFBhcmVudHM7XG5cdG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRjdXJyZW50UGFyZW50cyA9IFtdO1xuXHRvcHRpb25zLnJlcXVpcmUgPSByZXF1aXJlO1xufSk7XG5cbl9fd2VicGFja19yZXF1aXJlX18uaG1yQyA9IHt9O1xuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJID0ge307XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlcXVpcmUocmVxdWlyZSwgbW9kdWxlSWQpIHtcblx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cdGlmICghbWUpIHJldHVybiByZXF1aXJlO1xuXHR2YXIgZm4gPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuXHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG5cdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuXHRcdFx0XHR2YXIgcGFyZW50cyA9IGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cztcblx0XHRcdFx0aWYgKHBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG5cdFx0XHRcdFx0cGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuXHRcdFx0XHRjdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSB7XG5cdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuXHRcdFx0XHRcdHJlcXVlc3QgK1xuXHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG5cdFx0XHRcdFx0bW9kdWxlSWRcblx0XHRcdCk7XG5cdFx0XHRjdXJyZW50UGFyZW50cyA9IFtdO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVxdWlyZShyZXF1ZXN0KTtcblx0fTtcblx0dmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHJlcXVpcmVbbmFtZV07XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0cmVxdWlyZVtuYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG5cdGZvciAodmFyIG5hbWUgaW4gcmVxdWlyZSkge1xuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVxdWlyZSwgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKG5hbWUpKTtcblx0XHR9XG5cdH1cblx0Zm4uZSA9IGZ1bmN0aW9uIChjaHVua0lkKSB7XG5cdFx0cmV0dXJuIHRyYWNrQmxvY2tpbmdQcm9taXNlKHJlcXVpcmUuZShjaHVua0lkKSk7XG5cdH07XG5cdHJldHVybiBmbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9kdWxlSG90T2JqZWN0KG1vZHVsZUlkLCBtZSkge1xuXHR2YXIgX21haW4gPSBjdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkO1xuXHR2YXIgaG90ID0ge1xuXHRcdC8vIHByaXZhdGUgc3R1ZmZcblx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuXHRcdF9hY2NlcHRlZEVycm9ySGFuZGxlcnM6IHt9LFxuXHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG5cdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG5cdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG5cdFx0X3NlbGZJbnZhbGlkYXRlZDogZmFsc2UsXG5cdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG5cdFx0X21haW46IF9tYWluLFxuXHRcdF9yZXF1aXJlU2VsZjogZnVuY3Rpb24gKCkge1xuXHRcdFx0Y3VycmVudFBhcmVudHMgPSBtZS5wYXJlbnRzLnNsaWNlKCk7XG5cdFx0XHRjdXJyZW50Q2hpbGRNb2R1bGUgPSBfbWFpbiA/IHVuZGVmaW5lZCA6IG1vZHVsZUlkO1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG5cdFx0fSxcblxuXHRcdC8vIE1vZHVsZSBBUElcblx0XHRhY3RpdmU6IHRydWUsXG5cdFx0YWNjZXB0OiBmdW5jdGlvbiAoZGVwLCBjYWxsYmFjaywgZXJyb3JIYW5kbGVyKSB7XG5cdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiICYmIGRlcCAhPT0gbnVsbCkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcFtpXV0gPSBlcnJvckhhbmRsZXI7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0XHRob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBdID0gZXJyb3JIYW5kbGVyO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGVjbGluZTogZnVuY3Rpb24gKGRlcCkge1xuXHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiICYmIGRlcCAhPT0gbnVsbClcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG5cdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcblx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcblx0XHR9LFxuXHRcdGRpc3Bvc2U6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG5cdFx0fSxcblx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcblx0XHR9LFxuXHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcblx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0fSxcblx0XHRpbnZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9zZWxmSW52YWxpZGF0ZWQgPSB0cnVlO1xuXHRcdFx0c3dpdGNoIChjdXJyZW50U3RhdHVzKSB7XG5cdFx0XHRcdGNhc2UgXCJpZGxlXCI6XG5cdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0oXG5cdFx0XHRcdFx0XHRcdG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVyc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRzZXRTdGF0dXMoXCJyZWFkeVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInJlYWR5XCI6XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdFx0XHRtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJwcmVwYXJlXCI6XG5cdFx0XHRcdGNhc2UgXCJjaGVja1wiOlxuXHRcdFx0XHRjYXNlIFwiZGlzcG9zZVwiOlxuXHRcdFx0XHRjYXNlIFwiYXBwbHlcIjpcblx0XHRcdFx0XHQocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzID0gcXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzIHx8IFtdKS5wdXNoKFxuXHRcdFx0XHRcdFx0bW9kdWxlSWRcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vIGlnbm9yZSByZXF1ZXN0cyBpbiBlcnJvciBzdGF0ZXNcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gTWFuYWdlbWVudCBBUElcblx0XHRjaGVjazogaG90Q2hlY2ssXG5cdFx0YXBwbHk6IGhvdEFwcGx5LFxuXHRcdHN0YXR1czogZnVuY3Rpb24gKGwpIHtcblx0XHRcdGlmICghbCkgcmV0dXJuIGN1cnJlbnRTdGF0dXM7XG5cdFx0XHRyZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMucHVzaChsKTtcblx0XHR9LFxuXHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uIChsKSB7XG5cdFx0XHRyZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMucHVzaChsKTtcblx0XHR9LFxuXHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uIChsKSB7XG5cdFx0XHR2YXIgaWR4ID0gcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG5cdFx0XHRpZiAoaWR4ID49IDApIHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcblx0XHR9LFxuXG5cdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG5cdFx0ZGF0YTogY3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG5cdH07XG5cdGN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcblx0cmV0dXJuIGhvdDtcbn1cblxuZnVuY3Rpb24gc2V0U3RhdHVzKG5ld1N0YXR1cykge1xuXHRjdXJyZW50U3RhdHVzID0gbmV3U3RhdHVzO1xuXHR2YXIgcmVzdWx0cyA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuXHRcdHJlc3VsdHNbaV0gPSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChyZXN1bHRzKTtcbn1cblxuZnVuY3Rpb24gdHJhY2tCbG9ja2luZ1Byb21pc2UocHJvbWlzZSkge1xuXHRzd2l0Y2ggKGN1cnJlbnRTdGF0dXMpIHtcblx0XHRjYXNlIFwicmVhZHlcIjpcblx0XHRcdHNldFN0YXR1cyhcInByZXBhcmVcIik7XG5cdFx0XHRibG9ja2luZ1Byb21pc2VzLnB1c2gocHJvbWlzZSk7XG5cdFx0XHR3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJyZWFkeVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0Y2FzZSBcInByZXBhcmVcIjpcblx0XHRcdGJsb2NraW5nUHJvbWlzZXMucHVzaChwcm9taXNlKTtcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fVxufVxuXG5mdW5jdGlvbiB3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmbikge1xuXHRpZiAoYmxvY2tpbmdQcm9taXNlcy5sZW5ndGggPT09IDApIHJldHVybiBmbigpO1xuXHR2YXIgYmxvY2tlciA9IGJsb2NraW5nUHJvbWlzZXM7XG5cdGJsb2NraW5nUHJvbWlzZXMgPSBbXTtcblx0cmV0dXJuIFByb21pc2UuYWxsKGJsb2NrZXIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmbik7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBob3RDaGVjayhhcHBseU9uVXBkYXRlKSB7XG5cdGlmIChjdXJyZW50U3RhdHVzICE9PSBcImlkbGVcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuXHR9XG5cdHJldHVybiBzZXRTdGF0dXMoXCJjaGVja1wiKVxuXHRcdC50aGVuKF9fd2VicGFja19yZXF1aXJlX18uaG1yTSlcblx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlKSB7XG5cdFx0XHRpZiAoIXVwZGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gc2V0U3RhdHVzKGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkgPyBcInJlYWR5XCIgOiBcImlkbGVcIikudGhlbihcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJwcmVwYXJlXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdXBkYXRlZE1vZHVsZXMgPSBbXTtcblx0XHRcdFx0YmxvY2tpbmdQcm9taXNlcyA9IFtdO1xuXHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IFtdO1xuXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMpLnJlZHVjZShmdW5jdGlvbiAoXG5cdFx0XHRcdFx0XHRwcm9taXNlcyxcblx0XHRcdFx0XHRcdGtleVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJDW2tleV0oXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZS5jLFxuXHRcdFx0XHRcdFx0XHR1cGRhdGUucixcblx0XHRcdFx0XHRcdFx0dXBkYXRlLm0sXG5cdFx0XHRcdFx0XHRcdHByb21pc2VzLFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyxcblx0XHRcdFx0XHRcdFx0dXBkYXRlZE1vZHVsZXNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHJvbWlzZXM7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRbXSlcblx0XHRcdFx0KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aWYgKGFwcGx5T25VcGRhdGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGludGVybmFsQXBwbHkoYXBwbHlPblVwZGF0ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2V0U3RhdHVzKFwicmVhZHlcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHVwZGF0ZWRNb2R1bGVzO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcbn1cblxuZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuXHRpZiAoY3VycmVudFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0YXBwbHlJbnZhbGlkYXRlZE1vZHVsZXMoKTtcblxuXHR2YXIgcmVzdWx0cyA9IGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLm1hcChmdW5jdGlvbiAoaGFuZGxlcikge1xuXHRcdHJldHVybiBoYW5kbGVyKG9wdGlvbnMpO1xuXHR9KTtcblx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSB1bmRlZmluZWQ7XG5cblx0dmFyIGVycm9ycyA9IHJlc3VsdHNcblx0XHQubWFwKGZ1bmN0aW9uIChyKSB7XG5cdFx0XHRyZXR1cm4gci5lcnJvcjtcblx0XHR9KVxuXHRcdC5maWx0ZXIoQm9vbGVhbik7XG5cblx0aWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuIHNldFN0YXR1cyhcImFib3J0XCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhyb3cgZXJyb3JzWzBdO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG5cdHZhciBkaXNwb3NlUHJvbWlzZSA9IHNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG5cblx0cmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRpZiAocmVzdWx0LmRpc3Bvc2UpIHJlc3VsdC5kaXNwb3NlKCk7XG5cdH0pO1xuXG5cdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2Vcblx0dmFyIGFwcGx5UHJvbWlzZSA9IHNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG5cdHZhciBlcnJvcjtcblx0dmFyIHJlcG9ydEVycm9yID0gZnVuY3Rpb24gKGVycikge1xuXHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuXHR9O1xuXG5cdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcblx0cmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRpZiAocmVzdWx0LmFwcGx5KSB7XG5cdFx0XHR2YXIgbW9kdWxlcyA9IHJlc3VsdC5hcHBseShyZXBvcnRFcnJvcik7XG5cdFx0XHRpZiAobW9kdWxlcykge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChtb2R1bGVzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKFtkaXNwb3NlUHJvbWlzZSwgYXBwbHlQcm9taXNlXSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJmYWlsXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMpIHtcblx0XHRcdHJldHVybiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGxpc3QpIHtcblx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRcdFx0aWYgKGxpc3QuaW5kZXhPZihtb2R1bGVJZCkgPCAwKSBsaXN0LnB1c2gobW9kdWxlSWQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2V0U3RhdHVzKFwiaWRsZVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBvdXRkYXRlZE1vZHVsZXM7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhcHBseUludmFsaWRhdGVkTW9kdWxlcygpIHtcblx0aWYgKHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcykge1xuXHRcdGlmICghY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMpIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRtb2R1bGVJZCxcblx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVyc1xuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzID0gdW5kZWZpbmVkO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJsb2FkZWRcIiwgb3RoZXJ3aXNlIG5vdCBsb2FkZWQgeWV0XG52YXIgaW5zdGFsbGVkQ2h1bmtzID0gX193ZWJwYWNrX3JlcXVpcmVfXy5obXJTX3JlcXVpcmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtclNfcmVxdWlyZSB8fCB7XG5cdFwibWFpblwiOiAxXG59O1xuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGNodW5rIGluc3RhbGwgZnVuY3Rpb24gbmVlZGVkXG5cbi8vIG5vIGNodW5rIGxvYWRpbmdcblxuLy8gbm8gZXh0ZXJuYWwgaW5zdGFsbCBjaHVua1xuXG5mdW5jdGlvbiBsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSB7XG5cdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIF9fd2VicGFja19yZXF1aXJlX18uaHUoY2h1bmtJZCkpO1xuXHR2YXIgdXBkYXRlZE1vZHVsZXMgPSB1cGRhdGUubW9kdWxlcztcblx0dmFyIHJ1bnRpbWUgPSB1cGRhdGUucnVudGltZTtcblx0Zm9yKHZhciBtb2R1bGVJZCBpbiB1cGRhdGVkTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyh1cGRhdGVkTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRjdXJyZW50VXBkYXRlW21vZHVsZUlkXSA9IHVwZGF0ZWRNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdGlmKHVwZGF0ZWRNb2R1bGVzTGlzdCkgdXBkYXRlZE1vZHVsZXNMaXN0LnB1c2gobW9kdWxlSWQpO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBjdXJyZW50VXBkYXRlUnVudGltZS5wdXNoKHJ1bnRpbWUpO1xufVxuXG52YXIgY3VycmVudFVwZGF0ZUNodW5rcztcbnZhciBjdXJyZW50VXBkYXRlO1xudmFyIGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzO1xudmFyIGN1cnJlbnRVcGRhdGVSdW50aW1lO1xuZnVuY3Rpb24gYXBwbHlIYW5kbGVyKG9wdGlvbnMpIHtcblx0aWYgKF9fd2VicGFja19yZXF1aXJlX18uZikgZGVsZXRlIF9fd2VicGFja19yZXF1aXJlX18uZi5yZXF1aXJlSG1yO1xuXHRjdXJyZW50VXBkYXRlQ2h1bmtzID0gdW5kZWZpbmVkO1xuXHRmdW5jdGlvbiBnZXRBZmZlY3RlZE1vZHVsZUVmZmVjdHModXBkYXRlTW9kdWxlSWQpIHtcblx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcblx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjaGFpbjogW2lkXSxcblx0XHRcdFx0aWQ6IGlkXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG5cdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG5cdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG5cdFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblx0XHRcdGlmIChcblx0XHRcdFx0IW1vZHVsZSB8fFxuXHRcdFx0XHQobW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkICYmICFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWQpXG5cdFx0XHQpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuXHRcdFx0XHRcdGNoYWluOiBjaGFpbixcblx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG5cdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuXHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcblx0XHRcdFx0dmFyIHBhcmVudCA9IF9fd2VicGFja19yZXF1aXJlX18uY1twYXJlbnRJZF07XG5cdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG5cdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG5cdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcblx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcblx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcblx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuXHRcdFx0XHRxdWV1ZS5wdXNoKHtcblx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuXHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuXHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuXHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG5cdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuXHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcblx0XHR9XG5cdH1cblxuXHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuXHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG5cdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG5cdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cblx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZShtb2R1bGUpIHtcblx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIG1vZHVsZS5pZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuXHRcdCk7XG5cdH07XG5cblx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gY3VycmVudFVwZGF0ZSkge1xuXHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG5cdFx0XHR2YXIgbmV3TW9kdWxlRmFjdG9yeSA9IGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdO1xuXHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmIChuZXdNb2R1bGVGYWN0b3J5KSB7XG5cdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyhtb2R1bGVJZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB7XG5cdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuXHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cblx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG5cdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuXHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuXHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG5cdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG5cdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG5cdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuXHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuXHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG5cdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG5cdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcblx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuXHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcblx0XHRcdH1cblx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0ZXJyb3I6IGFib3J0RXJyb3Jcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChkb0FwcGx5KSB7XG5cdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gbmV3TW9kdWxlRmFjdG9yeTtcblx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG5cdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuXHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuXHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcblx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGN1cnJlbnRVcGRhdGUgPSB1bmRlZmluZWQ7XG5cblx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuXHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG5cdGZvciAodmFyIGogPSAwOyBqIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaisrKSB7XG5cdFx0dmFyIG91dGRhdGVkTW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbal07XG5cdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRpZiAoXG5cdFx0XHRtb2R1bGUgJiZcblx0XHRcdChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgfHwgbW9kdWxlLmhvdC5fbWFpbikgJiZcblx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcblx0XHRcdGFwcGxpZWRVcGRhdGVbb3V0ZGF0ZWRNb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZSAmJlxuXHRcdFx0Ly8gd2hlbiBjYWxsZWQgaW52YWxpZGF0ZSBzZWxmLWFjY2VwdGluZyBpcyBub3QgcG9zc2libGVcblx0XHRcdCFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWRcblx0XHQpIHtcblx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcblx0XHRcdFx0bW9kdWxlOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRyZXF1aXJlOiBtb2R1bGUuaG90Ll9yZXF1aXJlU2VsZixcblx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWRcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcblxuXHRyZXR1cm4ge1xuXHRcdGRpc3Bvc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzLmZvckVhY2goZnVuY3Rpb24gKGNodW5rSWQpIHtcblx0XHRcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcblx0XHRcdH0pO1xuXHRcdFx0Y3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MgPSB1bmRlZmluZWQ7XG5cblx0XHRcdHZhciBpZHg7XG5cdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcblx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuXHRcdFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblx0XHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge307XG5cblx0XHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG5cdFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG5cdFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRkaXNwb3NlSGFuZGxlcnNbal0uY2FsbChudWxsLCBkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckRbbW9kdWxlSWRdID0gZGF0YTtcblxuXHRcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuXHRcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuXHRcdFx0XHRkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblxuXHRcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG5cdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cblx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuXHRcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG5cdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG5cdFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuXHRcdFx0dmFyIGRlcGVuZGVuY3k7XG5cdFx0XHRmb3IgKHZhciBvdXRkYXRlZE1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG91dGRhdGVkTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0bW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdGlmIChtb2R1bGUpIHtcblx0XHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID1cblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuXHRcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcblx0XHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhcHBseTogZnVuY3Rpb24gKHJlcG9ydEVycm9yKSB7XG5cdFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcblx0XHRcdGZvciAodmFyIHVwZGF0ZU1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcblx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhhcHBsaWVkVXBkYXRlLCB1cGRhdGVNb2R1bGVJZCkpIHtcblx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bdXBkYXRlTW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVt1cGRhdGVNb2R1bGVJZF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcnVuIG5ldyBydW50aW1lIG1vZHVsZXNcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudFVwZGF0ZVJ1bnRpbWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZVJ1bnRpbWVbaV0oX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG5cdFx0XHRmb3IgKHZhciBvdXRkYXRlZE1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG91dGRhdGVkTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRpZiAobW9kdWxlKSB7XG5cdFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9XG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIGVycm9ySGFuZGxlcnMgPSBbXTtcblx0XHRcdFx0XHRcdHZhciBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MgPSBbXTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcblx0XHRcdFx0XHRcdFx0dmFyIGFjY2VwdENhbGxiYWNrID1cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9ySGFuZGxlciA9XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcGVuZGVuY3ldO1xuXHRcdFx0XHRcdFx0XHRpZiAoYWNjZXB0Q2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoYWNjZXB0Q2FsbGJhY2spICE9PSAtMSkgY29udGludWU7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goYWNjZXB0Q2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9ySGFuZGxlcnMucHVzaChlcnJvckhhbmRsZXIpO1xuXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrcy5wdXNoKGRlcGVuZGVuY3kpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGNhbGxiYWNrcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrc1trXS5jYWxsKG51bGwsIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBlcnJvckhhbmRsZXJzW2tdID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ySGFuZGxlcnNba10oZXJyLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba11cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIyKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuXHRcdFx0Zm9yICh2YXIgbyA9IDA7IG8gPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBvKyspIHtcblx0XHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbb107XG5cdFx0XHRcdHZhciBtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGl0ZW0ucmVxdWlyZShtb2R1bGVJZCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyLCB7XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZTogX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIyKTtcblx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb3V0ZGF0ZWRNb2R1bGVzO1xuXHRcdH1cblx0fTtcbn1cbl9fd2VicGFja19yZXF1aXJlX18uaG1ySS5yZXF1aXJlID0gZnVuY3Rpb24gKG1vZHVsZUlkLCBhcHBseUhhbmRsZXJzKSB7XG5cdGlmICghY3VycmVudFVwZGF0ZSkge1xuXHRcdGN1cnJlbnRVcGRhdGUgPSB7fTtcblx0XHRjdXJyZW50VXBkYXRlUnVudGltZSA9IFtdO1xuXHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gW107XG5cdFx0YXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG5cdH1cblx0aWYgKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG5cdFx0Y3VycmVudFVwZGF0ZVttb2R1bGVJZF0gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdO1xuXHR9XG59O1xuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDLnJlcXVpcmUgPSBmdW5jdGlvbiAoXG5cdGNodW5rSWRzLFxuXHRyZW1vdmVkQ2h1bmtzLFxuXHRyZW1vdmVkTW9kdWxlcyxcblx0cHJvbWlzZXMsXG5cdGFwcGx5SGFuZGxlcnMsXG5cdHVwZGF0ZWRNb2R1bGVzTGlzdFxuKSB7XG5cdGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuXHRjdXJyZW50VXBkYXRlQ2h1bmtzID0ge307XG5cdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gcmVtb3ZlZENodW5rcztcblx0Y3VycmVudFVwZGF0ZSA9IHJlbW92ZWRNb2R1bGVzLnJlZHVjZShmdW5jdGlvbiAob2JqLCBrZXkpIHtcblx0XHRvYmpba2V5XSA9IGZhbHNlO1xuXHRcdHJldHVybiBvYmo7XG5cdH0sIHt9KTtcblx0Y3VycmVudFVwZGF0ZVJ1bnRpbWUgPSBbXTtcblx0Y2h1bmtJZHMuZm9yRWFjaChmdW5jdGlvbiAoY2h1bmtJZCkge1xuXHRcdGlmIChcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmXG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZFxuXHRcdCkge1xuXHRcdFx0cHJvbWlzZXMucHVzaChsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSk7XG5cdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdID0gdHJ1ZTtcblx0XHR9XG5cdH0pO1xuXHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5mKSB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmVIbXIgPSBmdW5jdGlvbiAoY2h1bmtJZCwgcHJvbWlzZXMpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rcyAmJlxuXHRcdFx0XHQhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGN1cnJlbnRVcGRhdGVDaHVua3MsIGNodW5rSWQpICYmXG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmXG5cdFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkXG5cdFx0XHQpIHtcblx0XHRcdFx0cHJvbWlzZXMucHVzaChsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkpO1xuXHRcdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59O1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtck0gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5obXJGKCkpO1xuXHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHsgaWYoZXJyLmNvZGUgIT09IFwiTU9EVUxFX05PVF9GT1VORFwiKSB0aHJvdyBlcnI7IH0pO1xufSIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcz8xMDAwXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==