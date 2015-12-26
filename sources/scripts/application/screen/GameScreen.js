/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);


        


        this.gameController = APP.getGameController();

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
        this.addChild(this.label);

        this.label2 = new PIXI.Text("", {font:"20px Arial", fill:"red"});
        this.addChild(this.label2);
        this.label2.position.y = 200;



        this.reset();

        this.drawMapData();

        this.laneCounter = 0;

        this.initHUD();
        
    },
    initHUD:function(){
        var self = this;

        pauseButton = new DefaultButton("img/assets/Blob_red.png","img/assets/Blob_red.png");
        pauseButton.build(this.gameController.getTileSize().width, this.gameController.getTileSize().height);
        this.HUDLayer.addChild(pauseButton.getContent());

        pauseButton.clickCallback = function(){
            self.updateable = !self.updateable;
        }


        restartButton = new DefaultButton("img/assets/ennemy_Blob_blue.png","img/assets/ennemy_Blob_blue.png");
        restartButton.build(this.gameController.getTileSize().width, this.gameController.getTileSize().height);
        this.HUDLayer.addChild(restartButton.getContent());
        restartButton.getContent().position.x = 100;

        
        restartButton.clickCallback = function(){
            self.gameOver()
        }
    },
    reset:function(){

        this.lastTileCounter = -1;
        this.tileCounter = 0;
        this.laneCounter = 0;

        this.enemyCounter = APP.gameVariables.enemyCounter;
        this.maxEnemyCounter = APP.gameVariables.enemyCounter;
        this.onReset = true;
        this.updateable = true;


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
    // updateEnemySpawner:function()
    // {
    //     // if(this.enemyCounter < 0){

    //     if(this.tileCounter % 1 == 0){
    //         // if(this.mapArray)console.log(this.tileCounter);
    //     }
    //     //PROCURAR AQUI NO ARRAY SE TEM ALGUM INIMIGO NA LINHA ATRAVES DO TILECOUNTER
    //     // this.lastTileCounter = this.tileCounter;
    //     if(this.tileCounter % APP.gameVariables.enemyRespaw == 0 && this.lastTileCounter != this.tileCounter){
    //             this.lastTileCounter = this.tileCounter;
    //         this.enemyCounter = this.maxEnemyCounter;
    //         if(Math.random() < 0.5){
    //             tempEnemy = new Enemy("ENEMY", {width:this.gameController.getTileSize().width*2});
    //             // tempEnemy = new Enemy("ENEMY", {width:this.gameController.getTileSize().width});
    //             tempEnemy.build();
    //             tempEnemy.velocity.y = this.verticalSpeed;
    //             tempEnemy.getContent().position = this.gameController.getTilePosition(this.gameController.getRandom(3, APP.mapData.cols - 2), -1);
    //             this.enemyLayer.addChild(tempEnemy);

    //             rnd = Math.random();
    //             if(rnd < 0.6){
    //                 tempEnemy.behaviours.push(this.gameController.getRandomBehaviour(1));
    //             }

    //         }else{
    //             tempEnemy = new Enemy("ENEMY2", {width:this.gameController.getTileSize().width});
    //             tempEnemy.build();
    //             tempEnemy.velocity.y = this.verticalSpeed;
    //             tempEnemy.getContent().position = this.gameController.getTilePosition(this.gameController.getRandom(1, APP.mapData.cols - 1), -1, true);
    //             this.enemyLayer.addChild(tempEnemy);  

    //             rnd = Math.random();
    //             if(rnd < 0.3){
    //                 tempEnemy.behaviours.push(this.gameController.getRandomBehaviour(0));
    //                 tempEnemy.behaviours.push(this.gameController.getRandomBehaviour(1));
    //             }else if(rnd < 0.6){
    //                 tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             }              
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //             tempEnemy.behaviours.push(this.gameController.getRandomBehaviour());
    //         }
            
    //         // tempEnemy.getContent().position = this.gameController.getTilePosition(this.getRandom(1, APP.mapData.cols - 1), -1, true);            this.enemyLayer.addChild(tempEnemy);
    //     }else{
    //         this.enemyCounter --;
    //     }
    // },
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


            this.gameController.update(this.tileCounter, this.enemyLayer);

            // if(this.tileCounter > this.lastTileCounter)
                // this.updateEnemySpawner();
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
        for (var i = this.players.length - 1; i >= 0; i--) {
            this.entityLayer.collideChilds(this.players[i])
            this.enemyLayer.collideChilds(this.players[i]);
        };
        // this.entityLayer.collideChilds(this.player1);
        // this.enemyLayer.collideChilds(this.player2);
        // this.enemyLayer.collideChilds(this.player1);
    }
});
