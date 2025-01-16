import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Bishop extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(name, value, moved, scaleScene, texture);
    }
}