import { Application, Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { paddingVertical, paddingHorizontal, paddingContent, sizeButtonSetting, widthBoard, widthGame, heightGame } from "../common";
import StateManager from "./state_manager";
import SoundManager from "./sound_manager";
import { app } from "..";

export default class SettingManager extends Container {
    private static instance: SettingManager;

    private app: Application<HTMLCanvasElement>;

    // button setting
    private buttonSetting: Sprite = new Sprite();
    private angleButtonSetting: number = 0;
    private checkButtonRotate: boolean = false;
    private speedButtonSetting: number = 10;

    // UI
    private ui: Graphics = new Graphics();
    private widthUI = 0;
    private heightUI = 0;

    // line volume
    private lineVolume: Graphics = new Graphics();
    private lineNow: Graphics = new Graphics();
    private widthLineNow: number = 7;
    private lengthVolume: number = 0;
    private lengthNow: number = 0;
    private postX: number = 0;
    private postY: number = 0;
    private cursorDown: Sprite = new Sprite();
    private cursorCircle: Graphics = new Graphics();
    private booleanOverLineNow: boolean = false;
    private textCursorDown: Text = new Text();
    private close: Sprite = new Sprite();

    constructor() {
        super();

        this.app = app;
        this.app

        this.ui.beginFill(0x00000, 0.8); 
        this.widthUI = widthGame * 3 / 4;
        this.heightUI = heightGame * 3 / 4;
        this.postX = 0 - paddingHorizontal + widthGame / 2 - (this.widthUI / 2) + this.widthUI * 1 / 4;
        this.postY = 0 - paddingVertical + heightGame / 2;
        this.ui.drawRoundedRect(0 - paddingHorizontal + widthGame / 2 - this.widthUI / 2, 0 - paddingVertical + heightGame / 2 - this.heightUI / 2, this.widthUI, this.heightUI, 10); 
        this.ui.endFill(); 
        // this.addChild(this.ui);

        const heigthLineVolume = 10;
        this.lengthVolume = this.widthUI / 2;
        this.lineVolume.beginFill(0xFFFFFF);
        this.lineVolume.drawRect(this.postX, this.postY - heigthLineVolume / 2, this.lengthVolume, heigthLineVolume);
        this.lineVolume.endFill();
        this.ui.addChild(this.lineVolume);

        const heigthLineNow = 20;
        this.lengthNow = this.lengthVolume / 2;
        this.lineNow.beginFill(0xC0C0C0); 
        this.lineNow.drawRect(this.postX + this.lengthNow - this.widthLineNow / 2, this.postY - heigthLineNow / 2, this.widthLineNow, heigthLineNow);
        this.lineNow.endFill();
        this.ui.addChild(this.lineNow);

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
        this.ui.addChild(this.textCursorDown);

        
    }

    public update(deltaTime: number) {
        deltaTime
        if (this.checkButtonRotate) {
            this.angleButtonSetting += this.speedButtonSetting;
            if (this.angleButtonSetting > 90) {
                this.angleButtonSetting = 90;
            }
            this.buttonSetting.angle = this.angleButtonSetting;
        } else {
            this.angleButtonSetting -= this.speedButtonSetting;
            if (this.angleButtonSetting < 0) {
                this.angleButtonSetting = 0;
            }
            this.buttonSetting.angle = this.angleButtonSetting;
        }
    }

    public listen() {

        // this.ui.interactive = true;
        // this.ui.on('pointerup', () => {
        //     this.booleanOverLineNow = false;
        //     // this.ui.cursor = 'default';
        // })

        // this.ui.on('mousemove', (e) => {
            
        // })


        this.buttonSetting.interactive = true;
        this.buttonSetting.on('pointerover', () => {
            this.checkButtonRotate = true;
            this.buttonSetting.cursor = 'pointer';
            StateManager.getInstance().booleanState = false;
        });
        this.buttonSetting.on('pointerout', () => {
            this.checkButtonRotate = false;
            this.buttonSetting.cursor = 'default';
            StateManager.getInstance().booleanState = true;
        })
        this.buttonSetting.on('pointerdown', () => {
            this.addChild(this.ui);
        })

        this.lineVolume.interactive = true;
        this.lineVolume.on('pointerdown', (e) => {
            const localPos = this.lineVolume.toLocal(e.global);
            this.setVolume(localPos);
        });
        this.lineVolume.on('pointerover', () => {
            // this.lineVolume.cursor = 'none';
            this.ui.addChild(this.cursorDown);
            // this.ui.addChild(this.cursorCircle);
            this.ui.addChild(this.textCursorDown);
        });
        this.lineVolume.on('pointerout', () => {
            if (!this.booleanOverLineNow) {
                this.ui.removeChild(this.cursorDown);
                this.ui.removeChild(this.textCursorDown);
            }
            // this.ui.removeChild(this.cursorCircle);
        });
        this.lineVolume.on('mousemove', (e) => {
            const localPos = this.lineVolume.toLocal(e.global);
            this.moveVolume(localPos);
        })

        this.lineNow.interactive = true;
        this.lineNow.on('pointerdown', () => {
            this.booleanOverLineNow = true;
            this.ui.addChild(this.cursorDown);
            this.ui.addChild(this.textCursorDown);
            this.app.renderer.view.style.cursor = "pointer";
        })

        this.lineNow.on('pointerover', () => {
            this.app.renderer.view.style.cursor = "pointer";
        })

        this.lineNow.on('pointerout', () => {
            if (!this.booleanOverLineNow) {
                this.app.renderer.view.style.cursor = "default";
            }
        })


        
        window.addEventListener('pointerup', () => {
            this.app.renderer.view.style.cursor = "default";
            this.booleanOverLineNow = false;
            this.ui.removeChild(this.cursorDown);
            this.ui.removeChild(this.cursorCircle);
            this.ui.removeChild(this.textCursorDown);
        })

        window.addEventListener('mousemove', () => {
            if (this.booleanOverLineNow) {
                this.ui.removeChild(this.cursorCircle);
                const localPos = this.lineVolume.toLocal(this.app.renderer.events.pointer.global);
                this.moveVolume(localPos);
                this.setVolume(localPos);
            }
        })

        this.close.interactive = true;
        this.close.on('pointerover', () => {
            this.close.cursor = 'pointer';
        })
        this.close.on('pointerdown', () => {
            this.removeChild(this.ui);
        })
    }

    public setVolume(localPos: any) {
        let length = (localPos.x - this.postX) / this.lengthVolume;
        if (length < 0) {
            length = 0;
        } else if (length > 1) {
            length = 1;
        }
        SoundManager.getInstance().volume('breezy', length);
        // this.textCursorDown.text = `${length}`;
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

    public static getInstance(): SettingManager {
        if (!SettingManager.instance) {
            console.log("new setting manager");
            SettingManager.instance = new SettingManager();
        }
        return SettingManager.instance;
    }

    public addTexture(name: string, texture: Texture) {
        switch(name) {
            case 'setting':
                this.buttonSetting = Sprite.from(texture);
                this.buttonSetting.anchor.set(0.5);
                this.buttonSetting.width = sizeButtonSetting;
                this.buttonSetting.height = sizeButtonSetting;
                const postX = widthBoard + paddingHorizontal - sizeButtonSetting / 2 - paddingContent;
                const postY = 0 - paddingVertical + sizeButtonSetting / 2 + paddingContent;
                this.buttonSetting.x = postX;
                this.buttonSetting.y = postY;
                this.addChild(this.buttonSetting);
                break;
            case 'cursor-down':
                this.cursorDown = Sprite.from(texture);
                this.cursorDown.anchor.set(0.5, 1);
                this.cursorDown.y = this.postY - 5;
                this.cursorDown.width = 30;
                this.cursorDown.height = 30;
                this.textCursorDown.y = this.postY - this.cursorDown.height - 6;
                break;
            case 'close':
                this.close = Sprite.from(texture);
                this.close.width = 30;
                this.close.height = 30;
                this.close.anchor.set(0.5);
                this.close.x = 0 - paddingHorizontal + widthGame / 2 - (this.widthUI / 2) + this.widthUI - this.close.width;
                this.close.y = 0 - paddingVertical + heightGame / 2 - (this.heightUI / 2) + this.close.height;
                this.ui.addChild(this.close);
                break;
            default: 
                break;
        }
    }
}