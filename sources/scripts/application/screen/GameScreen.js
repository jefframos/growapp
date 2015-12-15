/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.updateable = false;
        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.gameContainer);
        var assetsToLoader = ["img/dragon.json"];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }

        
       

    },
    showModal:function(){
    },
    hideModal:function(force){
    },
    createModal:function(){
    },
    onProgress:function(){
    },
    onAssetsLoaded:function()
    {
        this._super();
        this.layerManager = new LayerManager();
        this.entityLayer = new Layer("Entity");
        this.layerManager.addLayer(this.entityLayer);

        var self = this;

        this.player1 = new Player();
        this.player1.build();
        this.entityLayer.addChild(this.player1);
        this.player1.getContent().position.x = windowWidth/2;
        this.player1.getContent().position.y = windowHeight/2;



        this.player2 = new Player();
        this.player2.build();
        this.entityLayer.addChild(this.player2);
        this.player2.getContent().position.x = windowWidth/1.5;
        this.player2.getContent().position.y = windowHeight/1.5;


        APP.getStage().mouseup = APP.getStage().touchend = function(touchData){
            self.player1.onMouseDown = false;
            self.player2.onMouseDown = false;
        };

        this.updateable = true;

        this.addChild(this.layerManager);
    },
    updateScales:function()
    {
        if(this.player2.onMouseDown){
            this.player1.updateScale(this.player2);
        }else if(this.player1.onMouseDown){
            this.player2.updateScale(this.player1);
        }
    },
    update:function()
    {
        if(!this.updateable){
            return;
        }
        if(this.layerManager){
            this.entityLayer.collideChilds(this.player1);
            this.entityLayer.collideChilds(this.player2);

            this.updateScales();
            this.layerManager.update();
        }
    },
});
