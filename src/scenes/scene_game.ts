import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { InputController } from "../input_controller";
import { PlayerController } from "../player_controller";

export class Scene extends Container {
    private readonly screenWidth: number;
    private readonly screenHeight: number;
    private inputController?: InputController;
    private playerController?: PlayerController;

    private arrayLine: { x: number, y: number }[] = [];
    private numberObstacle?: number;

    constructor(screenWidth: number, screenHeight: number, canvasX: number, canvasY: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.playerController = new PlayerController(this.screenWidth / 2, this.screenHeight / 2);
        
        this.inputController = new InputController(canvasX, canvasY, this.playerController);
        this.inputController.load();
        
        this.sortableChildren = true;
        

        // const newGraphics: Graphics = new Graphics();
        // newGraphics.x = 100;
        // newGraphics.y = 100;
        // newGraphics.beginFill(0xFF00FF);
        // newGraphics.lineStyle(10, 0x00FF00);
        // newGraphics.drawCircle(0, 0, 25); 
        // newGraphics.endFill();

        // this.addChild(newGraphics);
        this.initialize();
        this.addChild(this.playerController);

        // this.update();
    }

    private async initialize() {
        try {
            const background: Texture = await Assets.load("assets/images/background.jpg");
            const backgroundSprite: Sprite = new Sprite(background);
            backgroundSprite.x = 0;
            backgroundSprite.y = 0;
            this.addChildAt(backgroundSprite, 0);

            await this.playerController?.loadImage();

            const response = await fetch("assets/levels/level_1.json");
            const level = await response.json();
            this.processLevelData(level);

        } catch (error) {
            console.error("Error loading player" + error);
        }
    }

    private processLevelData(data: any) {
        var postLast = { x: 0, y: 0 };

        if (data) {
            this.numberObstacle = data.number_of_obstacle;
            console.log(`Number of obstacle: ${this.numberObstacle}`);

            if (data.line) {
                data.line.forEach((point: { x: number, y: number }) => {
                    const graphics = new Graphics();
                    graphics.beginFill(0xFF00FF);
                    graphics.drawCircle(point.x, point.y, 5);
                    graphics.endFill();
                    this.addChild(graphics);
    
                    if (postLast.x !== 0 && postLast.y !== 0) {
                        const graphicsLine = new Graphics();
                        graphicsLine.lineStyle(2, 0x0000FF);
                        graphicsLine.moveTo(postLast.x, postLast.y);
                        graphicsLine.lineTo(point.x, point.y);
                        this.addChild(graphicsLine);
                    }
    
                    postLast = point;
    
                    this.addLine(point.x, point.y);
                });
            }
        }
    }

    addLine(x: number, y: number): void {
        this.arrayLine.push({ x, y });
    }

    private async update() {
        try {
            const response = await fetch("assets/levels/level_1.json");
            const level = await response.json();
            this.processLevelData(level);
        } catch (error) {
            console.error("Error fetching level data: " + error);
        }

        requestAnimationFrame(() => this.update());
    }
}