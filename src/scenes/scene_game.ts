import { Container } from "pixi.js";
import { InputController } from "../input_controller";
import { PlayerController } from "../player_controller";

export class Scene extends Container {
    private readonly screenWidth: number;
    private readonly screenHeight: number;
    private inputController?: InputController;
    private playerController?: PlayerController;


    constructor(screenWidth: number, screenHeight: number, canvasX: number, canvasY: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.playerController = new PlayerController(this.screenWidth, this.screenHeight);
        
        this.inputController = new InputController(canvasX, canvasY, this.playerController);
        this.inputController.load();
        
        
        

        // const newGraphics: Graphics = new Graphics();
        // newGraphics.x = 100;
        // newGraphics.y = 100;
        // newGraphics.beginFill(0xFF00FF);
        // newGraphics.lineStyle(10, 0x00FF00);
        // newGraphics.drawCircle(0, 0, 25); 
        // newGraphics.endFill();

        // this.addChild(newGraphics);
        this.addChild(this.playerController);
        this.initialize();
    }

    private async initialize() {
        try {
            await this.playerController?.loadImage();
        } catch (error) {
            console.error("Error loading player" + error);
        }
    }
}