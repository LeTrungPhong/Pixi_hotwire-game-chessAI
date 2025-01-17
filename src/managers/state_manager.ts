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

        if (this.move == undefined && this.boardState[indexX][indexY].piece != null) {
            const rect = new Graphics();
            rect.lineStyle(2, 0x000000);
            rect.drawRect(this.boardState[indexX][indexY].post.x - widthItem / 2, this.boardState[indexX][indexY].post.y - widthItem / 2, widthItem, widthItem);
            this.boardState[indexX][indexY].focus = rect;
            this.addChild(rect);
            this.move = { indexX: indexX, indexY: indexY };
        } else {
            if (this.boardState[indexX][indexY].focus != null) {
                this.movePiece();
            }
            this.move = undefined;
        }
    }

    public movePiece() {

    }
}