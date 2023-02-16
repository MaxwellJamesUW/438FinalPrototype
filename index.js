/*import {
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    DirectionalLight,
  } from "three"; */
  
  /*
  import "p5.play";
  import "p5js";
  */
 
let ball, floor, lwall, rwall, top;
let cW, cH;
let clickx1, clicky1, clickx2, clicky2;
let hoopl, hoopr;
let velCalmer = 20;
let shots = 0;
let score = 0;

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

  newHoop();
}

window.draw = () => {
  clear();
  if(mouse.pressing()) {
    line(clickx1, clicky1, mouse.x, mouse.y);
  }
  //score condition
  if((ball.colliding(hoopl) > 60) && (ball.colliding(hoopr) > 60)){
    ball.y = cH - 60;
    ball.x = random(100, cW - 100);
    score += 1;
    hoopl.remove();
    hoopr.remove();
    newHoop();
  }

  textSize(40);
  text('Score: ' + score, 20, 50);
  text('Shots: ' + shots, 20, 90);
}

window.onmousedown = () => {
  clickx1 = mouse.x;
  clicky1 = mouse.y;
}

window.onmouseup = () => {
  clickx2 = mouse.x;
  clicky2 = mouse.y;
  ball.vel.x += (clickx1 - clickx2) / velCalmer;
  ball.vel.y += (clicky1 - clicky2) / velCalmer;
  shots += 1;
}

function newHoop() {
  let hx = random(100, cW - 100);
  let hy = random(200, 400);
  hoopl = new Sprite(hx, hy, 5, 35);
  hoopl.rotation = -15;
  hoopl.collider = 'static';

  hoopr = new Sprite(hx+55, hy, 5, 35);
  hoopr.rotation = 15;
  hoopr.collider = 'static';

}
