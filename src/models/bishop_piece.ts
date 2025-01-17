import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Bishop extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(name, value, moved, scaleScene, texture);
    }

    public override move(boardState: any, startY: number, startX: number): { indexX: number; indexY: number; }[] {
        const positiveMove: { indexX: number; indexY: number; }[] = []

        const dxList = [1, -1]
        const dyList = [1, -1]

        dxList.forEach(dx => {
            dyList.forEach(dy => {
                let step: number = 0;
                while (true) {
                    step++;
                    
                    let currentY = startY + dy * step
                    let currentX = startX + dx * step

                    // Check current position is out of boundary or not
                    if (currentY < 0 || currentY >= boardState.length || currentX < 0 || currentX >= boardState.length) break

                    // If current position is still on board, check value in this position
                    // If it's null or inverse value, push it into result array
                    let positionValue = boardState[currentY][currentX].piece?.value ?? 0;
                    if (positionValue == 0) {
                        positiveMove.push({ indexX: currentX, indexY: currentY });
                        continue;
                    }
                    if (positionValue * this.getValue() < 0) {
                        positiveMove.push({ indexX: currentX, indexY: currentY })
                        break
                    }
                    else break

                }
            })
        })

        return positiveMove;
    }
}

// trung