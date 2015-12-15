/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0x3dc554);
	},
    build:function(){
        this._super();
        this.timerLabel = new PIXI.Text("00", {font:"50px barrocoregular", fill:"black"});
        this.stage.addChild(this.timerLabel);
        this.onAssetsLoaded();
    },
    getStage:function(){
        return this.stage;
    },
    onAssetsLoaded:function()
    {
        this.gameScreen = new GameScreen('Game');
        this.homeScreen = new HomeScreen('Home');
        this.screenManager.addScreen(this.gameScreen);
        this.screenManager.addScreen(this.homeScreen);
        this.screenManager.change('Game');

        this.timerLabel.alpha = 0;
    },
});
