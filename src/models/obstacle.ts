import { Graphics } from "pixi.js";
import CircleCollider from "../collision/circle_collider";
import Collider from "../collision/collider_abstract";
import { screenWidth, screenHeight } from "../common";

export class Obstacle extends Graphics {
    public vx: number;
    public vy: number;
    public radius: number;
    public color: number;
    public collider: Collider;
    public checkState: boolean = true;

    constructor(vx: number, vy: number, radius: number, color: number) {
        super();
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;

        const pastColor = [
            "0xFF0000",
            "0xFFA500",
            "0xFFFF00",
            "0x00FF00",
            "0x0000FF",
            "0x4B0082",
            "0x8A2BE2"
        ];

        this.color = color;

        this.beginFill(pastColor[this.color]);
        this.drawCircle(this.x, this.y, this.radius || 0);
        this.endFill();

        this.collider = new CircleCollider(this.x, this.y, radius);

    }

    public update(delta: number): void {
        if (
            this.x <= 0 - this.radius || 
            this.x >= screenWidth + this.radius ||
            this.y <= 0 - this.radius || 
            this.y >= screenHeight + this.radius
        ) {
            if (this.checkState) {
                this.checkState = false;
            }
        }

        this.x = (this.x || 0) + (this.vx || 0) * delta;
        this.y = (this.y || 0) + (this.vy || 0) * delta;
        this.collider?.setX((this.x || 0) + (this.vx || 0) * delta);
        this.collider?.setY((this.y || 0) + (this.vy || 0) * delta);
    }
}