import Collider from "../collision/collider_abstract";

export default class GameObject {
    public x?: number;
    public y?: number;
    public vx?: number;
    public vy?: number;
    public collider?: Collider;

    constructor(x: number, y: number, vx: number, vy: number, collider: Collider) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.collider = collider;
    }

    update(delta: number) {
        this.x
        this.y
        this.vx
        this.vy
        this.collider
        delta
    }
}