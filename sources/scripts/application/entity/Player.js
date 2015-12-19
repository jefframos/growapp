var Player = Entity.extend({
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

        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.debugContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.debugContainer);

        this.playerContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.playerContainer);

		this.standardScale = null;

		this.debugPolygon(Math.random() * 0xFFFFFF,true)

		this.playerImage = new SimpleSprite("img/assets/teste1.png", {x:0.5, y:0.8});
        this.playerContainer.addChild(this.playerImage.getContent());
        // this.playerImage.getContent().width = this.range;
        

	},
	debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        this.debugPolygon.lineStyle(0.5,color);
        // this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        this.debugContainer.addChild(this.debugPolygon);
    },
	build:function(){
		var self = this;
        this.centerPosition = {x:0, y:0};
        // this.centerPosition = {x:this.width/2, y:this.height/2};
        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.scales = {min:1, max:1.8};

        this.getContent().scale.x = this.getContent().scale.y = this.scales.min + (this.scales.max - this.scales.min) / 2;

        this.growFactor = windowWidth * 0.0002;

        scaleConverter(this.playerContainer.width, this.debugContainer.width, 1, this.playerContainer);
        // if(this.standardScale == null){
        	this.standardScale = {x:0,y:0};
        	this.standardScale.x = this.playerContainer.scale.x;
        	this.standardScale.y = this.playerContainer.scale.y;
        	// console.log("CHANGE");
        // }
        // this.getContent().interactive = true;

    },

	reset:function(){
		// TweenLite.killTweensOf(this.getContent());
		// TweenLite.killTweensOf(this.playerContainer);
		// TweenLite.killTweensOf(this.playerContainer.scale);
		this.getContent().scale.x = this.getContent().scale.y = this.scales.min + (this.scales.max - this.scales.min) / 2;
		// // console.log(this.playerContainer.children.length);
		// //scaleConverter(this.playerContainer.width, this.debugContainer.width, 1, this.playerContainer);
		// console.log("lll",this.standardScale);
		// // this.playerContainer.scale = this.standardScale;
		// var self = this;
		// if(this.timeline){
		// 	this.timeline.clear();
		// 	this.timeline.kill();
		// }
		// this.timeline = new TimelineLite({onComplete:function(){
		// 		self.timeline.restart();
		// 	}
		// });
		// this.animationSpeedReference = 0.4;
		// this.timeline.add(TweenLite.to(this.playerContainer.scale, this.animationSpeedReference * 0.3, {x:this.standardScale.x * 1.1,y:this.standardScale.y * 0.9}));
		// // this.timeline.add(TweenLite.to(this.playerContainer.scale, 0.2, {x:this.standardScale.x * 1.2,y:this.standardScale.y * 0.8}));
		// this.timeline.add(TweenLite.to(this.playerContainer.scale, this.animationSpeedReference * 0.5, {x:this.standardScale.x * 0.9,y:this.standardScale.y * 1.1}));
		// this.timeline.add(TweenLite.to(this.playerContainer.scale, this.animationSpeedReference * 0.2, {x:this.standardScale.x, y:this.standardScale.y}));

		// this.timeline.resume();

	},
	goTo:function(position){
		TweenLite.to(this.getContent().position, 0.1,{x:position.x,y:position.y});
	},
	getContent:function(){
		return this.entityContainer;
	},
	updateScale:function(target){
		
		if(target.getContent().scale.x < target.scales.max){

			target.getContent().scale.x += this.growFactor;
			target.getContent().scale.y += this.growFactor;

			target.range = target.standardRange * target.getContent().scale.x;
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
        // console.log(arrayCollide[0].type);
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
