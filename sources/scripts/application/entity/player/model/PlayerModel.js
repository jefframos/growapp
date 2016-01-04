var PlayerModel = Class.extend({
    init:function(){
    	this.standardVelocity = {x:8,y:8};
        this.virtualVelocity = {x:0,y:0};
        this.force = {x:0.5,y:0.5};
        this.velocity = {x:0,y:0};
        this.shootMaxAcum = 10;
        this.color = 0x0000FF;
        this.fireRange = this.standardRange * 0.3;
        this.fireSpeed = - APP.gameVariables.shootSpeedStandard;
    }
});