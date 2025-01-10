import ObstacleBulletManager from "./managers/obstacle_bullet_manager";
import { PlayerController } from "./player_controller";

export class InputController {
    private keys: { [key: string]: boolean } = {};
    private buttons: { [key: string]: boolean } = {};
    private mouseX?: number;
    private mouseY?: number;
    private rectX?: number;
    private rectY?: number;

    private playerController?: PlayerController;
    private obstacleBulletManager?: ObstacleBulletManager;

    constructor(rectX: number, rectY: number, playerController: PlayerController, obstacleBulletManager: ObstacleBulletManager) {
        this.rectX = rectX;
        this.rectY = rectY;
        this.playerController = playerController;
        this.obstacleBulletManager = obstacleBulletManager;
    }

    public update(delta: number) {
        this.obstacleBulletManager?.update(delta);

        // console.log("Check")
    }

    public load() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('mousedown', (e) => {
            this.buttons[e.button] = true

            // this.mouseX = e.clientX - (this.rectX || 0);
            // this.mouseY = e.clientY - (this.rectY || 0);

            // this.sendMousePositionToServer(this.mouseX, this.mouseY);

            this.mouseX = e.clientX - (this.rectX || 0);
            this.mouseY = e.clientY - (this.rectY || 0);
            this.obstacleBulletManager?.shot(this.mouseX, this.mouseY);
        });
        window.addEventListener('mouseup', (e) => this.buttons[e.button] = false);
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX - (this.rectX || 0);
            this.mouseY = e.clientY - (this.rectY || 0);

            this.playerController?.updatePost(this.mouseX, this.mouseY);
        });
    }

    // private sendMousePositionToServer(mouseX: number, mouseY: number) {
    //     fetch('http://localhost:3000/update-mouse-position', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ mouseX, mouseY })
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             return response.json().then(err => { throw new Error(`${err.error}: ${err.details}`); });
    //         }
    //         return response.json();
    //     })
    //     .then(data => console.log('Mouse position sent to server:', data))
    //     .catch(error => console.error('Error sending mouse position to server:', error));
    // }

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