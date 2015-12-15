var Item = Entity.extend({
	init:function(imgSrc){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.imageDilma = new SimpleSprite(imgSrc);
        this.entityContainer.addChild(this.imageDilma.getContent());

        this.imageDilma.getContent().position.y = windowHeight - this.imageDilma.getContent().height * 0.9;
        this.standardVelocity = {x:windowWidth * 0.3,y:0};
        this.velocity = {x:0,y:0};
        this.updateable = true;

        this.side = 1;
        this.sin = 0;

        //this.gravity
	},
	update:function(){
		this._super();
	},
	getContent:function(){
		return this.entityContainer;
	}
});
