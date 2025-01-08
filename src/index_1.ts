import { Application, Assets, BitmapFont, BitmapText, BlurFilter, Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js'

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

const container_1: Container = new Container();
container_1.x = app.screen.width / 2;
container_1.y = app.screen.height / 2;
app.stage.addChild(container_1);

Assets.load("clampy.svg").then(() => {
    const image_1: Sprite = Sprite.from("clampy.svg");
    image_1.x = -image_1.width / 2;
    image_1.y = -image_1.height / 2;
    container_1.addChild(image_1);

    const myBlurFilter = new BlurFilter();
    image_1.filters = [myBlurFilter];

    console.log(image_1.width + " " + image_1.height);
});

// (Container)
// - addChild
// - removehild
// - children
// - position, scale, skew
// - rotation, angle
// - width, height
// - interactive, on, off
// - getBounds
// - destroy

// (Particle Container)
// const particleContainer_1: ParticleContainer = new ParticleContainer();

// (Sprite)
// - anchor set(0.5)
// - tint

const graphy_1: Graphics = new Graphics();

graphy_1.beginFill((255 << 16) + (100 << 8) + 50 , 1 );
graphy_1.lineStyle(10, 0x00FF00);
graphy_1.drawCircle(0, 0, 25);
graphy_1.endFill();
graphy_1.x = 100;
graphy_1.y = 100;

app.stage.addChild(graphy_1);

// (Graphics)
// - clear

// (Text)

const styly: TextStyle = new TextStyle({
    align: "center",
    fill: "#754c24",
    fontSize: 20
});
const texty: Text = new Text('Welcome to my world！', styly);
texty.text = "This is expensive to change, please do not abuse";

app.stage.addChild(texty);


BitmapFont.from("comic 32", {
    fill: "#ffffff", // White, will be colored later
    fontFamily: "Comic Sans MS",
    fontSize: 32
})

// Remember, this font only has letters and numbers. No commas or any other symbol.
const bitmapTexty: BitmapText = new BitmapText("I love baking, my family, and my friends",
    {
        fontName: "comic 32",
        fontSize: 32, // Making it too big or too small will look bad
        tint: 0xFF0000 // Here we make it red.
    });

bitmapTexty.text = "This is cheap";
bitmapTexty.text = "Change it as much as you want";
bitmapTexty.x = 0;
bitmapTexty.y = 15;

app.stage.addChild(bitmapTexty);

// Filter
// Particles















