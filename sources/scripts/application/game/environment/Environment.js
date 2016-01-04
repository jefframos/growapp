var Environment = Class.extend({
	init:function(mapBounds){
		this.environmentContainer = new PIXI.DisplayObjectContainer();
		this.assetsList = [];
		this.velocity = {x:0,y:0};
		this.updateable = true;
		// console.log(this);
		this.mapBounds = mapBounds;
		this.wallsScale = 0.1;
		

		this.floor = new EnvironmentObject("img/assets/Floor.png", {x:this.mapBounds.width});
		this.getContent().addChild(this.floor.getContent());
		this.floor.getContent().position.x = this.mapBounds.x;
		// scaleConverter(this.floor.getContent().width, windowWidth, 1 - this.wallsScale * 2, this.floor.getContent());
		// this.floor = new SimpleSprite("img/assets/Floor.png");
		// this.getContent().addChild(this.floor.getContent());

		this.leftWall = new EnvironmentObject("img/assets/SideWall.png", {x:APP.getGameController().getTileSize().width * 2}, {y:APP.getGameController().getTileSize().width});
		this.getContent().addChild(this.leftWall.getContent());
		this.leftWall.getContent().position.x = - this.leftWall.getContent().width / 2;

		this.rightWall = new EnvironmentObject("img/assets/SideWall2.png", {x:APP.getGameController().getTileSize().width * 2}, {y:APP.getGameController().getTileSize().width});
		this.getContent().addChild(this.rightWall.getContent());
		
		// this.rightWall.getContent().scale.x *= -1;
		this.rightWall.getContent().position.x = this.mapBounds.width + this.rightWall.getContent().width / 2;

		//-this.leftWall.getContent().width;

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
