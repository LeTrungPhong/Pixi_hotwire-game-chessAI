import { Application } from "pixi.js";
import { Scene } from "./scenes/scene_game";
import { screenWidth, screenHeight } from "./common";

const app = new Application<HTMLCanvasElement>({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: "#fff",
    width: screenWidth,
    height: screenHeight
});

const canvas = app.view;
const rect = canvas.getBoundingClientRect();
const canvasX = rect.x;
const canvasY = rect.y;

const sceny: Scene = new Scene(canvasX, canvasY);
sceny.x = 0;
sceny.y = 0;



app.ticker.add(() => {
    // const deltaSeconds = deltaTime / app.ticker.FPS;
    // console.log(deltaTime);
    // console.log(app.ticker.FPS);
    sceny.update(1 / app.ticker.FPS);
})

app.stage.addChild(sceny);



