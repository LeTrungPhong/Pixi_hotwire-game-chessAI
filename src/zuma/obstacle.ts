import { Graphics } from "pixi.js";
import CircleCollider from "../collision/circle_collider";
import Collider from "../collision/collider_abstract";
import { screenWidth, screenHeight } from "./common";

export class Obstacle extends Graphics {
    public vx: number;
    public vy: number;
    public radius: number;
    public color: number;
    public collider: Collider;
    public checkState: boolean = true;
    public type: string;

    constructor(vx: number, vy: number, radius: number, color: number, type: string) {
        super();
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.type = type;

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

        this.x = this.x + this.vx * delta;
        this.y = this.y + this.vy * delta;
        this.collider.x = this.x;
        this.collider.y = this.y;
    }
}