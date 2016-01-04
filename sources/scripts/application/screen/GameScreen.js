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

        this.gameContainerMaster = new PIXI.DisplayObjectContainer();
        this.addChild(this.gameContainerMaster);

        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.gameContainerMaster.addChild(this.gameContainer);

        this.gameGrid = new PIXI.DisplayObjectContainer();
        // this.gameContainerMaster.addChild(this.gameGrid);

        var assetsToLoader = [];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
        
        this.applyIsometric();
       
    },    
    applyIsometric:function(){
        this.gameContainer.pivot = {x:windowWidth/2, y:windowHeight/2};
        this.gameContainer.rotation = 45 /180*3.14;

        this.gameGrid.pivot = {x:windowWidth/2, y:windowHeight/2};
        this.gameGrid.rotation = 45 /180*3.14;


        this.gameContainerMaster.scale.y = 0.5;
        this.gameContainerMaster.x = windowWidth/2
        this.gameContainerMaster.y = windowHeight/2
    },
    drawMapData:function(){
        for (var i = APP.mapData.mapCols; i > 0; i--) {
            tempLine = new PIXI.Graphics();
            tempLine.lineStyle(1,0);
            tempLine.moveTo(0,0);
            tempLine.lineTo(0, windowHeight);
            tempLine.position.x = i * APP.mapBounds.width / APP.mapData.mapCols;
            // tempLine.alpha = 0.5;
            // this.addChild(tempLine);
            this.gameGrid.addChild(tempLine);
        };

        for (var i = APP.mapData.rows; i > 0; i--) {
            tempLine = new PIXI.Graphics();
            tempLine.lineStyle(1,0);
            tempLine.moveTo(APP.mapBounds.x,0);
            tempLine.lineTo(APP.mapBounds.x + APP.mapBounds.width , 0);
            tempLine.position.y = i * windowHeight / APP.mapData.rows;
            // tempLine.alpha = 0.5;
            // this.addChild(tempLine);
            this.gameGrid.addChild(tempLine);
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
    hidePauseModal:function(self){
        self.showTopHUD();
        self.pauseModal.hide(true);
        self.unpause();
    },
    showEndModal:function(){
        this.hideTopHUD();
        this.endModal.show();
    },
    hideEndModal:function(self){
        // console.log(this);
        self.showTopHUD();
        self.reset();
    },
    showStartModal:function(){
        this.pauseModal.hide(true);
        this.pause();
        this.hideTopHUD();
        this.startModal.show();
    },
    hideStartModal:function(self){
        // console.log("HIDE HERE");
        self.showTopHUD();
        self.start();
    },
    createModal:function(){
    },
    onProgress:function(){
    },
    onAssetsLoaded:function()
    {
        // console.log("ASSETS LOAD");
        this._super();
        this.layerManager = new LayerManager();
        this.environmentLayer = new Layer("Environment");
        this.entityLayer = new Layer("Entity");
        // this.fireLayer = new Layer("Fire");
        // this.enemyLayer = new Layer("Enemy");
        this.layerManager.addLayer(this.environmentLayer);
        // this.layerManager.addLayer(this.enemyLayer);
        this.layerManager.addLayer(this.entityLayer);
        // this.layerManager.addLayer(this.fireLayer);

        this.verticalSpeed = APP.gameVariables.verticalSpeed;

        configEnvironment = {
            leftWallScale:windowWidth / APP.mapData.cols / windowWidth,
            rightWallScale:windowWidth / APP.mapData.cols / windowWidth,
            floorScale:1,
        }
        // console.log(configEnvironment);
        configEnvironment.floorScale = 1;// - configEnvironment.leftWallScale - configEnvironment.rightWallScale;

        

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

        this.selecteds = [];

        this.updateable = false;

        this.gameContainer.addChild(this.layerManager.getContent());

        this.HUDLayer = new PIXI.DisplayObjectContainer();
        this.addChild(this.HUDLayer);

        


        this.label = new PIXI.Text("", {font:"20px Arial", fill:"red"});
        this.laneCounter = 0;

        this.initHUD();
        
        this.reset();
        tempLine = new PIXI.Graphics();
        tempLine.lineStyle(3,0xFF0000);
        tempLine.drawRect(APP.mapBounds.x,APP.mapBounds.y,APP.mapBounds.width,APP.mapBounds.height);
        this.gameGrid.addChild(tempLine);

        this.environment = new Environment(APP.mapBounds);
        this.environmentLayer.addChild(this.environment);
        this.environment.velocity.y = this.verticalSpeed;
        this.drawMapData();
    },
    restart:function(self){
        console.log("RESTART");
        self.destroyEntities();
        self.reset();
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
        returnButton.getContent().position = this.gameController.getTilePositionHUD(1,0);
        returnButton.getContent().position.y = this.gameController.getTileSize().height / 2 - returnButton.getContent().height / 2;

        returnButton.clickCallback = function(){
            APP.getTransition().transitionIn('Loader');
        }

        pauseButtonLabel = new PIXI.Text("II", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});    
        pauseButton = new DefaultButton("button_small_up.png","button_small_over.png");
        pauseButton.build(this.gameController.getTileSize().width, this.gameController.getTileSize().width);
        pauseButton.addLabel(pauseButtonLabel,0,0,true,0,0);
        this.tupHUD.addChild(pauseButton.getContent());
        pauseButton.getContent().position = this.gameController.getTilePositionHUD(7,0);
        pauseButton.getContent().position.y = this.gameController.getTileSize().height / 2 - pauseButton.getContent().height / 2;
        pauseButton.clickCallback = function(){
            self.showPauseModal();
        }

        this.scoreLabel = new PIXI.Text("0", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});
        this.tupHUD.addChild(this.scoreLabel);
        scaleConverter(this.scoreLabel.height, this.gameController.getTileSize().width, 1, this.scoreLabel);

        this.HUDLayer.addChild(this.tupHUD);

        this.pauseModal = new PauseModal(this, this.hidePauseModal, this.restart);
        this.pauseModal.build();
        this.HUDLayer.addChild(this.pauseModal.getContent());

        this.endModal = new EndModal(this,this.hideEndModal);
        this.endModal.build();
        this.HUDLayer.addChild(this.endModal.getContent());

        this.startModal = new StartModal(this, this.hideStartModal);
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
            this.entityLayer.addChild(tempEnemies[i]);
            // this.enemyLayer.addChild(tempEnemies[i]);
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
        for (var i = this.entityLayer.childs.length - 1; i >= 0; i--) {
            // this.entityLayer.childs[i].preKill();
            if(this.entityLayer.childs[i].type == "enemy"){
                this.entityLayer.childs[i].kill = true;
                this.entityLayer.removeChild(this.entityLayer.childs[i]);
            }
        };
        // for (var i = this.fireLayer.childs.length - 1; i >= 0; i--) {
        //     // this.fireLayer.childs[i].preKill();
        //     this.fireLayer.childs[i].kill = true;
        //     this.fireLayer.removeChild(this.fireLayer.childs[i]);
        // };
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
            if(this.players[i].label == this.players[selected].label){
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
                this.updateShoots();
            }else if(this.selecteds.length == 2){
                for (var i = this.selecteds.length - 1; i >= 0; i--) {
                    this.selecteds[i].toAverrageScale();
                };
            }

            this.layerManager.update();

            this.updateCollisions();

            

            this.laneCounter += this.verticalSpeed;
            this.tileCounter = Math.floor(this.laneCounter / this.gameController.getTileSize().height);


            this.gameController.update(this.tileCounter, this.entityLayer);

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
            if(targetPosition.x - tempPlayer.range < APP.mapBounds.x){
                hasCollision = true;
                targetPosition.x = APP.mapBounds.x + tempPlayer.range;
            }else if(targetPosition.x + tempPlayer.range > APP.mapBounds.width + APP.mapBounds.x){
                hasCollision = true;
                targetPosition.x = APP.mapBounds.width - tempPlayer.range + APP.mapBounds.x;
            }
            if(hasCollision){
                tempPlayer.goTo(targetPosition, true);
            }
        }
        for (var i = this.players.length - 1; i >= 0; i--) {
            this.entityLayer.collideChilds(this.players[i])
            // this.enemyLayer.collideChilds(this.players[i]);
        };
        // this.entityLayer.collideChilds(this.player1);
        // this.enemyLayer.collideChilds(this.player2);
        // this.enemyLayer.collideChilds(this.player1);
    }
});
