let g_state = {
    canvas: document.getElementById("canvas"),
    start_button: document.getElementById("start-button"),
    pause_button: document.getElementById("pause-button"),
    reset_button: document.getElementById("reset-button"),
    start_time: Date.now(),
    state: "inactive",
    ballList: null
}

// explosions - stole this from the web
const explode = (x, y) => {
    const colors = [ '#ffc000', '#ff3b3b', '#ff8400' ];
    const bubbles = 25;
    let particles = [];
    let ratio = window.devicePixelRatio;
    let c = document.createElement('canvas');
    let ctx = c.getContext('2d');

    c.style.position = 'absolute';
    c.style.left = (x - 100) + 'px';
    c.style.top = (y - 100) + 'px';
    c.style.pointerEvents = 'none';
    c.style.width = 200 + 'px';
    c.style.height = 200 + 'px';
    c.style.zIndex = 100;
    c.width = 200 * ratio;
    c.height = 200 * ratio;
    document.body.appendChild(c);

    for(let i = 0; i < bubbles; i++) {
        particles.push({
            x: c.width / 2,
            y: c.height / 2,
            radius: r(20, 30),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: r(0, 360, true),
            speed: r(8, 12),
            friction: 0.9,
            opacity: r(0, 0.5, true),
            yVel: 0,
            gravity: 0.1
        });
    }

    render(particles, ctx, c.width, c.height);
    setTimeout(() => document.body.removeChild(c), 1000);
}

const render = (particles, ctx, width, height) => {
    requestAnimationFrame(() => render(particles, ctx, width, height));
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
        p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
        p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

        p.opacity -= 0.01;
        p.speed *= p.friction;
        p.radius *= p.friction;
        p.yVel += p.gravity;
        p.y += p.yVel;

        if(p.opacity < 0 || p.radius < 0) return;

        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    });

    return ctx;
}

const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
// end of explosions

function degreeToRadians(value){
	return (value/360)*2*Math.PI;
}


function BouncingBall(radius, fill_color, x_location, y_location, x_velocity, y_velocity) {
    this.radius = radius;
    this.fill_color = fill_color;
    this.x = x_location;
    this.y = y_location;
    this.x_velocity = x_velocity;
    this.y_velocity = y_velocity;
    this.explode = false;
}

BouncingBall.prototype = new BouncingBall();

BouncingBall.prototype.draw = function() {
    const context = g_state.canvas.getContext('2d');
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.fill_color;
    // context.strokeStyle = 'black';
    context.fill();
    context.stroke();
}

BouncingBall.prototype.move = function() {
    if (this.x  + this.radius > g_state.canvas.width || this.x - this.radius - 1 < 0) {
        this.x_velocity = -1 * this.x_velocity;
    }
    
    if (this.y + this.radius > g_state.canvas.height || this.y - this.radius - 1 < 0) {
        this.y_velocity = -1 * this.y_velocity;
    }

    this.x += this.x_velocity;
    this.y += this.y_velocity;
}

BouncingBall.prototype.hit = function() {
    this.explode = true;
}

const getRandomVelocity = function() { return getRandomValueInRange(1, 11); }
const getRandomRadius = function () { return getRandomValueInRange(20, 80); }

const getRandomValueInRange = function(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

function allMove() {
    const ballList = [];
    for (let i = 0; i < 4 ; i++) {
        const rad = getRandomRadius();
        let color;
        let x;
        let y;
        const x_vel = getRandomVelocity();
        const y_vel = getRandomVelocity();
        switch(i)
        {
            case 0:
                color = 'blue';
                x = getRandomValueInRange(rad + 1, innerWidth - rad - 1);
                y = rad + 1;
                break;
            case 1:
                color = 'green';
                x = innerWidth - (rad + 1)
                y = getRandomValueInRange(rad + 1, innerHeight - rad - 1);
                break;
            case 2:
                color = 'yellow';
                x = getRandomValueInRange(rad + 1, innerWidth - 1)
                y = innerHeight - (rad + 1);
                break;
            case 3:
                color = 'red';
                x = rad + 1;
                y = getRandomValueInRange(rad + 1, innerHeight - rad - 1);
                break;
            default:
                break;
        }
        
        ballList[i] = new BouncingBall(rad, color, x, y, x_vel, y_vel);
    }

    return ballList;
}
 
function clock(context) {
    let seconds = Math.floor((Date.now() - g_state.start_time)/1000);
    let minutes = Math.floor(seconds/60);
    seconds %= 60;

    context.strokeText(minutes.toString().padStart(2,"0")+":"+seconds.toString().padStart(2,"0"),0,10);
}

function reset() {
    if (g_state.state != "inactive") {
        const context = g_state.canvas.getContext('2d');
        context.clearRect(0, 0, innerWidth, innerHeight);
        g_state.start_time=Date.now();
        g_state.state = "reset";
    }
}

function pause() {
    g_state.state = "pause";
}

function start() {
    if (g_state.state != "pause") {
        g_state.ballList = allMove();
    }

    g_state.state = "start";
    animate(g_state.ballList);
}

function animate(ballList) {

    const context = g_state.canvas.getContext('2d');
    context.clearRect(0, 0, innerWidth, innerHeight);

    clock(context);

    for (let i = 0; i < ballList.length; i++) {
        ballList[i].draw();
        ballList[i].move();
        checkHits(ballList[i], ballList);
        if(ballList[i].explode) {
            ballList.splice(i, 1);
        }
    }
    if(g_state.state == "reset") {
        context.clearRect(0, 0, innerWidth, innerHeight);
        return;
    }

    if(g_state.state == "pause") return;


    requestAnimationFrame(animate.bind(null, ballList));
}

function checkHits(my_ball, ballList) {
    ballList.forEach(ball => {
        if(ball != my_ball) {
            let distance = calcDistance(my_ball, ball);
            if(distance <= my_ball.radius + ball.radius) {
                my_ball.hit();
                explode(my_ball.x, my_ball.y);
            }
        }
    })
}

function calcDistance(ball1, ball2) {
    let x_distance = Math.abs(ball2.x - ball1.x);
    let y_distance = Math.abs(ball2.y - ball1.y);
    
    let underRoot = Math.pow(x_distance, 2) + Math.pow(y_distance, 2);
    let root = Math.sqrt(underRoot)

    return root;
}

function init() {
    g_state.canvas.width = window.innerWidth;
    g_state.canvas.height = window.innerHeight;
    g_state.start_button.onclick = start;
    g_state.reset_button.onclick = reset;
    g_state.pause_button.onclick = pause;
    //animate(ballList);
}

init();
