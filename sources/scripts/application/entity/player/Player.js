var Player = Class.extend({
	init:function(range, parent, label, fireLayer){
		// this._super( true );
        this.updateable = false;
        this.deading = false;
		this.scales = {min:1, max:2};
		this.averrageScale = this.scales.min + (this.scales.max - this.scales.min) / 2;
        this.range = Math.floor(range / this.averrageScale);
        this.standardRange = Math.floor(range / this.averrageScale);
        this.width = 0;
        this.height = 0;
        this.type = 'player';
        this.label = label;
        // console.log(label);
        this.node = null;
        this.life = 5;
        this.startPosition = null;
        this.parentClass = parent;
        this.fireLayer = fireLayer;

        if(label == "PLAYER0"){
            this.standardVelocity = {x:8,y:8};
            this.virtualVelocity = {x:0,y:0};
            this.force = {x:3,y:3};
            this.velocity = {x:0,y:0};
            this.shootMaxAcum = 10;
            this.color = 0x0000FF;
            this.fireRange = this.standardRange * 0.3;
            this.firePower = 1;
            this.fireSpeed = - APP.gameVariables.shootSpeedStandard * 1.3;
        }else{
            this.standardVelocity = {x:8,y:8};
            this.virtualVelocity = {x:0,y:0};
            this.force = {x:2,y:2};
            this.velocity = {x:0,y:0};
            this.shootMaxAcum = 30;
            this.color = 0xFF0000;
            this.fireRange = this.standardRange * 0.6;
            this.firePower = 3;
            this.fireSpeed = - APP.gameVariables.shootSpeedStandard;
        }

        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.collisionDebug = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.collisionDebug);

        this.hitContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.hitContainer);

        this.playerContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.playerContainer);

		this.standardScale = null;

		this.hitPolygon(this.color,true);
		this.debugPolygon(Math.random() * 0xFFFFFF,true);

		this.playerImage = new SimpleSprite("img/assets/teste1.png", {x:0.5, y:0.8});
        this.playerContainer.addChild(this.playerImage.getContent());
        this.playerImage.getContent().tint = this.color;

        this.playerImage.getContent().rotation = -APP.gameRotation;
        // console.log(this.playerImage.getContent())
        this.playerImage.getContent().scale.x = 1;
        this.playerImage.getContent().scale.y = 2;
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

            var newPosition = this.data.getLocalPosition(self.getContent().parent);
            self.goTo(newPosition);
        };
        
        this.hitContainer.mouseup = this.hitContainer.mouseupoutside = this.hitContainer.touchend = this.hitContainer.touchendoutside = function(data)
        {
            this.dragging = false;
            this.data = null;
            self.mouseDown = false;

            self.virtualVelocity = {x:0,y:0};
            self.targetPosition = self.getPosition();
        };
        this.hitContainer.mousemove = this.hitContainer.touchmove = function(data)
        {
            if(this.dragging && self.mouseDown)
            {
                var newPosition = this.data.getLocalPosition(self.getContent().parent);
                // console.log(newPosition);
                // newPosition.x -=  self.getPosition().x - newPosition.x;
                // newPosition.y -=  self.getPosition().y - newPosition.y;

                self.goTo(newPosition);
            }
        }
        

	},
    setParentLayer: function(layer){
        this.layer = layer;
    },
	boundsPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(1,color);
        // debugPolygon.beginFill(color);
        debugPolygon.drawRect(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height);
        // this.debugPolygon.alpha = 0.5;
        this.collisionDebug.addChild(debugPolygon);
    },
	debugPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(1,0x00FF00);
        // debugPolygon.beginFill(color);
        debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0.5;
        this.collisionDebug.addChild(debugPolygon);
    },
	hitPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(0.5,color);
        debugPolygon.beginFill(color);
        debugPolygon.drawCircle(0,0,this.range * 2);
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

        scaleConverter(this.playerContainer.width, this.range * 4, 1, this.playerContainer);

    	this.standardScale = {x:0,y:0};
    	this.standardScale.x = this.playerContainer.scale.x;
    	this.standardScale.y = this.playerContainer.scale.y;

    	this.bounds = new PIXI.Rectangle(-this.range, -this.range, this.range*2, this.range*2);
    	// this.boundsPolygon(0x00FF00);
    },

	reset:function(){
		this.shootAcum = 0;
		
		this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;
		this.mouseDown = false;

		this.updateable = true;
        this.collidable = true;

        this.targetPosition = null;

        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};

	},
	goTo:function(position, force){
        

        this.targetPosition = position;
        // console.log(this.targetPosition);
		if(force){
			this.getContent().position.x = position.x;
			this.getContent().position.y = position.y;
		}
	},
	getContent:function(){
		return this.entityContainer;
	},
	toAverrageScale:function(){

		this.shootAcum = this.shootMaxAcum;
		TweenLite.to(this.getContent().scale, 0.1,{x:this.averrageScale,y:this.averrageScale});
	},
	updateScale:function(target, totalPlayers){
		
		
		if(target.getContent().scale.x < target.scales.max){

			newTargetScale = {x:0,y:0};
			newTargetScale.x = target.getContent().scale.x + this.growFactor/totalPlayers;
			newTargetScale.y = target.getContent().scale.y + this.growFactor/totalPlayers;

			// TweenLite.to(target.getContent().scale, 0.1, {x:newTargetScale.x, y:newTargetScale.y});
			target.getContent().scale = newTargetScale;

			target.range = target.standardRange * target.getContent().scale.x;
			this.range = this.standardRange * this.getContent().scale.x;


		}


		if(target.getContent().scale.x == this.getContent().scale.x)
		{
			return
		}

		newTargetScale = {x:this.scales.min + this.scales.max - target.getContent().scale.x,y:this.scales.min + this.scales.max - target.getContent().scale.x};
		//target.getContent().scale.x = target.getContent().scale.y += this.growFactor;
		
		this.getContent().scale = newTargetScale;
		// TweenLite.to(this.getContent().scale, 0.1, {x:newTargetScale.x, y:newTargetScale.y});

		//this.getContent().scale.x = this.getContent().scale.y = this.scales.min + this.scales.max - target.getContent().scale.x;		
	},
	shoot:function(){
		if(this.shootAcum <= 0){
			// console.log("this");
			this.shootAcum = this.shootMaxAcum;
			var fire = new Fire({x:0, y:this.fireSpeed}, this.fireRange, this.color, this.layer, this.firePower);
			fire.build();
			fire.setPosition(this.getPosition().x, this.getPosition().y - this.velocity.y - this.range);
            this.layer.addChild(fire);
			// this.fireLayer.addChild(fire);
		}
	},
	update:function(){
		// this._super();
		if(this.shootAcum > 0){
			this.shootAcum --;
		}
		this.range = this.standardRange * this.getContent().scale.x;


        if(this.targetPosition && pointDistance(this.targetPosition.x, this.targetPosition.y, this.getContent().position.x,this.getContent().position.y) < this.range){
            this.velocity = {x:0, y:0};
            this.virtualVelocity = {x:0, y:0};
            this.targetPosition = null;
        }
        if(this.targetPosition){
            var angle = -Math.atan2(this.targetPosition.y - this.getContent().position.y, this.targetPosition.x - this.getContent().position.x) * 180 / Math.PI;

            // angle = angle * 180 / Math.PI;
            angle += 90;
            angle = -angle / 180 * Math.PI;
            // this.getContent().rotation = angle;
            this.virtualVelocity.x =-Math.sin(angle) * this.standardVelocity.x;
            this.virtualVelocity.y = Math.cos(angle) * this.standardVelocity.y;
        }

        if(this.velocity.x < this.virtualVelocity.x && this.virtualVelocity.x > 0){
            this.velocity.x += this.force.x;
        }else if(this.velocity.x > this.virtualVelocity.x && this.virtualVelocity.x < 0){
            this.velocity.x -= this.force.x;
        }

        if(this.velocity.y < this.virtualVelocity.y && this.virtualVelocity.y > 0){
            this.velocity.y += this.force.y;
        }else if(this.velocity.y > this.virtualVelocity.y && this.virtualVelocity.y < 0){
            this.velocity.y -= this.force.y;
        }

        this.getContent().position.x += this.velocity.x;
        this.getContent().position.y += this.velocity.y;
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        // console.log('fireCollide', arrayCollide[0].type);
        // console.log(arrayCollide[0].type);
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                // this.getContent().tint = 0xff0000;
                // this.preKill();
                if(this.parentClass){
                	this.parentClass.gameOver();
                	// this.preKill();
                }
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
