import { sound } from "@pixi/sound";

export default class SoundManager {
    private static instance: SoundManager;
    private listMusic: string[] = [];
    private index: number = 0;

    constructor() {

    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            console.log("New sound manager");
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public addMusic(name: string) {
        this.listMusic.push(name);
    }

    public playSound(name: string) {
        sound.play(name);
    }

    public getNameMusic(): string {
        return this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : 'null';
    }

    public playLoopSound(volume: number) {
        const name = this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : null;
        if (name) {
            const soundItem = sound.find(name);
            if (soundItem) {
                soundItem.play();
                soundItem.loop = true;
                soundItem.volume = volume;
            }
        }
    }

    public pauseLoopSound() {
        const name = this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : null;
        if (name) {
            const soundItem = sound.find(name);
            if (soundItem) {
                soundItem.pause();
            }
        }
    }

    public replayLoopSound() {
        const name = this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : null;
        if (name) {
            const soundItem = sound.find(name);
            if (soundItem) {
                soundItem.play();
            }
        }
    }

    public nextLoopSound(volume: number) {
        if (this.index < this.listMusic.length - 1) {
            this.listMusic && this.listMusic.length > this.index && sound.find(this.listMusic[this.index]).pause();
            this.index++;
            const name = this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : null;
            if (name) {
                const soundItem = sound.find(name);
                if (soundItem) {
                    soundItem.play();
                    soundItem.loop = true;
                    soundItem.volume = volume;
                }
            }
        }
    }

    public backLoopSound(volume: number) {
        if (this.index > 0) {
            this.listMusic && this.listMusic.length > this.index && sound.find(this.listMusic[this.index]).pause();
            this.index--;
            const name = this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : null;
            if (name) {
                const soundItem = sound.find(name);
                if (soundItem) {
                    soundItem.play();
                    soundItem.loop = true;
                    soundItem.volume = volume;
                }
            }
        }
    }

    public volume(volume: number) {
        const name = this.listMusic && this.listMusic.length > this.index ? this.listMusic[this.index] : null;
        if (name) {
            const soundItem = sound.find(name);
            if (soundItem) {
                soundItem.volume = volume;
            }
        }
    }
}