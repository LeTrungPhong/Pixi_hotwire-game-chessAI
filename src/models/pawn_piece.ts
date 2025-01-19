import {
    Texture
} from "pixi.js";
import Piece from "./piece_abstract";

export default class Pawn extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture ? : Texture) {
        super(name, value, moved, scaleScene, texture);
    }

    public override move(boardState: any, startY: number, startX: number): {
        indexX: number;indexY: number;
    } [] {
        var positiveMove: {
            indexX: number;indexY: number;
        } [] = [];
        var endY: number = startY;
        if (Math.abs(this.getValue()) == 10) {
            //nuoc di cua quan tot
            if (startY == 0 || startY == 7) {
                // console.log(positiveMove);
                // console.log(startY + " " + startX)
                return positiveMove;
            }
            const direction = this.getValue() > 0 ? -1 : 1;
            if (!(startY == 7 && direction == 1) && !(startY == 0 && direction == -1)) {
                endY += direction;
            }
            for (let i = -1; i <= 1; i += 2) {
                if (startX + i >= 0 && startX + i <= 7) {
                    // console.log(startY + " " + (startX))
                    if (boardState[endY][startX + i].piece != null && boardState[endY][startX + i].piece.getValue() * this.getValue() < 0) {
                        positiveMove.push({
                            indexX: endY,
                            indexY: startX + i
                        });
                    }
                }
            }
            // console.log(endY + " " + startX)
            if (boardState[endY][startX].piece == null) {
                positiveMove.push({
                    indexX: endY,
                    indexY: startX
                });
            } else {
                // console.log(positiveMove);
                // console.log(startY + " " + startX)
                return positiveMove;
            }
            if ((startY != 1 && startY != 6) || (startY == 1 && this.getValue() > 0) || (startY == 6 && this.getValue() < 0)) {
                // console.log(positiveMove);
                // console.log(startY + " " + startX)
                return positiveMove;
            }
            endY += direction;
            if (boardState[endY][startX].piece == null) {
                positiveMove.push({
                    indexX: endY,
                    indexY: startX
                });
            }
            // console.log(positiveMove);
            // console.log(startY + " " + startX)
            return positiveMove;
        } 
        console.log(positiveMove);
        console.log(startY + " " + startX)
        return positiveMove;
    }

    public override cloneObject(): Piece {
        const newObject: Pawn = new Pawn("", this.getValue(), this.moved, 0, undefined);
        newObject.x = this.x;
        newObject.y = this.y;
        return newObject
    }

    //dwidwdjwaodjaodapdaowdoajdaodadaoowoaodoawo
}

// hoang

