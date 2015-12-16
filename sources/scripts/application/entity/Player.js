var Player = SpritesheetEntity.extend({
	init:function(parent, label){
		this._super( true );
        this.updateable = false;
        this.deading = false;
        // this.range = 40;
        this.range = this.standardRange = windowWidth * 0.05;
        this.width = 0;
        this.height = 0;
        this.type = 'player';
        this.subType = label;
        this.node = null;
        this.life = 5;
        this.parentClass = parent;
	},
	debugPolygon: function(color, force){
        // this.debugPolygon = new PIXI.Graphics();
        // this.debugPolygon.beginFill(0xFF0000);
        // this.debugPolygon.drawRect(0,0,this.width, this.height);
        // this.getContent().addChild(this.debugPolygon);

        this.debugPolygon = new PIXI.Graphics();
        this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        this.getContent().addChild(this.debugPolygon);
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
		this.debugPolygon(Math.random() * 0xFFFFFF,true)
        // this.centerPosition = {x:this.width/2, y:this.height/2};


        
        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.scales = {min:1, max:2};

        this.getContent().scale.x = this.getContent().scale.y = this.scales.min + (this.scales.max - this.scales.min) / 2;

        this.growFactor = windowWidth * 0.0002;

        this.getContent().interactive = true;
        

        // this.getTexture().width = 100;

        console.log(this.spritesheet.container.children);
        this.spritesheet.container.width = 200;
        this.spritesheet.container.children[0].alpha = 0.2;
	},

	reset:function(){
		TweenLite.killTweensOf(this.getContent());
		this.getContent().scale.x = this.getContent().scale.y = this.scales.min + (this.scales.max - this.scales.min) / 2;
	},
	goTo:function(position){
		TweenLite.to(this.getContent().position, 0.1,{x:position.x,y:position.y});
	},
	updateScale:function(target){
		
		if(target.getContent().scale.x < target.scales.max){

			target.getContent().scale.x += this.growFactor;
			target.getContent().scale.y += this.growFactor;

			target.range = target.standardRange * target.getContent().scale.x;
			// console.log(target.range);
		}
		//target.getContent().scale.x = target.getContent().scale.y += this.growFactor;
		this.getContent().scale.x = this.getContent().scale.y = this.scales.min + this.scales.max - target.getContent().scale.x;		
	},
	update:function(){
		this._super();

		this.range = this.standardRange * this.getContent().scale.x;
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        // console.log('fireCollide', arrayCollide[0].type);
        console.log(arrayCollide[0].type);
        if(this.parentClass){
        	this.parentClass.gameOver();
        }
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                // this.getContent().tint = 0xff0000;
                // this.preKill();
                // arrayCollide[0].hurt(this.power);

            }
        }
    },
    getPosition:function(){
    	return this.getContent().position;
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
