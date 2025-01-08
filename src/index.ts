import { Application } from "pixi.js";
import { Scene } from "./scenes/scene_game";

const app = new Application<HTMLCanvasElement>({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: "#fff",
    width: 640,
    height: 480
});

const canvas = app.view;
const rect = canvas.getBoundingClientRect();
const canvasX = rect.x;
const canvasY = rect.y;

const sceny: Scene = new Scene(app.screen.width, app.screen.height, canvasX, canvasY);
sceny.x = 0;
sceny.y = 0;

app.stage.addChild(sceny);