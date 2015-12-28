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

        this.gameController = new GameController();

        this.onAssetsLoaded();
    },
    getStage:function(){
        return this.stage;
    },
    getGameController:function(){
        return this.gameController;
    },
    getTransition:function(){
        return this.transition;
    },
    getScreenManager:function(){
        return this.screenManager;
    },
    onAssetsLoaded:function()
    {
        this.loadScreen = new LoaderScreen('Loader');
        this.gameScreen = new GameScreen('Game');
        this.homeScreen = new HomeScreen('Home');
        this.screenManager.addScreen(this.loadScreen);
        this.screenManager.addScreen(this.gameScreen);
        this.screenManager.addScreen(this.homeScreen);
        this.screenManager.change('Loader');

        this.transition = new TransitionScreen();
        this.transition.build();
        this.stage.addChild(this.transition.getContent());

        this.timerLabel.alpha = 0;
    },
});
