/*jshint undef:false */
var LoaderScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        

        var self = this;

        

        var assetsToLoader = ["img/assets/Blob_red.png",
        "img/assets/ennemy_Blob_blue.png",
        "img/assets/Floor.png",
        "img/assets/SideWall.png",
        "img/assets/teste1.png",
        "img/assets/HUD/HUD.json"
        ];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    onProgress:function(){

    },
    drawMapData:function(){
        for (var i = APP.mapData.cols - 1; i >= 0; i--) {
            tempLine = new PIXI.Graphics();
            tempLine.lineStyle(0.5,0);
            tempLine.moveTo(0,0);
            tempLine.lineTo(0, windowHeight);
            tempLine.position.x = i * windowWidth / APP.mapData.cols;
            tempLine.alpha = 0.5;
            this.addChild(tempLine);
        };

        for (var i = APP.mapData.rows - 1; i >= 0; i--) {
            tempLine = new PIXI.Graphics();
            tempLine.lineStyle(0.5,0);
            tempLine.moveTo(0,0);
            tempLine.lineTo(windowWidth , 0);
            tempLine.position.y = i * windowHeight / APP.mapData.rows;
            tempLine.alpha = 0.5;
            this.addChild(tempLine);
        };
    },
    onAssetsLoaded:function()
    {
        this._super();


        this.drawMapData();
        // this.bg = new SimpleSprite("img/assets/home/background.png");
        // this.addChild(this.bg.getContent());
        // this.bg.getContent().width = windowWidth;
        // this.bg.getContent().height = windowHeight;

        this.screenContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.screenContainer);


        this.imgScr = new SimpleSprite("game_logo.png");
        this.screenContainer.addChild(this.imgScr.getContent());
        scaleConverter(this.imgScr.getContent().width, APP.getGameController().getSize(APP.mapData.cols - 4,3).width, 1, this.imgScr.getContent());
        this.imgScr.getContent().position = APP.getGameController().getTilePosition(2,2);

        var self = this;

        this.playButton = new DefaultButton("button_up.png","button_over.png");
        this.playButton.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);
        this.screenContainer.addChild(this.playButton.getContent());

        this.label = new PIXI.Text("PLAY", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        this.playButton.addLabel(this.label,0,5,true,0,0)
        this.playButton.getContent().position = APP.getGameController().getTilePosition(2,APP.mapData.rows - 3);
        this.playButton.getContent().position.y += APP.getGameController().getTileSize().height / 2 - this.playButton.getContent().height / 2;
        this.playButton.clickCallback = function(){
            APP.getTransition().transitionIn('Game');
        }



        this.fullscreen = new DefaultButton("button_small_up.png","button_small_over.png");
        this.fullscreen.build(APP.getGameController().getTileSize().width, APP.getGameController().getTileSize().width);
        this.screenContainer.addChild(this.fullscreen.getContent());

        fullscreenLabel = new PIXI.Text("F", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        this.fullscreen.addLabel(fullscreenLabel,0,5,true,0,0)
        this.fullscreen.getContent().position = APP.getGameController().getTilePosition(0,0, true);
        this.fullscreen.getContent().position.y += APP.getGameController().getTileSize().height / 2 - this.fullscreen.getContent().height / 2;
        this.fullscreen.clickCallback = function(){
            fullscreen();
        }


        this.logoLabel = new PIXI.Text("©TaBien Studios", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});
        this.screenContainer.addChild(this.logoLabel);
        scaleConverter(this.logoLabel.width, APP.getGameController().getTileSize().width*3, 1, this.logoLabel);
        this.logoLabel.position = APP.getGameController().getTilePosition(3,APP.mapData.rows - 1);
        this.logoLabel.position.y += APP.getGameController().getTileSize().height / 2 - this.logoLabel.height / 2;

        //this.screenContainer.position.x = windowWidth - this.screenContainer.width * 1.2;
        //this.screenContainer.position.y = windowHeight - this.screenContainer.height * 1.3;

    },
    update:function()
    {
    }
});
