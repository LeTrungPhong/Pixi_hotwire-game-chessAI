import { Application, Container, Graphics } from "pixi.js";
import { borderBoard, widthBoard, widthItem } from "../common";
import Piece from "../models/piece_abstract";
import { app } from "../index";
import SoundManager from "./sound_manager";

export default class StateManager extends Container {
    private static instance: StateManager;
    public boardState: {
        post: { x: number; y: number; name: string };
        piece: Piece | null;
        focus: Graphics | null;
    }[][];
    public moveBack: {
        start: { indexX: number; indexY: number };
        end: { indexX: number; indexY: number };
        piece: Piece | null;
    }[] = [];
    private move?: { indexX: number; indexY: number };
    private moveAI?: {
        start: { indexX: number; indexY: number };
        end: { indexX: number; indexY: number };
    };
    public whiteKing?: { indexX: number; indexY: number };
    public blackKing?: { indexX: number; indexY: number };
    public moveValid: { indexX: number; indexY: number }[] = [];
    private app: Application<HTMLCanvasElement>;
    private interpolation: {
        piece: Piece;
        start: { x: number; y: number };
        end: { x: number; y: number };
        duration: number;
        time: number;
        check: boolean;
    }[] = [];
    public booleanState: boolean = true;
    public level: number = 2;

    private pawnEvalWhite = [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0,
        5.0, 5.0, 1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0, 0.5, 0.5, 1.0, 2.5,
        2.5, 1.0, 0.5, 0.5, 0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0, 0.5, -0.5,
        -1.0, 0.0, 0.0, -1.0, -0.5, 0.5, 0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0,
        0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ];
    private knightEval = [
        -5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0, -4.0, -2.0, 0.0, 0.0,
        0.0, 0.0, -2.0, -4.0, -3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0, -3.0,
        0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0, -3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0,
        -3.0, -3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0, -4.0, -2.0, 0.0, 0.5,
        0.5, 0.0, -2.0, -4.0, -5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0,
    ];
    private bishopEvalWhite = [
        -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0, -1.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, -1.0, -1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0, -1.0,
        0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0, -1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
        -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, -1.0, -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0,
    ];
    private rookEvalWhite = [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5, -0.5, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5, -0.5,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        -0.5, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0,
    ];
    private kingEvalWhite = [
        -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0, -3.0, -4.0, -4.0, -5.0,
        -5.0, -4.0, -4.0, -3.0, -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0,
        -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0, -2.0, -3.0, -3.0, -4.0,
        -4.0, -3.0, -3.0, -2.0, -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0,
        2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0, 2.0, 3.0, 1.0, 0.0, 0.0, 1.0,
        3.0, 2.0,
    ];
    private evalQueen = [
        -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0, -1.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, -1.0, -1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0, -0.5,
        0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0,
        -0.5, -1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0, -1.0, 0.0, 0.5, 0.0,
        0.0, 0.0, 0.0, -1.0, -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0,
    ];

    public pawnEvalBlack: number[] = [];
    public bishopEvalBlack: number[] = [];
    public rookEvalBlack: number[] = [];
    public kingEvalBlack: number[] = [];

