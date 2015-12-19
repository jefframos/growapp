var EnvironmentObject = Class.extend({
	init:function(imgSrc, mainScale){
		this.environmentContainer = new PIXI.DisplayObjectContainer();

		this.img = new SimpleSprite(imgSrc);
		if( mainScale.x){
			scaleConverter(this.img.getContent().width, windowWidth, mainScale.x, this.img.getContent());
		} if( mainScale.y){
				scaleConverter(this.img.getContent().height, windowHeight, mainScale.y, this.img.getContent());
			}

		this.assetList = [];

		var totAssets = Math.ceil(windowHeight / this.img.getContent().height) + 1;
		for (var i = 0; i < totAssets; i++) {
			this.img = new SimpleSprite(imgSrc);
			this.environmentContainer.addChild(this.img.getContent());
			if( mainScale.x){
				scaleConverter(this.img.getContent().width, windowWidth, mainScale.x, this.img.getContent());
			}else if( mainScale.y){
				scaleConverter(this.img.getContent().height, windowHeight, mainScale.y, this.img.getContent());
			}
			this.img.getContent().position.y = this.img.getContent().height * i - this.img.getContent().height;
			this.assetList.push(this.img);
		};

		this.velocity = {x:0,y:0};
		
	},
	update:function(){
		// console.log(this.velocity);
		for (var i = this.assetList.length - 1; i >= 0; i--) {
			this.assetList[i].getContent().position.x += this.velocity.x;
			this.assetList[i].getContent().position.y += this.velocity.y;
			if(this.velocity.y > 0){
				if(this.assetList[i].getContent().position.y + this.velocity.y > windowHeight){
					
					this.assetList[i].getContent().position.y = this.getMinPosition() -this.assetList[i].getContent().height + this.velocity.y;

				}
			}else if(this.velocity.y < 0){
				if(this.assetList[i].getContent().position.y + this.velocity.y + this.assetList[i].getContent().height < 0){
					this.assetList[i].getContent().position.y = this.getMaxPosition() + this.assetList[i].getContent().height + this.velocity.y;
				}
			}
		};
	},
	getMaxPosition:function(){
		var maxPosition = -999999999999;
		for (var j = this.assetList.length - 1; j >= 0; j--) {
			if(this.assetList[j].getContent().position.y > maxPosition){
				maxPosition = this.assetList[j].getContent().position.y;
			}
		};
		return maxPosition
	},
	getMinPosition:function(){
		var minPosition = 999999999999;
		for (var j = this.assetList.length - 1; j >= 0; j--) {
			if(this.assetList[j].getContent().position.y < minPosition){
				minPosition = this.assetList[j].getContent().position.y;
			}
		};
		return minPosition
	},
	getContent:function(){
		return this.environmentContainer;
	}
});
