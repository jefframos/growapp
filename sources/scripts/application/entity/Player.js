var Player = SpritesheetEntity.extend({
	init:function(){
		this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = 40;
        this.standardRange = 40;
        this.width = 0;
        this.height = 0;
        this.type = 'heart';
        this.node = null;
        this.life = 5;
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
        // this.centerPosition = {x:this.width/2, y:this.height/2};

        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.scales = {min:1, max:2};

        this.getContent().scale.x = this.getContent().scale.y = this.scales.min + (this.scales.max - this.scales.min) / 2;

        this.growFactor = 0.01;

        this.getContent().interactive = true;
		// this.getContent().mousemove = this.getContent().touchmove = function(touchData){
		// 	self.onMouseDown = true;
  //       	self.debugPolygon.tint = 0xFF0000;
			
  //       };
  //       this.getContent().mousedown = this.getContent().touchstart = function(touchData){
  //       	self.onMouseDown = true;
  //       	self.debugPolygon.tint = 0xFF0000;
  //       };

  //       this.getContent().on('mousedown', onDragStart)
  //       .on('touchstart', onDragStart)
  //       // events for drag end
  //       .on('mouseup', onDragEnd)
  //       .on('mouseupoutside', onDragEnd)
  //       .on('touchend', onDragEnd)
  //       .on('touchendoutside', onDragEnd)
  //       // events for drag move
  //       .on('mousemove', onDragMove)
  //       .on('touchmove', onDragMove);

  //       function onDragStart(event)
		// {
		//     // store a reference to the data
		//     // the reason for this is because of multitouch
		//     // we want to track the movement of this particular touch
		//     this.data = event.data;
		//     this.alpha = 0.5;
		//     this.dragging = true;
		// }

		// function onDragEnd()
		// {
		//     this.alpha = 1;

		//     this.dragging = false;

		//     // set the interaction data to null
		//     this.data = null;
		// }

		// function onDragMove()
		// {
		//     if (this.dragging)
		//     {
		//         var newPosition = this.data.getLocalPosition(this.parent);
		//         this.position.x = newPosition.x;
		//         this.position.y = newPosition.y;
		//     }
		// }


        this.debugPolygon(Math.random() * 0xFFFFFF,true)
	},

	updateScale:function(target){
		this.getContent().scale.x = this.getContent().scale.y = this.scales.min + this.scales.max - target.getContent().scale.x;		
	},
	update:function(){
		if(this.onMouseDown){
			mPosition = APP.getStage().getMousePosition();
			if(mPosition.x + mPosition.y > 0){
				TweenLite.to(this.getContent().position, 0.2,{x:APP.getStage().getMousePosition().x,y:APP.getStage().getMousePosition().y});
				
				if(this.getContent().scale.x < this.scales.max){

					this.getContent().scale.x += 0.01;
					this.getContent().scale.y += 0.01;

					this.range = this.standardRange * this.getContent().scale.x;
				}

				// console.log(this.getContent().scale.y);
				// this.getContent().position.x = APP.getStage().getMousePosition().x;
				// this.getContent().position.y = APP.getStage().getMousePosition().y;
			}else{
				// this.onMouseDown = false;
			}
		}else{
			this.debugPolygon.tint = 0xFFFFFF;
		}
		this._super();
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        console.log('fireCollide', arrayCollide[0].type);
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                this.getContent().tint = 0xff0000;
                this.preKill();
                arrayCollide[0].hurt(this.power);

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
