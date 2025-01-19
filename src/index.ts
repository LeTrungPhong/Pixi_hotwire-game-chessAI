import { Application, Assets } from "pixi.js";
import GameManager from "./managers/game_manager";
import { heightBoard, widthBoard } from "./common";

const app = new Application<HTMLCanvasElement>({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: "#fff",
    width: 1000,
    height: 1000
});

// const canvas = app.view;
// const rect = canvas.getBoundingClientRect();
// const canvasX = rect.x;
// const canvasY = rect.y;

// const sceny: Scene = new Scene(canvasX, canvasY);
// sceny.x = 0;
// sceny.y = 0;

const assets = [
    { name: 'bouncing', path: 'assets/images/bouncing2-8x8.png' },
    { name: 'white-rook', path: 'assets/images/white-rook.png' },
    { name: 'white-queen', path: 'assets/images/white-queen.png' },
    { name: 'white-pawn', path: 'assets/images/white-pawn.png' },
    { name: 'white-knight', path: 'assets/images/white-knight.png' },
    { name: 'white-king', path: 'assets/images/white-king.png' },
    { name: 'white-bishop', path: 'assets/images/white-bishop.png' },
    { name: 'black-rook', path: 'assets/images/black-rook.png' },
    { name: 'black-queen', path: 'assets/images/black-queen.png' },
    { name: 'black-pawn', path: 'assets/images/black-pawn.png' },
    { name: 'black-knight', path: 'assets/images/black-knight.png' },
    { name: 'black-king', path: 'assets/images/black-king.png' },
    { name: 'black-bishop', path: 'assets/images/black-bishop.png' }
]

async function loadAssets() {
    try {
        // Tải ảnh
        const textures = await Promise.all(
            assets.map((image) => 
                Assets.load(image.path).then((texture) => ({
                  name: image.name,
                  src: texture
                }))
            )
        );

        app.renderer.resize(widthBoard, heightBoard);

        const engineGame = new GameManager(textures, app)

        engineGame.show()

        // console.log(engineGame.getPositiveMoveAt(3, 4))


        app.stage.addChild(engineGame);
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
    }
}

loadAssets().catch(console.error);

app.ticker.add(() => {
    // const deltaSeconds = deltaTime / app.ticker.FPS;
    // console.log(deltaTime);
    // console.log(app.ticker.FPS);
    // sceny.update(1 / app.ticker.FPS);
})






