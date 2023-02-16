/*import {
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    DirectionalLight,
  } from "three"; */
  
 
let ball, floor, lwall, rwall, topper;
let cW, cH;
let clickx1, clicky1, clickx2, clicky2;
let hoopl, hoopr;
let velCalmer = 20;
let shots = 0;
let score = 0;
let ballimg1;

window.preload = () => {
  ballimg1 = loadImage("ball2.png");
  ballimg2 = loadImage("theBall.png");
  ballimg3 = loadImage('ball3.png');
}

window.setup = () => {
  cW = windowWidth;
  cH = windowHeight;
  new Canvas(cW, cH);
  world.gravity.y = 10;

  ball = new Sprite();
  ball.diameter = 50;
  ball.y =  cH - 60;
  ball.bounciness = 0.7;
  ball.addAni('distressed', ballimg2);
  ball.addAni('baseline', ballimg1);
  ball.addAni('done', ballimg3);
  
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

  topper = new Sprite();
  topper.y = 5;
  topper.h = 10;
  topper.x = cW/2;
  topper.w = cW;
  topper.collider = 'static';

  newHoop();
}

window.draw = () => {
  clear();
  if(mouse.pressing()) {
    line(clickx1, clicky1, mouse.x, mouse.y);
    ball.changeAni('distressed');
  } else {
    ball.changeAni('baseline');
  }
  
  if((ball.colliding(hoopl) > 5) && (ball.colliding(hoopr) > 5)){
    ball.changeAni('done');
  }

  //score condition
  if((ball.colliding(hoopl) > 50) && (ball.colliding(hoopr) > 50)){
    ball.y = cH - 60;
    ball.x = random(100, cW - 100);
    score += 1;
    hoopl.remove();
    hoopr.remove();
    newHoop();
  }
  
  textSize(40);
  text('Score: ' + score, 20, 55);
  textSize(32);
  text('Shots: ' + shots, 20, 90);
}

//onmousedown
window.mousePressed = () => {
  clickx1 = mouseX;
  clicky1 = mouseY;
}

//onmouseup
window.mouseReleased = () => {
  clickx2 = mouseX;
  clicky2 = mouseY;
  ball.vel.x += (clickx1 - clickx2) / velCalmer;
  ball.vel.y += (clicky1 - clicky2) / velCalmer;
  shots += 1;
}

function newHoop() {
  let hx = random(100, cW - 100);
  let hy = random(150, 350);
  hoopl = new Sprite(hx, hy, 5, 35);
  hoopl.rotation = -15;
  hoopl.collider = 'static';

  hoopr = new Sprite(hx+55, hy, 5, 35);
  hoopr.rotation = 15;
  hoopr.collider = 'static';

}

function doEnd() {
  
}