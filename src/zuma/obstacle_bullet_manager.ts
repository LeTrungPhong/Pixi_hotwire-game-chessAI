import { Container } from "pixi.js";
import { Obstacle } from "./obstacle";

export default class ObstacleBulletManager extends Container {
    public listBullet: Obstacle[] = [];
    private postX: number;
    private postY: number;
    private timeSpace: number = 0;

    constructor(x: number, y: number) {
        super();
        this.x = 0;
        this.y = 0;
        this.postX = x;
        this.postY = y;

        this.postX
        this.postY

        this.addNewBullet();
        this.addNewBullet();
        this.addNewBullet();
        this.addNewBullet();
        this.addNewBullet();
    }

    public update(delta: number) {
        // const listDelete = [];
        for (let i = 0; i < this.listBullet.length; ++i) {
            this.listBullet[i].update(delta);

            if (this.listBullet[i].checkState == false) {
                this.removeChild(this.listBullet[i]);
                this.listBullet.splice(i, 1);
            }
        }

        this.timeSpace += delta;
    }

    public createNewBullet(): Obstacle {
        const randomNumber = Math.floor(Math.random() * 7);
        const newObstacle = new Obstacle(0, 0, 20, randomNumber, "bullet");
        newObstacle.x = this.postX;
        newObstacle.y = this.postY;
        return newObstacle;
    }

    public addNewBullet(): void {
        const newObstacle = this.createNewBullet();
        this.listBullet?.push(newObstacle);
        this.addChildAt(newObstacle, 0);
    }

    public shot(mouseX: number, mouseY: number): void {

        if (this.listBullet.length > 0 && this.timeSpace > 0.2) {
            const vectorDirect = { x: mouseX - this.postX, y: mouseY - this.postY };
            const distance = Math.sqrt(vectorDirect.x * vectorDirect.x + vectorDirect.y * vectorDirect.y);
            const vectorNorm = { x: vectorDirect.x / distance, y: vectorDirect.y / distance };
            const speed = 400;
            const v = { x: vectorNorm.x * speed, y: vectorNorm.y * speed };
            for (let i = 0; i < this.listBullet.length; ++i) {
                if (this.listBullet[i].vx == 0 && this.listBullet[i].vy == 0) {
                    this.listBullet[i].vx = v.x;
                    this.listBullet[i].vy = v.y;

                    this.addNewBullet();
                    this.timeSpace = 0;
                    break;
                }
            }
            // console.log("Obstacle velocity set to 30");
        } else {
            // console.log("No obstacles in listBullet");
        }
    }
}