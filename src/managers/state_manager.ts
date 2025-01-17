import { Container, Graphics } from "pixi.js";
import { borderBoard, widthBoard, widthItem } from "../common";
import Piece from "../models/piece_abstract";

export default class StateManager extends Container {
    private static instance: StateManager;
    public boardState: { post: { x: number, y: number, name: string }, piece: Piece | null, focus: Graphics | null }[][];
    private move?: { indexX: number, indexY: number };

    constructor() {
        super();
        const widthItem = (widthBoard - borderBoard * 2) / 8;

        this.boardState = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => ({
                post: { x: col * widthItem + borderBoard + widthItem / 2, y: row * widthItem + borderBoard + widthItem / 2, name: `${String.fromCharCode(97 + col)}${8 - row}` },
                piece: null,
                focus: null
            }))
        );
    }

    // func lay danh sách bên trắng, bên đen (turn) => quân cờ // trung
    // minimax // phong, duc, trung
    // func gia lap (board state, quan co dang xet) => danh sach ban co moi // trung
    // func cap nhat lai trang thai (board state)

    public addState(row: number, column: number, piece: Piece) {
        this.boardState[row][column].piece = piece;
    }

    public setPost() {
        this.boardState.forEach((row) => {
            row.forEach((item) => {
                // const circle = new Graphics();
                // const centerX = item.post.x ;
                // const centerY = item.post.y ;

                // circle.beginFill(0xff0000); 
                // circle.lineStyle(1, 0x000000); 
                // circle.drawCircle(0, 0, 2); 

                // circle.endFill();

                // // Đặt vị trí cho circle
                // circle.x = centerX;
                // circle.y = centerY;

                // this.addChild(circle)

                if (item && item.piece) {
                    item.piece.x = item.post.x;
                    item.piece.y = item.post.y;
                }
            })
        })
    }

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    public updateFocus(indexX: number, indexY: number) {
        this.boardState.forEach((row) => {
            row.forEach((item) => {
                if (item.focus) {
                    this.removeChild(item.focus);
                    item.focus = null;
                }
            })
        });

        if (
            this.move == undefined &&
            indexX >= 0 && indexX < this.boardState.length &&
            indexY >= 0 && indexY < this.boardState[indexX]?.length &&
            this.boardState[indexX]?.[indexY]?.piece != null
        ) {

            const rect = new Graphics();
            rect.lineStyle(2, 0xFF0000);
            rect.drawRect(this.boardState[indexX][indexY].post.x - widthItem / 2, this.boardState[indexX][indexY].post.y - widthItem / 2, widthItem, widthItem);
            this.boardState[indexX][indexY].focus = rect;
            this.addChild(rect);

            const piece = this.boardState[indexX][indexY].piece;
            if (piece) {
                const listMovePiece = piece.move(this.boardState, indexX, indexY);
                listMovePiece.forEach(item => {
                    const indexX = item?.indexX;
                    const indexY = item?.indexY;
                    if (indexX != null && indexY != null) {
                        const rect = new Graphics();
                        rect.lineStyle(2, 0xFF0000);
                        rect.drawRect(this.boardState[indexX][indexY].post.x - widthItem / 2, this.boardState[indexX][indexY].post.y - widthItem / 2, widthItem, widthItem);
                        this.boardState[indexX][indexY].focus = rect;
                        this.addChild(rect);
                    }
                });
            }

            this.move = { indexX: indexX, indexY: indexY };
        } else {
            if (this.boardState[indexX][indexY].focus != null && (indexX != this.move?.indexX || indexY != this.move?.indexY)) {
                this.movePiece();
            }
            this.move = undefined;
        }
    }

    public movePiece() {
        // code move
        // code
        // ...........
    }

    public show() {
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
        this.boardState.forEach(row => {
            let rowString = "";
            row.forEach(col => {
                let pieceChar = "_";
                switch (col.piece?.getValue()) {
                    case 10: pieceChar = "P"; break;
                    case 30: pieceChar = "N"; break;
                    case 45: pieceChar = "B"; break;
                    case 50: pieceChar = "R"; break;
                    case 90: pieceChar = "Q"; break;
                    case 900: pieceChar = "K"; break;
                    case -10: pieceChar = "p"; break;
                    case -30: pieceChar = "n"; break;
                    case -45: pieceChar = "b"; break;
                    case -50: pieceChar = "r"; break;
                    case -90: pieceChar = "q"; break;
                    case -900: pieceChar = "k"; break;
                }
                rowString += pieceChar + " ";
            })
            console.log(rowString);
        })
    }


    public getPositiveMoveAt(X: number, Y: number): { indexX: number; indexY: number; }[]{
        const myPiece: any = this.boardState[Y][X].piece;

        const myPieceValue: number = myPiece?.getValue() ?? 0;

        const positiveMove: { indexX: number; indexY: number; }[] = []

        console.log(myPieceValue)

        if (!myPieceValue){
            return positiveMove;
        }

        switch (Math.abs(myPieceValue)) {
            case 45:
                positiveMove.push(...myPiece.move(this.boardState, Y, X));
                break;
        
            default:
                break;
        }

        return positiveMove

    }
}