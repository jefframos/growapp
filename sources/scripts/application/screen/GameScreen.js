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
        this.enemyLayer = new Layer("Enemy");
        this.layerManager.addLayer(this.entityLayer);
        this.layerManager.addLayer(this.enemyLayer);

        var self = this;

        this.player1 = new Player(this,"PLAYER1");
        this.player1.build();
        this.entityLayer.addChild(this.player1);
        this.player1.getContent().position.x = windowWidth/2;
        this.player1.getContent().position.y = windowHeight/2;



        this.player2 = new Player(this,"PLAYER2");
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

        
        
    //detectar colisoes aqui pra mover depois
        this.gameHit.mousemove = this.gameHit.touchmove = function(touchData){
            if(!self.updateable){
                return;
            }
            self.currentPosition = touchData.global;
            if(self.touchDown){
                self.detectTouchCollision(touchData);
            }
        };
        this.gameHit.mousedown = this.gameHit.touchstart = function(touchData){
            if(!self.updateable){
                return;
            }
            self.currentPosition = touchData.global;
            self.touchDown = true;
            self.detectTouchCollision(touchData);
        };
        this.gameHit.mouseup = this.gameHit.touchend = function(touchData){
            self.label.setText("");
            self.touchDown = false;
            self.currentPosition = null;
            self.selectedPlayer = null;
            self.onReset = false;
        };


        this.updateable = true;

        this.addChild(this.layerManager);

        this.players = [this.player1, this.player2];


        this.label = new PIXI.Text("", {font:"50px Arial", fill:"red"});
        this.addChild(this.label);



        this.reset();
        
    },
    reset:function(){
        this.selectedPlayer = null;
        this.touchDown = false;
        this.currentPosition = null;
        this.currentLocalPosition = null;
        this.enemyCounter = windowHeight * 0.15;
        this.maxEnemyCounter = windowHeight * 0.15;
        this.onReset = true;
        this.updateable = true;
        this.player1.reset();
        this.player2.reset();

        this.player1.getContent().position.x = this.player1.range * 2;
        this.player1.getContent().position.y = windowHeight - this.player1.range * 2;
        
        this.player2.getContent().position.x = windowWidth - this.player1.range * 2;
        this.player2.getContent().position.y = windowHeight - this.player2.range * 2;
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
        var hasCollide = false;
        for (var i = this.players.length - 1; i >= 0; i--) {
            
            if(!this.selectedPlayer && pointDistance(touchData.global.x, touchData.global.y,this.players[i].getContent().position.x, this.players[i].getContent().position.y) < this.players[i].range){                
                hasCollide = true;
                this.selectedPlayer = this.players[i];

                this.currentLocalPosition = {x:touchData.global.x - this.players[i].getContent().position.x, y:touchData.global.y - this.players[i].getContent().position.y};
            }
        };
        // console.log(hasCollide);
    
    },
    updateScales:function()
    {
        if(this.selectedPlayer.subType == this.player2.subType){
            this.player1.updateScale(this.player2);
        }else if(this.selectedPlayer.subType == this.player1.subType){
            this.player2.updateScale(this.player1);
        }
    },
    updateEnemySpawner:function()
    {
        if(this.enemyCounter < 0){
            this.enemyCounter = this.maxEnemyCounter;
            tempEnemy = new Enemy();
            tempEnemy.build();
            tempEnemy.velocity.y = windowHeight * 0.005;
            tempEnemy.getContent().position.x = tempEnemy.range + Math.random() * (windowWidth - tempEnemy.range * 2)
            this.enemyLayer.addChild(tempEnemy);
        }else{
            this.enemyCounter --;
        }
    },
    update:function()
    {
        if(!this.updateable){
            return;
        }
        if(this.layerManager){
            this.updateEnemySpawner();
            

            if(this.selectedPlayer && this.touchDown){
                this.label.setText(this.selectedPlayer.subType);
                this.selectedPlayer.goTo({x:this.currentPosition.x - this.currentLocalPosition.x, y:this.currentPosition.y - this.currentLocalPosition.y});
                this.updateScales();
            }else{
                this.label.setText("");
            }
            this.layerManager.update();

            this.entityLayer.collideChilds(this.player1);
            // this.entityLayer.collideChilds(this.player2);


            this.enemyLayer.collideChilds(this.player2);
            this.enemyLayer.collideChilds(this.player1);
        }
    },
});
