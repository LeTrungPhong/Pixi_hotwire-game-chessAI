import Piece from "../models/piece_abstract";

export default class PieceManager {
    private static instance: PieceManager;
    private listPiece: Array<Piece> = [];

    constructor() {

    }

    public addPiece(piece: Piece) {
        this.listPiece.push(piece);
    }

    public static getInstance(): PieceManager {
        if (!PieceManager.instance) {
            PieceManager.instance = new PieceManager();
        }
        return PieceManager.instance;
    }
}