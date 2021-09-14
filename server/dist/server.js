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

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var http_1 = __importDefault(__webpack_require__(/*! http */ "http"));
var socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
var BadukGame_1 = __webpack_require__(/*! ./BoardLogic/BadukGame */ "./src/BoardLogic/BadukGame.ts");
var cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
var app = express_1["default"]();
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
/******/ 		__webpack_require__.h = () => ("4d035c0babb5620657c3")
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsbUJBQW1CLDJCQUEyQjtXQUM5QztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQSxrQkFBa0IsY0FBYztXQUNoQztXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0EsY0FBYyxNQUFNO1dBQ3BCO1dBQ0E7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsY0FBYyxhQUFhO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsaUJBQWlCLDRCQUE0QjtXQUM3QztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBO1dBQ0E7V0FDQSxnQkFBZ0IsNEJBQTRCO1dBQzVDO1dBQ0E7V0FDQTs7V0FFQTtXQUNBOztXQUVBO1dBQ0E7O1dBRUE7V0FDQTs7V0FFQTtXQUNBLGdCQUFnQiw0QkFBNEI7V0FDNUM7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esa0JBQWtCLHVDQUF1QztXQUN6RDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBLG1CQUFtQixpQ0FBaUM7V0FDcEQ7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHNCQUFzQix1Q0FBdUM7V0FDN0Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esc0JBQXNCLHNCQUFzQjtXQUM1QztXQUNBO1dBQ0EsU0FBUztXQUNUO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxXQUFXO1dBQ1gsV0FBVztXQUNYO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsWUFBWTtXQUNaO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLFVBQVU7V0FDVjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxXQUFXO1dBQ1g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQSxtQkFBbUIsd0NBQXdDO1dBQzNEO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxRQUFRO1dBQ1IsUUFBUTtXQUNSO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLFNBQVM7V0FDVDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxPQUFPO1dBQ1A7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLFFBQVE7V0FDUjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRSxJQUFJO1dBQ047V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0EsRUFBRSx3QkFBd0IsZ0RBQWdEO1dBQzFFOzs7OztVRTVkQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvQm9hcmRMb2dpYy9CYWR1a0dhbWUudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvQm9hcmRMb2dpYy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL3NyYy9zaGFyZWQvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcInNvY2tldC5pb1wiIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IHVwZGF0ZSBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0IHVwZGF0ZSBtYW5pZmVzdCBmaWxlbmFtZSIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvaG90IG1vZHVsZSByZXBsYWNlbWVudCIsIndlYnBhY2s6Ly9iYWR1ay1tZWdhLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvcmVxdWlyZSBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmFkdWstbWVnYS1zZXJ2ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JhZHVrLW1lZ2Etc2VydmVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkJhZHVrR2FtZU1hbmFnZXIgPSBleHBvcnRzLkJhZHVrR2FtZSA9IGV4cG9ydHMuY2FsY3VsYXRlVGVycml0b3J5ID0gZXhwb3J0cy5maW5kU3BhY2VTaXplID0gZXhwb3J0cy5raWxsR3JvdXAgPSBleHBvcnRzLmtpbGxTdXJyb3VuZGluZ0dyb3VwcyA9IGV4cG9ydHMuaGFzTGliZXJ0aWVzID0gZXhwb3J0cy5zZXR1cEJvYXJkID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3R5cGVzXCIpO1xudmFyIGhlbHBlcl8xID0gcmVxdWlyZShcIi4vaGVscGVyXCIpO1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBHQU1FIExPR0lDIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKipcbiAqIHNldHVwIEJvYXJkIHdpdGggcHJvcGVyIHNpemUgYW5kIGhhbmRpY2FwXG4gKiBAcGFyYW0gc2l6ZVxuICogQHBhcmFtIGhhbmRpY2FwXG4gKiBAcmV0dXJucyBCb2FyZCBvYmplY3QgYW5kIGNvbG9yIG9mIHBsYXllciB0byBtb3ZlXG4gKi9cbmZ1bmN0aW9uIHNldHVwQm9hcmQoc2l6ZSwgaGFuZGljYXApIHtcbiAgICB2YXIgYm9hcmQgPSBuZXcgQXJyYXkoc2l6ZSkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KHNpemUpLmZpbGwobnVsbCk7IH0pO1xuICAgIGlmIChoYW5kaWNhcC5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gW2JvYXJkLCB0eXBlc18xLkNvbG9yLkJMQUNLXTtcbiAgICB9XG4gICAgaGFuZGljYXAuZm9yRWFjaChmdW5jdGlvbiAoY29vcmQpIHsgYm9hcmRbY29vcmQueV1bY29vcmQueF0gPSB0eXBlc18xLkNvbG9yLkJMQUNLOyB9KTtcbiAgICByZXR1cm4gW2JvYXJkLCB0eXBlc18xLkNvbG9yLldISVRFXTtcbn1cbmV4cG9ydHMuc2V0dXBCb2FyZCA9IHNldHVwQm9hcmQ7XG4vKipcbiAqIHByZTogYm9hcmQgYXQgbG9jICE9IG51bGxcbiAqXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm5zIENoZWNrcyBpZiB0aGUgZ3JvdXAgbG9jYXRlZCBhdCBsb2MgaGFzIGFueSBsaWJlcnRpZXNcbiAqL1xuZnVuY3Rpb24gaGFzTGliZXJ0aWVzKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciBjdXJyX3BsYXllciA9IGJvYXJkW2xvYy55XVtsb2MueF07XG4gICAgdmFyIHZpc2lzdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoIXZpc2lzdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgLy8gRW1wdHkgc3BhY2UgPT4gbGliZXJ0eVxuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgdGhlIHN0b25lIGlzIHRoZSBzYW1lIGNvbG9yIGdvIHRvIGl0J3MgbmVpZ2h0Ym91cnNcbiAgICAgICAgICAgIGVsc2UgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBjdXJyX3BsYXllcikge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmhhc0xpYmVydGllcyA9IGhhc0xpYmVydGllcztcbi8qKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEBwYXJhbSBtb3ZlXG4gKiBAcmV0dXJucyByZXR1cm5zIGlmIGEgbW92ZSBpcyB2YWxpZCBhbmQgaWYgaXQgaXMsIHRoZSByZXN1bHRpbmcgYm9hcmQgYW5kIHRoZSBudW1iZXIgb2Ygc3RvbmVzIGNhcHR1cmVkXG4gKi9cbmZ1bmN0aW9uIHBsYXlCb2FyZE1vdmUoYm9hcmQsIGN1cnJfcGxheWVyLCBtb3ZlKSB7XG4gICAgaWYgKGJvYXJkW21vdmUueV1bbW92ZS54XSAhPSBudWxsKVxuICAgICAgICByZXR1cm4gW2ZhbHNlLCBib2FyZCwgMCwgXCJjYW4ndCBwbGF5IG9udG9wIG9mIGEgc3RvbmVcIl07XG4gICAgcmV0dXJuIGNvbW1pdFBsYWNlQW5kS2lsbChib2FyZCwgY3Vycl9wbGF5ZXIsIG1vdmUpO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEBwYXJhbSBsb2NcbiAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIG1vdmUgb2YgcGxhY2luZyBhIHN0b25lIG9mIGN1cnJfcGxheWVyIGF0IGxvYyBpcyB2YWxpZCwgYW5kIGlmIHNvXG4gKiAgICAgICAgICB0aGUgbmV3IGJvYXJkIGFuZCB0aGUgbnVtYmVyIG9mIHN0b25lcyBraWxsZWRcbiAqL1xuZnVuY3Rpb24gY29tbWl0UGxhY2VBbmRLaWxsKGJvYXJkLCBjdXJyX3BsYXllciwgbG9jKSB7XG4gICAgYm9hcmRbbG9jLnldW2xvYy54XSA9IGN1cnJfcGxheWVyO1xuICAgIGlmIChoYXNMaWJlcnRpZXMoYm9hcmQsIGxvYykpIHtcbiAgICAgICAgdmFyIF9hID0ga2lsbFN1cnJvdW5kaW5nR3JvdXBzKGJvYXJkLCBsb2MpLCBuYm9hcmQgPSBfYVswXSwga2lsbGVkID0gX2FbMV07XG4gICAgICAgIHJldHVybiBbdHJ1ZSwgbmJvYXJkLCBraWxsZWQsIFwiT2tcIl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgX2IgPSBraWxsU3Vycm91bmRpbmdHcm91cHMoYm9hcmQsIGxvYyksIG5ib2FyZCA9IF9iWzBdLCBraWxsZWQgPSBfYlsxXTtcbiAgICAgICAgaWYgKGtpbGxlZCA9PSAwKSB7XG4gICAgICAgICAgICBib2FyZFtsb2MueV1bbG9jLnhdID0gbnVsbDsgLy8gcmVzZXQgcGxheWVyXG4gICAgICAgICAgICByZXR1cm4gW2ZhbHNlLCBib2FyZCwgMCwgXCJTdWljaWRlIGlzIGlsbGVnYWxcIl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0cnVlLCBuYm9hcmQsIGtpbGxlZCwgXCJPa1wiXTtcbiAgICB9XG59XG4vKipcbiAqIEZpbmRzIHRoZSBib2FyZCBhZnRlciBraWxsaW5nIHRoZSBzdXJyb3VuZGluZyBlbmVteSBncm91cHMgd2l0aCBubyBsaWJlcnRpZXNcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnMgbmV3IGJvYXJkIGFuZCBudW1iZXIgb2YgZW5lbXkgc3RvbmVzIGtpbGxlZFxuICovXG5mdW5jdGlvbiBraWxsU3Vycm91bmRpbmdHcm91cHMoYm9hcmQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIGN1cnJfcGxheWVyID0gYm9hcmRbbG9jLnldW2xvYy54XTtcbiAgICB2YXIgdmlzaXN0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIga2lsbGVkID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdID09IG51bGwpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBlbHNlIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55ICsgMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSAtIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54ICsgMSA8IGJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCArIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggLSAxID49IDApXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggLSAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghaGFzTGliZXJ0aWVzKGJvYXJkLCBjdXJyKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2EgPSBraWxsR3JvdXAoYm9hcmQsIGN1cnIpLCB0Ym9hcmQgPSBfYVswXSwgdGtpbGxlZCA9IF9hWzFdO1xuICAgICAgICAgICAgICAgICAgICBib2FyZCA9IHRib2FyZDtcbiAgICAgICAgICAgICAgICAgICAga2lsbGVkICs9IHRraWxsZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXN0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JvYXJkLCBraWxsZWRdO1xufVxuZXhwb3J0cy5raWxsU3Vycm91bmRpbmdHcm91cHMgPSBraWxsU3Vycm91bmRpbmdHcm91cHM7XG4vKipcbiAqIHByZTogYm9hcmQgYXQgbG9jICE9IG51bGxcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnMgcmV0dXJucyBib2FyZCBhZnRlciBraWxsaW5nIHRoZSBncm91cCBhdCBsb2MsIGFuZCB0aGUgbnVtYmVyIG9mIHN0b25lcyBraWxsZWRcbiAqL1xuZnVuY3Rpb24ga2lsbEdyb3VwKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciBjdXJyX3BsYXllciA9IGJvYXJkW2xvYy55XVtsb2MueF07XG4gICAgdmFyIHZpc2l0ZWQgPSBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwobnVsbCkubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShib2FyZC5sZW5ndGgpLmZpbGwoZmFsc2UpOyB9KTtcbiAgICB2YXIga2lsbGVkID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXRlZFtjdXJyLnldW2N1cnIueF0pIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtjdXJyLnldW2N1cnIueF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGtpbGxlZCArPSAxO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbYm9hcmQsIGtpbGxlZF07XG59XG5leHBvcnRzLmtpbGxHcm91cCA9IGtpbGxHcm91cDtcbi8vIHByZTogYm9hcmQgYXQgbG9jIGlzIGVtcHR5XG5mdW5jdGlvbiBmaW5kU3BhY2VTaXplKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB2aXNpdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgdmFyIHN6ID0gMDtcbiAgICB3aGlsZSAodG9WaXNpdC5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgY3VyciA9IHRvVmlzaXQucG9wKCk7XG4gICAgICAgIGlmICghdmlzaXRlZFtjdXJyLnldW2N1cnIueF0pIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtjdXJyLnldW2N1cnIueF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN6ICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpdGVkW2N1cnIueV1bY3Vyci54XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN6O1xufVxuZXhwb3J0cy5maW5kU3BhY2VTaXplID0gZmluZFNwYWNlU2l6ZTtcbi8qKlxuICogcHJlOiBkZWFkIGdyb3VwcyBhcmUgcmVtb3ZlZCBiZWZvcmVoYW5kXG4gKiBAcGFyYW0gYm9hcmRcbiAqIEByZXR1cm5zIHJldHVybiB0ZXJyaXRvcnkgcG9pbnRzIGZvciBbYmxhY2ssIHdoaXRlXVxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVUZXJyaXRvcnkoYm9hcmQpIHtcbiAgICB2YXIgdmlzaXRlZCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChmYWxzZSk7IH0pO1xuICAgIHZhciBibGFja190ZXJyaXRvcnkgPSAwO1xuICAgIHZhciB3aGl0ZV90ZXJyaXRvcnkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkW2ldW2pdICYmIGJvYXJkW2ldW2pdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvYyA9IG5ldyB0eXBlc18xLkNvb3JkKGosIGkpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IGhlbHBlcl8xLmZpbmRCb3JkZXJpbmdDb2xvcihib2FyZCwgbG9jKTtcbiAgICAgICAgICAgICAgICB2YXIgc3ogPSBmaW5kU3BhY2VTaXplKGJvYXJkLCBsb2MpO1xuICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykge1xuICAgICAgICAgICAgICAgICAgICBibGFja190ZXJyaXRvcnkgKz0gc3o7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yID09PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaXRlX3RlcnJpdG9yeSArPSBzejtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZWxzZSBjb2xvciA9PT0gbnVsbCA9PiBlbXB0eSBib2FyZCAvIGRpc3B1dGVkIGFyZWFzIG5vIHBvaW50c1xuICAgICAgICAgICAgICAgIC8vIG1hcmsgYXMgdmlld2VkXG4gICAgICAgICAgICAgICAgaGVscGVyXzEuc2V0VmlzaXRlZChib2FyZCwgdmlzaXRlZCwgbG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JsYWNrX3RlcnJpdG9yeSwgd2hpdGVfdGVycml0b3J5XTtcbn1cbmV4cG9ydHMuY2FsY3VsYXRlVGVycml0b3J5ID0gY2FsY3VsYXRlVGVycml0b3J5O1xuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBnYW1lIG9mIEJhZHVrXG4gKiBAcGFyYW0gc2l6ZVxuICogQHBhcmFtIGhhbmRpY2FwXG4gKiBAcGFyYW0ga29taVxuICovXG52YXIgQmFkdWtHYW1lID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEJhZHVrR2FtZShzaXplLCBoYW5kaWNhcCwga29taSkge1xuICAgICAgICB2YXIgX2EgPSBzZXR1cEJvYXJkKHNpemUsIGhhbmRpY2FwKSwgYm9hcmQgPSBfYVswXSwgY3Vycl9wbGF5ZXIgPSBfYVsxXTtcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgICAgICB0aGlzLnByZXZfYm9hcmQgPSBudWxsO1xuICAgICAgICB0aGlzLmN1cnJfcGxheWVyID0gY3Vycl9wbGF5ZXI7XG4gICAgICAgIHRoaXMuaGFzX3Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmtvbWkgPSBrb21pO1xuICAgICAgICB0aGlzLmJsYWNrX2NhcHR1cmVzID0gMDtcbiAgICAgICAgdGhpcy53aGl0ZV9jYXB0dXJlcyA9IDA7XG4gICAgICAgIHRoaXMuaXNfb3ZlciA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbW92ZVxuICAgICAqIEBwYXJhbSBjdXJyX3BsYXllclxuICAgICAqIEByZXR1cm5zIHJldHVybnMgd2hldGhlciB0aGUgbW92ZSB3YXMgdmFsaWQgKGJvb2xlYW4pIG9yIGEgd2lubmVyIChjb2xvcikgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgICAqL1xuICAgIEJhZHVrR2FtZS5wcm90b3R5cGUucGxheU1vdmUgPSBmdW5jdGlvbiAobW92ZSwgY3Vycl9wbGF5ZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoY3Vycl9wbGF5ZXIgIT0gdGhpcy5jdXJyX3BsYXllcilcbiAgICAgICAgICAgIHJldHVybiBbZmFsc2UsIFwiSWxsZWdhbCBtb3ZlLCBub3QgeW91ciB0dXJuXCJdO1xuICAgICAgICBlbHNlIGlmIChtb3ZlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc19wYXNzZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFRIRSBHQU1FIElTIERPTkVcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgd2lubmVyXG4gICAgICAgICAgICAgICAgdGhpcy5pc19vdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfYSA9IGNhbGN1bGF0ZVRlcnJpdG9yeSh0aGlzLmJvYXJkKSwgdGhpcy5ibGFja190ZXJyaXRvcnkgPSBfYVswXSwgdGhpcy53aGl0ZV90ZXJyaXRvcnkgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICB2YXIgYmxhY2tfc2NvcmUgPSB0aGlzLmJsYWNrX2NhcHR1cmVzICsgdGhpcy5ibGFja190ZXJyaXRvcnk7XG4gICAgICAgICAgICAgICAgdmFyIHdoaXRlX3Njb3JlID0gdGhpcy53aGl0ZV9jYXB0dXJlcyArIHRoaXMud2hpdGVfdGVycml0b3J5O1xuICAgICAgICAgICAgICAgIHdoaXRlX3Njb3JlICs9IHRoaXMua29taTsgLy8gYWRkIEtvbWkgZm9yIHdoaXRlXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtbKGJsYWNrX3Njb3JlID4gd2hpdGVfc2NvcmUpID8gdHlwZXNfMS5Db2xvci5CTEFDSyA6IHR5cGVzXzEuQ29sb3IuV0hJVEUsIGJsYWNrX3Njb3JlLCB3aGl0ZV9zY29yZV0sIFwiR2FtZSBvdmVyXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNfcGFzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFzX3Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9iID0gcGxheUJvYXJkTW92ZSh0aGlzLmJvYXJkLCB0aGlzLmN1cnJfcGxheWVyLCBtb3ZlKSwgdmFsaWQgPSBfYlswXSwgbmJvYXJkID0gX2JbMV0sIGNhcHR1cmVzID0gX2JbMl0sIHN0ciA9IF9iWzNdO1xuICAgICAgICAgICAgLy8gaW52YWxpZCBtb3ZlXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSwgXCJJbGxlZ2FsIE1vdmUsIFwiICsgc3RyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGtvLCBub3QgdmFsaWQgbW92ZVxuICAgICAgICAgICAgaWYgKHRoaXMucHJldl9ib2FyZCAhPT0gbnVsbCAmJiBoZWxwZXJfMS5pc0JvYXJkRXF1YWwodGhpcy5wcmV2X2JvYXJkLCBuYm9hcmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSwgXCJJbGxlZ2FsIE1vdmUsIEtvXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIGtvIGJvYXJkXG4gICAgICAgICAgICB0aGlzLnByZXZfYm9hcmQgPSBoZWxwZXJfMS5jbG9uZUJvYXJkKHRoaXMuYm9hcmQpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGJvYXJkIHN0YXRlXG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbmJvYXJkO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGNhcHR1cmVkIHN0b25lc1xuICAgICAgICAgICAgaWYgKHRoaXMuY3Vycl9wbGF5ZXIgPT0gdHlwZXNfMS5Db2xvci5CTEFDSylcbiAgICAgICAgICAgICAgICB0aGlzLmJsYWNrX2NhcHR1cmVzICs9IGNhcHR1cmVzO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGVfY2FwdHVyZXMgKz0gY2FwdHVyZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmV4dCBwbGF5ZXJzIHR1cm5cbiAgICAgICAgdGhpcy5jdXJyX3BsYXllciA9IHRoaXMuY3Vycl9wbGF5ZXIgPT0gdHlwZXNfMS5Db2xvci5CTEFDSyA/IHR5cGVzXzEuQ29sb3IuV0hJVEUgOiB0eXBlc18xLkNvbG9yLkJMQUNLO1xuICAgICAgICByZXR1cm4gW3RydWUsIFwiVmFsaWQgTW92ZVwiXTtcbiAgICB9O1xuICAgIEJhZHVrR2FtZS5wcm90b3R5cGUucmVtb3ZlR3JvdXAgPSBmdW5jdGlvbiAobG9jKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW2xvYy55XVtsb2MueF0gPT09IHR5cGVzXzEuQ29sb3IuQkxBQ0spIHtcbiAgICAgICAgICAgIHZhciBfYSA9IGtpbGxHcm91cCh0aGlzLmJvYXJkLCBsb2MpLCBuYm9hcmQgPSBfYVswXSwga2lsbGVkID0gX2FbMV07XG4gICAgICAgICAgICB0aGlzLndoaXRlX2NhcHR1cmVzICs9IGtpbGxlZDtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQgPSBuYm9hcmQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5ib2FyZFtsb2MueV1bbG9jLnhdID09PSB0eXBlc18xLkNvbG9yLldISVRFKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBraWxsR3JvdXAodGhpcy5ib2FyZCwgbG9jKSwgbmJvYXJkID0gX2JbMF0sIGtpbGxlZCA9IF9iWzFdO1xuICAgICAgICAgICAgdGhpcy5ibGFja19jYXB0dXJlcyArPSBraWxsZWQ7XG4gICAgICAgICAgICB0aGlzLmJvYXJkID0gbmJvYXJkO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQmFkdWtHYW1lO1xufSgpKTtcbmV4cG9ydHMuQmFkdWtHYW1lID0gQmFkdWtHYW1lO1xuO1xuLy8gU2luZ2xlIEdhbWUgc3RhdGUgbWFuYWdlclxudmFyIEJhZHVrR2FtZU1hbmFnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQmFkdWtHYW1lTWFuYWdlcihzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICAgIHRoaXMuaGFzX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgQmFkdWtHYW1lTWFuYWdlci5wcm90b3R5cGUuYWRkQmxhY2sgPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIHRoaXMuYmxhY2tfY2xpZW50ID0gc29ja2V0O1xuICAgICAgICBzb2NrZXQuZW1pdChcIlBMQVlJTkdfQkxBQ0tcIik7XG4gICAgfTtcbiAgICBCYWR1a0dhbWVNYW5hZ2VyLnByb3RvdHlwZS5hZGRXaGl0ZSA9IGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgdGhpcy53aGl0ZV9jbGllbnQgPSBzb2NrZXQ7XG4gICAgICAgIHNvY2tldC5lbWl0KFwiUExBWUlOR19XSElURVwiKTtcbiAgICB9O1xuICAgIEJhZHVrR2FtZU1hbmFnZXIucHJvdG90eXBlLnBsYXlNb3ZlID0gZnVuY3Rpb24gKHNvY2tldCwgeCwgeSkge1xuICAgICAgICBpZiAodGhpcy5nYW1lLnByZXZfYm9hcmQgIT0gbnVsbClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlbHBlcl8xLmdldE51bXNGcm9tQm9hcmQodGhpcy5nYW1lLnByZXZfYm9hcmQpKTtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nYW1lLnBsYXlNb3ZlKG5ldyB0eXBlc18xLkNvb3JkKHgsIHkpLCAoc29ja2V0LmlkID09PSB0aGlzLmJsYWNrX2NsaWVudC5pZCkgPyB0eXBlc18xLkNvbG9yLkJMQUNLIDogdHlwZXNfMS5Db2xvci5XSElURSksIHJlcyA9IF9hWzBdLCBtc2cgPSBfYVsxXTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiR0FNRV9FTkRcIiwgKHJlc1swXSA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykgPyB0aGlzLmJsYWNrX2NsaWVudCA6IHRoaXMud2hpdGVfY2xpZW50LCByZXNbMV0sIHJlc1syXSwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFZhbGlkIG1vdmVcbiAgICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiVVBEQVRFX0JPQVJEXCIsIGhlbHBlcl8xLmdldE51bXNGcm9tQm9hcmQodGhpcy5nYW1lLmJvYXJkKSwgdGhpcy5nYW1lLmJsYWNrX2NhcHR1cmVzLCB0aGlzLmdhbWUud2hpdGVfY2FwdHVyZXMsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdChcIkVSUk9SXCIsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJhZHVrR2FtZU1hbmFnZXIucHJvdG90eXBlLnBhc3MgPSBmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2FtZS5wbGF5TW92ZShudWxsLCAoc29ja2V0LmlkID09PSB0aGlzLmJsYWNrX2NsaWVudC5pZCkgPyB0eXBlc18xLkNvbG9yLkJMQUNLIDogdHlwZXNfMS5Db2xvci5XSElURSksIHJlcyA9IF9hWzBdLCBtc2cgPSBfYVsxXTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXMgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgZW5kZWRcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMsIG1zZyk7XG4gICAgICAgICAgICB2YXIgd2lubmVyID0gcmVzWzBdLCBibGFja19zY29yZSA9IHJlc1sxXSwgd2hpdGVfc2NvcmUgPSByZXNbMl07XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5lbWl0KFwiR0FNRV9FTkRcIiwgd2lubmVyID09PSB0eXBlc18xLkNvbG9yLkJMQUNLID8gMSA6IC0xLCBibGFja19zY29yZSwgd2hpdGVfc2NvcmUsIG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBtb3ZlXG4gICAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW1pdChcIlVQREFURV9CT0FSRFwiLCBoZWxwZXJfMS5nZXROdW1zRnJvbUJvYXJkKHRoaXMuZ2FtZS5ib2FyZCksIHRoaXMuZ2FtZS5ibGFja19jYXB0dXJlcywgdGhpcy5nYW1lLndoaXRlX2NhcHR1cmVzLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoXCJFUlJPUlwiLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBCYWR1a0dhbWVNYW5hZ2VyLnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGFzX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWUgPSBuZXcgQmFkdWtHYW1lKDE5LCBbXSwgNi41KTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW1pdChcIkdBTUVfU1RBUlRFRFwiLCBoZWxwZXJfMS5nZXROdW1zRnJvbUJvYXJkKHRoaXMuZ2FtZS5ib2FyZCkpO1xuICAgICAgICB0aGlzLmJsYWNrX2NsaWVudC5lbWl0KFwiQkxBQ0tfUExBWUVSXCIpO1xuICAgICAgICB0aGlzLndoaXRlX2NsaWVudC5lbWl0KFwiV0hJVEVfUExBWUVSXCIpO1xuICAgIH07XG4gICAgcmV0dXJuIEJhZHVrR2FtZU1hbmFnZXI7XG59KCkpO1xuZXhwb3J0cy5CYWR1a0dhbWVNYW5hZ2VyID0gQmFkdWtHYW1lTWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuY2xvbmVCb2FyZCA9IGV4cG9ydHMuYWxwaGFUb0Nvb3JkID0gZXhwb3J0cy5zZXRWaXNpdGVkID0gZXhwb3J0cy5maW5kQm9yZGVyaW5nQ29sb3IgPSBleHBvcnRzLmdldEJvYXJkRnJvbVN0cmluZ3MgPSBleHBvcnRzLmdldE51bXNGcm9tQm9hcmQgPSBleHBvcnRzLmdldFN0cmluZ3NGcm9tQm9hcmQgPSBleHBvcnRzLmdldENvb3JkRnJvbUJvYXJkID0gZXhwb3J0cy5zZWxlY3RHcm91cCA9IGV4cG9ydHMuc2V0Q29sb3IgPSBleHBvcnRzLmlzQm9hcmRFbXB0eSA9IGV4cG9ydHMuaXNCb2FyZEVxdWFsID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3R5cGVzXCIpO1xudmFyIEJhZHVrR2FtZV8xID0gcmVxdWlyZShcIi4vQmFkdWtHYW1lXCIpO1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVVRJTElUWSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyoqXG4gKiBAcGFyYW0gYm9hcmQxXG4gKiBAcGFyYW0gYm9hcmQyXG4gKiBAcmV0dXJucyBpZiBib2FyZDEgYW5kIGJvYXJkMiByZXByZXNlbnQgdGhlIHNhbWUgc3RhdGVcbiAqL1xuZnVuY3Rpb24gaXNCb2FyZEVxdWFsKGJvYXJkMSwgYm9hcmQyKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2FyZDEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZDEubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGlmIChib2FyZDFbaV1bal0gIT09IGJvYXJkMltpXVtqXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmlzQm9hcmRFcXVhbCA9IGlzQm9hcmRFcXVhbDtcbi8qKlxuICogQHBhcmFtIGJvYXJkXG4gKiBAcmV0dXJucyByZXR1cm4gaWYgYm9hcmQgaXMgZW1wdHkgKGhhcyBubyBzdG9uZXMpXG4gKi9cbmZ1bmN0aW9uIGlzQm9hcmRFbXB0eShib2FyZCkge1xuICAgIGZvciAodmFyIF9pID0gMCwgYm9hcmRfMSA9IGJvYXJkOyBfaSA8IGJvYXJkXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBib2FyZF8xW19pXTtcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCByb3dfMSA9IHJvdzsgX2EgPCByb3dfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IHJvd18xW19hXTtcbiAgICAgICAgICAgIGlmIChzcGFjZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuaXNCb2FyZEVtcHR5ID0gaXNCb2FyZEVtcHR5O1xuLyoqXG4gKiBzZXRzIGVhY2ggb2YgdGhlIENvb3JkcyBnaXZlbiBpbiBtb3ZlcyB0byBjdXJyX3BsYXllciBpbiBib2FyZFxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gbW92ZXMgQXJyYXkgb2YgQ29vcmRzIHRvIHBsYWNlIHN0b25lXG4gKiBAcGFyYW0gY3Vycl9wbGF5ZXJcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHNldENvbG9yKGJvYXJkLCBtb3ZlcywgY3Vycl9wbGF5ZXIpIHtcbiAgICBtb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb3ZlKSB7XG4gICAgICAgIGJvYXJkW21vdmUueV1bbW92ZS54XSA9IGN1cnJfcGxheWVyO1xuICAgIH0pO1xuICAgIHJldHVybiBib2FyZDtcbn1cbmV4cG9ydHMuc2V0Q29sb3IgPSBzZXRDb2xvcjtcbjtcbi8qKlxuICogcHJlOiBib2FyZCBhdCBsb2MgIT0gbnVsbFxuICogQHBhcmFtIGJvYXJkXG4gKiBAcGFyYW0gbG9jXG4gKiBAcmV0dXJuIGEgQm9hcmQgd2l0aCBvbmx5IHRoZSBncm91cCBjb25uZWN0ZWQgdG8gdGhlIHN0b25lIGF0IGxvYyBwbGFjZWRcbiAqL1xuZnVuY3Rpb24gc2VsZWN0R3JvdXAoYm9hcmQsIGxvYykge1xuICAgIHZhciB0b1Zpc2l0ID0gW2xvY107XG4gICAgdmFyIGN1cnJfcGxheWVyID0gYm9hcmRbbG9jLnldW2xvYy54XTtcbiAgICB2YXIgY2hlY2tHcmFwaCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChcIk5cIik7IH0pO1xuICAgIHZhciBzaXplID0gYm9hcmQubGVuZ3RoO1xuICAgIHZhciBuYm9hcmQgPSBuZXcgQXJyYXkoc2l6ZSkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KHNpemUpLmZpbGwobnVsbCk7IH0pO1xuICAgIHdoaWxlICh0b1Zpc2l0Lmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBjdXJyID0gdG9WaXNpdC5wb3AoKTtcbiAgICAgICAgaWYgKGNoZWNrR3JhcGhbY3Vyci55XVtjdXJyLnhdID09IFwiTlwiKSB7XG4gICAgICAgICAgICBuYm9hcmRbY3Vyci55XVtjdXJyLnhdID0gY3Vycl9wbGF5ZXI7XG4gICAgICAgICAgICBpZiAoYm9hcmRbY3Vyci55XVtjdXJyLnhdID09IGN1cnJfcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLngsIGN1cnIueSArIDEpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci55IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCArIDEgPCBib2FyZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHRvVmlzaXQucHVzaChuZXcgdHlwZXNfMS5Db29yZChjdXJyLnggKyAxLCBjdXJyLnkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci54IC0gMSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54IC0gMSwgY3Vyci55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGVja0dyYXBoW2N1cnIueV1bY3Vyci54XSA9IFwiRFwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuYm9hcmQ7XG59XG5leHBvcnRzLnNlbGVjdEdyb3VwID0gc2VsZWN0R3JvdXA7XG4vKipcbiAqIEBwYXJhbSBib2FyZFxuICogQHJldHVybiBnaXZlbiBhIGJvYXJkLCByZXR1cm4gYW4gYXJyYXkgb2YgY29vcmRzIGZvciBsb2NhdGlvbiBvZiBibGFjayBhbmQgd2hpdGUgc3RvbmVzXG4gKi9cbmZ1bmN0aW9uIGdldENvb3JkRnJvbUJvYXJkKGJvYXJkKSB7XG4gICAgdmFyIGJsYWNrX2Nvb3JkcyA9IFtdO1xuICAgIHZhciB3aGl0ZV9jb29yZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYm9hcmQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtpXVtqXSA9PSB0eXBlc18xLkNvbG9yLkJMQUNLKSB7XG4gICAgICAgICAgICAgICAgYmxhY2tfY29vcmRzLnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoaiwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYm9hcmRbaV1bal0gPT0gdHlwZXNfMS5Db2xvci5XSElURSkge1xuICAgICAgICAgICAgICAgIHdoaXRlX2Nvb3Jkcy5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGosIGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2JsYWNrX2Nvb3Jkcywgd2hpdGVfY29vcmRzXTtcbn1cbmV4cG9ydHMuZ2V0Q29vcmRGcm9tQm9hcmQgPSBnZXRDb29yZEZyb21Cb2FyZDtcbmZ1bmN0aW9uIGdldFN0cmluZ3NGcm9tQm9hcmQoYm9hcmQpIHtcbiAgICB2YXIgbmJvYXJkID0gW107XG4gICAgZm9yICh2YXIgaSA9IGJvYXJkLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciByb3cgPSBib2FyZFtpXS5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gKHZhbCA9PT0gbnVsbCkgPyAnLScgOiAoKHZhbCA9PT0gdHlwZXNfMS5Db2xvci5CTEFDSykgPyAnWCcgOiAnTycpOyB9KTtcbiAgICAgICAgbmJvYXJkLnB1c2gocm93KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ib2FyZDtcbn1cbmV4cG9ydHMuZ2V0U3RyaW5nc0Zyb21Cb2FyZCA9IGdldFN0cmluZ3NGcm9tQm9hcmQ7XG5mdW5jdGlvbiBnZXROdW1zRnJvbUJvYXJkKGJvYXJkKSB7XG4gICAgdmFyIG5ib2FyZCA9IFtdO1xuICAgIGJvYXJkLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgbnJvdyA9IHJvdy5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gKHZhbCA9PT0gbnVsbCkgPyAwIDogKCh2YWwgPT09IHR5cGVzXzEuQ29sb3IuQkxBQ0spID8gMSA6IC0xKTsgfSk7XG4gICAgICAgIG5ib2FyZC5wdXNoKG5yb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiBuYm9hcmQ7XG59XG5leHBvcnRzLmdldE51bXNGcm9tQm9hcmQgPSBnZXROdW1zRnJvbUJvYXJkO1xuZnVuY3Rpb24gZ2V0Qm9hcmRGcm9tU3RyaW5ncyhib2FyZCkge1xuICAgIHZhciBuYm9hcmQgPSBCYWR1a0dhbWVfMS5zZXR1cEJvYXJkKGJvYXJkLmxlbmd0aCwgW10pWzBdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBib2FyZC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2ldW2pdID09ICdYJylcbiAgICAgICAgICAgICAgICBuYm9hcmRbaV1bal0gPSB0eXBlc18xLkNvbG9yLkJMQUNLO1xuICAgICAgICAgICAgZWxzZSBpZiAoYm9hcmRbaV1bal0gPT0gJ08nKVxuICAgICAgICAgICAgICAgIG5ib2FyZFtpXVtqXSA9IHR5cGVzXzEuQ29sb3IuV0hJVEU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ib2FyZDtcbn1cbmV4cG9ydHMuZ2V0Qm9hcmRGcm9tU3RyaW5ncyA9IGdldEJvYXJkRnJvbVN0cmluZ3M7XG4vKipcbiAqIGZpbmQgdGhlIGJvcmRlcmluZyBjb2xvciBlbXB0eSBzcGFjZSBhdCBsb2NcbiAqIHByZTogYm9hcmQgYXQgbG9jID09IG51bGwsIGlmIGJvdGggY29sb3JzIG9yIG5vbmUgYXJlIHByZXNlbnQgcmV0dXJuIG51bGxcbiAqIEBwYXJhbSBib2FyZFxuICogQHBhcmFtIGxvY1xuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gZmluZEJvcmRlcmluZ0NvbG9yKGJvYXJkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB2aXNpdGVkID0gQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKG51bGwpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkoYm9hcmQubGVuZ3RoKS5maWxsKGZhbHNlKTsgfSk7XG4gICAgdmFyIGN1cnJfY29sb3IgPSBudWxsO1xuICAgIHdoaWxlICh0b1Zpc2l0Lmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBjdXJyID0gdG9WaXNpdC5wb3AoKTtcbiAgICAgICAgaWYgKCF2aXNpdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyX2NvbG9yID09PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBjdXJyX2NvbG9yID0gYm9hcmRbY3Vyci55XVtjdXJyLnhdO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJfY29sb3IgIT0gYm9hcmRbY3Vyci55XVtjdXJyLnhdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXJyX2NvbG9yO1xufVxuZXhwb3J0cy5maW5kQm9yZGVyaW5nQ29sb3IgPSBmaW5kQm9yZGVyaW5nQ29sb3I7XG5mdW5jdGlvbiBzZXRWaXNpdGVkKGJvYXJkLCB2aXNpdGVkLCBsb2MpIHtcbiAgICB2YXIgdG9WaXNpdCA9IFtsb2NdO1xuICAgIHZhciB0dmlzaXRlZCA9IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChudWxsKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KGJvYXJkLmxlbmd0aCkuZmlsbChmYWxzZSk7IH0pO1xuICAgIHZhciBzeiA9IDA7XG4gICAgd2hpbGUgKHRvVmlzaXQubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIGN1cnIgPSB0b1Zpc2l0LnBvcCgpO1xuICAgICAgICBpZiAoIXR2aXNpdGVkW2N1cnIueV1bY3Vyci54XSkge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2N1cnIueV1bY3Vyci54XSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtjdXJyLnldW2N1cnIueF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnkgKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54LCBjdXJyLnkgKyAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueSAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCwgY3Vyci55IC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLnggKyAxIDwgYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB0b1Zpc2l0LnB1c2gobmV3IHR5cGVzXzEuQ29vcmQoY3Vyci54ICsgMSwgY3Vyci55KSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIueCAtIDEgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgdG9WaXNpdC5wdXNoKG5ldyB0eXBlc18xLkNvb3JkKGN1cnIueCAtIDEsIGN1cnIueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHZpc2l0ZWRbY3Vyci55XVtjdXJyLnhdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmlzaXRlZDtcbn1cbmV4cG9ydHMuc2V0VmlzaXRlZCA9IHNldFZpc2l0ZWQ7XG5mdW5jdGlvbiBhbHBoYVRvQ29vcmQoc3RyKSB7XG4gICAgdmFyIHggPSBzdHIuY2hhckNvZGVBdCgwKSAtIDY1O1xuICAgIGlmICh4ID49IDkpXG4gICAgICAgIC0teDtcbiAgICB2YXIgeSA9IHN0ci5jaGFyQ29kZUF0KDEpIC0gNDk7XG4gICAgcmV0dXJuIG5ldyB0eXBlc18xLkNvb3JkKHgsIHkpO1xufVxuZXhwb3J0cy5hbHBoYVRvQ29vcmQgPSBhbHBoYVRvQ29vcmQ7XG5mdW5jdGlvbiBjbG9uZUJvYXJkKGJvYXJkKSB7XG4gICAgdmFyIG5ib2FyZCA9IFtdO1xuICAgIGJvYXJkLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgbnJvdyA9IHJvdy5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGU7IH0pO1xuICAgICAgICBuYm9hcmQucHVzaChucm93KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmJvYXJkO1xufVxuZXhwb3J0cy5jbG9uZUJvYXJkID0gY2xvbmVCb2FyZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xudmFyIGh0dHBfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiaHR0cFwiKSk7XG52YXIgc29ja2V0X2lvXzEgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpO1xudmFyIEJhZHVrR2FtZV8xID0gcmVxdWlyZShcIi4vQm9hcmRMb2dpYy9CYWR1a0dhbWVcIik7XG52YXIgY29yc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJjb3JzXCIpKTtcbnZhciBhcHAgPSBleHByZXNzXzFbXCJkZWZhdWx0XCJdKCk7XG52YXIgc2VydmVyID0gbmV3IGh0dHBfMVtcImRlZmF1bHRcIl0uU2VydmVyKGFwcCk7XG52YXIgaW8gPSBuZXcgc29ja2V0X2lvXzEuU2VydmVyKHNlcnZlciwge1xuICAgIGNvcnM6IHtcbiAgICAgICAgb3JpZ2luOiAnKicsXG4gICAgICAgIG1ldGhvZHM6IFsnR0VUJywgJ1BPU1QnXVxuICAgIH1cbn0pO1xudmFyIHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDI1Njc7XG5hcHAudXNlKGNvcnNfMVtcImRlZmF1bHRcIl0oKSk7XG5zZXJ2ZXIubGlzdGVuKHBvcnQsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInNlcnZlciBsaXN0ZW5pbmcgb24gcG9ydFwiLCBwb3J0KTtcbn0pO1xudmFyIGdhbWUgPSBuZXcgQmFkdWtHYW1lXzEuQmFkdWtHYW1lTWFuYWdlcihpbyk7XG52YXIgY2xpZW50cyA9IFtdO1xuLy8gU3RhcnRpbmcgcG9pbnQgZm9yIHVzZXJzXG5pby5vbignY29ubmVjdGlvbicsIGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gZXN0YWJsaXNoZWQgd2l0aDpcIiwgc29ja2V0LmlkKTtcbiAgICAvLyBBZGQgU29ja2V0IHRvIGxpc3Qgb2YgY2xpZW50c1xuICAgIGNsaWVudHMucHVzaChzb2NrZXQpO1xuICAgIHNvY2tldC5vbihcIkpPSU5fR0FNRVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKFwiUExBWV9NT1ZFXCIsIGZ1bmN0aW9uICh4LCB5LCBwYXNzKSB7XG4gICAgICAgIGlmICghZ2FtZS5oYXNfc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIG5vdCBzdGFydGVkXCIpO1xuICAgICAgICAgICAgc29ja2V0LmVtaXQoXCJFUlJPUlwiLCBcIkdhbWUgbm90IHN0YXJ0ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1vdmVcIiwgeCwgeSwgXCJlbnRlcmVkXCIpO1xuICAgICAgICAgICAgaWYgKHBhc3MpXG4gICAgICAgICAgICAgICAgZ2FtZS5wYXNzKHNvY2tldCk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnYW1lLnBsYXlNb3ZlKHNvY2tldCwgcGFyc2VJbnQoeCksIHBhcnNlSW50KHkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNvY2tldC5vbihcIlNUQVJUX0dBTUVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY2xpZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBlbm91Z2ggcGxheWVyc1wiKTtcbiAgICAgICAgICAgIHNvY2tldC5lbWl0KFwiRVJST1JcIiwgXCJOb3QgZW5vdWdoIHBsYXllcnNcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJpbmcgZ2FtZVwiKTtcbiAgICAgICAgICAgIGdhbWUuYWRkQmxhY2soY2xpZW50c1swXSk7XG4gICAgICAgICAgICBnYW1lLmFkZFdoaXRlKGNsaWVudHNbMV0pO1xuICAgICAgICAgICAgZ2FtZS5zdGFydEdhbWUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNvY2tldC5vbihcImRpc2Nvbm5lY3RcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gbG9zdCB3aXRoOlwiLCBzb2NrZXQuaWQpO1xuICAgICAgICB2YXIgaSA9IGNsaWVudHMuaW5kZXhPZihzb2NrZXQpO1xuICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICBjbGllbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhjbGllbnRzLmxlbmd0aCk7XG4gICAgfSk7XG59KTtcbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKCkgeyByZXR1cm4gY29uc29sZS5sb2coJ01vZHVsZSBkaXNwb3NlZC4gJyk7IH0pO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5Db29yZCA9IGV4cG9ydHMuQ29sb3IgPSB2b2lkIDA7XG52YXIgQ29sb3I7XG4oZnVuY3Rpb24gKENvbG9yKSB7XG4gICAgQ29sb3JbQ29sb3JbXCJCTEFDS1wiXSA9IDBdID0gXCJCTEFDS1wiO1xuICAgIENvbG9yW0NvbG9yW1wiV0hJVEVcIl0gPSAxXSA9IFwiV0hJVEVcIjtcbn0pKENvbG9yID0gZXhwb3J0cy5Db2xvciB8fCAoZXhwb3J0cy5Db2xvciA9IHt9KSk7XG47XG52YXIgQ29vcmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmQoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICByZXR1cm4gQ29vcmQ7XG59KCkpO1xuZXhwb3J0cy5Db29yZCA9IENvb3JkO1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXG5cdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiXG5cdFx0KTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKVxuXHRcdFx0bG9nKFxuXHRcdFx0XHRcImluZm9cIixcblx0XHRcdFx0J1tITVJdIENvbnNpZGVyIHVzaW5nIHRoZSBvcHRpbWl6YXRpb24ubW9kdWxlSWRzOiBcIm5hbWVkXCIgZm9yIG1vZHVsZSBuYW1lcy4nXG5cdFx0XHQpO1xuXHR9XG59O1xuIiwidmFyIGxvZ0xldmVsID0gXCJpbmZvXCI7XG5cbmZ1bmN0aW9uIGR1bW15KCkge31cblxuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxldmVsLCBtc2cpIHtcblx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRpZiAobGV2ZWwgPT09IFwiaW5mb1wiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwid2FybmluZ1wiKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcImVycm9yXCIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuLyogZXNsaW50LWVuYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cblxubW9kdWxlLmV4cG9ydHMuZ3JvdXAgPSBsb2dHcm91cChncm91cCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwQ29sbGFwc2VkID0gbG9nR3JvdXAoZ3JvdXBDb2xsYXBzZWQpO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cEVuZCA9IGxvZ0dyb3VwKGdyb3VwRW5kKTtcblxubW9kdWxlLmV4cG9ydHMuc2V0TG9nTGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcblx0bG9nTGV2ZWwgPSBsZXZlbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24gKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBzdGFjaztcblx0fVxufTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdFxuXHRcdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHR2YXIgc3RhdHVzID0gbW9kdWxlLmhvdC5zdGF0dXMoKTtcblx0XHRcdFx0XHRpZiAoW1wiYWJvcnRcIiwgXCJmYWlsXCJdLmluZGV4T2Yoc3RhdHVzKSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS5cIik7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdHNldEludGVydmFsKGNoZWNrRm9yVXBkYXRlLCBob3RQb2xsSW50ZXJ2YWwpO1xufSBlbHNlIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChjYWNoZWRNb2R1bGUuZXJyb3IgIT09IHVuZGVmaW5lZCkgdGhyb3cgY2FjaGVkTW9kdWxlLmVycm9yO1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHR0cnkge1xuXHRcdHZhciBleGVjT3B0aW9ucyA9IHsgaWQ6IG1vZHVsZUlkLCBtb2R1bGU6IG1vZHVsZSwgZmFjdG9yeTogX193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0sIHJlcXVpcmU6IF9fd2VicGFja19yZXF1aXJlX18gfTtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7IGhhbmRsZXIoZXhlY09wdGlvbnMpOyB9KTtcblx0XHRtb2R1bGUgPSBleGVjT3B0aW9ucy5tb2R1bGU7XG5cdFx0ZXhlY09wdGlvbnMuZmFjdG9yeS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBleGVjT3B0aW9ucy5yZXF1aXJlKTtcblx0fSBjYXRjaChlKSB7XG5cdFx0bW9kdWxlLmVycm9yID0gZTtcblx0XHR0aHJvdyBlO1xuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbl9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgZXhlY3V0aW9uIGludGVyY2VwdG9yXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBbXTtcblxuIiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYWxsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5odSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIF9fd2VicGFja19yZXF1aXJlX18uaCgpICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckYgPSAoKSA9PiAoXCJtYWluLlwiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5oKCkgKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gKFwiNGQwMzVjMGJhYmI1NjIwNjU3YzNcIikiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwidmFyIGN1cnJlbnRNb2R1bGVEYXRhID0ge307XG52YXIgaW5zdGFsbGVkTW9kdWxlcyA9IF9fd2VicGFja19yZXF1aXJlX18uYztcblxuLy8gbW9kdWxlIGFuZCByZXF1aXJlIGNyZWF0aW9uXG52YXIgY3VycmVudENoaWxkTW9kdWxlO1xudmFyIGN1cnJlbnRQYXJlbnRzID0gW107XG5cbi8vIHN0YXR1c1xudmFyIHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycyA9IFtdO1xudmFyIGN1cnJlbnRTdGF0dXMgPSBcImlkbGVcIjtcblxuLy8gd2hpbGUgZG93bmxvYWRpbmdcbnZhciBibG9ja2luZ1Byb21pc2VzO1xuXG4vLyBUaGUgdXBkYXRlIGluZm9cbnZhciBjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycztcbnZhciBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXM7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJEID0gY3VycmVudE1vZHVsZURhdGE7XG5cbl9fd2VicGFja19yZXF1aXJlX18uaS5wdXNoKGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdHZhciBtb2R1bGUgPSBvcHRpb25zLm1vZHVsZTtcblx0dmFyIHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKG9wdGlvbnMucmVxdWlyZSwgb3B0aW9ucy5pZCk7XG5cdG1vZHVsZS5ob3QgPSBjcmVhdGVNb2R1bGVIb3RPYmplY3Qob3B0aW9ucy5pZCwgbW9kdWxlKTtcblx0bW9kdWxlLnBhcmVudHMgPSBjdXJyZW50UGFyZW50cztcblx0bW9kdWxlLmNoaWxkcmVuID0gW107XG5cdGN1cnJlbnRQYXJlbnRzID0gW107XG5cdG9wdGlvbnMucmVxdWlyZSA9IHJlcXVpcmU7XG59KTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDID0ge307XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkgPSB7fTtcblxuZnVuY3Rpb24gY3JlYXRlUmVxdWlyZShyZXF1aXJlLCBtb2R1bGVJZCkge1xuXHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblx0aWYgKCFtZSkgcmV0dXJuIHJlcXVpcmU7XG5cdHZhciBmbiA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG5cdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcblx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG5cdFx0XHRcdHZhciBwYXJlbnRzID0gaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzO1xuXHRcdFx0XHRpZiAocGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG5cdFx0XHRcdGN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG5cdFx0XHR9XG5cdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcblx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG5cdFx0XHRcdFx0cmVxdWVzdCArXG5cdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcblx0XHRcdFx0XHRtb2R1bGVJZFxuXHRcdFx0KTtcblx0XHRcdGN1cnJlbnRQYXJlbnRzID0gW107XG5cdFx0fVxuXHRcdHJldHVybiByZXF1aXJlKHJlcXVlc3QpO1xuXHR9O1xuXHR2YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gcmVxdWlyZVtuYW1lXTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRyZXF1aXJlW25hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblx0Zm9yICh2YXIgbmFtZSBpbiByZXF1aXJlKSB7XG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXF1aXJlLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IobmFtZSkpO1xuXHRcdH1cblx0fVxuXHRmbi5lID0gZnVuY3Rpb24gKGNodW5rSWQpIHtcblx0XHRyZXR1cm4gdHJhY2tCbG9ja2luZ1Byb21pc2UocmVxdWlyZS5lKGNodW5rSWQpKTtcblx0fTtcblx0cmV0dXJuIGZuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNb2R1bGVIb3RPYmplY3QobW9kdWxlSWQsIG1lKSB7XG5cdHZhciBfbWFpbiA9IGN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQ7XG5cdHZhciBob3QgPSB7XG5cdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuXHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG5cdFx0X2FjY2VwdGVkRXJyb3JIYW5kbGVyczoge30sXG5cdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcblx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcblx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcblx0XHRfc2VsZkludmFsaWRhdGVkOiBmYWxzZSxcblx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcblx0XHRfbWFpbjogX21haW4sXG5cdFx0X3JlcXVpcmVTZWxmOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjdXJyZW50UGFyZW50cyA9IG1lLnBhcmVudHMuc2xpY2UoKTtcblx0XHRcdGN1cnJlbnRDaGlsZE1vZHVsZSA9IF9tYWluID8gdW5kZWZpbmVkIDogbW9kdWxlSWQ7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcblx0XHR9LFxuXG5cdFx0Ly8gTW9kdWxlIEFQSVxuXHRcdGFjdGl2ZTogdHJ1ZSxcblx0XHRhY2NlcHQ6IGZ1bmN0aW9uIChkZXAsIGNhbGxiYWNrLCBlcnJvckhhbmRsZXIpIHtcblx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIgJiYgZGVwICE9PSBudWxsKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdFx0aG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwW2ldXSA9IGVycm9ySGFuZGxlcjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdGhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcF0gPSBlcnJvckhhbmRsZXI7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWNsaW5lOiBmdW5jdGlvbiAoZGVwKSB7XG5cdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIgJiYgZGVwICE9PSBudWxsKVxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcblx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuXHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuXHRcdH0sXG5cdFx0ZGlzcG9zZTogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcblx0XHR9LFxuXHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcblx0XHR9LFxuXHRcdGludmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX3NlbGZJbnZhbGlkYXRlZCA9IHRydWU7XG5cdFx0XHRzd2l0Y2ggKGN1cnJlbnRTdGF0dXMpIHtcblx0XHRcdFx0Y2FzZSBcImlkbGVcIjpcblx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IFtdO1xuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRcdFx0bW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHNldFN0YXR1cyhcInJlYWR5XCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicmVhZHlcIjpcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0oXG5cdFx0XHRcdFx0XHRcdG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVyc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInByZXBhcmVcIjpcblx0XHRcdFx0Y2FzZSBcImNoZWNrXCI6XG5cdFx0XHRcdGNhc2UgXCJkaXNwb3NlXCI6XG5cdFx0XHRcdGNhc2UgXCJhcHBseVwiOlxuXHRcdFx0XHRcdChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgfHwgW10pLnB1c2goXG5cdFx0XHRcdFx0XHRtb2R1bGVJZFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly8gaWdub3JlIHJlcXVlc3RzIGluIGVycm9yIHN0YXRlc1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuXHRcdGNoZWNrOiBob3RDaGVjayxcblx0XHRhcHBseTogaG90QXBwbHksXG5cdFx0c3RhdHVzOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0aWYgKCFsKSByZXR1cm4gY3VycmVudFN0YXR1cztcblx0XHRcdHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuXHRcdH0sXG5cdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24gKGwpIHtcblx0XHRcdHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24gKGwpIHtcblx0XHRcdHZhciBpZHggPSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcblx0XHRcdGlmIChpZHggPj0gMCkgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuXHRcdH0sXG5cblx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcblx0XHRkYXRhOiBjdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cblx0fTtcblx0Y3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuXHRyZXR1cm4gaG90O1xufVxuXG5mdW5jdGlvbiBzZXRTdGF0dXMobmV3U3RhdHVzKSB7XG5cdGN1cnJlbnRTdGF0dXMgPSBuZXdTdGF0dXM7XG5cdHZhciByZXN1bHRzID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG5cdFx0cmVzdWx0c1tpXSA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpO1xufVxuXG5mdW5jdGlvbiB0cmFja0Jsb2NraW5nUHJvbWlzZShwcm9taXNlKSB7XG5cdHN3aXRjaCAoY3VycmVudFN0YXR1cykge1xuXHRcdGNhc2UgXCJyZWFkeVwiOlxuXHRcdFx0c2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcblx0XHRcdGJsb2NraW5nUHJvbWlzZXMucHVzaChwcm9taXNlKTtcblx0XHRcdHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHNldFN0YXR1cyhcInJlYWR5XCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHRjYXNlIFwicHJlcGFyZVwiOlxuXHRcdFx0YmxvY2tpbmdQcm9taXNlcy5wdXNoKHByb21pc2UpO1xuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZuKSB7XG5cdGlmIChibG9ja2luZ1Byb21pc2VzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZuKCk7XG5cdHZhciBibG9ja2VyID0gYmxvY2tpbmdQcm9taXNlcztcblx0YmxvY2tpbmdQcm9taXNlcyA9IFtdO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoYmxvY2tlcikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZuKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5T25VcGRhdGUpIHtcblx0aWYgKGN1cnJlbnRTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG5cdH1cblx0cmV0dXJuIHNldFN0YXR1cyhcImNoZWNrXCIpXG5cdFx0LnRoZW4oX193ZWJwYWNrX3JlcXVpcmVfXy5obXJNKVxuXHRcdC50aGVuKGZ1bmN0aW9uICh1cGRhdGUpIHtcblx0XHRcdGlmICghdXBkYXRlKSB7XG5cdFx0XHRcdHJldHVybiBzZXRTdGF0dXMoYXBwbHlJbnZhbGlkYXRlZE1vZHVsZXMoKSA/IFwicmVhZHlcIiA6IFwiaWRsZVwiKS50aGVuKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHNldFN0YXR1cyhcInByZXBhcmVcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB1cGRhdGVkTW9kdWxlcyA9IFtdO1xuXHRcdFx0XHRibG9ja2luZ1Byb21pc2VzID0gW107XG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKFxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1yQykucmVkdWNlKGZ1bmN0aW9uIChcblx0XHRcdFx0XHRcdHByb21pc2VzLFxuXHRcdFx0XHRcdFx0a2V5XG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckNba2V5XShcblx0XHRcdFx0XHRcdFx0dXBkYXRlLmMsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZS5yLFxuXHRcdFx0XHRcdFx0XHR1cGRhdGUubSxcblx0XHRcdFx0XHRcdFx0cHJvbWlzZXMsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLFxuXHRcdFx0XHRcdFx0XHR1cGRhdGVkTW9kdWxlc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiBwcm9taXNlcztcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFtdKVxuXHRcdFx0XHQpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiB3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoYXBwbHlPblVwZGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaW50ZXJuYWxBcHBseShhcHBseU9uVXBkYXRlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJyZWFkeVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdXBkYXRlZE1vZHVsZXM7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG5cdGlmIChjdXJyZW50U3RhdHVzICE9PSBcInJlYWR5XCIpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGludGVybmFsQXBwbHkob3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRhcHBseUludmFsaWRhdGVkTW9kdWxlcygpO1xuXG5cdHZhciByZXN1bHRzID0gY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMubWFwKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG5cdFx0cmV0dXJuIGhhbmRsZXIob3B0aW9ucyk7XG5cdH0pO1xuXHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IHVuZGVmaW5lZDtcblxuXHR2YXIgZXJyb3JzID0gcmVzdWx0c1xuXHRcdC5tYXAoZnVuY3Rpb24gKHIpIHtcblx0XHRcdHJldHVybiByLmVycm9yO1xuXHRcdH0pXG5cdFx0LmZpbHRlcihCb29sZWFuKTtcblxuXHRpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcblx0XHRyZXR1cm4gc2V0U3RhdHVzKFwiYWJvcnRcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBlcnJvcnNbMF07XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2Vcblx0dmFyIGRpc3Bvc2VQcm9taXNlID0gc2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcblxuXHRyZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdGlmIChyZXN1bHQuZGlzcG9zZSkgcmVzdWx0LmRpc3Bvc2UoKTtcblx0fSk7XG5cblx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuXHR2YXIgYXBwbHlQcm9taXNlID0gc2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cblx0dmFyIGVycm9yO1xuXHR2YXIgcmVwb3J0RXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG5cdH07XG5cblx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuXHRyZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdGlmIChyZXN1bHQuYXBwbHkpIHtcblx0XHRcdHZhciBtb2R1bGVzID0gcmVzdWx0LmFwcGx5KHJlcG9ydEVycm9yKTtcblx0XHRcdGlmIChtb2R1bGVzKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKG1vZHVsZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwoW2Rpc3Bvc2VQcm9taXNlLCBhcHBseVByb21pc2VdKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0cmV0dXJuIHNldFN0YXR1cyhcImZhaWxcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcykge1xuXHRcdFx0cmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucykudGhlbihmdW5jdGlvbiAobGlzdCkge1xuXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdFx0XHRpZiAobGlzdC5pbmRleE9mKG1vZHVsZUlkKSA8IDApIGxpc3QucHVzaChtb2R1bGVJZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gbGlzdDtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZXRTdGF0dXMoXCJpZGxlXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG91dGRhdGVkTW9kdWxlcztcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkge1xuXHRpZiAocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzKSB7XG5cdFx0aWYgKCFjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycykgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdG1vZHVsZUlkLFxuXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImxvYWRlZFwiLCBvdGhlcndpc2Ugbm90IGxvYWRlZCB5ZXRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtclNfcmVxdWlyZSA9IF9fd2VicGFja19yZXF1aXJlX18uaG1yU19yZXF1aXJlIHx8IHtcblx0XCJtYWluXCI6IDFcbn07XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8gY2h1bmsgaW5zdGFsbCBmdW5jdGlvbiBuZWVkZWRcblxuLy8gbm8gY2h1bmsgbG9hZGluZ1xuXG4vLyBubyBleHRlcm5hbCBpbnN0YWxsIGNodW5rXG5cbmZ1bmN0aW9uIGxvYWRVcGRhdGVDaHVuayhjaHVua0lkLCB1cGRhdGVkTW9kdWxlc0xpc3QpIHtcblx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5odShjaHVua0lkKSk7XG5cdHZhciB1cGRhdGVkTW9kdWxlcyA9IHVwZGF0ZS5tb2R1bGVzO1xuXHR2YXIgcnVudGltZSA9IHVwZGF0ZS5ydW50aW1lO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHVwZGF0ZWRNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gdXBkYXRlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0aWYodXBkYXRlZE1vZHVsZXNMaXN0KSB1cGRhdGVkTW9kdWxlc0xpc3QucHVzaChtb2R1bGVJZCk7XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIGN1cnJlbnRVcGRhdGVSdW50aW1lLnB1c2gocnVudGltZSk7XG59XG5cbnZhciBjdXJyZW50VXBkYXRlQ2h1bmtzO1xudmFyIGN1cnJlbnRVcGRhdGU7XG52YXIgY3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3M7XG52YXIgY3VycmVudFVwZGF0ZVJ1bnRpbWU7XG5mdW5jdGlvbiBhcHBseUhhbmRsZXIob3B0aW9ucykge1xuXHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5mKSBkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmVIbXI7XG5cdGN1cnJlbnRVcGRhdGVDaHVua3MgPSB1bmRlZmluZWQ7XG5cdGZ1bmN0aW9uIGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyh1cGRhdGVNb2R1bGVJZCkge1xuXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG5cdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNoYWluOiBbaWRdLFxuXHRcdFx0XHRpZDogaWRcblx0XHRcdH07XG5cdFx0fSk7XG5cdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcblx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcblx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcblx0XHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhbW9kdWxlIHx8XG5cdFx0XHRcdChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgJiYgIW1vZHVsZS5ob3QuX3NlbGZJbnZhbGlkYXRlZClcblx0XHRcdClcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG5cdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuXHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcblx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG5cdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW3BhcmVudElkXTtcblx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcblx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG5cdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuXHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuXHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG5cdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG5cdFx0XHRcdHF1ZXVlLnB1c2goe1xuXHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG5cdFx0XHRcdFx0aWQ6IHBhcmVudElkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG5cdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG5cdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcblx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IGJbaV07XG5cdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG5cdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cblx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcblx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuXHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKG1vZHVsZSkge1xuXHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgbW9kdWxlLmlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG5cdFx0KTtcblx0fTtcblxuXHRmb3IgKHZhciBtb2R1bGVJZCBpbiBjdXJyZW50VXBkYXRlKSB7XG5cdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlLCBtb2R1bGVJZCkpIHtcblx0XHRcdHZhciBuZXdNb2R1bGVGYWN0b3J5ID0gY3VycmVudFVwZGF0ZVttb2R1bGVJZF07XG5cdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0aWYgKG5ld01vZHVsZUZhY3RvcnkpIHtcblx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRNb2R1bGVFZmZlY3RzKG1vZHVsZUlkKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG5cdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuXHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcblx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG5cdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG5cdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcblx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcblx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuXHRcdFx0fVxuXHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuXHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcblx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG5cdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG5cdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcblx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcblx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuXHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcblx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG5cdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRlcnJvcjogYWJvcnRFcnJvclxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRvQXBwbHkpIHtcblx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBuZXdNb2R1bGVGYWN0b3J5O1xuXHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuXHRcdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcblx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG5cdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG5cdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Y3VycmVudFVwZGF0ZSA9IHVuZGVmaW5lZDtcblxuXHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG5cdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcblx0Zm9yICh2YXIgaiA9IDA7IGogPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBqKyspIHtcblx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tqXTtcblx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdGlmIChcblx0XHRcdG1vZHVsZSAmJlxuXHRcdFx0KG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCB8fCBtb2R1bGUuaG90Ll9tYWluKSAmJlxuXHRcdFx0Ly8gcmVtb3ZlZCBzZWxmLWFjY2VwdGVkIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSByZXF1aXJlZFxuXHRcdFx0YXBwbGllZFVwZGF0ZVtvdXRkYXRlZE1vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlICYmXG5cdFx0XHQvLyB3aGVuIGNhbGxlZCBpbnZhbGlkYXRlIHNlbGYtYWNjZXB0aW5nIGlzIG5vdCBwb3NzaWJsZVxuXHRcdFx0IW1vZHVsZS5ob3QuX3NlbGZJbnZhbGlkYXRlZFxuXHRcdCkge1xuXHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuXHRcdFx0XHRtb2R1bGU6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdHJlcXVpcmU6IG1vZHVsZS5ob3QuX3JlcXVpcmVTZWxmLFxuXHRcdFx0XHRlcnJvckhhbmRsZXI6IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuXG5cdHJldHVybiB7XG5cdFx0ZGlzcG9zZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0Y3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MuZm9yRWFjaChmdW5jdGlvbiAoY2h1bmtJZCkge1xuXHRcdFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuXHRcdFx0fSk7XG5cdFx0XHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IHVuZGVmaW5lZDtcblxuXHRcdFx0dmFyIGlkeDtcblx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG5cdFx0XHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuXHRcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cblx0XHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuXHRcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcblx0XHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcblx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdGRpc3Bvc2VIYW5kbGVyc1tqXS5jYWxsKG51bGwsIGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yRFttb2R1bGVJZF0gPSBkYXRhO1xuXG5cdFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG5cdFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG5cdFx0XHRcdGRlbGV0ZSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuXG5cdFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcblx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuXHRcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuXHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZS5jaGlsZHJlbltqXV07XG5cdFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG5cdFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcblx0XHRcdFx0XHRpZiAoaWR4ID49IDApIHtcblx0XHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG5cdFx0XHR2YXIgZGVwZW5kZW5jeTtcblx0XHRcdGZvciAodmFyIG91dGRhdGVkTW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhvdXRkYXRlZERlcGVuZGVuY2llcywgb3V0ZGF0ZWRNb2R1bGVJZCkpIHtcblx0XHRcdFx0XHRtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuXHRcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPVxuXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG5cdFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuXHRcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGFwcGx5OiBmdW5jdGlvbiAocmVwb3J0RXJyb3IpIHtcblx0XHRcdC8vIGluc2VydCBuZXcgY29kZVxuXHRcdFx0Zm9yICh2YXIgdXBkYXRlTW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuXHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGFwcGxpZWRVcGRhdGUsIHVwZGF0ZU1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVt1cGRhdGVNb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW3VwZGF0ZU1vZHVsZUlkXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBydW4gbmV3IHJ1bnRpbWUgbW9kdWxlc1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50VXBkYXRlUnVudGltZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjdXJyZW50VXBkYXRlUnVudGltZVtpXShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcblx0XHRcdGZvciAodmFyIG91dGRhdGVkTW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhvdXRkYXRlZERlcGVuZGVuY2llcywgb3V0ZGF0ZWRNb2R1bGVJZCkpIHtcblx0XHRcdFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdGlmIChtb2R1bGUpIHtcblx0XHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID1cblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG5cdFx0XHRcdFx0XHR2YXIgZXJyb3JIYW5kbGVycyA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHR2YXIgZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuXHRcdFx0XHRcdFx0XHR2YXIgYWNjZXB0Q2FsbGJhY2sgPVxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuXHRcdFx0XHRcdFx0XHR2YXIgZXJyb3JIYW5kbGVyID1cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUuaG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwZW5kZW5jeV07XG5cdFx0XHRcdFx0XHRcdGlmIChhY2NlcHRDYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihhY2NlcHRDYWxsYmFjaykgIT09IC0xKSBjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChhY2NlcHRDYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3JIYW5kbGVycy5wdXNoKGVycm9ySGFuZGxlcik7XG5cdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzLnB1c2goZGVwZW5kZW5jeSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgY2FsbGJhY2tzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzW2tdLmNhbGwobnVsbCwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGVycm9ySGFuZGxlcnNba10gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyc1trXShlcnIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogb3V0ZGF0ZWRNb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogb3V0ZGF0ZWRNb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlcG9ydEVycm9yKGVycjIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlcG9ydEVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba10sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlcG9ydEVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG5cdFx0XHRmb3IgKHZhciBvID0gMDsgbyA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IG8rKykge1xuXHRcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tvXTtcblx0XHRcdFx0dmFyIG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aXRlbS5yZXF1aXJlKG1vZHVsZUlkKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIsIHtcblx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlOiBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG5cdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJlcG9ydEVycm9yKGVycjIpO1xuXHRcdFx0XHRcdFx0XHRcdHJlcG9ydEVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdHJlcG9ydEVycm9yKGVycik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvdXRkYXRlZE1vZHVsZXM7XG5cdFx0fVxuXHR9O1xufVxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJLnJlcXVpcmUgPSBmdW5jdGlvbiAobW9kdWxlSWQsIGFwcGx5SGFuZGxlcnMpIHtcblx0aWYgKCFjdXJyZW50VXBkYXRlKSB7XG5cdFx0Y3VycmVudFVwZGF0ZSA9IHt9O1xuXHRcdGN1cnJlbnRVcGRhdGVSdW50aW1lID0gW107XG5cdFx0Y3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MgPSBbXTtcblx0XHRhcHBseUhhbmRsZXJzLnB1c2goYXBwbHlIYW5kbGVyKTtcblx0fVxuXHRpZiAoIV9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlLCBtb2R1bGVJZCkpIHtcblx0XHRjdXJyZW50VXBkYXRlW21vZHVsZUlkXSA9IF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF07XG5cdH1cbn07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMucmVxdWlyZSA9IGZ1bmN0aW9uIChcblx0Y2h1bmtJZHMsXG5cdHJlbW92ZWRDaHVua3MsXG5cdHJlbW92ZWRNb2R1bGVzLFxuXHRwcm9taXNlcyxcblx0YXBwbHlIYW5kbGVycyxcblx0dXBkYXRlZE1vZHVsZXNMaXN0XG4pIHtcblx0YXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG5cdGN1cnJlbnRVcGRhdGVDaHVua3MgPSB7fTtcblx0Y3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MgPSByZW1vdmVkQ2h1bmtzO1xuXHRjdXJyZW50VXBkYXRlID0gcmVtb3ZlZE1vZHVsZXMucmVkdWNlKGZ1bmN0aW9uIChvYmosIGtleSkge1xuXHRcdG9ialtrZXldID0gZmFsc2U7XG5cdFx0cmV0dXJuIG9iajtcblx0fSwge30pO1xuXHRjdXJyZW50VXBkYXRlUnVudGltZSA9IFtdO1xuXHRjaHVua0lkcy5mb3JFYWNoKGZ1bmN0aW9uIChjaHVua0lkKSB7XG5cdFx0aWYgKFxuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiZcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkXG5cdFx0KSB7XG5cdFx0XHRwcm9taXNlcy5wdXNoKGxvYWRVcGRhdGVDaHVuayhjaHVua0lkLCB1cGRhdGVkTW9kdWxlc0xpc3QpKTtcblx0XHRcdGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSB0cnVlO1xuXHRcdH1cblx0fSk7XG5cdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmYpIHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmYucmVxdWlyZUhtciA9IGZ1bmN0aW9uIChjaHVua0lkLCBwcm9taXNlcykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzICYmXG5cdFx0XHRcdCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZUNodW5rcywgY2h1bmtJZCkgJiZcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiZcblx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSB1bmRlZmluZWRcblx0XHRcdCkge1xuXHRcdFx0XHRwcm9taXNlcy5wdXNoKGxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSk7XG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn07XG5cbl9fd2VicGFja19yZXF1aXJlX18uaG1yTSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcmVxdWlyZShcIi4vXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckYoKSk7XG5cdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikgeyBpZihlcnIuY29kZSAhPT0gXCJNT0RVTEVfTk9UX0ZPVU5EXCIpIHRocm93IGVycjsgfSk7XG59IiwiIiwiLy8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzPzEwMDBcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9