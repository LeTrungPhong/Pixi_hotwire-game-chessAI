import Collider from "./collider_abstract";

export default class CircleCollider extends Collider {
    public radius: number;

    constructor(x: number, y: number, radius: number) {
        super(x, y, 1);

        this.radius = radius;
    }

    public override checkCollision(other: Collider): boolean {
        if (other instanceof CircleCollider) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // console.log(this.x + " " + other.x)
            return distance < (this.radius + other.radius);
        }
        return false;
    }

    public override onCollision(other: Collider): void {
        other
    }
}