    constructor() {
        super();
        this.app = app;
        const widthItem = (widthBoard - borderBoard * 2) / 8;

        this.boardState = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => ({
                post: {
                    x: col * widthItem + borderBoard + widthItem / 2,
                    y: row * widthItem + borderBoard + widthItem / 2,
                    name: `${String.fromCharCode(97 + col)}${8 - row}`,
                },
                piece: null,
                focus: null,
            }))
        );

        this.pawnEvalBlack = this.reverseArray(this.pawnEvalWhite);
        this.bishopEvalBlack = this.reverseArray(this.bishopEvalWhite);
        this.rookEvalBlack = this.reverseArray(this.rookEvalWhite);
        this.kingEvalBlack = this.reverseArray(this.kingEvalWhite);

        this.sortableChildren = true;
    }

    // func lay danh sách bên trắng, bên đen (turn) => quân cờ // trung
    // minimax // phong, duc, trung
    // func gia lap (board state, quan co dang xet) => danh sach ban co moi // trung
    // func cap nhat lai trang thai (board state)

    public update(deltaTime: number) {
        // console.log(this.interpolation)
        this.interpolation.forEach((item) => {
            // console.log("Check inter")
            item.time += deltaTime;
            let t = Math.min(item.time / item.duration, 1);

            item.piece.x = this.lerp(item.start.x, item.end.x, t);
            item.piece.y = this.lerp(item.start.y, item.end.y, t);

            if (t == 1) {
                item.check = false;
            }
        });

        for (let i: number = 0; i < this.interpolation.length; ++i) {
            if (this.interpolation[i].check == false) {
                this.interpolation.splice(i, 1);
            }
            // console.log(this.interpolation[i] + " " + deltaTime)
        }
    }

    public lerp(start: number, end: number, t: number) {
        return start + (end - start) * t;
    }

    public addState(row: number, column: number, piece: Piece) {
        this.boardState[row][column].piece = piece;
        piece.zIndex = 2;
        this.addChild(piece);
    }

    public setPost(
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][]
    ) {
        boardState.forEach((row) => {
            row.forEach((item) => {
                if (item && item.piece) {
                    item.piece.x = item.post.x;
                    item.piece.y = item.post.y;
                }
            });
        });
    }

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    public setLevel(level: number) {
        this.level = level;
    }

    public updateFocus(indexX: number, indexY: number) {
        if (this.booleanState) {
            if (
                this.move == undefined &&
                indexX >= 0 &&
                indexX < this.boardState.length &&
                indexY >= 0 &&
                indexY < this.boardState[indexX]?.length &&
                this.boardState[indexX]?.[indexY]?.piece != null
            ) {
                const piece = this.boardState[indexX][indexY].piece;
                if (piece && piece.getValue() > 0) {
                    this.boardState.forEach((row) => {
                        row.forEach((item) => {
                            if (item.focus) {
                                this.removeChild(item.focus);
                                item.focus = null;
                            }
                        });
                    });
                    const rect = new Graphics();
                    rect.beginFill(0xff0000, 0.4);
                    rect.drawRect(
                        this.boardState[indexX][indexY].post.x - widthItem / 2,
                        this.boardState[indexX][indexY].post.y - widthItem / 2,
                        widthItem,
                        widthItem
                    );
                    rect.endFill();
                    this.boardState[indexX][indexY].focus = rect;
                    this.addChild(rect);

                    if (piece) {
                        const listMovePiece = piece.move(
                            this.boardState,
                            indexX,
                            indexY
                        );
                        this.moveValid = listMovePiece;
                        // console.log(listMovePiece);

                        listMovePiece.forEach((item) => {
                            const indexX = item?.indexX;
                            const indexY = item?.indexY;
                            if (indexX != null && indexY != null) {
                                const rect = new Graphics();
                                rect.beginFill(0xff0000, 0.4);
                                rect.drawRect(
                                    this.boardState[indexX][indexY].post.x -
                                        widthItem / 2,
                                    this.boardState[indexX][indexY].post.y -
                                        widthItem / 2,
                                    widthItem,
                                    widthItem
                                );
                                rect.endFill();
                                this.boardState[indexX][indexY].focus = rect;
                                this.addChild(rect);
                            }
                        });
                    }

                    this.move = { indexX: indexX, indexY: indexY };
                }
            } else {
                if (
                    (indexX !== this.move?.indexX ||
                        indexY !== this.move?.indexY) &&
                    this.move != undefined
                ) {
                    // InputController.getInstance(0).removeMouseDownEvent();
                    const focus = this.boardState[indexX][indexY].focus;
                    if (focus) {
                        this.movePiece(
                            this.boardState,
                            this.move,
                            indexX,
                            indexY
                        );
                        this.app.renderer.render(this.app.stage); // check
                        // console.log("Check player move")
                        setTimeout(() => {
                            const boardStateCopy = this.copyBoardState(
                                this.boardState
                            );
                            // console.log(boardStateCopy)
                            this.setPost(boardStateCopy);
                            console.log(
                                this.minimax(
                                    boardStateCopy,
                                    100000,
                                    -100000,
                                    this.level,
                                    this.level,
                                    true
                                )
                            );
                            setTimeout(() => {
                                this.movePiece(
                                    this.boardState,
                                    this.moveAI?.start,
                                    this.moveAI?.end.indexX || 0,
                                    this.moveAI?.end.indexY || 0
                                );
                            }, 500);
                            this.app.renderer.render(this.app.stage); // check
                        }, 500);
                    }
                }
                this.boardState.forEach((row) => {
                    row.forEach((item) => {
                        if (item.focus) {
                            this.removeChild(item.focus);
                            item.focus = null;
                        }
                    });
                });

                this.move = undefined;
            }
        }
    }

    public movePiece(
        boardState: any,
        move: { indexX: number; indexY: number } | undefined,
        destX: number,
        destY: number
    ) {
        const startX = move?.indexX;
        const startY = move?.indexY;

        // Kiểm tra nếu tọa độ ban đầu và tọa độ đích hợp lệ
        if (
            startX === undefined ||
            startY === undefined ||
            (destX === startX && destY === startY)
        )
            return;

        const piece = boardState[startX][startY]?.piece;

        // Kiểm tra nếu có quân cờ tại vị trí ban đầu
        if (!piece) return;

        const validMoves: { indexX: number; indexY: number }[] = piece.move(
            boardState,
            startX,
            startY
        );

        // Kiểm tra nước đi có hợp lệ không
        const isValidMove = validMoves.some(
            (move) => move.indexX === destX && move.indexY === destY
        );

        // Kiểm tra nước đi có hợp lệ không
        if (!isValidMove) {
            console.log(`Invalid move to (${destX}, ${destY})`);
            return;
        }

        const capturedPiece = boardState[destX][destY]?.piece;

        // Xử lý trường hợp nhập thành
        if (capturedPiece && capturedPiece.getValue() * piece.getValue() > 0) {
            let moveOffset = 0;
            let rookOffset = 0;

            if (Math.abs(piece.getValue()) === 50) {
                // Quân xe nhập thành
                moveOffset = startY > destY ? 2 : -2;
                rookOffset = startY > destY ? -1 : 1;
                boardState[destX][destY + moveOffset].piece = capturedPiece;
                boardState[startX][destY + moveOffset + rookOffset].piece =
                    piece;

                this.interpolation.push({
                    piece: piece,
                    start: {
                        x: boardState[startX][startY].post.x,
                        y: boardState[startX][startY].post.y,
                    },
                    end: {
                        x: boardState[startX][destY + moveOffset + rookOffset]
                            .post.x,
                        y: boardState[startX][destY + moveOffset + rookOffset]
                            .post.y,
                    },
                    duration: 0.5,
                    time: 0,
                    check: true,
                });

                this.interpolation.push({
                    piece: capturedPiece,
                    start: {
                        x: boardState[destX][destY].post.x,
                        y: boardState[destX][destY].post.y,
                    },
                    end: {
                        x: boardState[startX][destY + moveOffset].post.x,
                        y: boardState[startX][destY + moveOffset].post.y,
                    },
                    duration: 0.5,
                    time: 0,
                    check: true,
                });
            } else {
                // Quân vua nhập thành
                moveOffset = startY > destY ? -2 : 2;
                rookOffset = startY > destY ? 1 : -1;
                boardState[destX][startY + moveOffset].piece = piece;
                boardState[startX][startY + moveOffset + rookOffset].piece =
                    capturedPiece;

                this.interpolation.push({
                    piece: piece,
                    start: {
                        x: boardState[startX][startY].post.x,
                        y: boardState[startX][startY].post.y,
                    },
                    end: {
                        x: boardState[destX][startY + moveOffset].post.x,
                        y: boardState[destX][startY + moveOffset].post.y,
                    },
                    duration: 0.5,
                    time: 0,
                    check: true,
                });

                this.interpolation.push({
                    piece: capturedPiece,
                    start: {
                        x: boardState[destX][destY].post.x,
                        y: boardState[destX][destY].post.y,
                    },
                    end: {
                        x: boardState[startX][startY + moveOffset + rookOffset]
                            .post.x,
                        y: boardState[startX][startY + moveOffset + rookOffset]
                            .post.y,
                    },
                    duration: 0.5,
                    time: 0,
                    check: true,
                });
            }
            boardState[startX][startY].piece = null;
            boardState[destX][destY].piece = null;
        } else {
            // Xử lý việc ăn quân hoặc di chuyển bình thường
            if (capturedPiece) {
                this.removeChild(capturedPiece);
            }
            this.moveBack.push({
                start: { indexX: startX, indexY: startY },
                end: { indexX: destX, indexY: destY },
                piece: boardState[destX][destY].piece,
            });
            boardState[startX][startY].piece = null;
            boardState[destX][destY].piece = piece;
            console.log(this.moveBack);

            this.interpolation.push({
                piece: piece,
                start: {
                    x: boardState[startX][startY].post.x,
                    y: boardState[startX][startY].post.y,
                },
                end: {
                    x: boardState[destX][destY].post.x,
                    y: boardState[destX][destY].post.y,
                },
                duration: 0.5,
                time: 0,
                check: true,
            });
        }
        SoundManager.getInstance().playMoveSound();
        piece.setMoved(true);

        // this.setPost(boardState);

        if (piece.getValue() == 900) {
            this.whiteKing = { indexX: destX, indexY: destY };
        } else if (piece.getValue() == -900) {
            this.blackKing = { indexX: destX, indexY: destY };
        }

        if (
            this.isKingInCheck({ indexX: 0, indexY: 4 }, false, this.boardState)
        ) {
            console.log("Black king is in check");
        }
        if (this.checkMate({ indexX: 0, indexY: 4 }, false, this.boardState)) {
            console.log("Black king is in checkmate");
        }
        // Reset trạng thái nước đi
        this.move = undefined;
    }

    public back(number: number, time: number) {
        if (this.moveBack && number > 0) {
            const move = this.moveBack.pop();
            if (move) {
                const piece =
                    this.boardState[move.end.indexX][move.end.indexY].piece;
                if (piece) {
                    this.boardState[move.start.indexX][
                        move.start.indexY
                    ].piece = piece;
                    this.boardState[move.end.indexX][move.end.indexY].piece =
                        null;
                    if (move.piece) {
                        this.boardState[move.end.indexX][
                            move.end.indexY
                        ].piece = move.piece;
                        this.addChild(move.piece);
                    }
                    this.interpolation.push({
                        piece: piece,
                        start: {
                            x: this.boardState[move.end.indexX][move.end.indexY]
                                .post.x,
                            y: this.boardState[move.end.indexX][move.end.indexY]
                                .post.y,
                        },
                        end: {
                            x: this.boardState[move.start.indexX][
                                move.start.indexY
                            ].post.x,
                            y: this.boardState[move.start.indexX][
                                move.start.indexY
                            ].post.y,
                        },
                        duration: 0.5,
                        time: 0,
                        check: true,
                    });

                    if (this.moveBack) {
                        const moveLast =
                            this.moveBack[this.moveBack.length - 1];
                        if (moveLast) {
                            const pieceLast =
                                this.boardState[moveLast.end.indexX][
                                    moveLast.end.indexY
                                ].piece;
                            if (pieceLast) {
                                if (
                                    pieceLast.getValue() * piece.getValue() <
                                    0
                                ) {
                                    number--;
                                }
                                setTimeout(
                                    () => this.back(number, time),
                                    time + 200
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    public movePieceAI(
        boardState: any,
        move: { indexX: number; indexY: number } | undefined,
        destX: number,
        destY: number
    ) {
        const startX = move?.indexX;
        const startY = move?.indexY;

        // Kiểm tra nếu tọa độ ban đầu và tọa độ đích hợp lệ
        if (
            startX === undefined ||
            startY === undefined ||
            (destX === startX && destY === startY)
        )
            return;

        const piece = boardState[startX][startY]?.piece;

        // Kiểm tra nếu có quân cờ tại vị trí ban đầu
        if (!piece) return;

        const validMoves: { indexX: number; indexY: number }[] = piece.move(
            boardState,
            startX,
            startY
        );

        // Kiểm tra nước đi có hợp lệ không
        const isValidMove = validMoves.some(
            (move) => move.indexX === destX && move.indexY === destY
        );

        // Kiểm tra nước đi có hợp lệ không
        if (!isValidMove) {
            this.show(boardState);
            console.log(piece.getValue() + ` ${startX} ${startY}`);
            console.log(`Invalid move to (${destX}, ${destY})`);
            return;
        }

        const capturedPiece = boardState[destX][destY]?.piece;

        // Xử lý trường hợp nhập thành
        if (capturedPiece && capturedPiece.getValue() * piece.getValue() > 0) {
            let moveOffset = 0;
            let rookOffset = 0;

            if (Math.abs(piece.getValue()) === 50) {
                // Quân xe nhập thành
                moveOffset = startY > destY ? 2 : -2;
                rookOffset = startY > destY ? -1 : 1;
                boardState[destX][destY + moveOffset].piece = capturedPiece;
                boardState[startX][destY + moveOffset + rookOffset].piece =
                    piece;
            } else {
                // Quân vua nhập thành
                moveOffset = startY > destY ? -2 : 2;
                rookOffset = startY > destY ? 1 : -1;
                boardState[destX][startY + moveOffset].piece = piece;
                boardState[startX][startY + moveOffset + rookOffset].piece =
                    capturedPiece;
            }
            boardState[startX][startY].piece = null;
            boardState[destX][destY].piece = null;
        } else {
            // Xử lý việc ăn quân hoặc di chuyển bình thường
            // if (capturedPiece) {
            //   this.removeChild(capturedPiece);
            // }
            boardState[destX][destY].piece = piece;
            boardState[startX][startY].piece = null;
        }
        piece.setMoved(true);

        this.setPost(boardState);
        // Reset trạng thái nước đi
        move = undefined;
    }

    public show(
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][]
    ) {
        /*
            THIS METHOD IS UTILIZED TO SHOW BOARD STATE

                r n b q k b n r 
                p p p p p p p p
                _ _ _ _ _ _ _ _
                _ _ _ _ _ _ _ _
                _ _ _ _ _ _ _ _
                _ _ _ _ _ _ _ _
                P P P P P P P P
                R N B Q K B N R 

        */
        boardState.forEach((row) => {
            let rowString = "";
            row.forEach((col) => {
                let pieceChar = "_";
                switch (col.piece?.getValue()) {
                    case 10:
                        pieceChar = "P";
                        break;
                    case 30:
                        pieceChar = "N";
                        break;
                    case 45:
                        pieceChar = "B";
                        break;
                    case 50:
                        pieceChar = "R";
                        break;
                    case 90:
                        pieceChar = "Q";
                        break;
                    case 900:
                        pieceChar = "K";
                        break;
                    case -10:
                        pieceChar = "p";
                        break;
                    case -30:
                        pieceChar = "n";
                        break;
                    case -45:
                        pieceChar = "b";
                        break;
                    case -50:
                        pieceChar = "r";
                        break;
                    case -90:
                        pieceChar = "q";
                        break;
                    case -900:
                        pieceChar = "k";
                        break;
                }
                rowString += pieceChar + " ";
            });
            console.log(rowString);
        });
    }

    public getPositiveMoveAt(
        X: number,
        Y: number
    ): { indexX: number; indexY: number }[] {
        const myPiece: any = this.boardState[Y][X].piece;

        const myPieceValue: number = myPiece?.getValue() ?? 0;

        const positiveMove: { indexX: number; indexY: number }[] = [];

        console.log(myPieceValue);

        if (!myPieceValue) {
            return positiveMove;
        }

        switch (Math.abs(myPieceValue)) {
            case 45:
                positiveMove.push(...myPiece.move(this.boardState, Y, X));
                break;

            default:
                break;
        }

        return positiveMove;
    }

    public reverseArray(array: number[]) {
        return array.slice().reverse();
    }

    public valueCal(
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][]
    ): number {
        let sum: number = 0;
        boardState.forEach((row, indexX) => {
            row.forEach((item, indexY) => {
                if (item.piece) {
                    const index = 8 * indexX + indexY;
                    let score = 0;
                    switch (item.piece.getValue()) {
                        case 10:
                            score = this.pawnEvalWhite[index];
                            break;
                        case 30:
                            score = this.knightEval[index];
                            break;
                        case 45:
                            score = this.bishopEvalWhite[index];
                            break;
                        case 50:
                            score = this.rookEvalWhite[index];
                            break;
                        case 90:
                            score = this.evalQueen[index];
                            break;
                        case 900:
                            score = this.kingEvalWhite[index];
                            break;
                        case -10:
                            score = -this.pawnEvalBlack[index];
                            break;
                        case -30:
                            score = -this.knightEval[index];
                            break;
                        case -45:
                            score = -this.bishopEvalBlack[index];
                            break;
                        case -50:
                            score = -this.rookEvalBlack[index];
                            break;
                        case -90:
                            score = -this.evalQueen[index];
                            break;
                        case -900:
                            score = -this.kingEvalBlack[index];
                            break;
                        default:
                            break;
                    }
                    sum += item.piece.getValue() + score;
                }
            });
        });
        return sum;
    }
    // (boardstate, quan trang, quan den, do sau, luot, )

    // (!) copy boardState -> computer, player
    public minimax(
        boardState: any,
        anpha: number,
        beta: number,
        depth: number,
        selectDepth: number,
        turn: boolean
    ): number {
        let checkKingComputer: boolean = false;
        let checkKingPlayer: boolean = false;
        const computer: Piece[] = [];
        const player: Piece[] = [];
        this.copyListPiece(boardState, computer, player);
        // check king computer
        computer.forEach((item) => {
            if (item.getValue() == -900) {
                checkKingComputer = true;
            }
        });
        // check king player
        player.forEach((item) => {
            if (item.getValue() == 900) {
                checkKingPlayer = true;
            }
        });

        if (
            depth == 0 ||
            checkKingComputer == false ||
            checkKingPlayer == false
        ) {
            console.log(1);
            return this.valueCal(boardState);
        }

        // turn computer
        if (turn) {
            const boardStateCopy = this.copyBoardState(boardState);

            if (depth >= 2) {
                const mapMinimax = this.minimaxDepth2(
                    boardStateCopy,
                    100000,
                    -100000,
                    2,
                    2,
                    true
                );

                mapMinimax.sort((a: any, b: any) => a.score - b.score);

                for (let i: number = 0; i < mapMinimax.length; ++i) {
                    const boardStateCopy = this.copyBoardState(boardState);
                    const playerCopy: Piece[] = [];
                    const computerCopy: Piece[] = [];
                    this.copyListPiece(
                        boardStateCopy,
                        computerCopy,
                        playerCopy
                    );
                    this.movePieceAI(
                        boardStateCopy,
                        {
                            indexX: mapMinimax[i].post.indexX,
                            indexY: mapMinimax[i].post.indexY,
                        },
                        mapMinimax[i].move.indexX,
                        mapMinimax[i].move.indexY
                    );

                    const scoreNew: number = this.minimax(
                        boardStateCopy,
                        anpha,
                        beta,
                        depth - 1,
                        selectDepth,
                        false
                    );
                    if (anpha > scoreNew) {
                        anpha = scoreNew;

                        if (depth == selectDepth) {
                            this.moveAI = {
                                start: {
                                    indexX: mapMinimax[i].post.indexX,
                                    indexY: mapMinimax[i].post.indexY,
                                },
                                end: {
                                    indexX: mapMinimax[i].move.indexX,
                                    indexY: mapMinimax[i].move.indexY,
                                },
                            };
                        }
                    }

                    if (anpha <= beta) {
                        return anpha;
                    }
                }
                return anpha;
            } else {
                console.log(1);
                return this.minimaxDepth2(
                    boardStateCopy,
                    100000,
                    -100000,
                    1,
                    1,
                    true
                );
            }
        } else {
            const boardStateCopy = this.copyBoardState(boardState);

            if (depth >= 2) {
                const mapMinimax = this.minimaxDepth2(
                    boardStateCopy,
                    100000,
                    -100000,
                    2,
                    2,
                    false
                );

                mapMinimax.sort((a: any, b: any) => b.score - a.score);

                for (let i: number = 0; i < mapMinimax.length; ++i) {
                    const boardStateCopy = this.copyBoardState(boardState);
                    const playerCopy: Piece[] = [];
                    const computerCopy: Piece[] = [];
                    this.copyListPiece(
                        boardStateCopy,
                        computerCopy,
                        playerCopy
                    );
                    this.movePieceAI(
                        boardStateCopy,
                        {
                            indexX: mapMinimax[i].post.indexX,
                            indexY: mapMinimax[i].post.indexY,
                        },
                        mapMinimax[i].move.indexX,
                        mapMinimax[i].move.indexY
                    );

                    const scoreNew: number = this.minimax(
                        boardStateCopy,
                        anpha,
                        beta,
                        depth - 1,
                        selectDepth,
                        true
                    );

                    if (beta < scoreNew) {
                        beta = scoreNew;
                    }

                    if (anpha <= beta) {
                        return beta;
                    }
                }

                return beta;
            } else {
                console.log(1);
                return this.minimaxDepth2(
                    boardStateCopy,
                    100000,
                    -100000,
                    1,
                    1,
                    false
                );
            }
        }
    }

    public minimaxDepth2(
        boardState: any,
        anpha: number,
        beta: number,
        depth: number,
        selectDepth: number,
        turn: boolean
    ): any {
        const mapMinimax: {
            score: number;
            piece: Piece;
            post: {
                indexX: number;
                indexY: number;
            };
            move: {
                indexX: number;
                indexY: number;
            };
        }[] = [];

        let checkKingComputer: boolean = false;
        let checkKingPlayer: boolean = false;
        const computer: Piece[] = [];
        const player: Piece[] = [];
        this.copyListPiece(boardState, computer, player);
        // check king computer
        computer.forEach((item) => {
            if (item.getValue() == -900) {
                checkKingComputer = true;
            }
        });
        // check king player
        player.forEach((item) => {
            if (item.getValue() == 900) {
                checkKingPlayer = true;
            }
        });

        if (
            depth == 0 ||
            checkKingComputer == false ||
            checkKingPlayer == false
        ) {
            return this.valueCal(boardState);
        }

        // turn computer
        if (turn) {
            for (let i: number = 0; i < computer.length; ++i) {
                const indexX = Math.floor(
                    (computer[i].y - borderBoard) / widthItem
                );
                const indexY = Math.floor(
                    (computer[i].x - borderBoard) / widthItem
                );
                const validMove = computer[i].move(boardState, indexX, indexY);

                for (let j: number = 0; j < validMove.length; ++j) {
                    const boardStateCopy = this.copyBoardState(boardState);
                    const playerCopy: Piece[] = [];
                    const computerCopy: Piece[] = [];
                    this.copyListPiece(
                        boardStateCopy,
                        computerCopy,
                        playerCopy
                    );
                    this.movePieceAI(
                        boardStateCopy,
                        { indexX: indexX, indexY: indexY },
                        validMove[j].indexX,
                        validMove[j].indexY
                    );

                    const scoreNew: number = this.minimaxDepth2(
                        boardStateCopy,
                        anpha,
                        beta,
                        depth - 1,
                        selectDepth,
                        false
                    );

                    if (depth == 2) {
                        mapMinimax.push({
                            score: scoreNew,
                            piece: computer[i],
                            post: {
                                indexX,
                                indexY,
                            },
                            move: {
                                indexX: validMove[j].indexX,
                                indexY: validMove[j].indexY,
                            },
                        });
                    }

                    if (anpha > scoreNew) {
                        anpha = scoreNew;
                    }

                    if (anpha <= beta) {
                        return anpha;
                    }
                }
            }
            if (depth == 2) {
                return mapMinimax;
            } else {
                return anpha;
            }
        } else {
            for (let i: number = 0; i < player.length; ++i) {
                const indexX = Math.floor(
                    (player[i].y - borderBoard) / widthItem
                );
                const indexY = Math.floor(
                    (player[i].x - borderBoard) / widthItem
                );
                const validMove = player[i].move(boardState, indexX, indexY);

                for (let j: number = 0; j < validMove.length; ++j) {
                    const boardStateCopy = this.copyBoardState(boardState);
                    const playerCopy: Piece[] = [];
                    const computerCopy: Piece[] = [];
                    this.copyListPiece(
                        boardStateCopy,
                        computerCopy,
                        playerCopy
                    );
                    this.movePieceAI(
                        boardStateCopy,
                        { indexX: indexX, indexY: indexY },
                        validMove[j].indexX,
                        validMove[j].indexY
                    );

                    const scoreNew: number = this.minimaxDepth2(
                        boardStateCopy,
                        anpha,
                        beta,
                        depth - 1,
                        selectDepth,
                        true
                    );
                    beta = Math.max(beta, scoreNew);

                    if (depth == 2) {
                        mapMinimax.push({
                            score: scoreNew,
                            piece: computer[i],
                            post: {
                                indexX,
                                indexY,
                            },
                            move: {
                                indexX: validMove[j].indexX,
                                indexY: validMove[j].indexY,
                            },
                        });
                    }

                    if (beta < scoreNew) {
                        beta = scoreNew;
                    }

                    if (anpha <= beta) {
                        return beta;
                    }
                }
            }
            if (depth == 2) {
                return mapMinimax;
            } else {
                return beta;
            }
        }
    }

    public parstLocateArray(
        postX: number,
        postY: number
    ): { indexX: number; indexY: number } {
        const indexX = Math.floor((postY - borderBoard) / widthItem);
        const indexY = Math.floor((postX - borderBoard) / widthItem);

        return { indexX: indexX, indexY: indexY };
    }

    public getAllPosibleMove(
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][],
        isWhiteTurn: boolean,
        KingPosition: { indexX: number; indexY: number }
    ): { indexX: number; indexY: number }[] {
        if (isWhiteTurn) {
            return boardState
                .filter((row) =>
                    row.some((item) => item.piece && item.piece.getValue() > 0)
                )
                .flatMap((row) =>
                    row.flatMap((item) => {
                        if (item.piece) {
                            const position = this.parstLocateArray(
                                item.post.x,
                                item.post.y
                            );
                            var legalMove = item.piece.move(
                                boardState,
                                position.indexX,
                                position.indexY
                            );
                            legalMove = this.isMoveValidAgainstCheck(
                                legalMove,
                                position,
                                isWhiteTurn,
                                KingPosition
                            );
                            return legalMove;
                        }
                        return [];
                    })
                );
        } else {
            return boardState
                .filter((row) =>
                    row.some((item) => item.piece && item.piece.getValue() < 0)
                )
                .flatMap((row) =>
                    row.flatMap((item) => {
                        if (item.piece && item.piece.getValue() < 0) {
                            const position = this.parstLocateArray(
                                item.post.x,
                                item.post.y
                            );
                            // console.log("begin");
                            var legalMove = item.piece.move(
                                boardState,
                                position.indexX,
                                position.indexY
                            );
                            // console.log(legalMove);
                            // console.log("end");
                            legalMove = this.isMoveValidAgainstCheck(
                                legalMove,
                                position,
                                isWhiteTurn,
                                KingPosition
                            );
                            // console.log("end2");
                            // console.log(legalMove);
                            return legalMove;
                        }
                        return [];
                    })
                );
        }
    }

    public copyBoardState(
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][]
    ) {
        const boardStateCopy: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][] = Array.from({ length: boardState.length }, (_, row) =>
            Array.from({ length: boardState[row].length }, (_, col) => {
                const currentCell = boardState[row][col];
                const clonedPiece = currentCell.piece
                    ? currentCell.piece.cloneObject()
                    : null;
                return {
                    post: { ...currentCell.post },
                    piece: clonedPiece,
                    focus: null,
                };
            })
        );

        return boardStateCopy;
    }

    public isMoveValidAgainstCheck(
        legalMove: { indexX: number; indexY: number }[],
        startPosition: { indexX: number; indexY: number },
        isWhiteTurn: boolean,
        KingPosition: { indexX: number; indexY: number }
    ): { indexX: number; indexY: number }[] {
        const validMoves: { indexX: number; indexY: number }[] = [];
        legalMove.forEach((item) => {
            let piece =
                this.boardState[startPosition.indexX][startPosition.indexY]
                    .piece;
            let pieceCp = this.boardState[item.indexX][item.indexY].piece;
            this.boardState[startPosition.indexX][startPosition.indexY].piece =
                null;
            this.boardState[item.indexX][item.indexY].piece = piece;
            if (
                this.isKingInCheck(KingPosition, isWhiteTurn, this.boardState)
            ) {
                console.log(
                    "Check at: " +
                        this.boardState[item.indexX][
                            item.indexY
                        ].piece?.getValue()
                );
                console.log(piece);
                console.log(item.indexX, item.indexY);
            } else {
                validMoves.push(item);
            }
            this.boardState[startPosition.indexX][startPosition.indexY].piece =
                piece;
            this.boardState[item.indexX][item.indexY].piece = pieceCp;
        });
        return validMoves;
    }

    public isKingInCheck(
        KingPosition: { indexX: number; indexY: number },
        isWhiteKing: boolean,
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][]
    ): boolean {
        if (isWhiteKing) {
            return boardState.some((row) =>
                row.some((item) => {
                    var position = this.parstLocateArray(
                        item.post.x,
                        item.post.y
                    );
                    if (
                        item.piece &&
                        item.piece.getValue() < 0 &&
                        this.canPieceAttackKing(
                            KingPosition,
                            boardState,
                            position
                        )
                    ) {
                        return true;
                    }
                    return false;
                })
            );
        } else {
            return boardState.some((row) =>
                row.some((item) => {
                    var position = this.parstLocateArray(
                        item.post.x,
                        item.post.y
                    );
                    if (
                        item.piece &&
                        item.piece.getValue() > 0 &&
                        this.canPieceAttackKing(
                            KingPosition,
                            boardState,
                            position
                        )
                    ) {
                        return true;
                    }
                    return false;
                })
            );
        }
    }

    // Hàm kiểm tra nếu một quân cờ có thể tấn công vua hay không
    public canPieceAttackKing(
        KingPosition: { indexX: number; indexY: number },
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][],
        position: { indexX: number; indexY: number }
    ): boolean {
        const possibleMoves = boardState[position.indexX][
            position.indexY
        ].piece?.move(boardState, position.indexX, position.indexY);

        return possibleMoves
            ? possibleMoves?.some(
                  (move) =>
                      move.indexX === KingPosition.indexX &&
                      move.indexY === KingPosition.indexY
              )
            : false;
    }

    public checkMate(
        KingPosition: { indexX: number; indexY: number },
        isWhiteTurn: boolean,
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][]
    ): boolean {
        // console.log(KingPosition);
        let legalMove = this.getAllPosibleMove(
            boardState,
            isWhiteTurn,
            KingPosition
        );
        // console.log(legalMove);
        if (legalMove.length == 0) {
            return true;
        }
        return false;
    }

    public copyListPiece(
        boardState: {
            post: { x: number; y: number; name: string };
            piece: Piece | null;
            focus: Graphics | null;
        }[][],
        computer: Piece[],
        player: Piece[]
    ) {
        boardState.forEach((row) => {
            row.forEach((item) => {
                if (item.piece) {
                    if (item.piece.getValue() > 0) {
                        player.push(item.piece);
                    } else {
                        computer.push(item.piece);
                    }
                }
            });
        });
    }
}
