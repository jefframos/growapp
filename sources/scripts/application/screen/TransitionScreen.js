/*jshint undef:false */
var TransitionScreen = Class.extend({
    init:function(){
       this.transitionContainer = new PIXI.DisplayObjectContainer();
    },
    getContent:function(){
    	return this.transitionContainer;
    },
    build: function(){
    	backTopHud = new PIXI.Graphics();
        backTopHud.beginFill(0);
        backTopHud.drawRect(0,0,windowWidth, windowHeight);
        this.transitionContainer.addChild(backTopHud);
        this.transitionContainer.visible = false;
        this.transitionContainer.interactive = true;
        this.transitionContainer.buttonMode = true;
        ScreenManager.debug = true
    },
    transitionIn: function(target){
    	var self = this;
    	self.getContent().visible = true;
    	this.getContent().position.x = windowWidth;
    	TweenLite.to(this.getContent(), 0.5, {x:0, onComplete:function(){
    		if(target){
    			APP.getScreenManager().change(target);
    			APP.getTransition().transitionOut();
    		}
    	}}) 
    },
    transitionOut: function(target){
    	var self = this;
    	self.getContent().visible = true;
    	TweenLite.to(this.getContent(), 0.5, {x:-windowWidth, onComplete:function(){
	       	self.getContent().visible = false;
	       	if(target){
    			APP.getScreenManager().change(target);
    		}
    	}})
    },
    update: function(){
    },
});