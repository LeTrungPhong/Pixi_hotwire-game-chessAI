import { borderBoard, widthBoard } from "../common";
import Piece from "../models/piece_abstract";

export default class StateManager {
    private static instance: StateManager;
    private boardState: { post: { x: number, y: number, name: string }, piece: Piece | null }[][];

    constructor() {
        const widthItem = (widthBoard - borderBoard * 2) / 8;

        this.boardState = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => ({
                post: { x: col * widthItem + borderBoard + widthItem / 2, y: row * widthItem + borderBoard + widthItem / 2, name: `${String.fromCharCode(97 + col)}${8 - row}` },
                piece: null,
            }))
        );
    }

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

                console.log(item.post.x)
            })
        })
    }

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }
}