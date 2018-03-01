/*
 * ObsticleFactory
 * @tRex: the reference of the tRex object.
 */
function ObsticleFactory(game, tRex){
    this.queue = [];           //container for obsticles.
    this.lastN = 0;
    this.createObsticle = function(){
        var autoPick = floor(random(0, 5));
	var newObsticle = new Obsticle(autoPick);
        this.queue.push(newObsticle);
    };
    this.drawObsticle = function(framecount){        
        if (framecount % 30 === 0) {           // every 0.5 seconds
            var n = noise(framecount);         // noisey by P5
            if(n > 0.6 && this.lastN < 0.6){ 
                //to avoid error: update the lastN but don't create obj when the game just start.
                if(game.score > 40) this.createObsticle(); 
            }
            this.lastN = n;         //to make sure that obsticles will not be to close with each other.
        }
        this.queue.forEach(function(obj){
            if(!game.justStart) obj.x -= 1 * tRex.xV;
            rect(obj.x, obj.y, obj.w, obj.h);
        });

    };
    this.removeObsticle = function(){  //remove the obsticle that is out of canvas.
        var queue = this.queue;
        this.queue.forEach(function(obj, key){
            if(obj.x <= -100) queue.splice(key, 1);
        });
    };
    this.getQueueLength = function(){
        return this.queue.length;
    };
    this.restart = function(){
        obsticle.queue = [];
    };
}

function Obsticle(num){
    this.types = [
        {
            name: 'cactus1',
            x: 800,           //init x point has to be out of canvas
            y: 91,            //cactus should stand on the ground
            w: 26,            //box width
            h: 47,            //box height
            mx: undefined,    //middle point x => self.x + self.w/2
            my: undefined     //middle point y => self.y + self.h/2
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
    ];

    return this.types[num];
}
