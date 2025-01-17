import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Queen extends Piece {
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

    // Directions for Queen (Rook + Bishop)
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1], // Rook directions
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1], // Bishop directions
    ];

    directions.forEach(([dx, dy]) => {
      for (let i = 1; i < boardState.length; i++) {
        const newX = startX + i * dx;
        const newY = startY + i * dy;

        // Stop if out of bounds
        if (
          newX < 0 ||
          newX >= boardState.length ||
          newY < 0 ||
          newY >= boardState.length
        )
          break;

        const piece = boardState[newX][newY].piece;
        const pieceValue = piece?.value ?? 0;

        if (pieceValue === 0) {
          // Empty position
          validMoves.push({ indexX: newX, indexY: newY });
        } else {
          // Position occupied
          if (this.getValue() * pieceValue < 0) {
            // Opponent's piece
            validMoves.push({ indexX: newX, indexY: newY });
          }
          break; // Stop further movement in this direction because we can't move over our own pieces with queen
        }
      }
    });

    return validMoves;
  }
}
