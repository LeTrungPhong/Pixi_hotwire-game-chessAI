import { Container, Graphics, Sprite, TextStyle, Text, Texture, Application } from "pixi.js";
import { heightGame, paddingHorizontal, paddingVertical, widthGame } from "../common";
import { app } from "..";
import SettingManager from "./setting_manager";

export default class Volume extends Container {

    private app: Application<HTMLCanvasElement>;

    private widthUI: number = 0;
    private heigthUI: number = 0;

    private lineVolume: Graphics = new Graphics();
    private lineNow: Graphics = new Graphics();
    private widthLineNow: number = 7;
    private lengthVolume: number = 0;
    private lengthNow: number = 0;
    private postX: number = 0;
    private postY: number = 0;
    public cursorDown: Sprite = new Sprite();
    private cursorCircle: Graphics = new Graphics();
    private booleanOverLineNow: boolean = false;
    private textCursorDown: Text = new Text();

    constructor(widthUI: number, heightUI: number) {
        super();

        this.app = app;
        this.app;

        this.heigthUI
        this.cursorDown
        this.booleanOverLineNow

        
        // this.volumeGame.x = -this.lengthVolume / 2;
        // this.volumeGame.y = this.space1 + 15 + heigthLineVolume / 2;

        this.widthUI = widthUI;
        this.heigthUI = heightUI;

        const heigthLineVolume = 10;
        this.lengthVolume = this.widthUI / 2;

        this.postX = 0 - paddingHorizontal + widthGame / 2 - (this.widthUI / 2) + this.widthUI * 1 / 4;
        this.postY = 0 - paddingVertical + heightGame / 2 + 30 + 15 + 10 / 2;

        
        this.lineVolume.beginFill(0xFFFFFF);
        this.lineVolume.drawRect(this.postX, this.postY - heigthLineVolume / 2, this.lengthVolume, heigthLineVolume);
        this.lineVolume.endFill();
        this.addChild(this.lineVolume);

        const heigthLineNow = 20;
        this.lengthNow = this.lengthVolume / 2;
        this.lineNow.beginFill(0xC0C0C0); 
        this.lineNow.drawRect(this.postX + this.lengthNow - this.widthLineNow / 2, this.postY - heigthLineNow / 2, this.widthLineNow, heigthLineNow);
        this.lineNow.endFill();
        this.addChild(this.lineNow);

        this.cursorCircle.beginFill(0x000000);
        this.cursorCircle.drawRect(this.postX, this.postY, 3, 3);
        this.cursorCircle.endFill();

        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: "#ffffff",
            fontSize: 10
        });
        this.textCursorDown.style = styly;
        this.textCursorDown.anchor.set(0.5);
    }

    public listen() {
        this.lineVolume.interactive = true;
        this.lineVolume.on("pointerover", () => {
            this.addChild(this.cursorDown);
            this.addChild(this.textCursorDown);
        });

        this.lineVolume.on('pointerout', () => {
            if (!this.booleanOverLineNow) {
                this.removeChild(this.cursorDown);
                this.removeChild(this.textCursorDown);
            }
        })

        this.lineVolume.on('mousemove', () => {
            const localPos = this.lineVolume.toLocal(this.app.renderer.events.pointer.global);
            this.moveVolume(localPos);
        })

        this.lineVolume.on('pointerdown', () => {
            const localPos = this.lineVolume.toLocal(this.app.renderer.events.pointer.global);
            this.setVolume(localPos);
        })

        this.lineNow.interactive = true;
        this.lineNow.on('pointerover', () => {
            this.app.renderer.view.style.cursor = "pointer";
        })

        this.lineNow.on('pointerout', () => {
            if (!this.booleanOverLineNow) {
                this.app.renderer.view.style.cursor = "default";
            }
        })

        this.lineNow.on('pointerdown', () => {
            this.booleanOverLineNow = true;
            this.addChild(this.cursorDown);
            this.addChild(this.textCursorDown);
        })

        window.addEventListener('mousemove', () => {
            if (this.booleanOverLineNow) {
                const localPos = this.lineVolume.toLocal(this.app.renderer.events.pointer.global);
                this.moveVolume(localPos);
                this.setVolume(localPos);
            }
        })

        window.addEventListener('pointerup', () => {
            this.app.renderer.view.style.cursor = "default";
            this.booleanOverLineNow = false;
            this.removeChild(this.cursorDown);
            this.removeChild(this.textCursorDown);
        })
    }

    public setVolume(localPos: any) {
        let length = (localPos.x - this.postX) / this.lengthVolume;
        if (length < 0) {
            length = 0;
        } else if (length > 1) {
            length = 1;
        }
        SettingManager.getInstance().setVolumeType("game", length);
        this.lengthNow = localPos.x - this.postX;
        this.lineNow.x = this.lengthNow - this.lengthVolume / 2 - this.lineNow.width / 2 + this.widthLineNow / 2;
    }

    public moveVolume(localPos: any) {
        if (localPos.x < this.postX) {
            localPos.x = this.postX;
        } else if (localPos.x > this.postX + this.lengthVolume) {
            localPos.x = this.postX + this.lengthVolume;
        }
        let length = (localPos.x - this.postX) / this.lengthVolume;
        if (length < 0) {
            length = 0;
        } else if (length > 1) {
            length = 1;
        }
        this.textCursorDown.text = `${Math.round(length * 100)}`;
        this.textCursorDown.x = localPos.x;
        this.cursorDown.x = localPos.x;
        this.cursorCircle.x = localPos.x - this.postX;
        this.cursorCircle.y = localPos.y - this.postY;
    }

    public spriteCursonDown(cursorDown: Texture) {
        this.cursorDown = Sprite.from(cursorDown);
        this.cursorDown.y = this.postY - 5;
        this.cursorDown.width = 30;
        this.cursorDown.height = 30;
        this.cursorDown.anchor.set(0.5, 1);
        this.textCursorDown.y = this.cursorDown.y - 30;
    }
}