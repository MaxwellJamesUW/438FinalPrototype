import 'p5.play';

const os = require('os');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { program } = require('commander');
const { version, description } = require('./package.json');
const sketchesPath = process.env.NODE_ENV == 'test' ? '/tmp' : path.resolve(os.homedir(), 'Sketches');
const p5jsPath = path.resolve(__dirname, 'p5.js');
const faviconPath = path.resolve(p5jsPath, 'favicon.ico');

const startSketch = (sketchPath, options) => {
    try {
        if (!fs.existsSync(sketchPath)) throw Error(`Error: Path "${sketchPath}" does not exist!`)
        const liveServer = require('live-server');
        const params = {
            root: sketchPath || process.cwd(), // defaults to cwd.
            open: true, // when false, it won't load your browser by default.
            logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
            host: options.host || '0.0.0.0', // host name to serve. defaults to 0.0.0.0.
            port: options.port || 8000, // port number to serve. defaults to 8000.
            wait: options.wait || 100, // milliseconds to wait for changes before reloading.
            mount: [
                ['/p5.js/', p5jsPath],
                ['/favicon.ico', faviconPath],
            ],
        };
        liveServer.start(params);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

program
    .command('list')
    .description('List all your sketches.')
    .action(() => {
        fs.readdir(sketchesPath, (err, files) => {
            if (files) {
                console.log('All p5.js sketches in', sketchesPath, ':', files.length);
                files.forEach((file) => console.log('🍀', file));
            } else console.log('No p5.js sketches in', sketchesPath);
        });
    });

program
    .command('new <sketch>')
    .description('Create new p5.js sketch.')
    .option('-s, --size <size>', 'p5.js canvas size WxH', '600x600')
    .option('-r, --run', 'start coding and serving at once', false)
    .option('--webgl', 'use WEBGL', false)
    .option('-h, --host <host>', 'host name to serve', '0.0.0.0')
    .option('-p, --port <port>', 'port number to serve', 8000)
    .option('-w, --wait <milliseconds>', 'milliseconds to wait for changes before reloading', 100)
    .action((sketch, options) => {
        const sketchPath = path.join(sketchesPath, sketch);
        try {
            if (fs.existsSync(sketchPath)) throw Error(`Error: Sketch "${sketch}" already exists!`)
            if (options.size && !options.size.match(/\d+x\d+/)) throw Error(`Error: canvas size format is worng. `)
            const [width, height] = options.size.split('x');
            fs.mkdirSync(sketchPath, { recursive: true });
            const renderer = options.webgl ? 'WEBGL' : 'P2D';
            fs.writeFileSync(
                path.join(sketchPath, 'index.html'),
                `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${sketch} - p5.js sketch</title>
        <style>
            * {
                margin: 0px;
                padding: 0px;
                box-sizing: border-box;
            }
            body {
                background-color: #777;
            }
            main {
                width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .p5Canvas {
                border: 1px solid white;
                box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
            }
        </style>
    </head>
    <body>
        <main></main>
        <script src="/p5.js/p5.min.js"></script>
        <!-- <script src="/p5.js/p5.sound.min.js"></script> -->
        <script src="sketch.js"></script>
    </body>
</html>
`
            );
            fs.writeFileSync(
                path.join(sketchPath, 'sketch.js'),
                `function setup() {
    createCanvas(${width}, ${height}, ${renderer})
}

function draw() {
    background(200)
}
`
            );
            console.info(`Sketch ${chalk.blueBright(sketch)} created successfully!`);
            if (options.run) {
                require('child_process').exec(`code ${sketchPath} -g ${sketchPath}/sketch.js`);
                startSketch(sketchPath, options);
            } else console.info(`You may run ${chalk.greenBright(`p5js run ${sketch}`)} to serve it.`);
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    });

program
    .command('run <sketch>')
    .description('Serve an exsiting sketch.')
    .option('-h, --host <host>', 'host name to serve', '0.0.0.0')
    .option('-p, --port <port>', 'port number to serve', 8000)
    .option('-w, --wait <milliseconds>', 'milliseconds to wait for changes before reloading', 100)
    .option('-c, --code', 'open sketch with VS code', false)
    .action((sketch, options) => {
        const sketchPath = sketch === '.' ? process.cwd() : path.join(sketchesPath, sketch);
        if (options.code) require('child_process').exec(`code ${sketchPath} -g ${sketchPath}/sketch.js`);
        startSketch(sketchPath, options);
    });

program
    .command('code <sketch>')
    .description('Open sketch with VS code.')
    .option('-r, --run', 'start serving and open your browser.', false)
    .option('-h, --host <host>', 'host name to serve', '0.0.0.0')
    .option('-p, --port <port>', 'port number to serve', 8000)
    .option('-w, --wait <milliseconds>', 'milliseconds to wait for changes before reloading', 100)
    .action((sketch, options) => {
        const sketchPath = sketch === '.' ? process.cwd() : path.join(sketchesPath, sketch);
        try {
            if (!fs.existsSync(sketchPath)) throw Error(`Error: Path "${sketchPath}" does not exist!`)
            require('child_process').exec(`code ${sketchPath} -g ${sketchPath}/sketch.js`);
            if (options.run) startSketch(sketchPath, options);
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    });

program.version(version).description(description).parse(process.argv);

/*import {
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    DirectionalLight,
  } from "three"; */
  
 
  let ball, floor, lwall, rwall, top;
  let cW, cH;
  let clickx1, clicky1, clickx2, clicky2;
  let velCalmer = 20;

  window.setup = () => {
    cW = windowWidth;
    cH = windowHeight;
    new Canvas(cW, cH);
    world.gravity.y = 10;
  
    ball = new Sprite();
    ball.diameter = 50;
    ball.y =  cH - 60;
    ball.bounciness = 0.7;
  
    floor = new Sprite();
    floor.y = cH-5;
    floor.w = cW;
    floor.h = 10;
    floor.collider = 'static';

    lwall = new Sprite();
    lwall.y = cH/2;
    lwall.x = 5;
    lwall.w = 10;
    lwall.h = cH;
    lwall.collider = 'static';

    rwall = new Sprite();
    rwall.y = cH/2;
    rwall.x = cW - 5;
    rwall.w = 10;
    rwall.h = cH;
    rwall.collider = 'static';

    top = new Sprite();
    top.y = 5;
    top.h = 10;
    top.x = cW/2;
    top.w = cW;
    top.collider = 'static';

  };
  
  window.draw = () => {
    clear();
    if(mouse.pressing()) {
      line(clickx1, clicky1, mouse.x, mouse.y);
    }
  };

  window.onmousedown = () => {
    clickx1 = mouse.x;
    clicky1 = mouse.y;
  };
  
  window.onmouseup = () => {
    clickx2 = mouse.x;
    clicky2 = mouse.y;
    ball.vel.x += (clickx1 - clickx2) / velCalmer;
    ball.vel.y += (clicky1 - clicky2) / velCalmer;
  };
