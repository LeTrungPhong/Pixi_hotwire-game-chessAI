import { Texture } from "pixi.js";
import Piece from "./piece_abstract";
import Queen from "./queen_piece";

export default class Pawn extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(name, value, moved, scaleScene, texture);
    }

    public override move(boardState: any, startX: number, startY: number): { indexX: number; indexY: number; }[] {
        var positiveMove: { indexX: number; indexY: number; }[] = [];
        var endY: number = startY;
        if (Math.abs(this.getValue()) == 10){
            //nuoc di cua quan tot
            const direction = this.getValue() > 0 ? 1 : -1;
            if (!(startY==7&&direction==1)&&!(startY==0&&direction==-1)){
                endY += direction;
            }
            for (let i=-1 ; i<=1 ; i+=2){
                if (startX+i>=0 && startX+i<=7){
                    if (boardState[endY][startX+i] != null && boardState[endY][startX+i].getValue()*this.getValue()<0){
                        positiveMove.push({indexX: startX+i, indexY: endY});
                    }
                }
            }
            if (boardState[endY][startX] == null){
                positiveMove.push({indexX: startX, indexY: endY});
            }
            else return positiveMove;
            if ((endY != 1&& endY != 6)||(endY == 1&&this.getValue()<0)||(endY == 6&&this.getValue()>0)){
                return positiveMove;
            }
            endY += direction;
            if (boardState[endY][startX] == null){
                positiveMove.push({indexX: startX, indexY: endY});
            }
            return positiveMove;
        }else if (Math.abs(this.getValue()) == 90){
            //nuoc di quan hau
            Queen.prototype.move(boardState, startX, startY);

        }

    }
}

// hoang