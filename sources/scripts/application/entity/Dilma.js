var Dilma = Entity.extend({
	init:function(imgSrc, heads, positionHead){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.imageDilma = new SimpleSprite(imgSrc);
        this.entityContainer.addChild(this.imageDilma.getContent());
        this.imageDilma.getContent().anchor.x = 0.5;

        // this.imageDilma.getContent().position.y = windowHeight - this.imageDilma.getContent().height * 0.9;
        this.velocity = {x:0,y:0};
        this.updateable = true;

        // this.minPos = this.imageDilma.getContent().width * 0.2;
        // this.maxPos = windowWidth / 2 - this.imageDilma.getContent().width * 1.5;
        this.side = 1;
        this.sin = Math.random();

        this.standardVel = {x:3, y:2};
        this.virtualVel = {x:0, y:0};

        this.acc = 0.1;



        this.heads = [];
        for (var i = heads.length - 1; i >= 0; i--) {
        	tempHead = new SimpleSprite(heads[i])
        	this.heads.push(tempHead);
        	//this.entityContainer.addChild(tempHead.getContent());
        	tempHead.getContent().position.x = positionHead.x;
        };

        this.currentHead(3);

        scaleConverter(this.getContent().height, windowHeight, 0.5, this.getContent());

        this.imageDilma.getContent().position.y = positionHead.y;
        this.getContent().position.y = windowHeight - this.getContent().height * 0.9;
        this.normalCounter = 0;
	},
	hurt:function(){
		this.currentHead((Math.floor(Math.random() * 2) + 1));
		this.normalCounter = 50;
	},
	currentHead:function(id){
		if(this.currentId == id){
			return;
		}
		this.currentId = id;
		for (var i = this.heads.length - 1; i >= 0; i--) {
			if(this.heads[i].getContent().parent){
				this.heads[i].getContent().parent.removeChild(this.heads[i].getContent());
			}
        }
        this.entityContainer.addChild(this.heads[id].getContent());
	},
	update:function(){

		this.normalCounter --;
		if(this.normalCounter <= 0){
			this.currentHead(3);
		}
		this.velocity.x = this.virtualVel.x * this.side;

		tempSin = Math.sin(this.sin += 0.2);
		// console.log(tempSin)
		this.velocity.y = this.virtualVel.y *tempSin;

		accelerating = true;

		if(this.getPosition().x > this.maxPos && this.side > 0){
			this.virtualVel.x -= this.acc;

			accelerating = false;

			// this.side = -1;
		}else if(this.getPosition().x < this.minPos && this.side < 0){
			this.virtualVel.x -= this.acc;

			accelerating = false;
			// this.side = 1;
		}
		if(accelerating && this.virtualVel.x < this.standardVel.x){
			this.virtualVel.x +=  this.acc;
		}

		if(this.virtualVel.y < this.standardVel.y){
			this.virtualVel.y +=  this.acc;
		}

		this._super();
	},
	getContent:function(){
		return this.entityContainer;
	}
});
