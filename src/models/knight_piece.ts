import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Knight extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(name, value, moved, scaleScene, texture);
    }

    public override move(boardState: any, startY: number, startX: number): { indexX: number; indexY: number; }[] {
        var positiveMove: {
            indexX: number;indexY: number;
        } [] = [];
        const moves = [
            [-2, 1],
            [-1, 2],
            [1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [-1, -2],
            [-2, -1],
          ];
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const x = startX + move[0];
            const y = startY + move[1];
            if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                if (boardState[y][x].piece == null || boardState[y][x].piece.getValue() * this.getValue() < 0) {
                    // console.log(y+""+x+""+boardState[y][x].piece);
                    positiveMove.push({
                        indexX: y,
                        indexY: x
                    });
                }
            }
        }
    return positiveMove;
    }

    public override cloneObject(): Piece {
        const newObject: Knight = new Knight("", this.getValue(), this.moved, 0, undefined);
        newObject.x = this.x;
        newObject.y = this.y;
        return newObject
    }
}

// hoang