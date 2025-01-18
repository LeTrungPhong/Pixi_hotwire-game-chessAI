import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Knight extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(name, value, moved, scaleScene, texture);
    }

    public override move(boardState: any, startX: number, startY: number): { indexX: number; indexY: number; }[] {
        boardState
        startX
        startY
        const validMoves: { indexX: number; indexY: number }[] = [];
        validMoves


        return validMoves;
    }
}

// hoang