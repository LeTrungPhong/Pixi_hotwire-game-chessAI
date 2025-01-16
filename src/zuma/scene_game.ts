import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { InputController } from "./input_controller";
import { PlayerController } from "./player_controller";
import ObstacleBulletManager from "./obstacle_bullet_manager";
import { screenWidth, screenHeight } from "./common";
import ObstacleMoveManager from "./obstacle_move_manager";

export class Scene extends Container {
    private readonly screenWidth: number;
    private readonly screenHeight: number;
    private inputController?: InputController;
    private playerController?: PlayerController;
    private obstacleBulletManager?: ObstacleBulletManager;
    private obstacleMoveManager?: ObstacleMoveManager;

    private arrayLine: { x: number, y: number }[] = [];
    // private numberObstacle?: number;

    constructor(canvasX: number, canvasY: number) {
        super();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        
        this.initialize(canvasX, canvasY);
        // console.log(this.arrayLine)
        
        this.sortableChildren = true;
        

        // const newGraphics: Graphics = new Graphics();
        // newGraphics.x = 100;
        // newGraphics.y = 100;
        // newGraphics.beginFill(0xFF00FF);
        // newGraphics.lineStyle(10, 0x00FF00);
        // newGraphics.drawCircle(0, 0, 25); 
        // newGraphics.endFill();

        // this.addChild(newGraphics); 

        // this.loadData();
    }

    private async initialize(canvasX: number, canvasY: number) {
        try {
            const background: Texture = await Assets.load("assets/images/background.jpg");
            const backgroundSprite: Sprite = new Sprite(background);
            backgroundSprite.x = 0;
            backgroundSprite.y = 0;
            // this.addChildAt(backgroundSprite, 0);

            await this.playerController?.loadImage();

            const response = await fetch("assets/levels/level_1.json");
            const level = await response.json();
            this.processLevelData(level);

            const postX = this.screenWidth / 2;
            const postY = this.screenHeight / 2;

            this.playerController = new PlayerController(postX, postY);
            this.playerController.loadImage();
            this.obstacleBulletManager = new ObstacleBulletManager(postX, postY);
            this.obstacleMoveManager = new ObstacleMoveManager(20 ,this.arrayLine);

            this.inputController = new InputController(canvasX, canvasY, this.playerController, this.obstacleBulletManager, this.obstacleMoveManager);
            this.inputController.load();

            this.addChild(this.playerController);
            this.addChild(this.obstacleBulletManager);
            this.addChild(this.obstacleMoveManager);
        } catch (error) {
            console.error("Error loading player" + error);
        }
    }

    public update(delta: number) {
        this.inputController?.update(delta);
        // console.log("Check")
    }

    private processLevelData(data: any) {
        var postLast = { x: 0, y: 0 };

        if (data) {
            // this.numberObstacle = data.number_of_obstacle;

            if (data.line) {
                data.line.forEach((point: { x: number, y: number }) => {
                    // const graphics = new Graphics();
                    // graphics.beginFill(0xFF00FF);
                    // graphics.drawCircle(point.x, point.y, 5);
                    // graphics.endFill();
                    // this.addChild(graphics);
    
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

    private async loadData() {
        try {
            const response = await fetch("assets/levels/level_1.json");
            const level = await response.json();
            this.processLevelData(level);
        } catch (error) {
            console.error("Error fetching level data: " + error);
        }

        requestAnimationFrame(() => this.loadData());
    }
}