import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Rook extends Piece {
  constructor(
    name: string,
    value: number,
    moved: boolean,
    scaleScene: number,
    texture?: Texture
  ) {
    super(name, value, moved, scaleScene, texture);
  }

  public override move(
    boardState: any,
    startX: number,
    startY: number
  ): { indexX: number; indexY: number }[] {
    const validMoves: { indexX: number; indexY: number }[] = [];

    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    directions.forEach(([dx, dy]) => {
      for (let i = 1; i < boardState.length; i++) {
        const newX = startX + i * dx;
        const newY = startY + i * dy;

        // Check if the position is out of the board's boundary
        if (
          newX < 0 ||
          newX >= boardState.length ||
          newY < 0 ||
          newY >= boardState.length
        ) {
          break;
        }

        const destPiece = boardState[newX][newY].piece ?? null;

        if (destPiece == null) {
          // Empty position
          validMoves.push({ indexX: newX, indexY: newY });
          continue;
        }
        if (this.getValue() * destPiece.value < 0) {
          // Position occupied by an opponent's piece
          validMoves.push({ indexX: newX, indexY: newY });
          break;
        } else {
          // Position occupied by a friendly King piece
          if (Math.abs(destPiece.getValue()) == 900 && this.getMoved() == false && destPiece.getMoved() == false) {
            validMoves.push({ indexX: newX, indexY: newY });
          }
          break;
        }
      }
    });

    return validMoves;
  }

  public override cloneObject(): Piece {
      const newObject: Rook = new Rook("", this.getValue(), this.moved, 0, undefined);
      newObject.x = this.x;
      newObject.y = this.y;
      return newObject
  }
}

// duc
