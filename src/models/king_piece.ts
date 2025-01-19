import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class King extends Piece {
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
      const newX = startX + dx;
      const newY = startY + dy;

      // Stop if out of bounds
      if (
        newX < 0 ||
        newX >= boardState.length ||
        newY < 0 ||
        newY >= boardState.length
      ) {
      } else {
        const piece = boardState[newX][newY].piece;
        const pieceValue = piece?.value ?? 0;
        if (pieceValue == 0 || this.getValue() * pieceValue < 0) {
          validMoves.push({ indexX: newX, indexY: newY });
        }
      }
    });

    // Kiểm tra khả năng castle
    if (!this.getMoved()) {
      // Kiểm tra di chuyển xuống dưới (cột tăng lên)
      for (let i = startY + 1; i < 8; ++i) {
        // Nếu có quân ngáng đường, dừng lại
        if (boardState[startX][i].piece != null && i != 7) {
          break;
        }

        if (
          i == 7 &&
          boardState[startX][i].piece != null &&
          !boardState[startX][i].piece.getMoved()
        ) {
          validMoves.push({ indexX: startX, indexY: i });
          break;
        }
      }

      // Kiểm tra di chuyển lên trên (cột giảm xuống)
      for (let i = startY - 1; i >= 0; --i) {
        if (boardState[startX][i].piece != null && i != 0) {
          break;
        }

        if (
          i == 0 &&
          boardState[startX][i].piece != null &&
          !boardState[startX][i].piece.getMoved()
        ) {
          validMoves.push({ indexX: startX, indexY: i });
          break;
        }
      }
    }
    return validMoves;
  }
}

// phong
