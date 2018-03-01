/*
 * Game: storing all the game status attributes
 */
function Game(){
//attribute:
    this.canvasWidth = 471;
    this.canvasHeight = 150;
    this.levelAdd = 0;
    this.level = 1 + this.levelAdd;
    this.score = 0;
    this.viewScore = 0;
    this.initVelocity = 5;
    this.xV = this.initVelocity * this.level;
    this.isStart = false;
    this.justStart = true;     //will only be true while the page just loaded.
//method:
    this.restart = function(){
        this.isStart = true;
        this.level = 1;
        this.levelAdd = 0;
        this.score = 0;
        this.viewScore = this.score;
    }
}
