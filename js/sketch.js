//game:
var game = new Game();
//bg-dot:
var dot = new DotFactory(game, 35);
//t-rex:
var tRex = new TRex(game);
//obsticle:
var obsticle = new ObsticleFactory(game, tRex);

//init function
function setup(){
    var cnv = createCanvas(game.canvasWidth, game.canvasHeight);
    //var x = (windowWidth - width) / 2;
    //var y = (windowHeight - height) / 2;
    //cnv.position(x, y);
    dot.initBackgroundObj();    //init backgrount object.
}
//draw will be called in every frame.
function draw(){
    background('#ECEBE4');
    //A. draw background and bottom line.
    drawBackground();
    //B. draw T-Rex.
    drawTRex();
    //C. key control.
    keyControl();
    //D. draw obsticle.
    drawObsticle();
    //E. game logic. (score, lose, restart)
    gameLogic();
}

function drawBackground(){
    //bottom line
    stroke('grey')
        .strokeWeight(1);
    line(0, 130, width, height - 18);
    //dot on ground.
    dot.moveDot();
}

function drawTRex(){
    noStroke()
        .fill('#65686B');
    //A. init game animation:
    if(game.justStart && game.isStart && tRex.x <= 24){
        tRex.x += 1;
    }else if(tRex.x === 25){
        setTimeout(function(){game.justStart = false}, 500);
        tRex.x++; //to avoid the else if condition.
    }
    //B. handle the TRex.y after jump is triggered
    if(tRex.status !=="onGround"){
        tRex.y += tRex.yV;
    }
    if(tRex.y <= 5 && tRex.status === "Jumping"){
        //stay at the sky for a while then drop
        tRex.yV = 0;
        //delay effect
        setTimeout(function(){tRex.yV = 5;}, 100);
        tRex.status = "Dropping";
    }
    //back to the ground
    if(tRex.y >= 95 && tRex.status === "Dropping"){
        tRex.y = 95; //115;
        tRex.yV = 0;
        tRex.status = "onGround";
    }
    //C. handle the tRex after squat is triggered.
    if(tRex.isSquat){
        //C-1. if is dropping, acelerate the dropping speed.
        if(tRex.status === "Dropping") tRex.yV = 5.5;
        //C-2. if the status is "onGround", sqeeze the TRex.
        if(tRex.status === "onGround"){
            tRex.h = 26;     //15;
            tRex.w = 55;
            tRex.y = 112;    //123;
        }
    }
    //D. draw tRex:
    fill('#F5B700');
    rect(tRex.x, tRex.y, tRex.w, tRex.h);
}

function drawObsticle(){
    fill('#65686B');
    obsticle.drawObsticle(frameCount);
    obsticle.removeObsticle();
}

function gameLogic(){
    //A. handleScore and level
    scoreNLevel();
    //B. collide detaction
    collideDetact();
}

function scoreNLevel(){
    //A. score:
    if(game.isStart && frameCount % 8 === 0 && game.score < 99999/*the maximum of score*/) game.score++;
    game.viewScore = ("00000" + game.score).substr(-5,5); //number padding
    fill(50)
        .textSize(18);
    text(game.viewScore, 410, 25);
    //B. level: 
    if(game.score % 100 === 0 && game.score !== 0 && tRex.xV <= 12/*the maximum of xV*/){
        game.levelAdd += 0.001;
        game.level += game.levelAdd;
        tRex.updateXV();        
    }
}

function collideDetact(){
    obsticle.queue.forEach(function(obj){
        var checkHit = collideRectRect(tRex.x, tRex.y, tRex.w, tRex.h, obj.x, obj.y, obj.w, obj.h);
        if(checkHit) endGame();
    });
}

function endGame(){
    game.isStart = false;
    drawStop();
}

function drawStop(){
    if(!game.isStart){
        fill('gray')
            .textSize(25);
        text("GAME   OVER", width/2 - 88, height/2 - 20);
        textSize(13);
        text('press ENTER to restart', width/2 - 73, height/2);
        tRex.xV = 0;
        tRex.yV = 0;
    }
}

function restartGame(){
    //A. init global configs:
    game.restart();
    //B. init tRex:
    tRex.restart();
    //C. clear obsticles:
    obsticle.restart();
}

function keyControl(){
    //A. key control before game start.
    if(!game.isStart && game.justStart){
        if(keyIsDown(38) || keyIsDown(32)){
            tRex.triggerJump();
            setTimeout(function(){
                game.isStart = true;
            }, 1000);
        }
    }else{
    //B. key control during the game.
        //jump
        if(
            (keyIsDown(38) || keyIsDown(32))    &&    
            tRex.status === "onGround"          &&    //tRex can only jump when it is on the ground.    
            !tRex.isSquat                       &&    //tRex can't jump while it is doing squat.
            game.isStart === true
        ) tRex.triggerJump();
        //squat
        if(keyIsDown(40) && game.isStart === true) tRex.doSquat();
        //restart game after game is end.
        if(keyIsDown(13) && game.isStart === false){
            restartGame();
        }
    }
    
}

function keyReleased(e){
    if(e.keyCode === 40 && tRex.isSquat) tRex.undoSquat();
}
