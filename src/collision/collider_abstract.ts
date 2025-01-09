export default abstract class Collider {
    private x?: number;
    private y?: number;
    private type?: number;

    constructor(x: number, y: number, type: number) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    abstract checkCollision(other: Collider): boolean;
    abstract onCollision(other: Collider): void;

    public getX(): number {
        return this.x || 0;
    }

    public getY(): number {
        return this.y || 0;
    }

    public getType(): number {
        return this.type || -1;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }
}