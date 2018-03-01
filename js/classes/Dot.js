/*
 * DocFactory
 * @game: reference of the game object.
 * @num: the number of dot.
 */
function DotFactory(game, num){
//attribute:
    this.dotElm = [];
    this.dotNum = num;
//method:
    this.initBackgroundObj = function(){
        if(this.dotElm.length === 0){
            for(var i=0; i<=this.dotNum; i++){
		var x = floor(random(0, width));
		var y = floor(random(135, height-1));
                this.dotElm.push(new Dot(x, y));
            }
        }
    };
    this.moveDot = function(){
        this.dotElm.forEach(function(dot){
            //moving effect.
            if(game.isStart && !game.justStart){
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
}
/*
 * Dot: the background dot obj.
 */
function Dot(x, y){
    this.x = x;
    this.y = y;
}
