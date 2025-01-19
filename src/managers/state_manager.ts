import { Container, Graphics } from "pixi.js";
import { borderBoard, widthBoard, widthItem } from "../common";
import Piece from "../models/piece_abstract";
import PieceManager from "./piece_manager";

export default class StateManager extends Container {
  private static instance: StateManager;
  public boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][];
  private move?: { indexX: number; indexY: number };

  constructor() {
    super();
    const widthItem = (widthBoard - borderBoard * 2) / 8;

    this.boardState = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        post: {
          x: col * widthItem + borderBoard + widthItem / 2,
          y: row * widthItem + borderBoard + widthItem / 2,
          name: `${String.fromCharCode(97 + col)}${8 - row}`,
        },
        piece: null,
        focus: null,
      }))
    );
  }

  // func lay danh sách bên trắng, bên đen (turn) => quân cờ // trung
  // minimax // phong, duc, trung
  // func gia lap (board state, quan co dang xet) => danh sach ban co moi // trung
  // func cap nhat lai trang thai (board state)

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
      });
    });
  }

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  public updateFocus(indexX: number, indexY: number) {
    this.boardState.forEach((row) => {
      row.forEach((item) => {
        if (item.focus) {
          this.removeChild(item.focus);
          item.focus = null;
        }
      });
    });

    if (
      this.move == undefined &&
      indexX >= 0 &&
      indexX < this.boardState.length &&
      indexY >= 0 &&
      indexY < this.boardState[indexX]?.length &&
      this.boardState[indexX]?.[indexY]?.piece != null
    ) {
      const rect = new Graphics();
      rect.lineStyle(2, 0xff0000);
      rect.drawRect(
        this.boardState[indexX][indexY].post.x - widthItem / 2,
        this.boardState[indexX][indexY].post.y - widthItem / 2,
        widthItem,
        widthItem
      );
      this.boardState[indexX][indexY].focus = rect;
      this.addChild(rect);

      const piece = this.boardState[indexX][indexY].piece;
      if (piece) {
        const listMovePiece = piece.move(this.boardState, indexX, indexY);
        // console.log(listMovePiece);
        
        listMovePiece.forEach((item) => {
          const indexX = item?.indexX;
          const indexY = item?.indexY;
          if (indexX != null && indexY != null) {
            const rect = new Graphics();
            rect.lineStyle(2, 0xff0000);
            rect.drawRect(
              this.boardState[indexX][indexY].post.x - widthItem / 2,
              this.boardState[indexX][indexY].post.y - widthItem / 2,
              widthItem,
              widthItem
            );
            this.boardState[indexX][indexY].focus = rect;
            this.addChild(rect);
          }
        });
      }

      this.move = { indexX: indexX, indexY: indexY };
    } else {
      if (
        (indexX !== this.move?.indexX || indexY !== this.move?.indexY) &&
        this.move != undefined
      ) {
        this.movePiece(indexX, indexY);
      }

      this.move = undefined;
    }
  }

  public movePiece(destX: number, destY: number) {
    const startX = this.move?.indexX;
    const startY = this.move?.indexY;
    

    // Kiểm tra nếu tọa độ ban đầu và tọa độ đích hợp lệ
    if (
      startX !== undefined &&
      startY !== undefined &&
      (destX !== startX || destY !== startY)
    ) {
      const piece = this.boardState[startX][startY]?.piece;

      // Kiểm tra nếu có quân cờ tại vị trí ban đầu
      if (piece) {
        const validMoves = piece.move(this.boardState, startX, startY);
      
        // Kiểm tra nước đi có hợp lệ không
        const isValidMove = validMoves.some(
          (move) => move.indexX === destX && move.indexY === destY
        );

        if (isValidMove) {
          // Xử lý việc xóa quân cờ bị ăn
          const capturedPiece = this.boardState[destX][destY]?.piece;
          PieceManager.getInstance().removePiece(capturedPiece);
          // Di chuyển quân cờ
          this.boardState[destX][destY].piece = piece;
          this.boardState[startX][startY].piece = null;

          this.setPost();
          console.log(piece);
          console.log(`Move from (${startX}, ${startY}) to (${destX}, ${destY})`);
          
        } else {
          console.log(`Invalid move to (${destX}, ${destY})`);
        }
      }
    }

    this.move = undefined;

  
    if (this.isKingInCheck({indexX: 0, indexY: 4}, false, this.boardState)) {
      console.log("Black king is in check");
    }
    if (this.checkMate({indexX: 0, indexY: 4}, false, this.boardState)){
      console.log("Black king is in checkmate");
    }
  }

  public show() {
    /*
            THIS METHOD IS UTILIZED TO SHOW BOARD STATE

                r n b q k b n r 
                p p p p p p p p
                _ _ _ _ _ _ _ _
                _ _ _ _ _ _ _ _
                _ _ _ _ _ _ _ _
                _ _ _ _ _ _ _ _
                P P P P P P P P
                R N B Q K B N R 

        */
    this.boardState.forEach((row) => {
      let rowString = "";
      row.forEach((col) => {
        let pieceChar = "_";
        switch (col.piece?.getValue()) {
          case 10:
            pieceChar = "P";
            break;
          case 30:
            pieceChar = "N";
            break;
          case 45:
            pieceChar = "B";
            break;
          case 50:
            pieceChar = "R";
            break;
          case 90:
            pieceChar = "Q";
            break;
          case 900:
            pieceChar = "K";
            break;
          case -10:
            pieceChar = "p";
            break;
          case -30:
            pieceChar = "n";
            break;
          case -45:
            pieceChar = "b";
            break;
          case -50:
            pieceChar = "r";
            break;
          case -90:
            pieceChar = "q";
            break;
          case -900:
            pieceChar = "k";
            break;
        }
        rowString += pieceChar + " ";
      });
      console.log(rowString);
    });
  }

  public getPositiveMoveAt(
    X: number,
    Y: number
  ): { indexX: number; indexY: number }[] {
    const myPiece: any = this.boardState[Y][X].piece;

    const myPieceValue: number = myPiece?.getValue() ?? 0;

    const positiveMove: { indexX: number; indexY: number }[] = [];

    console.log(myPieceValue);

    if (!myPieceValue) {
      return positiveMove;
    }

    switch (Math.abs(myPieceValue)) {
      case 45:
        positiveMove.push(...myPiece.move(this.boardState, Y, X));
        break;

      default:
        break;
    }

    return positiveMove;
  }

  public parstLocateArray(postX: number, postY: number): { indexX: number, indexY: number } {
    const indexX = Math.floor((postY - borderBoard) / widthItem);
    const indexY = Math.floor((postX - borderBoard) / widthItem);

    return { indexX: indexX, indexY: indexY };
  }

  public getAllPosibleMove(boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][], isWhiteTurn: boolean, KingPosition: { indexX: number; indexY: number }): { indexX: number; indexY: number }[] {
    if (isWhiteTurn) {
      return boardState.filter((row) => row.some((item) => item.piece && item.piece.getValue() > 0))
    .flatMap((row) => row.flatMap((item) => {
      if (item.piece) {
        const position = this.parstLocateArray(item.post.x, item.post.y);
        var legalMove = item.piece.move(boardState, position.indexX, position.indexY);
        legalMove = this.isMoveValidAgainstCheck(legalMove, position, isWhiteTurn, KingPosition);
        return legalMove;
      }
      return [];
    }));
    }else {
      return boardState.filter((row) => row.some((item) => (item.piece && item.piece.getValue() < 0)))
      .flatMap((row) => row.flatMap((item) => {
        if (item.piece&& item.piece.getValue() < 0) {
          const position = this.parstLocateArray(item.post.x, item.post.y);
          console.log("begin");
          var legalMove = item.piece.move(boardState, position.indexX, position.indexY);
          console.log(legalMove);
          console.log("end");
          legalMove = this.isMoveValidAgainstCheck(legalMove, position, isWhiteTurn, KingPosition);
          console.log("end2");
          console.log(legalMove);
          return legalMove;
        }
        return [];
      }));
    }

  }

  public deepCopyArray(array: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][]) {

    let arrayCopy = array.map(row =>
      row.map(element => ({
        post: { ...element.post }, 
        piece: element.piece ? { ...element.piece } : null, 
        focus: element.focus ? { ...element.focus } : null, 
      }))
    );
    return arrayCopy;
  }
  
  public isMoveValidAgainstCheck(legalMove: { indexX: number; indexY: number }[], startPosition: { indexX: number; indexY: number }, isWhiteTurn: boolean, KingPosition: { indexX: number; indexY: number }): { indexX: number; indexY: number }[] {

    const validMoves: { indexX: number; indexY: number }[] = [];
    legalMove.forEach((item) => {
      let piece = this.boardState[startPosition.indexX][startPosition.indexY].piece;
      let pieceCp = this.boardState[item.indexX][item.indexY].piece;
      this.boardState[startPosition.indexX][startPosition.indexY].piece = null;
      this.boardState[item.indexX][item.indexY].piece = piece;
      if (this.isKingInCheck(KingPosition, isWhiteTurn, this.boardState)) {
        console.log("Check at: "+this.boardState[item.indexX][item.indexY].piece?.getValue());
        console.log(piece);
        console.log(item.indexX, item.indexY);
      }else {
        validMoves.push(item);
      }
      this.boardState[startPosition.indexX][startPosition.indexY].piece = piece;
      this.boardState[item.indexX][item.indexY].piece = pieceCp;
    });
    return validMoves;
  }

  public isKingInCheck(KingPosition: { indexX: number; indexY: number }, isWhiteKing: boolean, boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][]): boolean {
    if (isWhiteKing){
      return boardState.some((row) => row.some((item) => {
        var position = this.parstLocateArray(item.post.x, item.post.y);
        if (item.piece && item.piece.getValue() < 0 && this.canPieceAttackKing(KingPosition, boardState, position)) {
      
          return true;
        }
        return false;
    }));
    }else {
        return boardState.some((row) => row.some((item) => { 
          var position = this.parstLocateArray(item.post.x, item.post.y);
          if (item.piece && item.piece.getValue() > 0 && this.canPieceAttackKing( KingPosition, boardState, position)) {
            return true;
          }
          return false;
      }));
    }
  }

  // Hàm kiểm tra nếu một quân cờ có thể tấn công vua hay không
public canPieceAttackKing(KingPosition: { indexX: number; indexY: number }, boardState: {
  post: { x: number; y: number; name: string };
  piece: Piece | null;
  focus: Graphics | null;
}[][], position: { indexX: number; indexY: number }): boolean {

  const possibleMoves = boardState[position.indexX][position.indexY].piece?.move(boardState, position.indexX, position.indexY);

  return possibleMoves? possibleMoves?.some((move) => move.indexX === KingPosition.indexX && move.indexY === KingPosition.indexY):false;

}

  public checkMate(KingPosition: { indexX: number; indexY: number }, isWhiteTurn: boolean, boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][]): boolean {
    console.log(KingPosition);
    let legalMove = this.getAllPosibleMove(boardState, isWhiteTurn, KingPosition);
    console.log(legalMove);
    if (legalMove.length == 0) {
      return true;
    } 
    return false;
  }
}
