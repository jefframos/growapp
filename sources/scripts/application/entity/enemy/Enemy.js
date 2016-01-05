var Enemy = Entity.extend({
	init:function(label, size){
		this._super( true );
        this.updateable = false;
        this.deading = false;
        this.standardRange = this.range = size.width/2;
        this.width = 0;
        this.height = 0;
        this.type = 'enemy';
        this.label = label;
        this.node = null;
        this.life = 5;
        // console.log(size);
        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.debugContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.debugContainer);

        this.debugPolygon(0xFF0000,true)

        this.playerContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.playerContainer);

        if(this.label == "ENEMY2"){
            this.playerImage = new SimpleSprite("img/assets/Blob_red.png", {x:0.5, y:0.8});
        }else{
            this.playerImage = new SimpleSprite("img/assets/ennemy_Blob_blue.png", {x:0.5, y:0.8});
        }
        this.playerContainer.addChild(this.playerImage.getContent());
        this.playerImage.cacheAsBitmap = true;
        // this.playerContainer.addChild(this.playerImage.texture);
        // this.playerImage.getContent().width = this.range;
        scaleConverter(this.playerContainer.width, this.standardRange * 2, 1, this.playerContainer);
        //scaleConverter(this.playerContainer.width, this.range * 2, 1, this.playerContainer);
        this.standardScale = this.playerContainer.scale;

        this.behaviours = [];

        this.playerContainer.rotation = -APP.gameRotation;
        this.playerImage.getContent().scale.x = 1;
        this.playerImage.getContent().scale.y = 2;

        this.noDepth = false;
       // this.playerImage.getContent().scale.y = 2
	},
    hurt:function(demage){
        this.life -= demage;
        if(this.life <= 0){
            this.preKill();
        }
    },
	debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        this.debugPolygon.lineStyle(0.5,color);
        // this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        this.debugContainer.addChild(this.debugPolygon);
    },
    getContent:function(){
        return this.entityContainer;
    },
    getPosition:function(){
        return this.getContent().position;
    },
	build:function(){
		// this._super();

		var self = this;
       
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;

	},
	update:function(){
		// this._super();
        this.getContent().position.x += this.velocity.x;
        this.getContent().position.y += this.velocity.y;

        if(this.behaviours){
            for (var i = this.behaviours.length - 1; i >= 0; i--) {
                if(!this.behaviours[i].entity){
                    this.behaviours[i].build(this);
                }
                this.behaviours[i].update();
            };
        }
        // console.log(windowHeight);
        if(this.velocity.y > 0 && this.getContent().position.y > windowHeight * 1.5){
            this.preKill();
        }else if(this.velocity.y < 0 && this.getContent().position.y < -this.range){
            this.preKill();
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
        this.velocity = {x:0,y:0};
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){self.kill = true;}});

        }
    },
});
