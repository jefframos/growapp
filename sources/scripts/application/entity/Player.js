var Player = Entity.extend({
	init:function(range, parent, label, fireLayer){
		this._super( true );
        this.updateable = false;
        this.deading = false;
		this.scales = {min:1, max:2};
		this.averrageScale = this.scales.min + (this.scales.max - this.scales.min) / 2;
        this.range = this.standardRange = Math.floor(range / this.averrageScale);
        this.width = 0;
        this.height = 0;
        this.type = 'player';
        this.subType = label;
        this.node = null;
        this.life = 5;
        this.parentClass = parent;
        this.fireLayer = fireLayer;
        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.collisionDebug = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.collisionDebug);

        this.hitContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.hitContainer);

        this.playerContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.playerContainer);

		this.standardScale = null;

		this.hitPolygon(Math.random() * 0xFFFFFF,false);
		this.debugPolygon(Math.random() * 0xFFFFFF,true);

		this.playerImage = new SimpleSprite("img/assets/teste1.png", {x:0.5, y:0.8});
        this.playerContainer.addChild(this.playerImage.getContent());

        this.getContent().interactive = true;
        this.hitContainer.interactive = true;


        this.mouseDown = false;
        var self = this;
        this.hitContainer.mousedown = this.hitContainer.touchstart = function(data)
        {
    //      data.originalEvent.preventDefault()
            this.data = data;
            this.dragging = true;
            self.mouseDown = true;
        };
        
        this.hitContainer.mouseup = this.hitContainer.mouseupoutside = this.hitContainer.touchend = this.hitContainer.touchendoutside = function(data)
        {
            this.dragging = false;
            this.data = null;
            self.mouseDown = false;
        };
        this.hitContainer.mousemove = this.hitContainer.touchmove = function(data)
        {
            if(this.dragging && self.mouseDown)
            {
                var newPosition = this.data.getLocalPosition(self.getContent().parent);
                newPosition.x -=  self.getPosition().x - newPosition.x;
                newPosition.y -=  self.getPosition().y - newPosition.y;
                self.goTo(newPosition);
            }
        }
        

	},
	debugPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(1,0xFF0000);
        // debugPolygon.beginFill(color);
        debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0.5;
        this.collisionDebug.addChild(debugPolygon);
    },
	hitPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        // debugPolygon.lineStyle(0.5,color);
        debugPolygon.beginFill(color);
        debugPolygon.drawCircle(0,0,this.range * 1.5);
        debugPolygon.alpha = force?0:0.5;
        this.hitContainer.addChild(debugPolygon);
    },
	build:function(){
		var self = this;
        this.centerPosition = {x:0, y:0};
        // this.centerPosition = {x:this.width/2, y:this.height/2};
        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;

        this.growFactor = APP.gameVariables.growFactor;

        scaleConverter(this.playerContainer.width, this.range * 2, 1, this.playerContainer);

    	this.standardScale = {x:0,y:0};
    	this.standardScale.x = this.playerContainer.scale.x;
    	this.standardScale.y = this.playerContainer.scale.y;

    },

	reset:function(){
		this.shootAcum = 0;
		this.shootMaxAcum = 50;
		this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;
		this.mouseDown = false;

		this.updateable = true;
        this.collidable = true;

		TweenLite.killTweensOf(this.getContent());
		TweenLite.killTweensOf(this.playerContainer);
		TweenLite.killTweensOf(this.playerContainer.scale);

		var self = this;
		if(this.timeline){
			this.timeline.clear();
			this.timeline.kill();
		}
		this.timeline = new TimelineLite({onComplete:function(){
				self.timeline.restart();
			}
		});
		this.animationSpeedReference = 0.4;
		this.timeline.add(TweenLite.to(this.playerContainer.scale, this.animationSpeedReference * 0.3, {x:this.standardScale.x * 1.1,y:this.standardScale.y * 0.9}));
		this.timeline.add(TweenLite.to(this.playerContainer.scale, 0.2, {x:this.standardScale.x * 1.2,y:this.standardScale.y * 0.8}));
		this.timeline.add(TweenLite.to(this.playerContainer.scale, this.animationSpeedReference * 0.5, {x:this.standardScale.x * 0.9,y:this.standardScale.y * 1.1}));
		this.timeline.add(TweenLite.to(this.playerContainer.scale, this.animationSpeedReference * 0.2, {x:this.standardScale.x, y:this.standardScale.y}));

		this.timeline.resume();

	},
	goTo:function(position, force){
		if(force){
			this.getContent().position.x = position.x;
			this.getContent().position.y = position.y;
		}else{
			TweenLite.to(this.getContent().position, 0.4,{x:position.x,y:position.y});
		}
	},
	getContent:function(){
		return this.entityContainer;
	},
	toAverrageScale:function(){

		this.shootAcum = this.shootMaxAcum;
		TweenLite.to(this.getContent().scale, 0.1,{x:this.averrageScale,y:this.averrageScale});
	},
	updateScale:function(target){
		
		if(target.getContent().scale.x < target.scales.max){

			target.getContent().scale.x += this.growFactor;
			target.getContent().scale.y += this.growFactor;

			target.range = target.standardRange * target.getContent().scale.x;
			this.range = this.standardRange * this.getContent().scale.x;
			// console.log(target.range);
		}
		//target.getContent().scale.x = target.getContent().scale.y += this.growFactor;
		this.getContent().scale.x = this.getContent().scale.y = this.scales.min + this.scales.max - target.getContent().scale.x;		
	},
	shoot:function(){
		if(this.shootAcum <= 0){
			// console.log("this");
			this.shootAcum = this.shootMaxAcum;
			var fire = new Fire({x:0, y:- APP.gameVariables.shootSpeedStandard});
			fire.build();
			fire.setPosition(this.getPosition().x, this.getPosition().y);
			this.fireLayer.addChild(fire);
		}
	},
	update:function(){
		this._super();
		if(this.shootAcum > 0){
			this.shootAcum --;
		}
		this.range = this.standardRange * this.getContent().scale.x;
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        // console.log('fireCollide', arrayCollide[0].type);
        // console.log(arrayCollide[0].type);
        if(this.parentClass){
        	this.parentClass.gameOver();
        	// this.preKill();
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
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){
            	// self.kill = true;
            	self.parentClass.gameOver();
            }});

        }
    },
});
