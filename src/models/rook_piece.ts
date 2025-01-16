import { Texture } from "pixi.js";
import Piece from "./piece_abstract";

export default class Rook extends Piece {
    constructor(name: string, value: number, moved: boolean, scaleScene: number, texture?: Texture) {
        super(name, value, moved, scaleScene, texture);
    }
}

// duc