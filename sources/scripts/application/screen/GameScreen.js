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

        this.verticalSpeed = windowHeight * 0.005;

        configEnvironment = {
            floorScale:0.8,
            leftWallScale:0.1,
            rightWallScale:0.1,
        }
        this.environment = new Environment(configEnvironment);
        this.environmentLayer.addChild(this.environment);
        this.environment.velocity.y = this.verticalSpeed;

        var self = this;

        this.player1 = new Player(this,"PLAYER1",this.fireLayer);
        this.player1.build();
        this.entityLayer.addChild(this.player1);
        this.player1.getContent().position.x = windowWidth/2;
        this.player1.getContent().position.y = windowHeight/2;



        this.player2 = new Player(this,"PLAYER2",this.fireLayer);
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


        // use the mousedown and touchstart

        // {
        // //detectar colisoes aqui pra mover depois
        //     this.gameHit.mousemove = this.gameHit.touchmove = function(touchData){
        //         if(!self.updateable){
        //             return;
        //         }
        //         self.currentPosition = touchData.global;
        //         if(self.touchDown){
        //             self.detectTouchCollision(touchData);
        //         }
        //     };
        //     this.gameHit.mousedown = this.gameHit.touchstart = function(touchData){
        //         if(!self.updateable){
        //             return;
        //         }
        //         self.onReset = false;
        //         self.currentPosition = touchData.global;
        //         self.touchDown = true;
        //         self.detectTouchCollision(touchData);

        //         // var touch = {
        //         //     id: event.data.identifier,
        //         //     pos: event.data.getLocalPosition(this.view)
        //         // };

        //         self.label.setText(touchData);
        //         console.log(touchData);
        //         self.touches.push(touchData);
        //     };
        //     this.gameHit.mouseup = this.gameHit.touchend = function(touchData){
        //         self.label.setText("");
        //         self.touchDown = false;
        //         self.currentPosition = null;
        //         self.selectedPlayer = null;
        //         self.onReset = false;
        //     };
        // }

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
        
    },
    reset:function(){
        this.selectedPlayer = null;
        this.touchDown = false;
        this.currentPosition = null;
        this.currentLocalPosition = null;
        this.player1.reset();
        this.player2.reset();


        this.enemyCounter = this.verticalSpeed;
        this.maxEnemyCounter = this.verticalSpeed * this.player1.standardRange// * this.player1.scales.max;
        // console.log(this.verticalSpeed , this.player1.standardScale , this.player1.scales.max , 1.5);
        // this.enemyCounter = windowHeight * 0.2;
        // this.maxEnemyCounter = windowHeight * 0.2;
        this.onReset = true;
        this.updateable = true;

        this.player1.getContent().position.x = windowWidth / 2 - this.player1.range * 2;
        this.player1.getContent().position.y = windowHeight - this.player1.range * 4;
        
        this.player2.getContent().position.x = windowWidth / 2 + this.player1.range * 2;
        this.player2.getContent().position.y = windowHeight - this.player2.range * 4;
    },
    gameOver:function()
    {
        
        for (var i = this.enemyLayer.childs.length - 1; i >= 0; i--) {
            this.enemyLayer.removeChild(this.enemyLayer.childs[i]);
        };


        this.updateable = false;

        this.reset();

        // console.log(this);
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
    updateEnemySpawner:function()
    {
        if(this.enemyCounter < 0){
            this.enemyCounter = this.maxEnemyCounter;
            tempEnemy = new Enemy();
            tempEnemy.build();
            tempEnemy.velocity.y = -this.verticalSpeed;
            tempEnemy.getContent().position.x = tempEnemy.range + Math.random() * (windowWidth - tempEnemy.range * 2)
            tempEnemy.getContent().position.y = tempEnemy.range + windowHeight;
            scaleConverter(tempEnemy.getContent().width, windowWidth, 0.08, tempEnemy.getContent());
            // tempEnemy.getContent().scale.x = tempEnemy.getContent().scale.y = 0.5
            this.enemyLayer.addChild(tempEnemy);
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
            // this.updateEnemySpawner();
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
            this.updateCollisions();

            this.layerManager.update();

            
        }

    },
    updateCollisions:function()
    {
        var hasCollision;
        for (var i = this.selecteds.length - 1; i >= 0; i--) {            
            tempPlayer = this.selecteds[i];
            hasCollision = false;
            targetPosition = {x:tempPlayer.getPosition().x, y:tempPlayer.getPosition().y}
            // console.log(targetPosition);
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
