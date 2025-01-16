import { Container } from "pixi.js";
import { Obstacle } from "./obstacle";

export default class ObstacleMoveManager extends Container {
    private number: number;
    public listObstacle: { 
        state: boolean,
        obstacle: Obstacle, 
        animation: {
            index: { start: number, end: number }
            start: { x: number, y: number },
            end: { x: number, y: number },
            duration: number,
            startTime: number,
            time: number
        }
    }[] = [];
    private arrayLine: { x: number, y: number }[] = [];
    private index: number = 0;
    private timeSpace: number = 0.7;
    private timeCount: number = 0;
    private spawnX = 0;
    private spawnY = -50;
    private speedFirst = 1;
    private speedAfter = 0.7;

    constructor(number: number, arrayLine: { x: number, y: number }[]) {
        super();

        this.arrayLine = arrayLine;
        this.number = number;

        for (let i = 0; i < this.number; ++i) {
            this.addNewObstacle();
        }
    }

    public update(delta: number) {
        this.timeCount += delta;

        if (this.timeCount >= this.timeSpace && this.index < this.listObstacle.length) {
            this.listObstacle[this.index].state = true;
            this.index++;
            this.timeCount = 0;
        }



        for (let i = 0; i < this.listObstacle.length; ++i) {
            this.listObstacle[i].obstacle.update(delta);

            if (this.listObstacle[i].state) {
                if (i == 0 || this.listObstacle[i].obstacle.collider.checkCollision(this.listObstacle[i - 1].obstacle.collider) == false) {
                    this.listObstacle[i].animation.time += delta;

                    let elapsed = this.listObstacle[i].animation.time - this.listObstacle[i].animation.startTime;
                    let t = Math.min(elapsed / this.listObstacle[i].animation.duration, 1);

                    this.listObstacle[i].obstacle.x = this.lerp(this.listObstacle[i].animation.start.x, this.listObstacle[i].animation.end.x, t);
                    this.listObstacle[i].obstacle.y = this.lerp(this.listObstacle[i].animation.start.y, this.listObstacle[i].animation.end.y, t);

                    if (t == 1 && this.listObstacle[i].animation.index.end < this.arrayLine.length - 1) {
                        const index = { start: this.listObstacle[i].animation.index.start + 1, end: this.listObstacle[i].animation.index.end + 1 }

                        this.listObstacle[i].animation = {
                            index: { start: index.start, end: index.end },
                            start: { x: this.arrayLine[index.start].x, y: this.arrayLine[index.start].y },
                            end: { x: this.arrayLine[index.end].x, y: this.arrayLine[index.end].y },
                            duration: i == 0 ? this.speedFirst : this.speedAfter,
                            startTime: 0,
                            time: 0
                        }
                    }
                }
            }
        }
    }
    
    public lerp(start: number, end: number, t: number) {
        return start + (end - start) * t;
    }

    public createNewObstacle(): Obstacle {
        const randomNumber = Math.floor(Math.random() * 7);
        this.spawnX += 50;
        const newObstacle = new Obstacle(0, 0, 20, randomNumber, "move");
        newObstacle.x = this.spawnX;
        newObstacle.y = this.spawnY;
        return newObstacle;
    }

    public addNewObstacle(): void {
        const newObstacle = this.createNewObstacle();
        this.listObstacle.push({
            state: false,
            obstacle: newObstacle, 
            animation: {
                index: { start: 0, end: 1 }, 
                start: { x: this.arrayLine[0].x, y: this.arrayLine[0].y },
                end: { x: this.arrayLine[1].x, y: this.arrayLine[1].y },
                duration: this.listObstacle.length == 0 ? this.speedFirst : this.speedAfter,
                startTime: 0,
                time: 0
            }
        });
        this.addChild(newObstacle);
    }
}