import { Container, Texture } from "pixi.js";
import BoardScene from "../scenes/board_scene";
import { widthBoard } from "../common";
import Piece from "../models/piece_abstract";
import Knight from "../models/knight_piece";
import King from "../models/king_piece";
import Bishop from "../models/bishop_piece";
import Pawn from "../models/pawn_piece";
import Queen from "../models/queen_piece";
import Rook from "../models/rook_piece";
import PieceManager from "./piece_manager";

export default class GameManager extends Container {
    private scaleScene: number;
    private boardScene: BoardScene;
    private boardState: { post: { x: number, y: number, name: string }, piece: Piece }[][] = Array.from({ length: 8 }, () => Array(8).fill(0));

    constructor(textures: { name: string, src: Texture}[]) {
        super();

        //

        //

        const textureBoard = textures.find(asset => asset.name === 'bouncing')?.src;
        this.scaleScene = widthBoard / (textureBoard?.width || 0);
        this.boardScene = new BoardScene(textureBoard);

        const whiteKing = new King("white_king", 900, false, this.scaleScene, textures.find(assets => assets.name === 'white-king')?.src);
        const whiteBishop = new Bishop("white_bishop", 30, false, this.scaleScene, textures.find(assets => assets.name === 'white-bishop')?.src);
        const whiteKnight = new Knight("white_knight", 30, false, this.scaleScene, textures.find(assets => assets.name === 'white-knight')?.src);
        const whitePawn = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whiteQueen = new Queen("white_queen", 90, false, this.scaleScene, textures.find(assets => assets.name === 'white-queen')?.src);
        const whiteRook = new Rook("white_rook", 50, false, this.scaleScene, textures.find(assets => assets.name === 'white-rook')?.src);

        const blackKing = new King("black_king", -900, false, this.scaleScene, textures.find(assets => assets.name === 'black-king')?.src);
        const blackBishop = new Bishop("black_bishop", -30, false, this.scaleScene, textures.find(assets => assets.name === 'black-bishop')?.src);
        const blackKnight = new Knight("black_knight", -30, false, this.scaleScene, textures.find(assets => assets.name === 'black-knight')?.src);
        const blackPawn = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackQueen = new Queen("black_queen", -90, false, this.scaleScene, textures.find(assets => assets.name === 'black-queen')?.src);
        const blackRook = new Rook("black_rook", -50, false, this.scaleScene, textures.find(assets => assets.name === 'black-rook')?.src);
 
        const pieceManager = PieceManager.getInstance();
        pieceManager.addPiece(whiteKing);
        pieceManager.addPiece(whiteBishop);
        pieceManager.addPiece(whiteKnight);
        pieceManager.addPiece(whitePawn);
        pieceManager.addPiece(whiteQueen);
        pieceManager.addPiece(whiteKnight);
        pieceManager.addPiece(whiteRook);
        pieceManager.addPiece(blackKing);
        pieceManager.addPiece(blackBishop);
        pieceManager.addPiece(blackKnight);
        pieceManager.addPiece(blackPawn);
        pieceManager.addPiece(blackQueen);
        pieceManager.addPiece(blackRook);

        // this.boardState.forEach(());

        this.addChild(this.boardScene);
        this.addChild(whiteKing)
        this.addChild(whiteBishop)
        this.addChild(whiteKnight)
        this.addChild(whitePawn)
        this.addChild(whiteQueen)
        this.addChild(whiteKnight)
        this.addChild(whiteRook)
        this.addChild(blackKing)
        this.addChild(blackBishop)
        this.addChild(blackKnight)
        this.addChild(blackPawn)
        this.addChild(blackQueen)
        this.addChild(blackRook)
    }

    public initialize() {
        this.scaleScene
        this.boardState
    }
}