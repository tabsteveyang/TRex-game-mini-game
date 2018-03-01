var bgDot = [];
var dotNum = 35;

var levelAdd = 0
var level = 1 + levelAdd;
var score = 0;
var viewScore = 0;
var initVelocity = 5;
var xV = initVelocity * level;

var tRex = {
    x: 0,        //20,
    y: 95,        //115,
    w: 39,        //20,
    h: 43,        //30,
    xV: xV,
    yV: 0,
    status: "onGround",     //onGround | Jumping | Dropping
    isSquat: false,
    triggerJump: function(){
        this.yV = -6;
        this.status = "Jumping";
    },
    doSquat: function(){
        this.isSquat = true;
        if(this.status === "onGround") this.xV = xV + 0.5;
    },
    undoSquat: function(){
        if(this.isSquat && gameIsStart === true){
            this.isSquat = false;
            if(this.status === "onGround"){
                this.y = 95;    //115;
                this.w = 39;
                this.h = 43;
                this.xV = xV;    
            }
        }
    },
    updateXV: function(){
        this.xV = initVelocity * level;
        xV = initVelocity * level;
    }
};

var gameIsStart = false;
var gameJustStart = true;     //will only be true while the page just loaded.
var lastN = 0;

var obsticle = {
    types: [
        {
            name: 'cactus1',
            x: 800,            //init x point has to be out of canvas
            y: 91,            //cactus should stand on the ground
            w: 26,            //box width
            h: 47,            //box height
            mx: undefined,    //middle point x => self.x + self.w/2
            my: undefined    //middle point y => self.y + self.h/2
        },
        {
            name: 'cactus2',
            x: 800,            
            y: 104,            
            w: 36,            
            h: 34,            
            mx: undefined,    
            my: undefined    
        },
        {
            name: 'cactus3',
            x: 800,            
            y: 104,            
            w: 51,            
            h: 34,            
            mx: undefined,    
            my: undefined    
        },
        {
            name: 'bird',
            x: 800,
            y: 101,            //bird should fly above the ground
            w: 42,
            h: 26,
            mx: undefined,
            my: undefined
        },
        {
            name: 'bird2',
            x: 800,
            y: 80,            
            w: 42,
            h: 26,
            mx: undefined,
            my: undefined
        },
        {
            name: 'bird3',
            x: 800,
            y: 40,            
            w: 42,
            h: 26,
            mx: undefined,
            my: undefined
        },
        {
            name: 'cactus4',
            x: 800,            
            y: 91,            
            w: 73, //73,    
            h: 47,            
            mx: undefined,    
            my: undefined    
        }
    ],
    queue: [],                //container for obsticles.
    createObsticle: function(){
        var autoPick = floor(random(0, 5));
        var newObsticle = this.getObsticleCopy(autoPick);
        this.queue.push(newObsticle);
    },
    drawObsticle: function(framecount){        
        if (framecount % 30 === 0) {         // every 0.5 seconds
            var n = noise(framecount);         // noisey by P5
            if(n > 0.6 && lastN < 0.6){        // !!!
                this.createObsticle();
            }
            lastN = n;         //to make sure that obsticles will not be to close with each other.
        }
        this.queue.forEach(function(obj){
            if(!gameJustStart) obj.x -= 1 * tRex.xV;
            rect(obj.x, obj.y, obj.w, obj.h);
        });

    },
    removeObsticle: function(){  //remove the obsticle that is out of canvas.
        var queue = this.queue;
        this.queue.forEach(function(obj, key){
            if(obj.x <= -100) queue.splice(key, 1);
        });
    },
    getObsticleCopy: function(typeId){
        var newObj = {
            x: this.types[typeId].x,
            y: this.types[typeId].y,
            w: this.types[typeId].w,
            h: this.types[typeId].h,
            mx: this.types[typeId].x + this.types[typeId].w/2,
            my: this.types[typeId].y + this.types[typeId].h/2
        }
        return newObj;
    },
    getQueueLength: function(){
        return this.queue.length;
    }
};

