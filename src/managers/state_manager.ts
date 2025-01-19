import { Container, Graphics } from "pixi.js";
import { borderBoard, widthBoard, widthItem } from "../common";
import Piece from "../models/piece_abstract";

export default class StateManager extends Container {
  private static instance: StateManager;
  public boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][];
  private move?: { indexX: number; indexY: number };
  private moveAI?: { start: { indexX: number, indexY: number }, end: { indexX: number, indexY: number } };

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
    this.addChild(piece)
  }

  public setPost(boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][]) {
    boardState.forEach((row) => {
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
        this.movePiece(this.boardState, this.move, indexX, indexY);
        const boardStateCopy = this.copyBoardState(this.boardState);
        const computer: Piece[] = [];
        const player: Piece[] = [];
        this.copyListPiece(boardStateCopy, computer, player);
        // console.log(boardStateCopy)
        this.setPost(boardStateCopy);
        console.log(this.minimax(boardStateCopy, 100000, -100000, 3, 3, true, computer, player));
        this.movePiece(this.boardState, this.moveAI?.start, this.moveAI?.end.indexX || 0, this.moveAI?.end.indexY || 0);
      }

      this.move = undefined;
    }
  }

  public movePiece(boardState: any, move: { indexX: number, indexY: number } | undefined, destX: number, destY: number) {
    const startX = move?.indexX;
    const startY = move?.indexY;

    // Kiểm tra nếu tọa độ ban đầu và tọa độ đích hợp lệ
    if (
      startX !== undefined &&
      startY !== undefined &&
      (destX !== startX || destY !== startY)
    ) {
      const piece = boardState[startX][startY]?.piece;

      // Kiểm tra nếu có quân cờ tại vị trí ban đầu
      if (piece) {
        const validMoves: { indexX: number, indexY: number }[] = piece.move(boardState, startX, startY);

        // Kiểm tra nước đi có hợp lệ không
        const isValidMove = validMoves.some(
          (move) => move.indexX === destX && move.indexY === destY
        );

        if (isValidMove) {
          // Xử lý việc xóa quân cờ bị ăn
          const capturedPiece = boardState[destX][destY]?.piece;
          if (capturedPiece) {
            this.removeChild(capturedPiece);
          }
          // PieceManager.getInstance().removePiece(capturedPiece);
          // Di chuyển quân cờ
          boardState[destX][destY].piece = piece;
          boardState[startX][startY].piece = null;

          this.setPost(boardState);
        } else {
          console.log(`Invalid move to (${destX}, ${destY}, ${startX}, ${startY})`);
          console.log(piece)
        }
      }
    }

    move = undefined;
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
      // console.log(rowString);
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

  // (boardstate, quan trang, quan den, do sau, luot, )

  // (!) copy boardState -> computer, player
  public minimax(boardState: any, anpha: number, beta: number, depth: number, selectDepth: number, turn: boolean, computer: Piece[], player: Piece[]): number {
    let checkKingComputer: boolean = false;
    let checkKingPlayer: boolean = false;
    // check king computer
    computer.forEach((item) => {
      if (item.getValue() == -900) {
        checkKingComputer = true;
      }
    })
    // check king player
    player.forEach((item) => {
      if (item.getValue() == 900) {
        checkKingPlayer = true;
      }
    })

    if (depth == 0 || checkKingComputer == false || checkKingPlayer == false) {
      return this.valueCal(boardState);
    }

    // turn computer
    if (turn) {
      
      for (let i: number = 0; i < computer.length; ++i) {
        const indexX = Math.floor((computer[i].y - borderBoard) / widthItem);
        const indexY = Math.floor((computer[i].x - borderBoard) / widthItem);
        // if (indexX < 0 || indexY < 0) console.log(computer[i].y + " " + computer[i].x)
        const validMove = computer[i].move(boardState, indexX, indexY);
        
        validMove.forEach((item) => {
          if (item.indexX < 0 || item.indexY < 0 || item.indexX > 7 || item.indexY > 7) {
            console.log("x: " + item.indexX + ", y: " + item.indexY)
          }
        })
        

        for (let j: number = 0; j < validMove.length; ++j) {
          const boardStateCopy = this.copyBoardState(boardState);
          const playerCopy: Piece[] = [];
          const computerCopy: Piece[] = [];
          this.copyListPiece(boardStateCopy, computerCopy, playerCopy);
          this.movePiece(boardStateCopy, { indexX: indexX, indexY: indexY }, validMove[j].indexX, validMove[j].indexY);

          const scoreNew: number = this.minimax(boardStateCopy, anpha, beta, depth - 1, selectDepth, false, computerCopy, playerCopy);
          if (anpha > scoreNew) {
            anpha = scoreNew;
            
            if (depth == selectDepth) {
              this.moveAI = { start: { indexX: indexX, indexY: indexY }, end: { indexX: validMove[j].indexX, indexY: validMove[j].indexY } };
            }
          }
          // console.log("computer, " + "score: " + score, "depth: " + depth);
        }
      }
      return anpha;
    } else {
      for (let i: number = 0; i < player.length; ++i) {
        const indexX = Math.floor((player[i].y - borderBoard) / widthItem);
        const indexY = Math.floor((player[i].x - borderBoard) / widthItem);
        if (indexX < 0 || indexY < 0) console.log(player[i].y + " " + player[i].x)
        const validMove = player[i].move(boardState, indexX, indexY);
        
        validMove.forEach((item) => {
          if (item.indexX < 0 || item.indexY < 0 || item.indexX > 7 || item.indexY > 7) {
            console.log("x: " + item.indexX + ", y: " + item.indexY)
          }
        })

        for (let j: number = 0; j < validMove.length; ++j) {
          const boardStateCopy = this.copyBoardState(boardState);
          const playerCopy: Piece[] = [];
          const computerCopy: Piece[] = [];
          this.copyListPiece(boardStateCopy, computerCopy, playerCopy);
          this.movePiece(boardStateCopy, { indexX: indexX, indexY: indexY }, validMove[j].indexX, validMove[j].indexY);

          const scoreNew: number = this.minimax(boardStateCopy, anpha, beta, depth - 1, selectDepth, true, computerCopy, playerCopy);
          beta = Math.max(beta, scoreNew); 
          // console.log("player, " + "score: " + score, "depth: " + depth);
        }
      }
      return beta;
    }

    anpha
    beta
  }

  public parstLocateArray(postX: number, postY: number): { indexX: number, indexY: number } {
    const indexX = Math.floor((postY - borderBoard) / widthItem);
    const indexY = Math.floor((postX - borderBoard) / widthItem);

    return { indexX: indexX, indexY: indexY };
  }

  public copyBoardState(boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][]) {
    const boardStateCopy: {
      post: { x: number; y: number; name: string };
      piece: Piece | null;
      focus: Graphics | null;
    }[][] = Array.from({ length: boardState.length }, (_, row) =>
      Array.from({ length: boardState[row].length }, (_, col) => {
        const currentCell = boardState[row][col];
        const clonedPiece = currentCell.piece ? currentCell.piece.cloneObject() : null;
        return {
          post: { ...currentCell.post },
          piece: clonedPiece,
          focus: null,
        };
      })
    );
  
    return boardStateCopy;
  }

  // public override cloneObject(obj: any) {
  //   const copy = Array.isArray(obj) ? [] : {};
  //   for (let key in obj) {
  //     if (obj[key] && typeof obj[key] === "object") {
  //       copy[key] = this.cloneObject(obj[key]);
  //     } else {
  //       copy[key] = obj[key];
  //     }
  //   }
  //   return copy;
  // }

  public cloneObject(obj: any) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

  public copyListPiece(boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][], computer: Piece[], player: Piece[]) {
    boardState.forEach((row) => {
      row.forEach((item) => {
        if (item.piece) {
          if (item.piece.getValue() > 0) {
            player.push(item.piece);
          } else {
            computer.push(item.piece);
          }
        }
      })
    });
  }

  

  public valueCal(boardState: {
    post: { x: number; y: number; name: string };
    piece: Piece | null;
    focus: Graphics | null;
  }[][]): number {
    let sum: number = 0;
    boardState.forEach((row) => {
      row.forEach((item) => {
        if (item.piece) {
          sum += item.piece.getValue();
        }
      })
    })
    return sum;
  }
}
