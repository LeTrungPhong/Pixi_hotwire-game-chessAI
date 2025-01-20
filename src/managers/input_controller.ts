import { Application, Container } from "pixi.js";
import PieceManager from "./piece_manager";
import StateManager from "./state_manager";
import { borderBoard, widthItem } from "../common";
import { app } from "../index"

export default class InputController extends Container {
    private static instance: InputController;
    private keys: { [key: string]: boolean } = {};
    private buttons: { [key: string]: boolean } = {};
    private app: Application<HTMLCanvasElement>;
    private pieceManager: PieceManager;
    private stateManager: StateManager;
    private scaleScene: number;

    constructor(scaleScene: number) {
        super();
        this.app = app;
        this.scaleScene = scaleScene;
        this.pieceManager = PieceManager.getInstance();
        this.stateManager = StateManager.getInstance();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.addMouseDownEvent();
    }

    public static getInstance(scaleScene: number): InputController {
        if (!InputController.instance) {
            console.log("CHeck create")
            InputController.instance = new InputController(scaleScene);
        }
        return InputController.instance;
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
        // window.addEventListener('mousedown', (e) => {
            
        // });
        window.addEventListener('mouseup', (e) => this.buttons[e.button] = false);
        window.addEventListener('mousemove', (e) => {
            e
        });
    }

    handleMouseDown(e: MouseEvent): void {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const rect = this.app.view.getBoundingClientRect();
        const gameX = (mouseX - rect.left);
        const gameY = (mouseY - rect.top);

        const row = Math.floor((gameY - borderBoard) / widthItem);
        const column = Math.floor((gameX - borderBoard) / widthItem);

        if (row <= 7 && row >= 0 && column <= 7 && column >= 0) {
            for (let i: number = 0; i < this.stateManager.boardState.length; ++i) {
                for (let j: number = 0; j < this.stateManager.boardState[i].length; ++j) {

                }
            }
            this.stateManager.updateFocus(row, column);
        }

        console.log(`Mouse down at: (${row}, ${column})`);
    };

    public addMouseDownEvent(): void {
        window.addEventListener('mousedown', this.handleMouseDown);
    }

    public removeMouseDownEvent(): void {
        window.removeEventListener('mousedown', this.handleMouseDown);
    }

    public isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    public isButtonPressed(button: string): boolean {
        return this.buttons[button] || false;
    }
}