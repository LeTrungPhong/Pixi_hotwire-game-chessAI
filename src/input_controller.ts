import { PlayerController } from "./player_controller";

export class InputController {
    private keys: { [key: string]: boolean } = {};
    private buttons: { [key: string]: boolean } = {};
    private mouseX?: number;
    private mouseY?: number;
    private rectX?: number;
    private rectY?: number;

    private playerController?: PlayerController;

    constructor(rectX: number, rectY: number, playerController: PlayerController) {
        this.rectX = rectX;
        this.rectY = rectY;
        this.playerController = playerController;
    }

    public load() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('mousedown', (e) => this.buttons[e.button] = true);
        window.addEventListener('mouseup', (e) => this.buttons[e.button] = false);
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX - (this.rectX || 0);
            this.mouseY = e.clientY - (this.rectY || 0);

            this.playerController?.updatePost(this.mouseX, this.mouseY);
        });
    }

    public isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    public isButtonPressed(button: string): boolean {
        return this.buttons[button] || false;
    }

    public getMouseX(): number {
        return this.mouseX || 0;
    }

    public getMouseY(): number {
        return this.mouseY || 0;
    }
}