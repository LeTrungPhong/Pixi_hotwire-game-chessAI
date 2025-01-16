import { Application, Container, Graphics } from "pixi.js";
import PieceManager from "./piece_manager";
import StateManager from "./state_manager";
import { borderBoard, widthItem } from "../common";

export default class InputController extends Container {
    private keys: { [key: string]: boolean } = {};
    private buttons: { [key: string]: boolean } = {};
    private app: Application<HTMLCanvasElement>;
    private pieceManager: PieceManager;
    private stateManager: StateManager;
    private scaleScene: number;
    private move: { row: number, column: number }[] = [];

    constructor(scaleScene: number, app: Application<HTMLCanvasElement>) {
        super();
        this.app = app;
        this.scaleScene = scaleScene;
        this.pieceManager = PieceManager.getInstance();
        this.stateManager = StateManager.getInstance();
    }

    public update(delta: number) {
        delta
        this.pieceManager
        this.stateManager
        this.scaleScene
    }

    public load() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('mousedown', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const rect = this.app.view.getBoundingClientRect();
            const gameX = (mouseX - rect.left);
            const gameY = (mouseY - rect.top);

            const row = Math.floor((gameY - borderBoard) / widthItem);
            const column = Math.floor((gameX - borderBoard) / widthItem);

            if (row <= 7 && row >= 0 && column <= 7 && column >= 0) {
                
                // this.stateManager.boardState.forEach((rowItem, rowIndex) => {
                //     rowItem.forEach((columnItem, columnIndex) => {
                        
                //     })
                // });
                let breakFor = false;

                for (let i: number = 0; i < this.stateManager.boardState.length; ++i) {
                    for (let j: number = 0; j < this.stateManager.boardState[i].length; ++j) {

                        if (breakFor) break;

                        if (this.stateManager.boardState[i][j].piece != null && i == row && j == column) {
                            if (this.move.length == 0) {
                                const focus = this.stateManager.boardState[i][j].focus;
                                if (focus) {
                                    this.removeChild(focus);
                                    this.stateManager.boardState[i][j].focus = null;
                                }
    
                                const rect = new Graphics();
                                rect.lineStyle(2, 0x000000);
                                rect.drawRect(this.stateManager.boardState[i][j].post.x - widthItem / 2, this.stateManager.boardState[i][j].post.y - widthItem / 2, widthItem, widthItem);
                                this.addChild(rect);
    
                                this.stateManager.boardState[i][j].focus = rect;
                                this.move.push({ row: i, column: j });

                                breakFor = true;
                            } else {
                                const piece = this.stateManager.boardState[i][j].piece;
                                if (piece) {
                                    console.log("Check")
                                    this.pieceManager.removeChild(piece);
                                }
                                this.stateManager.boardState[i][j].piece = null;
                                this.stateManager.boardState[i][j].piece = this.stateManager.boardState[this.move[0].row][this.move[0].column].piece;
                                this.stateManager.boardState[this.move[0].row][this.move[0].column].piece = null;
                                this.stateManager.setPost();
                                this.move = [];
    
                                breakFor = true;
                            }
                        } else {
                            if (this.stateManager.boardState[i][j].focus) {
                                const focus = this.stateManager.boardState[i][j].focus;
                                if (focus) {
                                    this.removeChild(focus);
                                    this.stateManager.boardState[i][j].focus = null;
                                }
                            }
                        }
                    }
                }
            }

            console.log(this.move)

            

            console.log(`Mouse down at: (${row}, ${column})`);
        });
        window.addEventListener('mouseup', (e) => this.buttons[e.button] = false);
        window.addEventListener('mousemove', (e) => {
            e
        });
    }

    public isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    public isButtonPressed(button: string): boolean {
        return this.buttons[button] || false;
    }
}