import { Assets, Container, Sprite, Texture } from "pixi.js";

export class PlayerController extends Container {
    private spriteFrog?: Sprite;
    private postX?: number;
    private postY?: number;

    constructor(postX: number, postY: number) {
        super();

        this.postX = postX;
        this.postY = postY;
    }

    public async loadImage(): Promise<void> {
        try {
            const frogTexture: Texture = await Assets.load("assets/images/frog.png");

            this.spriteFrog = new Sprite(frogTexture);
            this.spriteFrog.anchor.set(0.5);
            this.spriteFrog.x = (this.postX || 0);
            this.spriteFrog.y = (this.postY || 0);
            this.spriteFrog.width = 100;
            this.spriteFrog.height = 100;
            this.spriteFrog.rotation = 0;

            this.addChild(this.spriteFrog);

            console.log("Tai anh player thanh cong");

        } catch (error) {
            console.error("Error loading image:", error);
        }
    }

    public updatePost(mouseX: number, mouseY: number) {
        if (this.spriteFrog) {
            const dx = mouseX - (this.postX || 0);
            const dy = mouseY - (this.postY || 0);

            const angle = Math.atan2(dy, dx) - Math.PI / 2;


            // this.spriteFrog.rotation = (this.numberDeg * (180 / Math.PI)) || 0;

            this.spriteFrog.rotation = angle;
        }
    }
}