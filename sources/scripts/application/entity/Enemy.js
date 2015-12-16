var Enemy = SpritesheetEntity.extend({
	init:function(label){
		this._super( true );
        this.updateable = false;
        this.deading = false;
        this.standardRange = this.range = 40;
        this.width = 0;
        this.height = 0;
        this.type = 'enemy';
        this.label = label;
        this.node = null;
        this.life = 5;
	},
	debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        this.getContent().addChild(this.debugPolygon);
    },
    getPosition:function(){
        return this.getContent().position;
    },
	build:function(){
		// this._super();

		var self = this;
        var motionArray = this.getFramesByRange('dragon10',0,14);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 0, true, null);
        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.play('idle');
        this.centerPosition = {x:0, y:0};
        // this.centerPosition = {x:this.width/2, y:this.height/2};

        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.scales = {min:1, max:2};

        //this.getContent().scale.x = this.getContent().scale.y = this.scales.min + (this.scales.max - this.scales.min) / 2;

        this.growFactor = 0.1;

        this.getContent().interactive = true;
        this.debugPolygon(0xFF0000,true)

        this.spritesheet.update();
	},
	update:function(){
		// this._super();
        this.getContent().position.x += this.velocity.x;
        this.getContent().position.y += this.velocity.y;

        this.spritesheet.update();
        // console.log(windowHeight);
        if(this.getContent().position.y > windowHeight){
            this.preKill();
            // console.log(this.getPosition().y);
            // this.kill = true;
            this.velocity.y = 0;
            // console.log("KILL");
        }
        this.range = this.standardRange * this.getContent().scale.x;
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                // this.getContent().tint = 0xff0000;
                // this.preKill();
                // arrayCollide[0].hurt(this.power);

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
