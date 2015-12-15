var Button1 = Entity.extend({
	init:function(){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.imgScr = new SimpleSprite("img/assets/modal_buttons/button_1.png");
        this.entityContainer.addChild(this.imgScr.getContent());
		this.updateable = false;

		this.label = new PIXI.Text("RANDOM", {font:"40px barrocoregular", fill:"white"});
		this.label.position.x = this.entityContainer.width / 2 - this.label.width / 2;
		this.label.position.y = this.entityContainer.height / 2 - this.label.height / 2;
		this.entityContainer.addChild(this.label);

		this.labels = ["E nada vai mudar", "Sai um, entra outro", "6 por meia dúzia", "Quem vai ser o próximo?"];
	},
	setRandomText:function(){
		this.entityContainer.removeChild(this.label);

		this.label = new PIXI.Text(this.labels[Math.floor(Math.random()*this.labels.length)], {font:"40px barrocoregular", fill:"white"});
		scaleConverter(this.label.width, this.imgScr.getContent().width, 0.85, this.label);
		this.label.position.x = this.imgScr.getContent().width / 2 - this.label.width / 2;
		this.label.position.y = this.imgScr.getContent().height / 2 - this.label.height / 1.4;
		this.entityContainer.addChild(this.label);
	},
	update:function(){
		this._super();
	},
	getContent:function(){
		return this.entityContainer;
	}
});
