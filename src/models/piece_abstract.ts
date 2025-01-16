import { Sprite, Texture } from "pixi.js";

export default class Piece extends Sprite {
    private value: number;
    private moved: boolean;

    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(texture);
        this.name = name;
        this.value = value;
        this.moved = moved;
        this.width = this.width * scaleScene;
        this.height = this.height * scaleScene;
    }

    public __init__() {
        this.value
        this.moved
    }
}