/*
 * TRex
 * @game: reference of the game object.
 */
function TRex(game) {
//attribute:
    this.x = 0;         //20;
    this.y = 95;        //115;
    this.w = 39;        //20;
    this.h = 43;        //30;
    this.xV = game.xV;
    this.yV = 0;
    this.status = "onGround";     //onGround | Jumping | Dropping
    this.isSquat = false;
//method:
    this.triggerJump = function(){
        this.yV = -6;
        this.status = "Jumping";
    };
    this.doSquat = function(){
        this.isSquat = true;
        if(this.status === "onGround") this.xV = game.xV + 0.5;
    };
    this.undoSquat = function(){
        if(this.isSquat && game.isStart === true){
            this.isSquat = false;
            if(this.status === "onGround"){
                this.y = 95;    //115;
                this.w = 39;
                this.h = 43;
                this.xV = game.xV;
            }
        }
    };
    this.updateXV = function(){
        this.xV = game.initVelocity * game.level;
        game.xV = game.initVelocity * game.level;
    };
    this.restart = function(){
        this.xV = game.initVelocity * game.level;
        this.y = 95;
        if(this.isSquat) this.undoSquat();
        if(this.status !== "onGround") this.status = "onGround";
    };
}
