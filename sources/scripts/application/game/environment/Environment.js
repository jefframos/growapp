var Environment = Class.extend({
	init:function(config){
		this.environmentContainer = new PIXI.DisplayObjectContainer();
		this.assetsList = [];
		this.velocity = {x:0,y:0};
		this.updateable = true;
		// console.log(this);

		this.wallsScale = 0.1;

		this.model = config;
		

		this.floor = new EnvironmentObject("img/assets/Floor.png", {x:this.model.floorScale});
		this.getContent().addChild(this.floor.getContent());

		// scaleConverter(this.floor.getContent().width, windowWidth, 1 - this.wallsScale * 2, this.floor.getContent());
		// this.floor = new SimpleSprite("img/assets/Floor.png");
		// this.getContent().addChild(this.floor.getContent());

		this.leftWall = new EnvironmentObject("img/assets/SideWall.png", {x:this.model.leftWallScale});
		this.getContent().addChild(this.leftWall.getContent());

		this.rightWall = new EnvironmentObject("img/assets/SideWall.png", {x:this.model.rightWallScale});
		this.getContent().addChild(this.rightWall.getContent());
		
		this.rightWall.getContent().position.x = windowWidth;
		this.rightWall.getContent().scale.x *= -1;

		this.floor.getContent().position.x = this.leftWall.getContent().width;

		this.assetsList.push(this.floor);
		this.assetsList.push(this.rightWall);
		this.assetsList.push(this.leftWall);
	},
	update:function(){
		// console.log(this.assetsList.length);
		for (var i = this.assetsList.length - 1; i >= 0; i--) {
			this.assetsList[i].velocity = this.velocity;
			this.assetsList[i].update();
		};
		// this.environmentContainer.position.x += this.velocity.x;
		// this.environmentContainer.position.y += this.velocity.y;
	},
	setParentLayer:function(layer){
		this.parentLayer = layer;
	},
	getContent:function(){
		return this.environmentContainer;
	}
});
