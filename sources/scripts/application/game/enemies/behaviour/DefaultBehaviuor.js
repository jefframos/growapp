/*jshint undef:false */
var DefaultBehaviour = Class.extend({
    init: function (entity, config){
		// this.player = player;
		this.entity = entity;
		this.config = config;
		this.entity.velocity.x = 2;
	},
	update: function(){


		if(this.entity.velocity.x > 0 && this.entity.getPosition().x > this.config.maxPosition||
			this.entity.velocity.x < 0 && this.entity.getPosition().x < this.config.minPosition){
			this.entity.velocity.x *= -1;
		}
		// else if(this.entity.velocity.x < 0 && this.entity.getPosition().x < this.config.minPosition){
		// 	this.entity.velocity.x = 1;
		// }

		//this.entity.update();
		// this.sideAcum --;
		// if(this.sideAcum <= 0)
		// {
		// 	this.entity.setVelocity(-1,this.entity.velocity.y*-1);
		// 	this.sideAcum = this.sideMaxAcum;
		// }

		// if(this.fireAcum >= this.fireFreq)
		// {
		// 	var pr = new Fire(true, new this.entity.fireBehaviour.clone());
		// 	pr.build();
		// 	this.fireAcum = 0;
		// 	this.entity.layer.addChildFirst(pr);		
		// 	pr.setPosition(this.entity.getPosition().x,this.entity.getPosition().y);
		// 	pr.setVelocity(-this.fireSpeed,0);
		// }
		// else
		// {
		// 	this.fireAcum ++;
		// }
		// if(this.entity.getPosition().x < -20 || this.entity.getPosition().x > windowWidth + 50 || this.entity.getPosition().y < -30 || this.entity.getPosition().y > windowHeight)
		// {
		// 	this.entity.kill = true;
		// }

		// this.entity.sprite.position.x += this.entity.velocity.x;
		// this.entity.sprite.position.y += this.entity.velocity.y;
			
		// if(this.entity.velocity.x > 0)
		// 	this.entity.setScale(-1,1 );
		// else if(this.entity.velocity.x < 0)
		// 	this.entity.setScale(1,1 );
    },
});