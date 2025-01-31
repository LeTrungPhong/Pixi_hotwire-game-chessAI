import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { paddingVertical, paddingHorizontal, paddingContent, sizeButtonSetting, widthBoard, widthGame, heightGame } from "../common";
import StateManager from "./state_manager";
import { app } from "..";
import SoundManager from "./sound_manager";

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

    // line volume
    private lineVolume: Graphics = new Graphics();
    private lineNow: Graphics = new Graphics();
    private lengthVolume: number = 0;
    private lengthNow: number = 0;
    private postX: number = 0;
    private postY: number = 0;

    constructor() {
        super();
        this.app = app;

        this.ui.beginFill(0x00000, 0.8); 
        const widthUI = widthGame * 3 / 4;
        const heightUI = heightGame * 3 / 4;
        this.postX = 0 - paddingHorizontal + widthGame / 2 - (widthUI / 2) + widthUI * 1 / 4;
        this.postY = 0 - paddingVertical + heightGame / 2;
        this.ui.drawRoundedRect(0 - paddingHorizontal + widthGame / 2 - widthUI / 2, 0 - paddingVertical + heightGame / 2 - heightUI / 2, widthUI, heightUI, 10); 
        this.ui.endFill(); 
        this.addChild(this.ui);

        this.lengthVolume = widthUI / 2;
        this.lineVolume.beginFill(0xFFFFFF);
        this.lineVolume.drawRect(this.postX, this.postY, this.lengthVolume, 5);
        this.lineVolume.endFill();
        this.ui.addChild(this.lineVolume);

        this.lengthNow = this.lengthVolume / 2;
        this.lineNow.beginFill(0xC0C0C0); 
        this.lineNow.drawRect(this.postX + this.lengthNow, this.postY - 10 + 5 / 2, 5, 20);
        this.lineNow.endFill();
        this.ui.addChild(this.lineNow);
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
        this.app
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

        this.lineVolume.interactive = true;
        this.lineVolume.on('pointerdown', (e) => {
            const localPos = this.lineVolume.toLocal(e.global);
            // console.log(`Local position: x = ${((localPos.x - this.postX) / this.lengthVolume) * 100}, y = ${localPos.y}`);
            SoundManager.getInstance().volume('breezy', (localPos.x - this.postX) / this.lengthVolume);
            this.lengthNow = localPos.x - this.postX;
            // this.lineNow.beginFill(0xC0C0C0); 
            // this.lineNow.drawRect(this.postX + this.lengthNow, this.postY, 5, 20);
            // this.lineNow.endFill();
            this.lineNow.x = this.lengthNow - this.lengthVolume / 2;
        });
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
            default: 
                break;
        }
    }
}