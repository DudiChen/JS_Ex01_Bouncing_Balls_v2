let start=Date.now();
function reset() {
  start=Date.now();
}
let x=0,y=0,dx=0,dy=0;
function loop() {
  let seconds=Math.floor((Date.now()-start)/1000);
  let minutes=Math.floor(seconds/60);
  seconds%=60;
  dx+=x<cnv.width/2?1:-1;
  dy+=y<cnv.height/2?1:-1;
  x+=dx;
  y+=dy;
  let ctx=cnv.getContext("2d");
  ctx.fillStyle="#8080FF";
  ctx.beginPath();
  ctx.arc(x,y,10,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.clearRect(0,0,30,15);
  ctx.strokeText(minutes.toString().padStart(2,"0")+":"+seconds.toString().padStart(2,"0"),0,10);
  requestAnimationFrame(loop);
}
loop();