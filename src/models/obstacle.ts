import CircleCollider from "../collision/circle_collider";
import GameObject from "./game_object";

export class Obstacle extends GameObject {
    private color?: number;

    constructor(x: number, y: number, vx: number, vy: number, radius: number, color: number) {
        super(x, y, vx, vy, new CircleCollider(x, y, radius));

        this.color = color;
    }

    public override update(delta: number): void {
        this.color

        this.x = (this.x || 0) + (this.vx || 0) * delta;
        this.y = (this.y || 0) + (this.vy || 0) * delta;
        this.collider?.setX((this.x || 0) + (this.vx || 0) * delta);
        this.collider?.setY((this.y || 0) + (this.vy || 0) * delta);
    }
}