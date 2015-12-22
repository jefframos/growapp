/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

        APP.mapData = {
            cols: 11,
            rows: 15
        }

        APP.gameVariables = {
            verticalSpeed: windowHeight * 0.002,
            // enemyCounter: (windowHeight * 0.007) * windowHeight / APP.mapData.rows,
            // enemyCounter: (windowHeight * 0.005) *this.getTileSize().height,
            enemyRespaw: 5,
            growFactor: windowWidth * 0.0001,
            shootSpeedStandard: windowHeight * 0.008,
        }

        // console.log(APP.gameVariables.enemyCounter);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.updateable = false;
        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.gameContainer);
        var assetsToLoader = ["img/assets/Blob_red.png",
        "img/assets/ennemy_Blob_blue.png",
        "img/assets/Floor.png",
        "img/assets/SideWall.png",
        "img/assets/teste1.png"
        ];
        // var assetsToLoader = ["img/dragon.json"];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }

    },
    getRandom:function(min, max){
        ret = Math.floor(Math.random()*(max - min) + min);
        // console.log(ret,min, max);
        return ret;
    },
    getTileSize:function(){
         return {width:(windowWidth / APP.mapData.cols),
            height:(windowHeight / APP.mapData.rows)}
    },
    getTilePosition:function(i,j, center){
        if(i > APP.mapData.cols){
            i = APP.mapData.cols;
        }
        if(j > APP.mapData.rows){
            j = APP.mapData.rows;
        }
        returnObj = {
            x:i * (windowWidth / APP.mapData.cols),
            y:j * (windowHeight / APP.mapData.rows),
        }
        if(center){
            returnObj.x += (windowWidth / APP.mapData.cols)/2;
            returnObj.y += (windowHeight / APP.mapData.rows)/2;
        }

        return returnObj;
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

        this.player1 = new Player(this.getTileSize().width/2,this,"PLAYER1",this.fireLayer);
        this.player1.build();
        this.entityLayer.addChild(this.player1);
        this.player1.getContent().position.x = windowWidth/2;
        this.player1.getContent().position.y = windowHeight/2;



        this.player2 = new Player(this.getTileSize().width/2,this,"PLAYER2",this.fireLayer);
        this.player2.build();     
        this.entityLayer.addChild(this.player2);
        this.player2.getContent().position.x = windowWidth/1.5;
        this.player2.getContent().position.y = windowHeight/1.5;

        this.player1.collideCallback = this.player2.collideCallback = this.gameOver;
        // APP.getStage().mouseup = APP.getStage().touchend = function(touchData){
        //     self.player1.onMouseDown = false;
        //     self.player2.onMouseDown = false;
        // };

        this.gameHit = new PIXI.Graphics();
        this.gameHit.interactive = true;
        this.gameHit.beginFill(0xFF0000);
        this.gameHit.drawRect(0,0,windowWidth, windowHeight);
        this.gameContainer.addChild(this.gameHit);
        this.gameHit.alpha = 0.1;
        this.gameHit.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight);


        this.selecteds = [];

        this.updateable = true;

        this.addChild(this.layerManager);

        this.players = [this.player1, this.player2];


        this.label = new PIXI.Text("", {font:"20px Arial", fill:"red"});
        this.addChild(this.label);

        this.label2 = new PIXI.Text("", {font:"20px Arial", fill:"red"});
        this.addChild(this.label2);
        this.label2.position.y = 200;



        this.reset();

        this.drawMapData();

        this.laneCounter = 0;

        
    },
    reset:function(){
        this.selectedPlayer = null;
        this.touchDown = false;
        this.currentPosition = null;
        this.currentLocalPosition = null;
        this.player1.reset();
        this.player2.reset();

        this.lastTileCounter = -1;
        this.tileCounter = 0;
        this.laneCounter = 0;

        this.enemyCounter = APP.gameVariables.enemyCounter;
        this.maxEnemyCounter = APP.gameVariables.enemyCounter;
        this.onReset = true;
        this.updateable = true;

        this.player1.getContent().position = this.getTilePosition(3, 12, true);
        this.player2.getContent().position = this.getTilePosition(7, 12, true);
        
    },
    gameOver:function()
    {
        for (var i = this.enemyLayer.childs.length - 1; i >= 0; i--) {
            this.enemyLayer.childs[i].preKill();
            // this.enemyLayer.removeChild(this.enemyLayer.childs[i]);
        };
        this.updateable = false;
        this.reset();
        this.label.setText("gameOver");
    },
    detectTouchCollision:function(touchData)
    {
        if(this.onReset){
            return;
        }
        // console.log("detectTouchCollision");
        var hasCollide = false;
        for (var i = this.players.length - 1; i >= 0; i--) {
            
            if(!this.selectedPlayer && pointDistance(touchData.global.x, touchData.global.y,this.players[i].getContent().position.x, this.players[i].getContent().position.y) < this.players[i].range*1.5){                
                hasCollide = true;
                this.selectedPlayer = this.players[i];

                this.currentLocalPosition = {x:touchData.global.x - this.players[i].getContent().position.x, y:touchData.global.y - this.players[i].getContent().position.y};
            }
        };    
    },
    updateScales:function()
    {
        if(this.selecteds[0].subType == this.player2.subType){
            this.player1.updateScale(this.player2);
        }else if(this.selecteds[0].subType == this.player1.subType){
            this.player2.updateScale(this.player1);
        }
    },
    getRandomBehaviour:function(fixed){

        behaviours = []
        behaviours.push(new ScaleBehaviour({minScale:1, maxScale:2}));
        behaviours.push(new DefaultBehaviour({minPosition:this.getTilePosition(2, -1,true).x, maxPosition:this.getTilePosition(APP.mapData.cols - 3, -1, true).x}));

        if(fixed){
            return behaviours[fixed];
        }else{
            return behaviours[Math.floor(Math.random() * behaviours.length)];
        }
    },
    updateEnemySpawner:function()
    {
        // if(this.enemyCounter < 0){
        if(this.tileCounter % APP.gameVariables.enemyRespaw == 0 && this.lastTileCounter != this.tileCounter){
            this.lastTileCounter = this.tileCounter;
            this.enemyCounter = this.maxEnemyCounter;
            if(Math.random() < 0.5){
                tempEnemy = new Enemy("ENEMY", {width:this.getTileSize().width*2});
                // tempEnemy = new Enemy("ENEMY", {width:this.getTileSize().width});
                tempEnemy.build();
                tempEnemy.velocity.y = this.verticalSpeed;
                tempEnemy.getContent().position = this.getTilePosition(this.getRandom(3, APP.mapData.cols - 2), -1);
                this.enemyLayer.addChild(tempEnemy);

                rnd = Math.random();
                if(rnd < 0.6){
                    tempEnemy.behaviours.push(this.getRandomBehaviour(1));
                }

            }else{
                tempEnemy = new Enemy("ENEMY2", {width:this.getTileSize().width});
                tempEnemy.build();
                tempEnemy.velocity.y = this.verticalSpeed;
                tempEnemy.getContent().position = this.getTilePosition(this.getRandom(1, APP.mapData.cols - 1), -1, true);
                this.enemyLayer.addChild(tempEnemy);  

                rnd = Math.random();
                if(rnd < 0.3){
                    tempEnemy.behaviours.push(this.getRandomBehaviour(0));
                    tempEnemy.behaviours.push(this.getRandomBehaviour(1));
                }else if(rnd < 0.6){
                    tempEnemy.behaviours.push(this.getRandomBehaviour());
                }              
            }
            
            // tempEnemy.getContent().position = this.getTilePosition(this.getRandom(1, APP.mapData.cols - 1), -1, true);            this.enemyLayer.addChild(tempEnemy);
        }else{
            this.enemyCounter --;
        }
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
    update:function()
    {
        if(!this.updateable){
            return;
        }
        if(this.layerManager){
            this.updateEnemySpawner();
            if(this.player1.mouseDown){
                this.addSelected(this.player1);
            }else{
                this.removeSelected(this.player1);
            }
            if(this.player2.mouseDown){
                this.addSelected(this.player2);
            }else{
                this.removeSelected(this.player2);
            }
            if(this.selecteds.length == 1){
                this.updateScales();
                if(this.selecteds[0].subType === this.player1.subType){
                    this.player2.shoot();
                }else{
                    this.player1.shoot();                    
                }
            }else if(this.selecteds.length == 2){
                for (var i = this.selecteds.length - 1; i >= 0; i--) {
                    this.selecteds[i].toAverrageScale();
                };
            }

            this.layerManager.update();

            this.updateCollisions();

            this.laneCounter += this.verticalSpeed;
            this.tileCounter = Math.floor(this.laneCounter / this.getTileSize().height);
            this.label2.setText(this.tileCounter);
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
        this.entityLayer.collideChilds(this.player1);
        this.enemyLayer.collideChilds(this.player2);
        this.enemyLayer.collideChilds(this.player1);
    }
});
