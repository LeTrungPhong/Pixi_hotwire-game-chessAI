import { Sprite, Texture } from "pixi.js";

export default abstract class Piece extends Sprite {
    private value: number;
    public moved: boolean;

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

    public getMoved(){
        return this.moved
    }

    public setMoved(moved: boolean){
        this.moved = moved
    }

    public getName() {
        return this.name
    }

    public abstract move(boardState: any, statrX: number, startY: number): { indexX: number, indexY: number }[];

    public abstract cloneObject(): Piece;
}