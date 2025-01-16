import { Sprite, Texture } from "pixi.js";
import { heightBoard, widthBoard } from "../common";

export default class BoardScene extends Sprite {
    constructor(texture?: Texture) {
        super(texture);
        this.width = widthBoard;
        this.height = heightBoard;
    }
}