var Player = Entity.extend({
	init:function(parent, label, fireLayer){
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
        this.fireLayer = fireLayer;

        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.hitContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.hitContainer);

        this.playerContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.playerContainer);

		this.standardScale = null;

		this.debugPolygon(Math.random() * 0xFFFFFF,true)

		this.playerImage = new SimpleSprite("img/assets/teste1.png", {x:0.5, y:0.8});
        this.playerContainer.addChild(this.playerImage.getContent());

        this.getContent().interactive = true;
        this.hitContainer.interactive = true;
        console.log(this.getContent().hitArea)
        // this.getContent().hitArea = new PIXI.Rectangle(-this.range*2,-this.range*2,this.range*2, this.range*2);
        // this.playerImage.getContent().width = this.range;


        this.mouseDown = false;
        var self = this;
        this.hitContainer.mousedown = this.hitContainer.touchstart = function(data)
        {
    //      data.originalEvent.preventDefault()
            // store a refference to the data
            // The reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = data;
            // this.alpha = 0.9;
            this.dragging = true;
            self.mouseDown = true;
        };
        
        // set the events for when the mouse is released or a touch is released
        
        this.hitContainer.mouseup = this.hitContainer.mouseupoutside = this.hitContainer.touchend = this.hitContainer.touchendoutside = function(data)
        {
            // this.alpha = 1
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            self.mouseDown = false;
        };
        
        // set the callbacks for when the mouse or a touch moves
        
        this.hitContainer.mousemove = this.hitContainer.touchmove = function(data)
        {
            if(this.dragging)
            {
                var newPosition = this.data.getLocalPosition(self.getContent().parent);
                // console.log(newPosition, self.getPosition());
                newPosition.x -=  self.getPosition().x - newPosition.x;
                newPosition.y -=  self.getPosition().y - newPosition.y;
                self.goTo(newPosition);
            }
        }
        

	},
	debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        // this.debugPolygon.lineStyle(0.5,color);
        this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range * 1.3);
        this.debugPolygon.alpha = 0;
        this.hitContainer.addChild(this.debugPolygon);
    },
	build:function(){
		var self = this;
        this.centerPosition = {x:0, y:0};
        // this.centerPosition = {x:this.width/2, y:this.height/2};
        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.scales = {min:1, max:1.8};

        this.averrageScale = this.scales.min + (this.scales.max - this.scales.min) / 2;

        this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;

        this.growFactor = windowWidth * 0.0002;

        scaleConverter(this.playerContainer.width, this.range * 2, 1, this.playerContainer);

    	this.standardScale = {x:0,y:0};
    	this.standardScale.x = this.playerContainer.scale.x;
    	this.standardScale.y = this.playerContainer.scale.y;

    },

	reset:function(){
		this.shootAcum = 0;
		this.shootMaxAcum = 50;
		// TweenLite.killTweensOf(this.getContent());
		// TweenLite.killTweensOf(this.playerContainer);
		// TweenLite.killTweensOf(this.playerContainer.scale);
		this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;
		// // console.log(this.playerContainer.children.length);
		// //scaleConverter(this.playerContainer.width, this.hitContainer.width, 1, this.playerContainer);
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
	goTo:function(position, force){
		if(force){
			this.getContent().position.x = position.x;
			this.getContent().position.y = position.y;
		}else{
			TweenLite.to(this.getContent().position, 0.05,{x:position.x,y:position.y});
		}
	},
	getContent:function(){
		return this.entityContainer;
	},
	toAverrageScale:function(){

		TweenLite.to(this.getContent().scale, 0.1,{x:this.averrageScale,y:this.averrageScale});
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
	shoot:function(){
		if(this.shootAcum <= 0){
			console.log("this");
			this.shootAcum = this.shootMaxAcum;
			var fire = new Fire({x:0, y:-4});
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
