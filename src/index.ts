import { Application, Container, Sprite, Point, ParticleContainer, Graphics, TextStyle, Text, BitmapFont, BitmapText } from 'pixi.js'

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

// const clampy: Sprite = Sprite.from("clampy.png");

// clampy.anchor.set(0.5);

// clampy.x = app.screen.width / 2;
// clampy.y = app.screen.height / 2;

// app.stage.addChild(clampy);


////  container
const bigConty: Container = new Container();
bigConty.scale.set(2); // You can use set and only one value to set x and y
bigConty.position.x = 100;
bigConty.y = 200; // this is a shortcut for .position.y and it also exists one for .position.x
app.stage.addChild(bigConty);

const littleConty: Container = new Container();
// position has a copy setter. It won't use your reference but copy the values from it!
littleConty.position = new Point(300,200);
bigConty.addChild(littleConty);

const conty: Container = new Container();
conty.x = 200;
conty.y = 0;
app.stage.addChild(conty);


// sprite
const clampy: Sprite = Sprite.from("clampy.svg");
clampy.x = 100;
clampy.y = 100;
conty.addChild(clampy);

const clampy1: Sprite = Sprite.from("clampy.svg");
clampy1.x = 50;
clampy1.y = 50;
conty.addChild(clampy1);
conty.removeChild(clampy1);



// partical Container
const particleConty: ParticleContainer = new ParticleContainer();
particleConty.addChild(Sprite.from("clampy.svg"));
// Pretty much everything that worked on a Container will work with a ParticleContainer.


// Graphics
const graphy: Graphics = new Graphics();

// we give instructions in order. begin fill, line style, draw circle, end filling
graphy.beginFill(0xFF00FF);
graphy.lineStyle(10, 0x00FF00);
graphy.drawCircle(0, 0, 25); // See how I set the drawing at 0,0? NOT AT 100, 100!
graphy.endFill();

app.stage.addChild(graphy); //I can add it before setting position, nothing bad will happen.

// Here we set it at 100,100
graphy.x = 100;
graphy.y = 100;

// Text, TextStyle
const styly: TextStyle = new TextStyle({
    align: "center",
    fill: "#754c24",
    fontSize: 42
});
const texty: Text = new Text('私に気づいて先輩！', styly); // Text supports unicode!
texty.text = "This is Text";

app.stage.addChild(texty);

//BitmapText
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
bitmapTexty.text = "Change it";

app.stage.addChild(bitmapTexty);




