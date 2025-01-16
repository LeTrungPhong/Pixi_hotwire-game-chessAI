import { Application, Assets } from "pixi.js";
import { screenWidth, screenHeight } from "./zuma/common";
import GameManager from "./managers/game_manager";
import { heightBoard, widthBoard } from "./common";

const app = new Application<HTMLCanvasElement>({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: "#fff",
    width: screenWidth,
    height: screenHeight
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
    { name: 'black-rook', path: 'assets/images/white-rook.png' },
    { name: 'black-queen', path: 'assets/images/white-queen.png' },
    { name: 'black-pawn', path: 'assets/images/white-pawn.png' },
    { name: 'black-knight', path: 'assets/images/white-knight.png' },
    { name: 'black-king', path: 'assets/images/white-king.png' },
    { name: 'black-bishop', path: 'assets/images/white-bishop.png' }
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


        app.stage.addChild(new GameManager(textures));
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





