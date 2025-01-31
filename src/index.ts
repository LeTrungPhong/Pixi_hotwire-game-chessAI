import { Application, Assets } from "pixi.js";
import GameManager from "./managers/game_manager";
import { heightGame, paddingVertical, paddingHorizontal, widthGame } from "./common";
import StateManager from "./managers/state_manager";
import { sound } from "@pixi/sound";
import SoundManager from "./managers/sound_manager";
import SettingManager from "./managers/setting_manager";

export const app = new Application<HTMLCanvasElement>({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: "#fff",
    width: 1000,
    height: 1000,
});

// const canvas = app.view;
// const rect = canvas.getBoundingClientRect();
// const canvasX = rect.x;
// const canvasY = rect.y;

// const sceny: Scene = new Scene(canvasX, canvasY);
// sceny.x = 0;
// sceny.y = 0;

const assets = [
    { name: "bouncing", path: "assets/images/bouncing2-8x8.png" },
    { name: "white-rook", path: "assets/images/white-rook.png" },
    { name: "white-queen", path: "assets/images/white-queen.png" },
    { name: "white-pawn", path: "assets/images/white-pawn.png" },
    { name: "white-knight", path: "assets/images/white-knight.png" },
    { name: "white-king", path: "assets/images/white-king.png" },
    { name: "white-bishop", path: "assets/images/white-bishop.png" },
    { name: "black-rook", path: "assets/images/black-rook.png" },
    { name: "black-queen", path: "assets/images/black-queen.png" },
    { name: "black-pawn", path: "assets/images/black-pawn.png" },
    { name: "black-knight", path: "assets/images/black-knight.png" },
    { name: "black-king", path: "assets/images/black-king.png" },
    { name: "black-bishop", path: "assets/images/black-bishop.png" },
    { name: "setting", path: "assets/images/setting.png" },
];

const assetsSound = [
    { name: "breezy", path: "assets/sounds/breezy.mp3" },
    { name: "dream", path: "assets/sounds/dream.mp3" },
    { name: "lazy", path: "assets/sounds/lazy.mp3" },
    { name: "morning", path: "assets/sounds/morning.mp3" },
    { name: "peace", path: "assets/sounds/peace.mp3" },
];

async function loadAssets() {
    try {
        // Tải ảnh
        const textures = await Promise.all(
            assets.map((image) =>
                Assets.load(image.path).then((texture) => ({
                    name: image.name,
                    src: texture,
                }))
            )
        );

        // Tai nhac
        await Promise.all(
            assetsSound.map((item) => 
                sound.add(item.name, item.path)
            )
        )

        SoundManager.getInstance().playLoopSound('breezy');

        app.renderer.resize(widthGame, heightGame);
        app.stage.position.set(paddingHorizontal, paddingVertical);

        const engineGame = new GameManager(textures);
        // engineGame.show()

        // console.log(engineGame.getPositiveMoveAt(3, 4))

        app.ticker.add(() => {
            StateManager.getInstance().update(1 / app.ticker.FPS);
            SettingManager.getInstance().update(1 / app.ticker.FPS);
        });

        app.stage.addChild(engineGame);
    } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
    }
}

loadAssets().catch(console.error);
