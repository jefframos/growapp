/*jshint undef:false */
var StartModal = StandardModal.extend({
    init:function(mainScreen){
    	this._super(mainScreen);       
    },
    build: function(){
    	this._super();
        var self = this;
// this.container.addChild(this.modalContainer);
    	this.backModalImg = new SimpleSprite("back_modal_1.png", {x:0, y:0});    	
    	this.modalContainer.addChild(this.backModalImg.getContent());
    	this.backModalImg.getContent().position.x = APP.getGameController().getTileSize().width;
    	this.backModalImg.getContent().position.y = APP.getGameController().getTileSize().height * 3;
    	this.backModalImg.getContent().interactive = true;
    	this.backModalImg.getContent().width = (APP.mapData.cols - 2) * APP.getGameController().getTileSize().width
    	this.backModalImg.getContent().height = (APP.mapData.rows - 6) * APP.getGameController().getTileSize().height

    	this.label = new PIXI.Text("START", {font:"40px barrocoregular", fill:"white", stroke:"#E88726", strokeThickness: 10});
    	this.modalContainer.addChild(this.label);
    	scaleConverter(this.label.width, APP.getGameController().getTileSize().width*3, 1, this.label);
    	this.label.position = APP.getGameController().getTilePosition(3,4);
    	this.label.position.y += APP.getGameController().getTileSize().height / 2 - this.label.height / 2;



        buttonContinue = new DefaultButton("button_up.png","button_over.png");
        buttonContinue.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);

        buttonContinueLabel = new PIXI.Text("START", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        buttonContinue.addLabel(buttonContinueLabel,0,5,true,0,0)
        buttonContinue.getContent().position = APP.getGameController().getTilePosition(2,APP.mapData.rows - 5);
        buttonContinue.getContent().position.y += APP.getGameController().getTileSize().height / 2 - buttonContinue.getContent().height / 2;
        buttonContinue.clickCallback = function(){
            self.hide(false);
            self.mainScreen.hideStartModal();
        }
        this.modalContainer.addChild(buttonContinue.getContent());


    	this.backModalImg.getContent().mousedown = this.backModalImg.getContent().touchstart = function(data){
            
    	}
        this.container.visible = false;
    },
    show: function(){
    	this.container.visible = true;
	    this.mainScreen.pause();
    	var self = this;

        this.modalContainer.position.x = windowWidth;

        TweenLite.to(this.modalContainer, .5, {x:0}) ;
    	TweenLite.to(this.container, .5, {alpha:1, onComplete:function(){
	       	self.container.visible = true;
    	}});
        TweenLite.to(this.backModal, .5, {alpha:0.5})
    },
    hide: function(callback){
    	var self = this;
    	TweenLite.to(this.modalContainer, .5, {x:-windowWidth, onComplete:function(){
            self.mainScreen.unpause();
	       	self.container.visible = false;
    	}})
        TweenLite.to(this.backModal, .5, {alpha:0}) 
    },
    update: function(){
    },
});