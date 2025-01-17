import { Sprite, Texture } from "pixi.js";

export default abstract class Piece extends Sprite {
    private value: number;
    private moved: boolean;

    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(texture);
        this.name = name;
        this.value = value;
        this.moved = moved;
        this.width = this.width * scaleScene * 75 / 100;
        this.height = this.height * scaleScene * 75 / 100;
        this.anchor.set(0.5);
    }

    public __init__() {
        this.value
        this.moved
    }

    public setValue(newValue: number){
        this.value = newValue
    }

    public getValue(){
        return this.value
    }

    public abstract move(boardState: any, statrY: number, startX: number): { indexX: number, indexY: number }[];
}