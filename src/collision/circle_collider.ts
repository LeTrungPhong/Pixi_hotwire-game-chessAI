import Collider from "./collider_abstract";

export default class CircleCollider extends Collider{
    private radius?: number;

    constructor(x: number, y: number, radius: number) {
        super(x, y, 1);

        this.radius = radius;
    }

    public override checkCollision(other: Collider): boolean {
        if (other instanceof CircleCollider) {
            const dx = this.getX() - other.getX();
            const dy = this.getY() - other.getY();
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (this.getRadius() + other.getRadius());
        }
        return false;
    }

    public override onCollision(other: Collider): void {
        other
    }

    public getRadius(): number {
        return this.radius || 0;
    }
}