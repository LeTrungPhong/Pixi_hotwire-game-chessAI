import { Container, Graphics, Sprite, Texture, Text, TextStyle } from "pixi.js";
import BoardScene from "../scenes/board_scene";
import { borderBoard, heightGame, paddingHorizontal, paddingVertical, widthBoard, widthGame, widthItem } from "../common";
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
    
    // game_ui
    private gameUI: Container = new Container();
    private scaleScene: number;
    private boardScene: BoardScene;
    private homeButton: Sprite = new Sprite();
    private backButton: Sprite = new Sprite();
    private resetButton: Sprite = new Sprite();

    // home_ui
    private homeUI: Container = new Container();
    private levelButton_1: Graphics = new Graphics();
    private levelButton_2: Graphics = new Graphics();
    private levelButton_3: Graphics = new Graphics();
    private levelText_1: Text = new Text();
    private levelText_2: Text = new Text();
    private levelText_3: Text = new Text();
    private titleGameText: Text = new Text();

    constructor(textures: { name: string, src: Texture }[]) {
        super();

        const textureBoard = textures.find(asset => asset.name === 'bouncing')?.src;
        this.scaleScene = widthBoard / (textureBoard?.width || 0);
        this.boardScene = new BoardScene(textureBoard);

        const background = new Graphics();

        background.beginFill(0xEEEEEE);
        background.drawRect(-paddingHorizontal, -paddingVertical, widthGame, heightGame);
        background.endFill();
        this.addChild(background);

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

        // stateManager.addState(0, 2, blackRook_1);
        // // stateManager.addState(0, 1, blackKnight_1);
        // stateManager.addState(1, 1, blackBishop_1);
        // stateManager.addState(1, 2, blackQueen);
        // stateManager.addState(1, 5, blackKing);
        // // stateManager.addState(0, 5, blackBishop_2);
        // // stateManager.addState(0, 6, blackKnight_2);
        // // stateManager.addState(0, 7, blackRook_2);
        // stateManager.addState(1, 0, blackPawn_1);
        // stateManager.addState(1, 7, blackPawn_2);
        // stateManager.addState(2, 1, blackPawn_3);
        // stateManager.addState(2, 6, blackPawn_4);
        // stateManager.addState(3, 3, blackPawn_5);
        // stateManager.addState(3, 4, blackPawn_6);
        // // stateManager.addState(1, 6, blackPawn_7);
        // // stateManager.addState(1, 7, blackPawn_8);

        // stateManager.addState(6, 1, whitePawn_1);
        // stateManager.addState(6, 5, whitePawn_2);
        // stateManager.addState(6, 6, whitePawn_3);
        // stateManager.addState(5, 0, whitePawn_4);
        // stateManager.addState(2, 7, whitePawn_5);
        // // stateManager.addState(6, 5, whitePawn_6);
        // // stateManager.addState(6, 6, whitePawn_7);
        // // stateManager.addState(6, 7, whitePawn_8);
        // stateManager.addState(0, 4, whiteRook_1);
        // // stateManager.addState(7, 1, whiteKnight_1);
        // stateManager.addState(4, 0, whiteBishop_1);
        // stateManager.addState(5, 2, whiteQueen);
        // stateManager.addState(7, 4, whiteKing);
        // // stateManager.addState(7, 5, whiteBishop_2);
        // // stateManager.addState(7, 6, whiteKnight_2);
        // // stateManager.addState(7, 7, whiteRook_2);
        stateManager.setPost(stateManager.boardState);

        stateManager.whiteKing = { indexX: 7, indexY: 4 }
        stateManager.blackKing = { indexX: 0, indexY: 4 }

        // create setting manager
        const settingManager = SettingManager.getInstance();
        settingManager.zIndex = 2;
        const textureSetting = textures.find(assets => assets.name === 'setting');
        const textureCursor = textures.find(assets => assets.name === 'cursor-down');
        const textureClose = textures.find(assets => assets.name === "close");
        const textureNext = textures.find(assets => assets.name === "next");
        const textureBack = textures.find(assets => assets.name === "back");
        const texturePause = textures.find(assets => assets.name === "pause");
        const texturePlay = textures.find(assets => assets.name === "play");
        
        textureSetting && settingManager.addTexture(textureSetting.name, textureSetting.src);
        textureCursor && settingManager.addTexture(textureCursor.name, textureCursor.src);
        textureClose && settingManager.addTexture(textureClose.name, textureClose.src);
        textureNext && settingManager.addTexture(textureNext.name, textureNext.src);
        textureBack && settingManager.addTexture(textureBack.name, textureBack.src);
        texturePause && settingManager.addTexture(texturePause.name, texturePause.src);
        texturePlay && settingManager.addTexture(texturePlay.name, texturePlay.src);

        settingManager.listen();

        const textureHome = textures.find(assets => assets.name === 'home');
        const textureMoveBack = textures.find(assets => assets.name === 'move_back');
        const textureReset = textures.find(assets => assets.name === 'reset');

        textureHome && this.addButton(textureHome.name, textureHome.src);
        textureMoveBack && this.addButton(textureMoveBack.name, textureMoveBack.src);
        textureReset && this.addButton(textureReset.name, textureReset.src);

        this.listen();

        // add to ui
        this.gameUI.addChild(this.boardScene);

        const inputController = new InputController(this.scaleScene);
        inputController.load();
        this.gameUI.addChild(inputController);
        this.gameUI.addChild(stateManager);
        this.addChild(settingManager);

        const widthButtonLevel = 220;
        const heightButtonLevel = 60;
        const padding = 20;

        const postButtonLevel_X = 0 - paddingHorizontal + widthGame / 2 - widthButtonLevel / 2;
        const postButtonLevel_Y = 0 - paddingVertical + heightGame / 2 - heightButtonLevel / 2;

        // home ui
        this.levelButton_1.beginFill(0x000000, 0.5);
        this.levelButton_1.drawRect(postButtonLevel_X, postButtonLevel_Y - heightButtonLevel - padding, widthButtonLevel, heightButtonLevel);
        this.levelButton_1.endFill();

        this.levelButton_2.beginFill(0x000000, 0.5);
        this.levelButton_2.drawRect(postButtonLevel_X, postButtonLevel_Y, widthButtonLevel, heightButtonLevel);
        this.levelButton_2.endFill();

        this.levelButton_3.beginFill(0x000000, 0.5);
        this.levelButton_3.drawRect(postButtonLevel_X, postButtonLevel_Y + heightButtonLevel + padding, widthButtonLevel, heightButtonLevel);
        this.levelButton_3.endFill();

        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: "#DDDDDD",
            fontSize: 25
        });

        this.levelText_1.style = styly;
        this.levelText_1.text = "Level 1";
        this.levelText_1.x = postButtonLevel_X + widthButtonLevel / 2;
        this.levelText_1.y = postButtonLevel_Y + heightButtonLevel / 2 - heightButtonLevel - padding;
        this.levelText_1.anchor.set(0.5);

        this.levelText_2.style = styly;
        this.levelText_2.text = "Level 2";
        this.levelText_2.x = postButtonLevel_X + widthButtonLevel / 2;
        this.levelText_2.y = postButtonLevel_Y + heightButtonLevel / 2;
        this.levelText_2.anchor.set(0.5);

        this.levelText_3.style = styly;
        this.levelText_3.text = "Level 3";
        this.levelText_3.x = postButtonLevel_X + widthButtonLevel / 2;
        this.levelText_3.y = postButtonLevel_Y + heightButtonLevel / 2 + heightButtonLevel + padding;
        this.levelText_3.anchor.set(0.5);

        const styly1: TextStyle = new TextStyle({
            align: "center",
            fill: "#222222",
            fontSize: 40,
            fontWeight: "bold"
        });

        this.titleGameText.style = styly1;
        this.titleGameText.text = "Chess Game";
        this.titleGameText.x = postButtonLevel_X + widthButtonLevel / 2;
        this.titleGameText.y = postButtonLevel_Y - heightButtonLevel * 2 - padding * 2;
        this.titleGameText.anchor.set(0.5);

        this.homeUI.addChild(this.levelButton_1);
        this.homeUI.addChild(this.levelButton_2);
        this.homeUI.addChild(this.levelButton_3);
        this.homeUI.addChild(this.levelText_1);
        this.homeUI.addChild(this.levelText_2);
        this.homeUI.addChild(this.levelText_3);
        this.homeUI.addChild(this.titleGameText);

        this.addChild(this.homeUI);

        this.sortableChildren = true;
    }

    public initialize() {
        this.scaleScene
    }

    public addButton(name: string, texture: Texture) {
        switch(name) {
            case 'home':
                this.homeButton = Sprite.from(texture);
                this.homeButton.anchor.set(0.5);
                this.homeButton.width = 40;
                this.homeButton.height = 40;
                this.homeButton.x = borderBoard + widthItem / 2;
                this.homeButton.y = -25;
                this.gameUI.addChild(this.homeButton);
                break;
            case 'move_back':
                this.backButton = Sprite.from(texture);
                this.backButton.anchor.set(0.5);
                this.backButton.width = 40;
                this.backButton.height = 40;
                this.backButton.x = borderBoard + widthItem / 2 + widthItem;
                this.backButton.y = -25;
                this.gameUI.addChild(this.backButton);
                break;
            case 'reset':
                this.resetButton = Sprite.from(texture);
                this.resetButton.anchor.set(0.5);
                this.resetButton.width = 40;
                this.resetButton.height = 40;
                this.resetButton.x = borderBoard + widthItem / 2 + widthItem * 2;
                this.resetButton.y = -25;
                this.gameUI.addChild(this.resetButton);
                break;
            default:
                break;
        }
    }

    public listen() {
        this.homeButton.interactive = true;
        this.homeButton.on('pointerover', () => {
            this.homeButton.cursor = 'pointer';
        })
        this.homeButton.on('pointerdown', () => {
            this.removeChild(this.gameUI);
            this.addChild(this.homeUI);
        })

        this.backButton.interactive = true;
        this.backButton.on('pointerover', () => {
            this.backButton.cursor = 'pointer';
        })
        this.backButton.on('pointerdown', () => {
            StateManager.getInstance().back(2, 500);
        })

        this.resetButton.interactive = true;
        this.resetButton.on('pointerover', () => {
            this.resetButton.cursor = 'pointer';
        })
        this.resetButton.on('pointerdown', () => {
            StateManager.getInstance().back(1000, 200);
        })

        this.levelButton_1.interactive = true;
        this.levelButton_1.on('pointerover', () => {
            this.levelButton_1.cursor = 'pointer';
        })
        this.levelButton_1.on('pointerdown', () => {
            this.playGame(4);
        });

        this.levelButton_2.interactive = true;
        this.levelButton_2.on('pointerover', () => {
            this.levelButton_2.cursor = 'pointer';
        })
        this.levelButton_2.on('pointerdown', () => {
            this.playGame(5);
        });

        this.levelButton_3.interactive = true;
        this.levelButton_3.on('pointerover', () => {
            this.levelButton_3.cursor = 'pointer';
        })
        this.levelButton_3.on('pointerdown', () => {
            this.playGame(6);
        });
    }

    public playGame(level: number) {
        StateManager.getInstance().setLevel(level);
        this.addChild(this.gameUI);
        this.removeChild(this.homeUI);
    }
}