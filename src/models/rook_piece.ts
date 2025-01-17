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
    startY: number,
    startX: number
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

        const pieceValue = boardState[newX][newY].piece?.value ?? 0;

        if (pieceValue === 0) {
          // Empty position
          validMoves.push({ indexX: newX, indexY: newY });
        } else if (this.getValue() * pieceValue < 0) {
          // Position occupied by an opponent's piece
          validMoves.push({ indexX: newX, indexY: newY });
          break; // Stop moving further in this direction
        } else {
          // Position is occupied by our own piece
          break;
        }
      }
    });

    return validMoves;
  }
}

// duc
