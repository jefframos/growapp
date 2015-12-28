/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.gameController = APP.getGameController();
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.updateable = false;
        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.gameContainer);
        var assetsToLoader = [];
        // var assetsToLoader = ["img/dragon.json"];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }

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
    showTopHUD:function(){
        TweenLite.to(this.tupHUD, 0.5, {y:0});
    },
    hideTopHUD:function(){
        TweenLite.to(this.tupHUD, 0.5, {y:-this.tupHUD.height});
    },
    showPauseModal:function(){
        this.hideTopHUD();
        this.pauseModal.show();
    },
    hidePauseModal:function(){
        this.showTopHUD();
        this.pauseModal.hide(true);
        this.unpause();
    },
    showEndModal:function(){
        this.hideTopHUD();
        this.endModal.show();
    },
    hideEndModal:function(){
        this.showTopHUD();
        this.reset();
    },
    showStartModal:function(){
        this.pauseModal.hide(true);
        this.pause();
        this.hideTopHUD();
        this.startModal.show();
    },
    hideStartModal:function(){
        console.log("HIDE HERE");
        this.showTopHUD();
        this.start();
    },
    createModal:function(){
    },
    onProgress:function(){
    },
    onAssetsLoaded:function()
    {
        console.log("ASSETS LOAD");
        this._super();
        this.layerManager = new LayerManager();
        this.environmentLayer = new Layer("Environment");
        this.entityLayer = new Layer("Entity");
        this.fireLayer = new Layer("Fire");
        this.enemyLayer = new Layer("Enemy");
        this.layerManager.addLayer(this.environmentLayer);
        this.layerManager.addLayer(this.enemyLayer);
        this.layerManager.addLayer(this.entityLayer);
        this.layerManager.addLayer(this.fireLayer);

        this.verticalSpeed = APP.gameVariables.verticalSpeed;

        configEnvironment = {
            leftWallScale:windowWidth / APP.mapData.cols / windowWidth,
            rightWallScale:windowWidth / APP.mapData.cols / windowWidth,
            floorScale:0.8,
        }
        // console.log(configEnvironment);
        configEnvironment.floorScale = 1 - configEnvironment.leftWallScale - configEnvironment.rightWallScale;

        this.environment = new Environment(configEnvironment);
        this.environmentLayer.addChild(this.environment);
        this.environment.velocity.y = this.verticalSpeed;

        var self = this;



        this.players = [];

        for (var i = this.gameController.playersList.length - 1; i >= 0; i--) {
            tempPlayer  = new Player(this.gameController.getTileSize().width/2,this,"PLAYER" + i,this.fireLayer);
            tempPlayer.build();
            tempPlayer.collideCallback = this.gameOver;
            this.entityLayer.addChild(tempPlayer);
            tempObj = this.gameController.getTilePosition(this.gameController.playersList[i].i, this.gameController.playersList[i].j, true);
            tempPlayer.startPosition = {x:tempObj.x,y:tempObj.y};
            this.players.push(tempPlayer) ;
        };

        this.gameHit = new PIXI.Graphics();
        this.gameHit.interactive = true;
        this.gameHit.beginFill(0xFF0000);
        this.gameHit.drawRect(0,0,windowWidth, windowHeight);
        this.gameContainer.addChild(this.gameHit);
        // this.gameHit.alpha = 0.1;
        this.gameHit.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight);

        this.selecteds = [];

        this.updateable = false;

        this.addChild(this.layerManager);

        this.HUDLayer = new PIXI.DisplayObjectContainer();
        this.addChild(this.HUDLayer);

        


        this.label = new PIXI.Text("", {font:"20px Arial", fill:"red"});
        // this.addChild(this.label);

        // this.label2 = new PIXI.Text("", {font:"20px Arial", fill:"red"});
        // this.addChild(this.label2);
        // this.label2.position.y = 200;




        this.drawMapData();

        this.laneCounter = 0;

        this.initHUD();
        
        this.reset();
    },
    initHUD:function(){
        var self = this;

        this.tupHUD = new PIXI.DisplayObjectContainer();
        backTopHud = new PIXI.Graphics();
        backTopHud.beginFill(0);
        backTopHud.drawRect(0,0,windowWidth, this.gameController.getTileSize().height);
        this.tupHUD.addChild(backTopHud);


        returnButtonLabel = new PIXI.Text("<", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});
        returnButton = new DefaultButton("button_small_up.png","button_small_over.png");
        returnButton.build(this.gameController.getTileSize().width, this.gameController.getTileSize().width);
        returnButton.addLabel(returnButtonLabel,0,0,true,0,0);
        this.tupHUD.addChild(returnButton.getContent());
        returnButton.getContent().position = this.gameController.getTilePosition(1,0);
        returnButton.getContent().position.y = this.gameController.getTileSize().height / 2 - returnButton.getContent().height / 2;

        returnButton.clickCallback = function(){
            APP.getTransition().transitionIn('Loader');
        }

        pauseButtonLabel = new PIXI.Text("II", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});    
        pauseButton = new DefaultButton("button_small_up.png","button_small_over.png");
        pauseButton.build(this.gameController.getTileSize().width, this.gameController.getTileSize().width);
        pauseButton.addLabel(pauseButtonLabel,0,0,true,0,0);
        this.tupHUD.addChild(pauseButton.getContent());
        pauseButton.getContent().position = this.gameController.getTilePosition(7,0);
        pauseButton.getContent().position.y = this.gameController.getTileSize().height / 2 - pauseButton.getContent().height / 2;
        pauseButton.clickCallback = function(){
            self.showPauseModal();
        }

        this.scoreLabel = new PIXI.Text("0", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});
        this.tupHUD.addChild(this.scoreLabel);
        scaleConverter(this.scoreLabel.height, this.gameController.getTileSize().width, 1, this.scoreLabel);

        this.HUDLayer.addChild(this.tupHUD);

        this.pauseModal = new PauseModal(this);
        this.pauseModal.build();
        this.HUDLayer.addChild(this.pauseModal.getContent());

        this.endModal = new EndModal(this);
        this.endModal.build();
        this.HUDLayer.addChild(this.endModal.getContent());

        this.startModal = new StartModal(this);
        this.startModal.build();
        this.HUDLayer.addChild(this.startModal.getContent());

    },
    updateScore:function(score){
        this.scoreLabel.setText(score);
        this.scoreLabel.position.x = windowWidth / 2 - this.scoreLabel.width / 2;
        this.scoreLabel.position.y = this.gameController.getTileSize().height / 2 - this.scoreLabel.height / 2;
    },
    reset:function(){

        console.log("RESET");
        this.lastTileCounter = -1;
        this.tileCounter = 0;
        this.laneCounter = 0;

        this.enemyCounter = APP.gameVariables.enemyCounter;
        this.maxEnemyCounter = APP.gameVariables.enemyCounter;
        this.onReset = true;
        this.updateable = false;


        for (var i = this.players.length - 1; i >= 0; i--) {
            this.players[i].reset();
            tempObj = this.gameController.getTilePosition(this.gameController.playersList[i].i, this.gameController.playersList[i].j, true);
            this.players[i].startPosition = {x:tempObj.x,y:tempObj.y};
            this.players[i].getContent().position = this.players[i].startPosition;
        };

        tempEnemies = this.gameController.getInitScreenEntities();
        for (var i = tempEnemies.length - 1; i >= 0; i--) {
            this.enemyLayer.addChild(tempEnemies[i]);
        };

        this.showStartModal();
        
    },
    start:function(){
        console.log("START");
        this.updateable = true;
        // this.hideStartModal();
        this.showTopHUD();
    },
    destroyEntities:function(){
        for (var i = this.enemyLayer.childs.length - 1; i >= 0; i--) {
            // this.enemyLayer.childs[i].preKill();
            this.enemyLayer.childs[i].kill = true;
            this.enemyLayer.removeChild(this.enemyLayer.childs[i]);
        };
        for (var i = this.fireLayer.childs.length - 1; i >= 0; i--) {
            // this.fireLayer.childs[i].preKill();
            this.fireLayer.childs[i].kill = true;
            this.fireLayer.removeChild(this.fireLayer.childs[i]);
        };
    },
    restart:function(){
        console.log("RESTART");
        this.destroyEntities();
        this.reset();
    },
    gameOver:function()
    {
        this.destroyEntities();
        this.updateable = false;
        this.showEndModal();
        this.label.setText("gameOver");
    },
    updateScales:function()
    {
        var selected = 0;
        for (var i = this.players.length - 1; i >= 0; i--) {
            for (var j = this.selecteds.length - 1; j >= 0; j--) {
                
                if(this.selecteds[j].label == this.players[i].label){
                    selected = i;                 
                }
            };
        };
        for (var i = this.players.length - 1; i >= 0; i--) {
            if(this.players[i].label != this.players[selected].label){
                this.players[i].updateScale(this.players[selected],this.players.length);
            }
        };
    },
    updateShoots:function()
    {
        var selected = 0;
        for (var i = this.players.length - 1; i >= 0; i--) {
            for (var j = this.selecteds.length - 1; j >= 0; j--) {
                
                if(this.selecteds[j].label == this.players[i].label){
                    selected = i;                 
                }
            };
        };
        for (var i = this.players.length - 1; i >= 0; i--) {
            if(this.players[i].label != this.players[selected].label){
                this.players[i].shoot();
            }
        };
    },
    addSelected:function(entity){
        var has = false;
        for (var i = this.selecteds.length - 1; i >= 0; i--) {
            if(this.selecteds[i] == entity){
                has = true;
            }
        };
        if(!has){
            this.selecteds.push(entity);
        }
    },
    removeSelected:function(entity){
        for (var i = 0; i < this.selecteds.length; i++) {
            if(this.selecteds[i] == entity){
                this.selecteds.splice(i, 1);
            }
        };
    },
    updateSelecteds:function(){
        for (var i = this.players.length - 1; i >= 0; i--) {
            if(this.players[i].mouseDown){
                this.addSelected(this.players[i]);
            }else{
                this.removeSelected(this.players[i]);
            }
        };
    },
    update:function()
    {
        if(!this.updateable){
            return;
        }
        if(this.layerManager){
            this.updateSelecteds();
            if(this.selecteds.length == 1){
                this.updateScales();
                // this.updateShoots();
            }else if(this.selecteds.length == 2){
                for (var i = this.selecteds.length - 1; i >= 0; i--) {
                    this.selecteds[i].toAverrageScale();
                };
            }

            this.layerManager.update();

            this.updateCollisions();

            

            this.laneCounter += this.verticalSpeed;
            this.tileCounter = Math.floor(this.laneCounter / this.gameController.getTileSize().height);


            this.gameController.update(this.tileCounter, this.enemyLayer);

            // if(this.tileCounter > this.lastTileCounter)
                // this.updateEnemySpawner();
            // this.label2.setText(this.tileCounter);
            this.updateScore(this.tileCounter);
        }

    },
    updateCollisions:function()
    {
        var hasCollision;
        for (var i = this.players.length - 1; i >= 0; i--) {            
            tempPlayer = this.players[i];
            hasCollision = false;
            targetPosition = {x:tempPlayer.getPosition().x, y:tempPlayer.getPosition().y};
            if(targetPosition.x - tempPlayer.range < (this.environment.model.leftWallScale * windowWidth)){
                hasCollision = true;
                targetPosition.x = this.environment.model.leftWallScale * windowWidth + tempPlayer.range;
            }else if(targetPosition.x + tempPlayer.range > ((1 - this.environment.model.rightWallScale) * windowWidth)){
                hasCollision = true;
                targetPosition.x = ((1 - this.environment.model.rightWallScale) * windowWidth) - tempPlayer.range
            }
            if(hasCollision){
                tempPlayer.goTo(targetPosition, true);
            }
        }
        for (var i = this.players.length - 1; i >= 0; i--) {
            this.entityLayer.collideChilds(this.players[i])
            this.enemyLayer.collideChilds(this.players[i]);
        };
        // this.entityLayer.collideChilds(this.player1);
        // this.enemyLayer.collideChilds(this.player2);
        // this.enemyLayer.collideChilds(this.player1);
    }
});
