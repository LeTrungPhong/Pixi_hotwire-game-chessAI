import { Container } from "pixi.js";
import Piece from "../models/piece_abstract";

export default class PieceManager extends Container {
    private static instance: PieceManager;
    private listPiece: Array<Piece> = [];

    constructor() {
        super();
    }

    public addPiece(piece: Piece) {
        this.listPiece.push(piece);
        this.addChild(piece);
    }

    public removePiece(piece: Piece | null) {
        if( piece == null ) return;
        const index = this.listPiece.indexOf(piece);
        if (index > -1) {
            this.listPiece.splice(index, 1);
            this.removeChild(piece);
        }
    }

    public static getInstance(): PieceManager {
        if (!PieceManager.instance) {
            PieceManager.instance = new PieceManager();
        }
        return PieceManager.instance;
    }
}