import { Container, Texture } from "pixi.js";
import BoardScene from "../scenes/board_scene";
import { widthBoard } from "../common";
import Knight from "../models/knight_piece";
import King from "../models/king_piece";
import Bishop from "../models/bishop_piece";
import Pawn from "../models/pawn_piece";
import Queen from "../models/queen_piece";
import Rook from "../models/rook_piece";
// import PieceManager from "./piece_manager";
import StateManager from "./state_manager";
import InputController from "./input_controller";
import SettingManager from "./setting_manager";

export default class GameManager extends Container {
    /* 
        DEFINE PIECES's VALUE:
            PAWN: 10
            KNIGHT: 30
            BISHOP: 45
            ROOK: 50
            QUEEN: 90
            KING: 900
    */
    private scaleScene: number;
    private boardScene: BoardScene;

    constructor(textures: { name: string, src: Texture }[]) {
        super();

        const textureBoard = textures.find(asset => asset.name === 'bouncing')?.src;
        this.scaleScene = widthBoard / (textureBoard?.width || 0);
        this.boardScene = new BoardScene(textureBoard);

        const whiteKing = new King("white_king", 900, false, this.scaleScene, textures.find(assets => assets.name === 'white-king')?.src);
        const whiteBishop_1 = new Bishop("white_bishop", 45, false, this.scaleScene, textures.find(assets => assets.name === 'white-bishop')?.src);
        const whiteBishop_2 = new Bishop("white_bishop", 45, false, this.scaleScene, textures.find(assets => assets.name === 'white-bishop')?.src);
        const whiteKnight_1 = new Knight("white_knight", 30, false, this.scaleScene, textures.find(assets => assets.name === 'white-knight')?.src);
        const whiteKnight_2 = new Knight("white_knight", 30, false, this.scaleScene, textures.find(assets => assets.name === 'white-knight')?.src);
        const whitePawn_1 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_2 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_3 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_4 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_5 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_6 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_7 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whitePawn_8 = new Pawn("white_pawn", 10, false, this.scaleScene, textures.find(assets => assets.name === 'white-pawn')?.src);
        const whiteQueen = new Queen("white_queen", 90, false, this.scaleScene, textures.find(assets => assets.name === 'white-queen')?.src);
        const whiteRook_1 = new Rook("white_rook", 50, false, this.scaleScene, textures.find(assets => assets.name === 'white-rook')?.src);
        const whiteRook_2 = new Rook("white_rook", 50, false, this.scaleScene, textures.find(assets => assets.name === 'white-rook')?.src);

        const blackKing = new King("black_king", -900, false, this.scaleScene, textures.find(assets => assets.name === 'black-king')?.src);
        const blackBishop_1 = new Bishop("black_bishop", -45, false, this.scaleScene, textures.find(assets => assets.name === 'black-bishop')?.src);
        const blackBishop_2 = new Bishop("black_bishop", -45, false, this.scaleScene, textures.find(assets => assets.name === 'black-bishop')?.src);
        const blackKnight_1 = new Knight("black_knight", -30, false, this.scaleScene, textures.find(assets => assets.name === 'black-knight')?.src);
        const blackKnight_2 = new Knight("black_knight", -30, false, this.scaleScene, textures.find(assets => assets.name === 'black-knight')?.src);
        const blackPawn_1 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_2 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_3 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_4 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_5 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_6 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_7 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackPawn_8 = new Pawn("black_pawn", -10, false, this.scaleScene, textures.find(assets => assets.name === 'black-pawn')?.src);
        const blackQueen = new Queen("black_queen", -90, false, this.scaleScene, textures.find(assets => assets.name === 'black-queen')?.src);
        const blackRook_1 = new Rook("black_rook", -50, false, this.scaleScene, textures.find(assets => assets.name === 'black-rook')?.src);
        const blackRook_2 = new Rook("black_rook", -50, false, this.scaleScene, textures.find(assets => assets.name === 'black-rook')?.src);

        // create stateManager()
        const stateManager = StateManager.getInstance();
        stateManager.addState(0, 0, blackRook_1);
        stateManager.addState(0, 1, blackKnight_1);
        stateManager.addState(0, 2, blackBishop_1);
        stateManager.addState(0, 3, blackQueen);
        stateManager.addState(0, 4, blackKing);
        stateManager.addState(0, 5, blackBishop_2);
        stateManager.addState(0, 6, blackKnight_2);
        stateManager.addState(0, 7, blackRook_2);
        stateManager.addState(1, 0, blackPawn_1);
        stateManager.addState(1, 1, blackPawn_2);
        stateManager.addState(1, 2, blackPawn_3);
        stateManager.addState(1, 3, blackPawn_4);
        stateManager.addState(1, 4, blackPawn_5);
        stateManager.addState(1, 5, blackPawn_6);
        stateManager.addState(1, 6, blackPawn_7);
        stateManager.addState(1, 7, blackPawn_8);

        stateManager.addState(6, 0, whitePawn_1);
        stateManager.addState(6, 1, whitePawn_2);
        stateManager.addState(6, 2, whitePawn_3);
        stateManager.addState(6, 3, whitePawn_4);
        stateManager.addState(6, 4, whitePawn_5);
        stateManager.addState(6, 5, whitePawn_6);
        stateManager.addState(6, 6, whitePawn_7);
        stateManager.addState(6, 7, whitePawn_8);
        stateManager.addState(7, 0, whiteRook_1);
        stateManager.addState(7, 1, whiteKnight_1);
        stateManager.addState(7, 2, whiteBishop_1);
        stateManager.addState(7, 3, whiteQueen);
        stateManager.addState(7, 4, whiteKing);
        stateManager.addState(7, 5, whiteBishop_2);
        stateManager.addState(7, 6, whiteKnight_2);
        stateManager.addState(7, 7, whiteRook_2);
        stateManager.setPost(stateManager.boardState);

        stateManager.whiteKing = { indexX: 7, indexY: 4 }
        stateManager.blackKing = { indexX: 0, indexY: 4 }

        // create setting manager
        const settingManager = SettingManager.getInstance();
        const textureSetting = textures.find(assets => assets.name === 'setting');
        const textureCursor = textures.find(assets => assets.name === 'cursor-down');
        const textureClose = textures.find(assets => assets.name === "close");
        
        textureSetting && settingManager.addTexture(textureSetting.name, textureSetting.src);
        textureCursor && settingManager.addTexture(textureCursor.name, textureCursor.src);
        textureClose && settingManager.addTexture(textureClose.name, textureClose.src);
        
        settingManager.listen();
        

        // add to ui
        this.addChild(this.boardScene);

        const inputController = new InputController(this.scaleScene);
        inputController.load();
        this.addChild(inputController);
        this.addChild(stateManager);
        this.addChild(settingManager);
    }

    public initialize() {
        this.scaleScene
    }
}