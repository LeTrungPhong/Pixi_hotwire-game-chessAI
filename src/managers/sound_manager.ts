import { sound } from "@pixi/sound";

export default class SoundManager {
    private static instance: SoundManager;

    constructor() {

    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            console.log("New sound manager");
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public playSound(name: string) {
        sound.play(name);
    }

    public playLoopSound(name: string) {
        const soundItem = sound.find(name);
        if (soundItem) {
            soundItem.play();
            soundItem.loop = true;
            soundItem.volume = 0.5;
        }
    }

    public volume(name: string, volume: number) {
        const soundItem = sound.find(name);
        if (soundItem) {
            soundItem.volume = volume;
        }
    }
}