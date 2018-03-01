function TRex() {
//attribute:
    this.x = 0;         //20;
    this.y = 95;        //115;
    this.w = 39;        //20;
    this.h = 43;        //30;
    this.xV = xV;
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
        if(this.status === "onGround") this.xV = xV + 0.5; //!!!
    };
    this.undoSquat = function(){
        if(this.isSquat && gameIsStart === true){ //!!!
            this.isSquat = false;
            if(this.status === "onGround"){
                this.y = 95;    //115;
                this.w = 39;
                this.h = 43;
                this.xV = xV;   //!!! 
            }
        }
    };
    this.updateXV = function(){
        this.xV = initVelocity * level;
        xV = initVelocity * level; //!!!
    };
}
