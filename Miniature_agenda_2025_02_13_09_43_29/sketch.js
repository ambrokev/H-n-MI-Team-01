var move = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
//  background(220);
  line(0,400,400,0);
  strokeWeight(4);
  line(0,0,400,400);
  circle(width/2,height/2,100);
  strokeWeight(1);
  circle(move,height/2,move);
  move=move+10;
  if(move==400)
    {
      move=200
    }
}