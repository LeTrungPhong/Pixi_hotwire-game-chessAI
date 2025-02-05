import { Application, Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { paddingVertical, paddingHorizontal, paddingContent, sizeButtonSetting, widthBoard, widthGame, heightGame } from "../common";
import StateManager from "./state_manager";
import SoundManager from "./sound_manager";
import { app } from "..";
import Volume from "./volume";

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

    // music
    private backButton: Sprite = new Sprite();
    private nextButton: Sprite = new Sprite();
    private pauseButton: Sprite = new Sprite();
    private playButton: Sprite = new Sprite();
    private textMusic: Text = new Text();
    private line1: number = 50;
    private space1: number = 30;

    // volume game

    // text
    private paddingRight = 130;
    private textTitle: Text = new Text();
    private textTitleVolume: Text = new Text();
    private textTitleMusic: Text = new Text();
    private textTitleVolumeGame: Text = new Text();
    private textTitleLanguage: Text = new Text();
    private textLanguage: Text = new Text();

    private volumeGame?: Volume;

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

        SoundManager.getInstance().playLoopSound(0.5);

        const styly1: TextStyle = new TextStyle({
            align: "center",
            fill: "#DDDDDD",
            fontSize: 15
        });

        this.textMusic.style = styly1;
        this.textMusic.anchor.set(0, 0.5);
        this.textMusic.x = this.postX + this.space1 * 4;
        this.textMusic.y = this.postY - this.line1;
        this.textMusic.text = SoundManager.getInstance().getNameMusic() + " - audio";
        this.ui.addChild(this.textMusic);

        // text
        const styly2: TextStyle = new TextStyle({
            align: "center",
            fill: "#C0C0C0",
            fontSize: 15
        });

        this.textTitleVolume.style = styly2;
        this.textTitleVolume.text = 'Volume music'
        this.textTitleVolume.anchor.set(0, 0.5);
        this.textTitleVolume.x = this.postX - this.paddingRight;
        this.textTitleVolume.y = this.postY;
        this.ui.addChild(this.textTitleVolume);

        this.textTitleMusic.style = styly2;
        this.textTitleMusic.text = 'Change music'
        this.textTitleMusic.anchor.set(0, 0.75);
        this.textTitleMusic.x = this.postX - this.paddingRight;
        this.textTitleMusic.y = this.postY - this.space1 - 15;
        this.ui.addChild(this.textTitleMusic);

        this.textTitleVolumeGame.style = styly2;
        this.textTitleVolumeGame.text = 'Volume game'
        this.textTitleVolumeGame.anchor.set(0, 0.25);
        this.textTitleVolumeGame.x = this.postX - this.paddingRight;
        this.textTitleVolumeGame.y = this.postY + this.space1 + 15;
        this.ui.addChild(this.textTitleVolumeGame);

        this.textTitleLanguage.style = styly2;
        this.textTitleLanguage.text = 'Language'
        this.textTitleLanguage.anchor.set(0, 0);
        this.textTitleLanguage.x = this.postX - this.paddingRight;
        this.textTitleLanguage.y = this.postY + this.space1 * 2 + 30;
        this.ui.addChild(this.textTitleLanguage);

        const styly3: TextStyle = new TextStyle({
            align: "center",
            fill: "#00FF00",
            fontSize: 15,
            fontWeight: "bold"
        });

        this.textLanguage.style = styly3;
        this.textLanguage.text = "English";
        this.textLanguage.anchor.set(0, 0);
        this.textLanguage.x = this.postX;
        this.textLanguage.y = this.postY + this.space1 * 2 + 30;
        this.ui.addChild(this.textLanguage);

        const styly4: TextStyle = new TextStyle({
            align: "center",
            fill: "#DDDDDD",
            fontSize: 35,
            fontWeight: "bold"
        });

        this.textTitle.text = "Setting Game";
        this.textTitle.style = styly4;
        this.textTitle.anchor.set(0.5, 0.5);
        this.textTitle.x = this.postX + this.lengthNow - this.widthLineNow / 2;
        this.textTitle.y = this.postY - this.heightUI / 2 + 50;
        this.ui.addChild(this.textTitle);

        this.volumeGame = new Volume(this.widthUI, this.heightUI);
        this.ui.addChild(this.volumeGame);
        this.volumeGame.listen();
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

        this.nextButton.interactive = true;
        this.nextButton.on('pointerover', () => {
            this.nextButton.cursor = 'pointer';
        })
        this.nextButton.on('pointerdown', () => {
            SoundManager.getInstance().nextLoopSound(this.lengthNow / this.lengthVolume);
            this.textMusic.text = SoundManager.getInstance().getNameMusic();
            SoundManager.getInstance().replayLoopSound();
        })

        this.backButton.interactive = true;
        this.backButton.on('pointerover', () => {
            this.backButton.cursor = 'pointer';
        })
        this.backButton.on('pointerdown', () => {
            SoundManager.getInstance().backLoopSound(this.lengthNow / this.lengthVolume);
            this.textMusic.text = SoundManager.getInstance().getNameMusic();
            SoundManager.getInstance().replayLoopSound();
        })

        this.pauseButton.interactive = true;
        this.pauseButton.on('pointerover', () => {
            this.pauseButton.cursor = 'pointer';
        })
        this.pauseButton.on('pointerdown', () => {
            SoundManager.getInstance().pauseLoopSound();
            this.ui.removeChild(this.pauseButton);
            this.ui.addChild(this.playButton);
        })

        this.playButton.interactive = true;
        this.playButton.on('pointerover', () => {
            this.playButton.cursor = 'pointer';
        })
        this.playButton.on('pointerdown', () => {
            SoundManager.getInstance().replayLoopSound();
            this.ui.removeChild(this.playButton);
            this.ui.addChild(this.pauseButton);
        })
    }

    public setVolume(localPos: any) {
        let length = (localPos.x - this.postX) / this.lengthVolume;
        if (length < 0) {
            length = 0;
        } else if (length > 1) {
            length = 1;
        }
        SoundManager.getInstance().volume(length);
        // this.textCursorDown.text = `${length}`;
        this.lengthNow = localPos.x - this.postX;
        this.lineNow.x = this.lengthNow - this.lengthVolume / 2 - this.lineNow.width / 2 + this.widthLineNow / 2;
    }

    public setVolumeType(name: string, volume: number) {
        if (name === "game") {
            SoundManager.getInstance().setVolumeMove(volume);
        }
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
                this.volumeGame?.spriteCursonDown(texture);
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
            case 'next':
                this.nextButton = Sprite.from(texture);
                this.nextButton.width = 30;
                this.nextButton.height = 30;
                this.nextButton.x = this.postX + this.space1 * 2 + this.nextButton.width / 2;
                this.nextButton.y = this.postY - this.line1;
                this.nextButton.anchor.set(0.5, 0.5);
                this.ui.addChild(this.nextButton);
                break;
            case 'back':
                this.backButton = Sprite.from(texture);
                this.backButton.width = 30;
                this.backButton.height = 30;
                this.backButton.x = this.postX + this.backButton.width / 2;
                this.backButton.y = this.postY - this.line1;
                this.backButton.anchor.set(0.5, 0.5);
                this.ui.addChild(this.backButton);
                break;
            case 'pause':
                this.pauseButton = Sprite.from(texture);
                this.pauseButton.width = 30;
                this.pauseButton.height = 30;
                this.pauseButton.x = this.postX + this.space1 + this.pauseButton.width / 2;
                this.pauseButton.y = this.postY - this.line1;
                this.pauseButton.anchor.set(0.5, 0.5);
                this.ui.addChild(this.pauseButton);
                break;
            case 'play':
                this.playButton = Sprite.from(texture);
                this.playButton.width = 30;
                this.playButton.height = 30;
                this.playButton.x = this.postX + this.space1 + this.playButton.width / 2; 
                this.playButton.y = this.postY - this.line1;
                this.playButton.anchor.set(0.5, 0.5);
                // this.ui.addChild(this.playButton);
                break;
            default: 
                break;
        }
    }
}