//init function
function setup(){
    var cnv = createCanvas(471, 150);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    //cnv.position(x, y);

    initBackgroundObj();    //init backgrount object.
    level = 1;
    levelAdd = 0;
    score = 0;
    viewScore = score;
    gameJustStart = true;
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

function initBackgroundObj(){
    if(bgDot.length === 0){
        for(var i=0; i<=dotNum; i++){
            bgDot.push({
                x: floor(random(0, width)),
                y: floor(random(135, height-1))
            });
        }
    }
}

function drawBackground(){
    //bottom line
    stroke('grey')
        .strokeWeight(1);
    line(0, 130, width, height - 18);
    //dot on ground.
    bgDot.forEach(function(dot){
        //moving effect.
        if(gameIsStart && !gameJustStart){
            dot.x -= 1 * tRex.xV;
            if(dot.x <= 0){
                dot.x = width + floor(random(0, 20));
                dot.y = floor(random(135, height-1));
            }
        }
        //draw static.
        noStroke()
            .fill('grey');
        ellipse(dot.x, dot.y, 2, 2);
    });
}

function drawTRex(){
    noStroke()
        .fill('#65686B');
    //A. init game animation:
    if(gameJustStart && gameIsStart && tRex.x <= 24){
        tRex.x += 1;
    }else if(tRex.x === 25){
        setTimeout(function(){gameJustStart = false}, 500);
        tRex.x++; //to avoid the else if condition.
    }
    //B. handle the TRex.y after jump is triggered
    if(tRex.status !=="onGround"){
        tRex.y += tRex.yV; //!!!
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
            tRex.h = 26;    //15;
            tRex.w = 55;
            tRex.y = 112;    //123;
        }
    }
    //D. draw tRex:
    //ellipse(tRex.x, tRex.y, tRex.w, tRex.h);
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
    if(gameIsStart && frameCount % 8 === 0 && score < 99999/*the maximum of score*/) score++;
    viewScore = ("00000" + score).substr(-5,5); //number padding
    fill(50)
        .textSize(18);
    text(viewScore, 410, 25);
    //B. level: 
    if(score % 100 === 0 && score !== 0 && tRex.xV <= 12/*the maximum of xV*/){
        levelAdd += 0.001;
        level += levelAdd;
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
    gameIsStart = false;
    drawStop();
}

function drawStop(){
    if(!gameIsStart){
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
    gameIsStart = true;
    level = 1;
    levelAdd = 0;
    score = 0;
    viewScore = score;
    //B. init tRex:
    tRex.xV = initVelocity * level;
    tRex.y = 95;
    if(tRex.isSquat) tRex.undoSquat();
    if(tRex.status !== "onGround") tRex.status = "onGround";
    //C. clear obsticles:
    obsticle.queue = [];
}

function keyControl(){
    //A. key control before game start.
    if(!gameIsStart && gameJustStart){
        if(keyIsDown(38) || keyIsDown(32)){
            tRex.triggerJump();
            setTimeout(function(){
                gameIsStart = true;
            }, 1000);
        }
    }else{
    //B. key control during the game.
        //jump
        if(
            (keyIsDown(38) || keyIsDown(32))    &&    
            tRex.status === "onGround"          &&    //tRex can only jump when it is on the ground.    
            !tRex.isSquat                       &&    //tRex can't jump while it is doing squat.
            gameIsStart === true
        ) tRex.triggerJump();
        //squat
        if(keyIsDown(40) && gameIsStart === true) tRex.doSquat();
        //restart game after game is end.
        if(keyIsDown(13) && gameIsStart === false){
            restartGame();
        }
    }
    
}

function keyReleased(e){
    if(e.keyCode === 40 && tRex.isSquat) tRex.undoSquat();
}
