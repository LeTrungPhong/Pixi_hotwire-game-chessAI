export default abstract class Collider {
    public x: number;
    public y: number;
    public type: number;

    constructor(x: number, y: number, type: number) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    abstract checkCollision(other: Collider): boolean;
    abstract onCollision(other: Collider): void;
}