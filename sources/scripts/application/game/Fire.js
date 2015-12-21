/*jshint undef:false */
var Fire = Entity.extend({
    init:function(vel){
        console.log(vel);
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = windowWidth * 0.02;
        this.width = 1;
        this.height = 1;
        this.type = 'fire';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = 100;
        this.power = 1;
        this.defaultVelocity = 1;
        this.entityContainer = new PIXI.DisplayObjectContainer();
        this.hitContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.hitContainer);

    },
    debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        // this.debugPolygon.lineStyle(0.5,color);
        this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0;
        this.hitContainer.addChild(this.debugPolygon);
    },
    getContent:function(){
        return this.entityContainer;
    },
    build: function(){
        // this._super();
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;
        // var self = this;
        this.debugPolygon(0xFF0000);
    },
    update: function(){
        this._super();
        this.timeLive --;
        if(this.timeLive <= 0){
            this.preKill();
        }
    },
    collide:function(arrayCollide){
        // console.log('fireCollide', arrayCollide[0].type);
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                this.getContent().tint = 0xff0000;
                this.preKill();
                arrayCollide[0].hurt(this.power);

            }
        }
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){self.kill = true;}});
        }
    },
});
