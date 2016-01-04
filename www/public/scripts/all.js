/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0);


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

var Ball = Class.extend({
	init:function(){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(0x553388);
		this.radius = 30;
		this.graphics.drawCircle(0,0,this.radius);
		this.entityContainer.addChild(this.graphics);
		this.velocity = {x:0,y:0};
		this.jumpForce = 8;
	},
	jump:function(){
		this.graphics.beginFill(Math.random() * 0xFFFFFF);
		this.graphics.drawCircle(0,0,30);
		this.velocity.y = -this.jumpForce;
	},
	update:function(){
		this.entityContainer.position.x += this.velocity.x;
		this.entityContainer.position.y += this.velocity.y;
	},
	getContent:function(){
		return this.entityContainer;
	}
});

var Item = Entity.extend({
	init:function(imgSrc){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.imageDilma = new SimpleSprite(imgSrc);
        this.entityContainer.addChild(this.imageDilma.getContent());

        this.imageDilma.getContent().position.y = windowHeight - this.imageDilma.getContent().height * 0.9;
        this.standardVelocity = {x:windowWidth * 0.3,y:0};
        this.velocity = {x:0,y:0};
        this.updateable = true;

        this.side = 1;
        this.sin = 0;

        //this.gravity
	},
	update:function(){
		this._super();
	},
	getContent:function(){
		return this.entityContainer;
	}
});

/*jshint undef:false */
var Door = Entity.extend({
    init:function(side){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.side = side;
        this.range = APP.tileSize.x;
        this.width = APP.tileSize.x;
        this.height = APP.tileSize.y;
        this.centerPosition = {x:-this.width/2, y:-this.height/2};
        this.type = 'door';
        this.node = null;
        this.updateable = true;
    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        //console.log(this.getPosition().x);
        this.bounds = {x: this.getPosition().x - this.width/2, y: this.getPosition().y - this.height/2, w: this.width, h: this.height};
        this.collisionPoints = {
            up:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y},
            down:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y + this.bounds.h},
            bottomLeft:{x:this.bounds.x, y:this.bounds.y+this.bounds.h},
            topLeft:{x:this.bounds.x, y:this.bounds.y},
            bottomRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y+this.bounds.h},
            topRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y}
        };
        this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y));
        return this.bounds;
    },
    debugPolygon: function(color, force){
        if(this.lastColorDebug !== color || force){
            if(this.debugGraphic.parent === null && this.getContent().parent !== null)
            {
                this.getContent().parent.addChild(this.debugGraphic);
            }
            this.lastColorDebug = color;
            this.gambAcum ++;
            if(this.debugGraphic !== undefined){
                this.debugGraphic.clear();
            }else{
                this.debugGraphic = new PIXI.Graphics();
            }
            // console.log(this.polygon);
            this.debugGraphic.beginFill(color, 0.5);
            this.debugGraphic.lineStyle(1, 0xffd900);
            this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x,this.polygon.points[this.polygon.points.length - 1].y);
            // console.log('this.polygon',this.polygon.points);

            for (var i = this.polygon.points.length - 2; i >= 0; i--) {
                this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            }
            this.debugGraphic.endFill();
        }
    },
    build: function(){
        this._super('dist/img/cubo2.png');
        var self = this;
        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
        this.getContent().scale.x = 0.5;
        this.getContent().scale.y = 0.5;
        this.getContent().alpha = 0.5;
    },
    update: function(){
        this._super();
        this.getBounds();
        this.debugPolygon(0x556644, true);
    },

    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});

/*jshint undef:false */
var Fire = Entity.extend({
    init:function(vel, range, color, entityLayer, power){
        // console.log(vel);
        this._super( true );
        this.entityLayer = entityLayer;
        this.color = color;
        this.updateable = false;
        this.deading = false;
        this.range =range;
        this.width = 1;
        this.height = 1;
        this.type = 'fire';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = 800;
        this.power = power;
        this.defaultVelocity = 1;
        this.entityContainer = new PIXI.DisplayObjectContainer();
        this.hitContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.hitContainer);

    },
    debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        // this.debugPolygon.lineStyle(0.5,color);
        this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0;
        this.hitContainer.addChild(this.debugPolygon);
    },
    getContent:function(){
        return this.entityContainer;
    },
    build: function(){
        // this._super();
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;
        // var self = this;
        this.debugPolygon(this.color);
    },
    update: function(){
        this._super();
        this.timeLive --;
        this.entityLayer.collideChilds(this);
        if(this.timeLive <= 0){
            this.preKill();
        }
    },
    collide:function(arrayCollide){
        // console.log('fireCollide', arrayCollide[0].type);
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                // this.getContent().tint = 0xff0000;
                this.preKill();
                arrayCollide[0].hurt(this.power);

            }
        }
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){self.kill = true;}});
        }
    },
});

/*jshint undef:false */
var GameController = Class.extend({
    init:function(){
    	APP.mapData = {
            cols: 9,
            rows: 12,
            mapCols: 11
        }

        // cols: 9,
        //     rows: 12

        APP.gameVariables = {
            verticalSpeed: windowHeight * 0.002,
            // verticalSpeed: windowHeight * 0.002,
            // enemyCounter: (windowHeight * 0.007) * windowHeight / APP.mapData.rows,
            // enemyCounter: (windowHeight * 0.005) *this.getTileSize().height,
            enemyRespaw: 5,
            growFactor: windowWidth * 0.0001,
            shootSpeedStandard: windowHeight * 0.01,
        }

        APP.mapBounds = new PIXI.Rectangle(this.getTileSize().width, 0, APP.mapData.mapCols * this.getTileSize().width, windowHeight);
        this.buildMap();
    },
    buildMap:function(){
    	map = 
        
        "00900005000\n"+
        "00000006000\n"+
        "00006005000\n"+
        "00000005000\n"+
        "00000000000\n"+
        "06000000000\n"+
        "00000070000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00800006000\n"+
        "00000000000\n"+
        "00800000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "05000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000600000\n"+
        "60000000700\n"+
        "00000000000\n"+
        "00800000000\n"+
        "00000000000\n"+
        "06080000000\n"+
        "00080000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        // "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00010002000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000"
        

        this.mapArray = [];
        tempLines = map.split("\n");
        for (var i = tempLines.length - 1 ; i >=0 ; i--) {
            tempMap = [];
            for (var j = 0 ; j < tempLines[i].length; j++) {
                tempMap.push(tempLines[i][j])
            };
            this.mapArray.push(tempMap);
        };
        // console.log(this.mapArray);

        this.getEntityList();
        // this.getInitScreenEntities();
    },
    getEntityList:function(){
    	this.entityList = [];
    	this.hasSomething = [];
    	has = false;
    	this.playersList = [];
    	accum = APP.mapData.rows - this.mapArray.length;//APP.mapData.rows - 1;
    	tempObj = {};
    	for (var i = this.mapArray.length-1; i >= 0; i--) {
    		// console.log(i);
    	// for (var i = 0; i < this.mapArray.length ; i++) {
    		has = false;
    		tempArray = [];
    		for (var j = 0; j < this.mapArray[i].length ; j++) {
    			if(this.mapArray[i][j] > 0){
    				tempObj = {
    					type: this.mapArray[i][j],
    					i:j,
    					j:accum
    				}
    				if(this.mapArray[i][j] < 5){
    					this.playersList.push(tempObj);
    				}else{
    					tempArray.push(tempObj);
    				}
    			}
    		};

    		this.entityList.push(tempArray);
    		accum++
    	};
    	// console.log(this.entityList);
    },
    updateEnemiesRow:function(id){
    	entities = [];
    	tempEntity = null;
    	id = (this.entityList.length - APP.mapData.rows - id - 1);
    	if(id < 0){
    		// console.log("ACABOU O LEVEL");
    		return;
    	}
    	for (var i = this.entityList[id].length - 1; i >= 0; i--) {
    		tempEntity = this.entityList[id][i];
			if(tempEntity){
				entities.push(
					this.getEnemy(tempEntity.i,
    					-5,
    					tempEntity.type));
			}
    	}
    	return entities
    },
    getInitScreenEntities:function(){
    	entities = [];
    	tempEntity = null;
    	for (var i = this.entityList.length - 1; i >= this.entityList.length -  APP.mapData.rows; i--) {
    		// console.log(i);
    		for (var j = this.entityList[i].length - 1; j >= 0; j--) {
    			tempEntity = this.entityList[i][j];
    			if(tempEntity){
    				entities.push(this.getEnemy(tempEntity.i,
	    				tempEntity.j,
	    				tempEntity.type));
    			}
    		};
    	}
    	return entities
    },
    getRandomBehaviour:function(fixed){

        behaviours = []
        behaviours.push(new ScaleBehaviour({minScale:1, maxScale:2}));
        behaviours.push(new DefaultBehaviour({minPosition:APP.getGameController().getTilePosition(2, -1,true).x, maxPosition:APP.getGameController().getTilePosition(APP.mapData.cols - 3, -1, true).x}));

        if(fixed >= 0){
            return behaviours[fixed];
        }else{
            return behaviours[Math.floor(Math.random() * behaviours.length)];
        }
    },
    getEnemy:function(i,j,type){
    	// console.log(i,j,type);
    	tempSize = this.getTileSize().width
        tempLabel = "ENEMY2";
    	if(type == 8){
    		tempSize *= 2;
    	}
        if(type == 6){
            tempLabel = "ENEMY";
        }
        // console.log(tempLabel);
		tempEnemy = new Enemy(tempLabel, {width:tempSize});
		tempEnemy.velocity.y = APP.gameVariables.verticalSpeed;
        tempEnemy.build();
        if(i == null || j == null){
        	tempEnemy.getContent().position = this.getTilePosition(this.getRandom(3, APP.mapData.cols - 2), -1);
        }else{
        	if(type == 8){
        		tempEnemy.getContent().position = this.getTilePosition(i,j);  
			}else{
        		tempEnemy.getContent().position = this.getTilePosition(i,j, true);        	
        	}
        	//se a largura é de dois tiles uso essa função
        	//tempEnemy.getContent().position = this.getTilePosition(i,j);        	
        }
        if(type == 7){
        	tempEnemy.behaviours.push(this.getRandomBehaviour(1));
        }
        if(type == 9){
        	tempEnemy.behaviours.push(this.getRandomBehaviour(0));
        }
        tempEnemy.getContent().position.y += 1/10; 
        return tempEnemy

    },
    getSize:function(i, j){
        return {width:(this.getTileSize().width * i),
            height:(this.getTileSize().height * j)}
    },
    getRandom:function(min, max){
        ret = Math.floor(Math.random()*(max - min) + min);
        return ret;
    },
    getTileSize:function(){
    	if(this.gameTileSize == null){
    		this.gameTileSize = {width:(windowWidth / APP.mapData.cols),
            height:(windowHeight / APP.mapData.rows)}
    	}
        return this.gameTileSize;
    },
    getTilePositionHUD:function(i,j, center){
        if(i > APP.mapData.cols){
            i = APP.mapData.cols;
        }
        if(j > APP.mapData.rows){
            j = APP.mapData.rows;
        }
        var returnObj = {
            x:i * (windowWidth / APP.mapData.cols),
            y:j * (windowHeight / APP.mapData.rows),
        }
        if(center){
            returnObj.x += (windowWidth / APP.mapData.cols)/2;
            returnObj.y += (windowHeight / APP.mapData.rows)/2;
        }

        return returnObj;
    },
    getTilePosition:function(i,j, center){
        if(i > APP.mapData.cols){
            i = APP.mapData.cols;
        }
        if(j > APP.mapData.rows){
            j = APP.mapData.rows;
        }
        var returnObj = {
            x:i * (APP.mapBounds.width / APP.mapData.mapCols) + APP.mapBounds.x,
            y:j * (windowHeight / APP.mapData.rows),
        }
        if(center){
            returnObj.x += (APP.mapBounds.width / APP.mapData.mapCols)/2;
            returnObj.y += (windowHeight / APP.mapData.rows)/2;
        }

        return returnObj;
    },
    update:function(rowID, enemyLayer){
    	//rowID += APP.mapData.rows;
    	if(this.currentRowID == rowID){
    		return;
    	}
    	this.currentRowID = rowID;

    	arrayEnemies = this.updateEnemiesRow(rowID);
    	if(arrayEnemies){
	    	for (var i = arrayEnemies.length - 1; i >= 0; i--) {
	    		enemyLayer.addChild(arrayEnemies[i]);
	    	};
	    }
        enemyLayer.getContent().children.sort(this.depthCompare);
    	if(this.mapArray.length >= rowID){
    		return;
    	}

    	// console.log(this.mapArray[rowID]);
    },
    depthCompare:function(a,b) {
        // if(a.type === 'environment' && b.type === 'environment'){
        //     return 0;
        // }

        var yA = a.position.y;
        var yB = b.position.y;
        if(yA === yB){
            return 0;
        }
        if(a.noDepth || b.noDepth){
            // return 0;
        }
        if(a.children.length > 0){
            // yA = a.children[0].position.y ;//+ a.children[0].height;
        }
        if(b.children.length > 0){
            // yB = b.children[0].position.y ;//+ b.children[0].height;
        }
        if (yA < yB){
            return -1;
        }
        if (yA > yB){
            return 1;
        }
        return 0;
    },
});

/*jshint undef:false */
var Heart = SpritesheetEntity.extend({
    init:function(){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = 60;
        this.width = 142;
        this.height = 142;
        this.type = 'heart';
        this.node = null;
        this.life = 5;
    },
    hurt:function(power){
        console.log('hurt');
        this.life -= power;
        if(this.life <= 0){
            this.preKill();
        }
    },
    collide:function(arrayCollide){
        //if(arrayCollide[0].type === 'player'){
        //     this.endLevel = true;
        console.log('this.node', this.node);
        console.log('col enemy');
        //}
    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        // console.log()
        this.bounds = {x: this.getPosition().x, y: this.getPosition().y, w: this.width, h: this.height};
        this.centerPosition = {x:this.width/2, y:this.height/2};
        this.collisionPoints = {
            up:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y},
            down:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y + this.bounds.h},
            bottomLeft:{x:this.bounds.x, y:this.bounds.y+this.bounds.h},
            topLeft:{x:this.bounds.x, y:this.bounds.y},
            bottomRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y+this.bounds.h},
            topRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y}
        };
        this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y));
        return this.bounds;
    },
    debugPolygon: function(color, force){
        if(this.lastColorDebug !== color || force){
            if(this.debugGraphic.parent === null && this.getContent().parent !== null)
            {
                this.getContent().parent.addChild(this.debugGraphic);
            }
            this.lastColorDebug = color;
            this.gambAcum ++;
            if(this.debugGraphic !== undefined){
                this.debugGraphic.clear();
            }else{
                this.debugGraphic = new PIXI.Graphics();
            }
            // console.log(this.polygon);
            this.debugGraphic.beginFill(color, 0.5);
            this.debugGraphic.lineStyle(1, 0xffd900);
            this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x,this.polygon.points[this.polygon.points.length - 1].y);
            // console.log('this.polygon',this.polygon.points);

            for (var i = this.polygon.points.length - 2; i >= 0; i--) {
                this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            }
            this.debugGraphic.endFill();
        }
    },
    build: function(){
        // console.log('criou o Heart');
        var self = this;
        var motionArray = this.getFramesByRange('dragon10',0,14);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);
        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.play('idle');

        this.respaw();

        // this.debugGraphic = new PIXI.Graphics();
        // this.debugGraphic.beginFill(0xFF3300);
        // this.debugGraphic.lineStyle(1, 0xffd900, 1);
        // this.debugGraphic.endFill();
    },
    update: function(){
        this._super();

        this.getBounds();
        //this.debugPolygon(0x556644, true);

        if(this.getTexture()){
            this.getContent().position.x = 80;
            this.getContent().position.y = -20;
            this.range = this.bounds.w / 2;
        }

    },
    preKill:function(){
        //this._super();
        var self = this;
        this.updateable = false;
        this.collidable = false;
        TweenLite.to(this.getContent(), 0.5, {alpha:0, onComplete:function(){self.kill = true;}});
        // if(this.debugGraphic.parent){
        //     this.debugGraphic.parent.removeChild(this.debugGraphic);
        // }
    },
    respaw: function(){
        // console.log('resetou o heart', this);

        this.deading = false;
        var rndPos = {x:Math.floor((12 * Math.random() * 142) /142) * 142 + 104,
            y:Math.floor((7 * Math.random() * 142) /142) * 142 + 177 + 142};

        // console.log('center distance', this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ));
        if(this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ) < 200)
        {
            this.respaw();
        }

        this.setPosition( Math.floor(rndPos.x / 7)*7,Math.floor(rndPos.y/7)*7) ;
        // console.log(this.getPosition());
        this.spritesheet.play('idle');

        this.setVelocity(0,0);
        this.updateable = true;
        this.collidable = true;
        // this.spritesheet.setScale(0,0);
        // TweenLite.to(this.spritesheet.scale, 1, {delay:0.4, x:1,y:1, ease:'easeOutElastic'});

        // console.log('radius', this.range);

    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});
/*jshint undef:false */
var Minimap = Class.extend({
	init:function(){
		this.collidable = false;
	},
	build:function(gen){
		this.gen = gen;
		this.background = new PIXI.Graphics();

		this.container = new PIXI.DisplayObjectContainer();
		this.roomsContainer = new PIXI.DisplayObjectContainer();
		this.mask = new PIXI.Graphics();
		this.container.addChild(this.background);
		this.container.addChild(this.roomsContainer);
		this.container.addChild(this.mask);
		this.arrayRooms = [];
		this.margin = {x: 15, y: 15};
		this.sizeTile = {x:80, y:50};
		this.sizeGraph = {x:40, y:25};

		// console.log(this.gen.rooms);

		var minX = 9999;
		var minY = 9999;
		var maxX = -9999;
		var maxY = -9999;
		var tempX = 0;
		var tempY = 0;

		for (var j = 0; j < this.gen.rooms.length; j++)
		{
			var item = this.gen.rooms[j];


			for (var i = 0; i < item.length; i++)
			{
				if (item[i].id > 0)
				{
					// console.log('item', item[i]);
					var tempRoomView = new PIXI.Graphics();
					var nodeColor = 0xffffff;
					if(item[i].mode === 1){
						nodeColor = 0x52d468;
					}else if(item[i].mode === 2){
						nodeColor = 0xaeaeae;
					}else if(item[i].mode === 3){
						nodeColor = 0xf7cd39;
					}else if(item[i].mode === 4){
						nodeColor = 0xf73939;
					}else if(item[i].mode === 5){
						nodeColor = 0xCB5B00;
					}else if(item[i].mode === 6){
						nodeColor = 0xcb52c4;
					}else{
						nodeColor = 0xffffff;
					}
					tempRoomView.beginFill(nodeColor);
					var tempSideGraphic;

					tempX = item[i].position[1] * this.sizeTile.x;
					tempY = item[i].position[0] * this.sizeTile.y;
					tempRoomView.position.x = tempX;
					tempRoomView.position.y = tempY;
					tempRoomView.drawRect(0,0,this.sizeGraph.x,this.sizeGraph.y);
					tempRoomView.endFill();
					this.roomsContainer.addChild(tempRoomView);

					for (var k = 0; k < item[i].childrenSides.length; k++) {
						if(item[i].childrenSides[k]){
							if(k === 0){//left
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = -this.sizeGraph.x / 2;
								tempY = this.sizeGraph.y / 4;//this.sizeGraph.y;
							}else if(k === 1){//right
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = this.sizeGraph.x;//this.sizeGraph.y;
								tempY = this.sizeGraph.y / 4;
							}else if(k === 2){//right
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = this.sizeGraph.x / 4;//this.sizeGraph.y;
								tempY = -this.sizeGraph.y / 2;
							}else if(k === 3){//down
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = this.sizeGraph.x / 4;//this.sizeGraph.y;
								tempY = this.sizeGraph.y;
							}
							if(tempSideGraphic){
								tempSideGraphic.position.x = tempX;
								tempSideGraphic.position.y = tempY;
								tempRoomView.addChild(tempSideGraphic);
							}
							tempSideGraphic = null;
						}
					}
					if (minX > item[i].position[1]){
						minX = item[i].position[1];
					}
					if (minY > item[i].position[0]){
						minY = item[i].position[0];
					}

					if (maxX < item[i].position[1]){
						maxX = item[i].position[1];
					}
					if (maxY < item[i].position[0]){
						maxY = item[i].position[0];
					}
					// console.log(i,j);
					tempRoomView.positionID = {i:j,j:i};
					tempRoomView.node = item[i];
					this.arrayRooms.push(tempRoomView);
				}
			}
		}
		for (var m = 0; m < this.arrayRooms.length; m++) {
			this.arrayRooms[m].position.x -= minX * this.sizeTile.x - this.margin.x - this.sizeGraph.x/2;
			this.arrayRooms[m].position.y -= minY * this.sizeTile.y - this.margin.y - this.sizeGraph.y/2;
		}

		this.mask.beginFill(0);
		this.mask.drawRect(0,0,200,200);
		this.container.addChild(this.mask);
		// this.updatePlayerNode();
		// console.log(minX,minY,maxX,maxY, maxX * this.margin.x, this.margin.x);
		this.background.beginFill(0x0);
		this.background.drawRect(0,0,this.mask.width,this.mask.height);
		// this.background.drawRect(0,0,
		// 	(maxX - minX + 1) * this.sizeTile.x + this.margin.x * 2 + this.sizeGraph.x/2,
		// 	(maxY - minY + 1) * this.sizeTile.y+ this.margin.y * 2+ this.sizeGraph.y/2);
		this.background.endFill();
		this.background.alpha = 0.5;

		this.container.mask = this.mask;
	},
	updatePlayerNode:function(position){
		var tempDist = 0;
		var currentNode = null;
		var childs = [];
		for (var i = 0; i < this.arrayRooms.length; i++) {
			this.arrayRooms[i].alpha = 0.4;
			if(position && position[0] === this.arrayRooms[i].positionID.i && position[1] === this.arrayRooms[i].positionID.j){
				currentNode = this.arrayRooms[i];
				for (var j = 0; j < this.arrayRooms[i].node.childrenSides.length; j++) {
					if(this.arrayRooms[i].node.childrenSides[j]){
						var tempPosition = this.arrayRooms[i].node.childrenSides[j].position;
						for (var k = 0; k < this.arrayRooms.length; k++) {
							if(this.arrayRooms[k].positionID.j === tempPosition[0] && this.arrayRooms[k].positionID.i === tempPosition[1]){
								childs.push(this.arrayRooms[k]);
							}
						}
					}
				}

			}
			// else if(!this.arrayRooms[i].active){
			// 	this.arrayRooms[i].alpha = 0;
			// }
		}
		console.log(childs);
		// for (var m = 0; m < childs.length; m++) {
		// 	this.showNode(childs[m]);
		// }
		this.showNode(currentNode, 0xFF0000);
		//CENTRALIZAR O MINIMAP AQUI
		TweenLite.to(this.roomsContainer, 0.5, {x:this.background.width / 2 - currentNode.position.x - currentNode.width / 2,
			y:this.background.height / 2 - currentNode.position.y - currentNode.height / 2});
	},
	showNode:function(node, tint){
		if(!node){
			return;
		}
		node.alpha = 1;
		// if(tint){
		// 	node.tint = tint;
		// }else{
		// 	node.tint = 0xFFFFFF;
		// }
	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});

/*jshint undef:false */
var Obstacle = Entity.extend({
    init:function(imgId){
        this._super();
        this.updateable = true;
        this.collidable = true;
        this.arrayObstacles = ['dist/img/2.png','dist/img/3.png','dist/img/2.png'];

        this.srcImg =  this.arrayObstacles[imgId];
        this.type = 'environment';
        this.width = APP.tileSize.x;
        this.height = APP.tileSize.x;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
        // this.scale.x = 0.5;
        // this.scale.y = 0.5;
        this.range = 0;
    },
    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    getBounds: function(){
        this.bounds = {x: this.getPosition().x - this.width *this.sprite.anchor.x,
            y: this.getPosition().y - this.height *this.sprite.anchor.y,
            w: this.width,
            h: this.height};
        return this.bounds;
    },
    build: function(){
        // console.log('criou o Obstacle');
        this._super(this.srcImg);
        var self = this;
        // this.respaw();
        this.sprite.anchor.x = 0;
        this.sprite.anchor.y = 1;

        // this.sprite.scale.x = 0.5;
        // this.sprite.scale.y = 0.5;
    },
    update: function(){
        this._super();

        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getBounds();
            this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);

            this.getContent().parent.addChild(this.debugGraphic);
        }
    },
    respaw: function(){
        // var rndPos = {x:(windowWidth - 200) * Math.random() + 100,
        //     y:(windowHeight - 200) * Math.random() + 100};

        var rndPos = {x:Math.floor((12 * Math.random() * 142) /142) * 142 + 104,
            y:Math.floor((7 * Math.random() * 142) /142) * 142 + 177 + 142};

        if(this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ) < 200)
        {
            this.respaw();
        }

        this.setPosition( rndPos.x,rndPos.y) ;
        this.collidable = true;
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});

/*jshint undef:false */
var Player2 = SpritesheetEntity.extend({
    init:function(){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.collidable = true;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.8;
        this.height = APP.tileSize.y * 0.8;
        this.type = 'player';
        this.collisionPointsMarginDivide = 0;
        this.isTouch = false;
        this.boundsCollision = true;


        this.defaultVelocity = 3;
        this.endLevel = false;
        this.fireSpeed = 10;
        this.fireFreq = 5;
        // this.fireFreq = 15;
        this.fireFreqAcum = 0;
        this.fireStepLive = 20;
        this.firePower = 20;

        this.touchCollection = {up:false, down:false,left:false, right:false, middleUp:false,middleDown:false,bottomLeft:false,bottomRight:false,topLeft:false,topRight:false};
    },
    debug:function(){

        // draw a shape
        // console.log('debug', this.debugGraphic.parent);
        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getContent().parent.addChild(this.debugGraphic);
        }
        this.debugGraphic.clear();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900);
        this.debugGraphic.moveTo(this.bounds.x ,this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h);
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h);
        this.debugGraphic.endFill();
    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        // console.log()
        this.bounds = {x: this.getPosition().x , y: this.getPosition().y, w: this.width, h: this.height};
        this.collisionPoints = {
            up:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y},
            down:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y + this.bounds.h},
            bottomLeft:{x:this.bounds.x, y:this.bounds.y+this.bounds.h},
            topLeft:{x:this.bounds.x, y:this.bounds.y},
            bottomRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y+this.bounds.h},
            topRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y}
        };
        this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y));
        return this.bounds;
    },
    build: function(){
        // console.log('criou o player');

        var self = this;
        var motionArray = this.getFramesByRange('chinesa10',0,8);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);

        // var motionArrayDead = this.getFramesByRange('chinesa10',19,25);
        var motionArrayDead = this.getFramesByRange('chinesa10',0,8);
        var animationDead = new SpritesheetAnimation();

        animationDead.build('dead', motionArrayDead, 2, false, function(){
            TweenLite.to(self.spritesheet.scale, 0.2, {x:0,y:0});
        });

        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.addAnimation(animationDead);
        this.spritesheet.play('idle');
        this.reset();
        this.counter = 0;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();

        this.vecPositions = [];

    },
    update: function(){
        // console.log(this.isTouch);
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }
        if(this.deading){
            this.setVelocity(0,0);
        }
        this.debugPolygon(0x556644, true);
        if(this.getTexture()){
            this.getContent().position.x = 20;
        }
        // if(this.lockUp && this.velocity.y < 0){
        //     this.velocity.y = 0;
        // }
        this._super();
    },
    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    reset: function(){
        this.deading = false;
        this.setPosition( windowWidth/2, windowHeight/2);
        this.spritesheet.play('idle');
        this.setVelocity(0,0);
        this.updateable = true;
        this.vecPositions = [];
    },
    collide:function(arrayCollide){
        // console.log('playerCollide', arrayCollide[0].type);

        if(arrayCollide[0].type === 'door'){
            console.log('door collider');
            if(arrayCollide[0].side === 'up' && this.virtualVelocity.y < 0 ||
                arrayCollide[0].side === 'down' && this.virtualVelocity.y > 0 ||
                arrayCollide[0].side === 'left' && this.virtualVelocity.x < 0 ||
                arrayCollide[0].side === 'right' && this.virtualVelocity.x > 0)
            {

                this.endLevel = true;
                this.nextNode = arrayCollide[0].node;
                this.nextDoorSide = arrayCollide[0].side;
            }
        }
        if(arrayCollide[0].type === 'enemy'){
            // var angle = Math.atan2(this.getPosition().y-arrayCollide[0].getPosition().y,  this.getPosition().x-arrayCollide[0].getPosition().x);
            // angle = angle * 180 / Math.PI;
            // this.setPosition(this.getPosition().x + arrayCollide[0].range * Math.sin(angle), this.getPosition().y + arrayCollide[0].range * Math.cos(angle));
        }
        //console.log('colidiu');
    },
    touch: function(collection){
        this.isTouch = true;
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            console.log('Y TOUCH');
            this.velocity.y = 0;
        }
    },
    // touch: function(collection, isTouch){
    //     console.log(this.touchCollection);
    //     this.touchCollection = collection;
    //     this.isTouch = isTouch;
    //     if(collection.left||collection.right && this.virtualVelocity.x !== 0)
    //     {
    //         this.velocity.x = 0;
    //     }
    //     if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
    //     {
    //         this.virtualVelocity.y = this.velocity.y = 0;
    //     }
    // },
    updatePlayerVel:function(vecPositions)
    {
        console.log('UPDATE');
        if(this && vecPositions){
            var hasAxysY = false;
            var hasAxysX = false;
            if(vecPositions.length === 0){
                this.virtualVelocity.x = 0;
                this.virtualVelocity.y = 0;
            }
            for (var i = vecPositions.length - 1; i >= 0; i--) {

                if(vecPositions[i] === 'up'){
                    this.virtualVelocity.y = -this.defaultVelocity;
                    hasAxysY = true;
                }
                else if(vecPositions[i] === 'down'){
                    this.virtualVelocity.y = this.defaultVelocity;
                    hasAxysY = true;
                }

                if(vecPositions[i] === 'left'){
                    this.virtualVelocity.x = -this.defaultVelocity;
                    hasAxysX = true;
                }
                else if(vecPositions[i] === 'right'){
                    this.virtualVelocity.x = this.defaultVelocity;
                    hasAxysX = true;
                }
            }
            if(this.virtualVelocity.y !== 0 && this.virtualVelocity.x !== 0){
                this.virtualVelocity.y /= 1.5;
                this.virtualVelocity.x /= 1.5;
            }
            if(!hasAxysY){
                this.virtualVelocity.y = 0;
            }
            if(!hasAxysX){
                this.virtualVelocity.x = 0;
            }

        }
    },
    // updatePlayerVel:function(vecPositions)
    // {
    //     if(this && vecPositions){
    //         var hasAxysY = false;
    //         var hasAxysX = false;
    //         if(vecPositions.length === 0){
    //             this.virtualVelocity.x = 0;
    //             this.virtualVelocity.y = 0;
    //             return;
    //         }
    //         for (var i = vecPositions.length - 1; i >= 0; i--) {

    //             if(vecPositions[i] === 'up' && !this.touchCollection.up){
    //                 this.virtualVelocity.y = -this.defaultVelocity;
    //                 this.touchCollection.down = false;
    //                 hasAxysY = true;
    //             }
    //             else if(vecPositions[i] === 'down' && !this.touchCollection.down){
    //                 this.virtualVelocity.y = this.defaultVelocity;
    //                 this.touchCollection.up = false;
    //                 hasAxysY = true;
    //             }

    //             if(vecPositions[i] === 'left' && !this.touchCollection.left){
    //                 this.virtualVelocity.x = -this.defaultVelocity;
    //                 this.touchCollection.right = false;
    //                 this.touchCollection.down = false;
    //                 hasAxysX = true;
    //             }
    //             else if(vecPositions[i] === 'right' && !this.touchCollection.right){
    //                 this.virtualVelocity.x = this.defaultVelocity;
    //                 this.touchCollection.left = false;
    //                 this.touchCollection.down = false;
    //                 hasAxysX = true;
    //             }
    //         }
    //         if(this.virtualVelocity.y !== 0 && this.virtualVelocity.x !== 0){
    //             this.virtualVelocity.y /= 1.5;
    //             this.virtualVelocity.x /= 1.5;
    //         }
    //         if(!hasAxysY){
    //             this.virtualVelocity.y = 0;
    //         }
    //         if(!hasAxysX){
    //             this.virtualVelocity.x = 0;
    //         }
    //     }
    // },
});

/*jshint undef:false */
var EndModal = StandardModal.extend({
    init:function(mainScreen, hideCallback){
    	this._super(mainScreen);
        this.hideCallback = hideCallback;
    },
    build: function(){
    	this._super();
        var self = this;
// this.container.addChild(this.modalContainer);
    	this.backModalImg = new SimpleSprite("back_modal_1.png", {x:0, y:0});    	
    	this.modalContainer.addChild(this.backModalImg.getContent());
    	this.backModalImg.getContent().position.x = APP.getGameController().getTileSize().width;
    	this.backModalImg.getContent().position.y = APP.getGameController().getTileSize().height * 3;
    	this.backModalImg.getContent().interactive = true;
    	this.backModalImg.getContent().width = (APP.mapData.cols - 2) * APP.getGameController().getTileSize().width
    	this.backModalImg.getContent().height = (APP.mapData.rows - 6) * APP.getGameController().getTileSize().height

    	this.label = new PIXI.Text("END GAME", {font:"40px barrocoregular", fill:"white", stroke:"#E88726", strokeThickness: 10});
    	this.modalContainer.addChild(this.label);
    	scaleConverter(this.label.width, APP.getGameController().getTileSize().width*3, 1, this.label);
    	this.label.position = APP.getGameController().getTilePositionHUD(3,4);
    	this.label.position.y += APP.getGameController().getTileSize().height / 2 - this.label.height / 2;



        buttonContinue = new DefaultButton("button_up.png","button_over.png");
        buttonContinue.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);

        buttonContinueLabel = new PIXI.Text("RESTART", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        buttonContinue.addLabel(buttonContinueLabel,0,5,true,0,0)
        buttonContinue.getContent().position = APP.getGameController().getTilePositionHUD(2,APP.mapData.rows - 5);
        buttonContinue.getContent().position.y += APP.getGameController().getTileSize().height / 2 - buttonContinue.getContent().height / 2;
        buttonContinue.clickCallback = function(){
            self.hide();
            self.mainScreen.unpause();
            self.hideCallback(self.mainScreen)
            // self.mainScreen.hideEndModal();
        }
        this.modalContainer.addChild(buttonContinue.getContent());


    	this.backModalImg.getContent().mousedown = this.backModalImg.getContent().touchstart = function(data){
    		// console.log(this);
    	}
        this.container.visible = false;
    },
    show: function(){
    	this.container.visible = true;

	    this.mainScreen.pause();
    	var self = this;

         this.modalContainer.position.x = windowWidth;
         
    	TweenLite.to(this.modalContainer, .5, {x:0}) ;
        TweenLite.to(this.container, .5, {alpha:1, onComplete:function(){
            self.container.visible = true;
        }})
        TweenLite.to(this.backModal, .5, {alpha:0.5})    	
    },
    hide: function(){
        var self = this;
        TweenLite.to(this.modalContainer, .5, {x:-windowWidth, onComplete:function(){
            // self.mainScreen.unpause();
            self.container.visible = false;
        }})
        TweenLite.to(this.backModal, .5, {alpha:0}) 
    },
    update: function(){
    },
});
/*jshint undef:false */
var PauseModal = StandardModal.extend({
    init:function(mainScreen, hideCallback, restartCallback){
        this._super(mainScreen);
        this.hideCallback = hideCallback;
        this.restartCallback = restartCallback;
    },
    build: function(){
    	this._super();

    	var self = this;

    	this.backModalImg = new SimpleSprite("back_modal_1.png", {x:0, y:0});    	
    	this.modalContainer.addChild(this.backModalImg.getContent());
    	this.backModalImg.getContent().position.x = APP.getGameController().getTileSize().width;
    	this.backModalImg.getContent().position.y = APP.getGameController().getTileSize().height * 3;
    	this.backModalImg.getContent().interactive = true;
    	this.backModalImg.getContent().width = (APP.mapData.cols - 2) * APP.getGameController().getTileSize().width
    	this.backModalImg.getContent().height = (APP.mapData.rows - 6) * APP.getGameController().getTileSize().height

    	this.label = new PIXI.Text("PAUSE", {font:"40px barrocoregular", fill:"white", stroke:"#E88726", strokeThickness: 10});
    	this.modalContainer.addChild(this.label);
    	scaleConverter(this.label.width, APP.getGameController().getTileSize().width*3, 1, this.label);
    	this.label.position = APP.getGameController().getTilePositionHUD(3,4);
    	this.label.position.y += APP.getGameController().getTileSize().height / 2 - this.label.height / 2;



    	buttonRestart = new DefaultButton("button_up.png","button_over.png");
        buttonRestart.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);

    	buttonRestartLabel = new PIXI.Text("RESTART", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        buttonRestart.addLabel(buttonRestartLabel,0,5,true,0,0)
        buttonRestart.getContent().position = APP.getGameController().getTilePositionHUD(2,APP.mapData.rows - 5);
        buttonRestart.getContent().position.y += APP.getGameController().getTileSize().height / 2 - buttonRestart.getContent().height / 2;
        buttonRestart.clickCallback = function(){
            self.hide(false);

            self.restartCallback(self.mainScreen);
        }
        this.modalContainer.addChild(buttonRestart.getContent());




        buttonContinue = new DefaultButton("button_up.png","button_over.png");
        buttonContinue.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);

    	buttonContinueLabel = new PIXI.Text("CONTINUE", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        buttonContinue.addLabel(buttonContinueLabel,0,5,true,0,0)
        buttonContinue.getContent().position = APP.getGameController().getTilePositionHUD(2,APP.mapData.rows - 6);
        buttonContinue.getContent().position.y += APP.getGameController().getTileSize().height / 2 - buttonContinue.getContent().height / 2;
        buttonContinue.clickCallback = function(){
            self.hide(true);

            self.hideCallback(self.mainScreen);
            // self.mainScreen.hidePauseModal();
        }
        this.modalContainer.addChild(buttonContinue.getContent());




    	this.backModalImg.getContent().mousedown = this.backModalImg.getContent().touchstart = function(data){
    	
    	}
    	this.container.visible = false;
    },
    show: function(){
    	this.container.visible = true;
    	this.container.alpha = 0;
	    this.mainScreen.pause();
    	var self = this;

    	this.modalContainer.position.x = windowWidth;

        TweenLite.to(this.modalContainer, .5, {x:0}) ;
    	TweenLite.to(this.container, .5, {alpha:1, onComplete:function(){
	       	self.container.visible = true;
    	}})
    	TweenLite.to(this.backModal, .5, {alpha:0.5}) 
    	// TweenLite.to(this.container, .5, {alpha:1, onComplete:function(){
	    //    	self.container.visible = true;
    	// }})    	
    },
    hide: function(callback){
    	if(!callback){
    		return;
    	}
    	var self = this;

    	TweenLite.to(this.modalContainer, .5, {x:-windowWidth, onComplete:function(){
	       	self.container.visible = false;
    	}})
        TweenLite.to(this.backModal, .5, {alpha:0}) 
    },
    update: function(){
    },
});
/*jshint undef:false */
var StandardModal = Class.extend({
    init:function(mainScreen){
    	this.container = new PIXI.DisplayObjectContainer();
    	this.modalContainer = new PIXI.DisplayObjectContainer();
       	this.mainScreen = mainScreen;

        this.fadeInTime = 0.5;
        this.fadeOutTime = 0.5;
    },
    getContent:function(){
    	return this.container;
    },
    build: function(){
    	this.backModal = new PIXI.Graphics();
    	this.backModal.beginFill(0);
    	this.backModal.drawRect(0,0,windowWidth, windowHeight);
        this.backModal.alpha = 0.5;
    	this.container.addChild(this.backModal);
    	this.backModal.interactive = true;
    	var self = this;
    	// this.backModal.mousedown = this.backModal.touchstart = function(data){
    	// 	self.hide();
    	// }
       	this.container.addChild(this.modalContainer);
    },
    show: function(){
    	this.container.visible = true;
	    this.mainScreen.pause();
    	var self = this;
    	TweenLite.to(this.container, this.fadeInTime, {alpha:1, onComplete:function(){
	       	self.container.visible = true;
    	}})    	
    },
    hide: function(){
    	var self = this;
    	TweenLite.to(this.container, this.fadeOutTime, {alpha:0, onComplete:function(){
	       	self.mainScreen.unpause();
	       	self.container.visible = false;
    	}})
    },
    update: function(){
    },
});
/*jshint undef:false */
var StartModal = StandardModal.extend({
    init:function(mainScreen, hideCallback){
        this._super(mainScreen);
        this.hideCallback = hideCallback;
    },
    build: function(){
    	this._super();
        var self = this;
// this.container.addChild(this.modalContainer);
    	this.backModalImg = new SimpleSprite("back_modal_1.png", {x:0, y:0});    	
    	this.modalContainer.addChild(this.backModalImg.getContent());
    	this.backModalImg.getContent().position.x = APP.getGameController().getTileSize().width;
    	this.backModalImg.getContent().position.y = APP.getGameController().getTileSize().height * 3;
    	this.backModalImg.getContent().interactive = true;
    	this.backModalImg.getContent().width = (APP.mapData.cols - 2) * APP.getGameController().getTileSize().width
    	this.backModalImg.getContent().height = (APP.mapData.rows - 6) * APP.getGameController().getTileSize().height

    	this.label = new PIXI.Text("START", {font:"40px barrocoregular", fill:"white", stroke:"#E88726", strokeThickness: 10});
    	this.modalContainer.addChild(this.label);
    	scaleConverter(this.label.width, APP.getGameController().getTileSize().width*3, 1, this.label);
    	this.label.position = APP.getGameController().getTilePositionHUD(3,4);
    	this.label.position.y += APP.getGameController().getTileSize().height / 2 - this.label.height / 2;



        buttonContinue = new DefaultButton("button_up.png","button_over.png");
        buttonContinue.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);

        buttonContinueLabel = new PIXI.Text("START", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        buttonContinue.addLabel(buttonContinueLabel,0,5,true,0,0)
        buttonContinue.getContent().position = APP.getGameController().getTilePositionHUD(2,APP.mapData.rows - 5);
        buttonContinue.getContent().position.y += APP.getGameController().getTileSize().height / 2 - buttonContinue.getContent().height / 2;
        buttonContinue.clickCallback = function(){
            self.hide(false);
            self.hideCallback(self.mainScreen)
        }
        this.modalContainer.addChild(buttonContinue.getContent());


    	this.backModalImg.getContent().mousedown = this.backModalImg.getContent().touchstart = function(data){
            
    	}
        this.container.visible = false;
    },
    show: function(){
    	this.container.visible = true;
	    this.mainScreen.pause();
    	var self = this;

        this.modalContainer.position.x = windowWidth;

        TweenLite.to(this.modalContainer, .5, {x:0}) ;
    	TweenLite.to(this.container, .5, {alpha:1, onComplete:function(){
	       	self.container.visible = true;
    	}});
        TweenLite.to(this.backModal, .5, {alpha:0.5})
    },
    hide: function(callback){
    	var self = this;
    	TweenLite.to(this.modalContainer, .5, {x:-windowWidth, onComplete:function(){
            self.mainScreen.unpause();
	       	self.container.visible = false;
    	}})
        TweenLite.to(this.backModal, .5, {alpha:0}) 
    },
    update: function(){
    },
});
/*jshint undef:false */
var AppModel = Class.extend({
	init:function(){
        this.isMobile = false;
        this.action = 'default';
        this.id = 0;
        this.position = 0;
        this.angle = 0;
        this.side = 0;
	},
	build:function(){

	},
    destroy:function(){

    },
    serialize:function(){
        
    }
});
/*jshint undef:false */
var RainParticle = Class.extend({
	init:function(fallSpeed,windSpeed,hArea,vArea,dir){
		// 50, 5, 600, 300, 'left'

		this.fallSpeed=fallSpeed;
		this.windSpeed=windSpeed;
		this.dir=dir;
		this.hArea=hArea;
		this.vArea=vArea;


		this.texture = new PIXI.Texture.fromImage('dist/img/drop.png');
		this.content = new PIXI.Sprite(this.texture);

		this.content.position.x = Math.random() * hArea;
		this.content.position.y=Math.random()*vArea;

		this.gambAccum = 0;
	},
	update:function(){
		var side = 1;
		// this.gambAccum += 0.005;

		switch (this.dir)
		{
			case 'left' :
				// this.content.rotation = this.gambAccum;// / 180 * 3.14;
				this.content.rotation = 15 / 180 * 3.14;
				break;

			case 'right' :
				side = -1;
				// this.content.rotation = -this.gambAccum;// / 180 * 3.14;
				this.content.rotation = -15 / 180 * 3.14;

				break;

			default :
				console.log('There is some error dude...');
		}

		// this.windSpeed = Math.cos(this.gambAccum) * 5;


		// console.log(this.windSpeed);
		// this.gambAccum ++;
		// if(this.gambAccum > 200){
		// 	this.gambAccum = 0;
		// 	if(this.dir === 'left')
		// 	{
		// 		this.dir = 'right';
		// 	}else
		// 	{
		// 		this.dir = 'left';
		// 	}
		// }


		this.content.position.x-=this.windSpeed * side;
		this.content.position.y+=Math.random()*this.fallSpeed;

		if (this.content.position.y>this.vArea)
		{
			this.content.position.x = Math.random() * (this.hArea);
			this.content.position.y =- 200;
		}
	}
});

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

/*jshint undef:false */
var HomeScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.screenContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.screenContainer);

        var self = this;

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x553388);
        this.graphics.drawRoundedRect(-120,-80,240, 160, 30);
        this.graphics.position.x = windowWidth /2;
        this.graphics.position.y = windowHeight /2;
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.graphics.touchstart = this.graphics.mousedown = function(mouseData){
            self.screenManager.change('Game');
        };
        this.screenContainer.addChild(this.graphics);

        var assetsToLoader = [];
        if(assetsToLoader.lenght <= 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    onProgress:function(){

    },
    onAssetsLoaded:function()
    {
        console.log('what3');
        this._super();
    },
    update:function()
    {
    }
});

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
        "img/assets/SideWall2.png",
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
        this.imgScr.getContent().position = APP.getGameController().getTilePositionHUD(2,2);

        var self = this;

        this.playButton = new DefaultButton("button_up.png","button_over.png");
        this.playButton.build(APP.getGameController().getTileSize().width * 5, APP.getGameController().getTileSize().width);
        this.screenContainer.addChild(this.playButton.getContent());

        this.label = new PIXI.Text("PLAY", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

        this.playButton.addLabel(this.label,0,5,true,0,0)
        this.playButton.getContent().position = APP.getGameController().getTilePositionHUD(2,APP.mapData.rows - 3);
        this.playButton.getContent().position.y += APP.getGameController().getTileSize().height / 2 - this.playButton.getContent().height / 2;
        this.playButton.clickCallback = function(){
            APP.getTransition().transitionIn('Game');
        }


        if(possibleFullscreen()){
            this.fullscreen = new DefaultButton("button_small_up.png","button_small_over.png");
            this.fullscreen.build(APP.getGameController().getTileSize().width, APP.getGameController().getTileSize().width);
            this.screenContainer.addChild(this.fullscreen.getContent());

            fullscreenLabel = new PIXI.Text("F", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});

            this.fullscreen.addLabel(fullscreenLabel,0,5,true,0,0)
            this.fullscreen.getContent().position = APP.getGameController().getTilePositionHUD(0,0, true);
            this.fullscreen.getContent().position.y += APP.getGameController().getTileSize().height / 2 - this.fullscreen.getContent().height / 2;
            this.fullscreen.clickCallback = function(){
                fullscreen();
            }
        }

        this.logoLabel = new PIXI.Text("©TaBien Studios", {font:"40px barrocoregular", fill:"white", stroke:"#006CD9", strokeThickness: 10});
        this.screenContainer.addChild(this.logoLabel);
        scaleConverter(this.logoLabel.width, APP.getGameController().getTileSize().width*3, 1, this.logoLabel);
        this.logoLabel.position = APP.getGameController().getTilePositionHUD(3,APP.mapData.rows - 1);
        this.logoLabel.position.y += APP.getGameController().getTileSize().height / 2 - this.logoLabel.height / 2;

        // this.screenManager.change('Game');
        //this.screenContainer.position.x = windowWidth - this.screenContainer.width * 1.2;
        //this.screenContainer.position.y = windowHeight - this.screenContainer.height * 1.3;

    },
    update:function()
    {
    }
});

/*jshint undef:false */
var TransitionScreen = Class.extend({
    init:function(){
       this.transitionContainer = new PIXI.DisplayObjectContainer();
    },
    getContent:function(){
    	return this.transitionContainer;
    },
    build: function(){
    	backTopHud = new PIXI.Graphics();
        backTopHud.beginFill(0);
        backTopHud.drawRect(0,0,windowWidth, windowHeight);
        this.transitionContainer.addChild(backTopHud);
        this.transitionContainer.visible = false;
        this.transitionContainer.interactive = true;
        this.transitionContainer.buttonMode = true;
        ScreenManager.debug = true
    },
    transitionIn: function(target){
    	var self = this;
    	self.getContent().visible = true;
    	this.getContent().position.x = windowWidth;
    	TweenLite.to(this.getContent(), 0.5, {x:0, onComplete:function(){
    		if(target){
    			APP.getScreenManager().change(target);
    			APP.getTransition().transitionOut();
    		}
    	}}) 
    },
    transitionOut: function(target){
    	var self = this;
    	self.getContent().visible = true;
    	TweenLite.to(this.getContent(), 0.5, {x:-windowWidth, onComplete:function(){
	       	self.getContent().visible = false;
	       	if(target){
    			APP.getScreenManager().change(target);
    		}
    	}})
    },
    update: function(){
    },
});
/*jshint undef:false */
var BarView = Class.extend({
	init: function (width, height, maxValue, currentValue,invert){

		this.maxValue = maxValue;
		this.text = 'default';
		this.currentValue = currentValue;
		this.container = new PIXI.DisplayObjectContainer();
		this.width = width;
		this.height = height;

		gambs = 0;
		this.backShape2 = new PIXI.Graphics();
		// this.backShape2.lineStyle(1,0xEEEEEE);
		this.backShape2.beginFill(0xffffff);
		this.backShape2.drawRect(-gambs,-gambs,width+gambs * 2, height+gambs * 2);
		this.container.addChild(this.backShape2);


		this.backShape = new PIXI.Graphics();
		// this.backShape.lineStyle(1,0xEEEEEE);
		this.backShape.beginFill(0xd53461);
		this.backShape.drawRect(0,0,width, height);
		this.container.addChild(this.backShape);

		this.frontShape = new PIXI.Graphics();
		this.frontShape.beginFill(0x3dc554);
		this.frontShape.drawRect(0,0,width, height);
		this.container.addChild(this.frontShape);
		if(invert){
			this.frontShape.pivot.x = width;
			this.frontShape.position.x+=width
		}
		this.frontShape.scale.x = this.currentValue/this.maxValue;
	},
	addBackShape: function(color, size){
		this.back = new PIXI.Graphics();
		this.back.beginFill(color);
		this.back.drawRect(-size/2,-size/2,this.width + size, this.height + size);
		this.container.addChildAt(this.back, 0);
	},
	setFrontColor: function(color){
		if(this.frontShape){
			this.container.removeChild(this.frontShape);
		}
		this.frontShape = new PIXI.Graphics();
		this.frontShape.beginFill(color);
		this.frontShape.drawRect(0,0,this.width, this.height);
		this.container.addChild(this.frontShape);

	},
	setBackColor: function(color){
		if(this.backShape){
			this.container.removeChild(this.backShape);
		}
		this.backShape = new PIXI.Graphics();
		this.backShape.beginFill(color);
		// this.backShape.lineStyle(1,0xEEEEEE);
		this.backShape.drawRect(0,0,this.width, this.height);
		this.container.addChildAt(this.backShape,0);

	},
	setText: function(text){
		if(this.text !== text){
			if(!this.lifebar){
				this.lifebar = new PIXI.Text(text, {fill:'white', align:'center', font:'10px Arial'});
				this.container.addChild(this.lifebar);
			}else
			{
				this.lifebar.setText(text);
			}
		}
	},
	updateBar: function(currentValue, maxValue){
		if(this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0){
			this.currentValue = currentValue;
			this.maxValue = maxValue;
			TweenLite.to(this.frontShape.scale, 0.2, {x:this.currentValue/this.maxValue})
			// this.frontShape.scale.x = this.currentValue/this.maxValue;
			if(this.frontShape.scale.x < 0){
				this.frontShape.scale.x = 0;
			}
		}
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});
/*jshint undef:false */
var InputManager = Class.extend({
	init: function (parent){
		var game = parent;
		var self = this;
		this.vecPositions = [];
		document.body.addEventListener('mouseup', function(e){
			if(game.player){
				game.mouseDown = false;
			}
		});
		document.body.addEventListener('mousedown', function(e){
			//só atira se não tiver na interface abaixo
			//TODO: melhorar isso
			if(game.player){// && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70){
				game.mouseDown = true;
			}
		});
		document.body.addEventListener('keyup', function(e){
			if(game.player){
				if(e.keyCode === 87 || e.keyCode === 38){// && game.player.velocity.y < 0){
					self.removePosition('up');
				}
				else if(e.keyCode === 83 || e.keyCode === 40){// && game.player.velocity.y > 0){
					self.removePosition('down');
				}
				else if(e.keyCode === 65 || e.keyCode === 37){// && game.player.velocity.x < 0){
					self.removePosition('left');
				}
				else if(e.keyCode === 68 || e.keyCode === 39){// && game.player.velocity.x > 0){
					self.removePosition('right');
				}
				game.player.updatePlayerVel(self.vecPositions);
			}
		});
		document.body.addEventListener('keydown', function(e){
			var vel = 6;
			var newPos = false;
			if(game.player){
				if(e.keyCode === 87 || e.keyCode === 38){
					self.removePosition('down');
					newPos = self.addPosition('up');
				}
				else if(e.keyCode === 83 || e.keyCode === 40){
					self.removePosition('up');
					newPos = self.addPosition('down');
				}
				else if(e.keyCode === 65 || e.keyCode === 37){
					self.removePosition('right');
					newPos = self.addPosition('left');
				}
				else if(e.keyCode === 68 || e.keyCode === 39){
					self.removePosition('left');
					newPos = self.addPosition('right');
				}
				game.player.updatePlayerVel(self.vecPositions);
			}
		});
	},
	//
    removePosition:function(position){
        for (var i = this.vecPositions.length - 1; i >= 0; i--) {
            if(this.vecPositions[i] === position)
            {
                this.vecPositions.splice(i,1);
            }
        }
    },
    //
    addPosition:function(position){
        var exists = false;

        for (var i = this.vecPositions.length - 1; i >= 0; i--) {
            if(this.vecPositions[i] === position)
            {
                exists = true;
            }
        }

        if(!exists){
            this.vecPositions.push(position);
        }
        return exists;
    },
});

/*jshint undef:false */
var Particles = Entity.extend({
    init:function(vel, timeLive, source, rotation){
        this._super( true );
        this.updateable = false;
        this.colidable = false;
        this.deading = false;
        this.range = 40;
        this.width = 1;
        this.height = 1;
        this.type = 'particle';
        this.target = 'enemy';
        this.fireType = 'physical';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = timeLive;
        this.power = 1;
        this.defaultVelocity = 1;

        this.imgSource = source;
        this.alphadecress = 0.03;
        this.scaledecress = 0.03;
        this.gravity = 0;
        if(rotation){
            this.rotation = rotation;
        }
        this.maxScale = 1;
        this.growType = 1;
        this.maxInitScale = 1;
        this.initScale = 1;

    },
    build: function(){
        this.updateable = true;
        if(this.imgSource instanceof PIXI.Text || this.imgSource instanceof PIXI.Graphics)
        {
            this.sprite = this.imgSource;
        }else{
            this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        }
        this.sprite.alpha = 1;
        this.sprite.scale.x = this.initScale;//this.maxScale * this.maxInitScale;
        this.sprite.scale.y = this.initScale;//this.maxScale * this.maxInitScale;
        if(this.growType === -1){
            this.sprite.scale.x = this.maxScale;
            this.sprite.scale.y = this.maxScale;
        }
        this.getContent().rotation = this.rotation;
        // TweenLite.to(this.sprite, 0.5, {alpha:1});
        // console.log(this.sprite.scale.x, this.maxScale);
    },
    update: function(){
        this._super();
        if(this.gravity !== 0){
            this.velocity.y += this.gravity;
        }
        this.timeLive --;
        if(this.timeLive <= 0){
            this.preKill();
        }
        this.range = this.width;
        if(this.rotation){
            this.getContent().rotation += this.rotation;
        }

        if(this.sprite.alpha > 0){
            this.sprite.alpha -=this.alphadecress;
            if(this.sprite.alpha <= 0){
                this.preKill();
            }
        }
        if(this.sprite.scale.x < 0){
            this.preKill();
        }
        if(this.sprite.scale.x > this.maxScale){
            return;
        }
        this.sprite.scale.x += this.scaledecress;
        this.sprite.scale.y += this.scaledecress;
    },
    preKill:function(){
        //this._super();
        var self = this;
        this.sprite.alpha = 0;
        this.updateable = true;
        this.kill = true;
        //TweenLite.to(this.getContent(), 0.3, {alpha:0, onComplete:function(){self.kill = true;}});
    }
});
var Enemy = Entity.extend({
	init:function(label, size){
		this._super( true );
        this.updateable = false;
        this.deading = false;
        this.standardRange = this.range = size.width/2;
        this.width = 0;
        this.height = 0;
        this.type = 'enemy';
        this.label = label;
        this.node = null;
        this.life = 5;
        // console.log(size);
        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.debugContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.debugContainer);

        this.debugPolygon(0xFF0000,true)

        this.playerContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.playerContainer);

        if(this.label == "ENEMY2"){
            this.playerImage = new SimpleSprite("img/assets/Blob_red.png", {x:0.5, y:0.8});
        }else{
            this.playerImage = new SimpleSprite("img/assets/ennemy_Blob_blue.png", {x:0.5, y:0.8});
        }
        this.playerContainer.addChild(this.playerImage.getContent());
        this.playerImage.cacheAsBitmap = true;
        // this.playerContainer.addChild(this.playerImage.texture);
        // this.playerImage.getContent().width = this.range;
        scaleConverter(this.playerContainer.width, this.standardRange * 2, 1, this.playerContainer);
        //scaleConverter(this.playerContainer.width, this.range * 2, 1, this.playerContainer);
        this.standardScale = this.playerContainer.scale;

        this.behaviours = [];

        this.playerContainer.rotation = -45 / 180 * 3.14
        this.playerImage.getContent().scale.x = 1;
        this.playerImage.getContent().scale.y = 2;

        this.noDepth = false;
       // this.playerImage.getContent().scale.y = 2
	},
    hurt:function(demage){
        this.life -= demage;
        if(this.life <= 0){
            this.preKill();
        }
    },
	debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        this.debugPolygon.lineStyle(0.5,color);
        // this.debugPolygon.beginFill(color);
        this.debugPolygon.drawCircle(0,0,this.range);
        this.debugContainer.addChild(this.debugPolygon);
    },
    getContent:function(){
        return this.entityContainer;
    },
    getPosition:function(){
        return this.getContent().position;
    },
	build:function(){
		// this._super();

		var self = this;
       
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;

	},
	update:function(){
		// this._super();
        this.getContent().position.x += this.velocity.x;
        this.getContent().position.y += this.velocity.y;

        if(this.behaviours){
            for (var i = this.behaviours.length - 1; i >= 0; i--) {
                if(!this.behaviours[i].entity){
                    this.behaviours[i].build(this);
                }
                this.behaviours[i].update();
            };
        }
        // console.log(windowHeight);
        if(this.velocity.y > 0 && this.getContent().position.y > windowHeight){
            this.preKill();
        }else if(this.velocity.y < 0 && this.getContent().position.y < -this.range){
            this.preKill();
        }
        this.range = this.standardRange * this.getContent().scale.x;
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                // this.getContent().tint = 0xff0000;
                // this.preKill();
                // arrayCollide[0].hurt(this.power);

            }
        }
    },
    preKill:function(){
        //this._super();
        this.velocity = {x:0,y:0};
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){self.kill = true;}});

        }
    },
});

/*jshint undef:false */
var Enemy2 = SpritesheetEntity.extend({
    init:function(player){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.9;
        this.height = APP.tileSize.y * 0.9;
        this.type = 'enemy';
        this.node = null;
        this.life = 1000;
        this.boundsCollision = true;
        this.defaultVelocity = 1;
        this.player = player;
        this.behaviour = new DefaultBehaviour(this, player);
    },
    hurt:function(power){
        console.log('hurt');
        this.getTexture().tint = 0xFF0000;
        this.life -= power;
        if(this.life <= 0){
            this.preKill();
        }
    },
    build: function(){
        // console.log('criou o Heart');
        var self = this;
        var motionArray = this.getFramesByRange('dragon10',0,14);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);
        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.play('idle');
        this.centerPosition = {x:this.width/2, y:this.height/2};

        this.updateable = true;
        this.collidable = true;
    },
    update: function(){
        this.behaviour.update();
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }
        this._super();
        this.getBounds();
        if(this.getTexture()){
            // this.width = 0;
            // this.height = 0;
            this.getContent().position.x = 20;
            // this.getContent().position.y = -20;
            // this.range = this.bounds.w / 2;
        }

    },
    preKill:function(){
        //this._super();
        var self = this;
        this.updateable = false;
        this.collidable = false;
        TweenLite.to(this.getContent(), 0.5, {alpha:0, onComplete:function(){self.kill = true;}});
        // if(this.debugGraphic.parent){
        //     this.debugGraphic.parent.removeChild(this.debugGraphic);
        // }
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection){
        this.isTouch = true;
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            this.velocity.y = 0;
        }
    },
});
/*jshint undef:false */
var FlightEnemy = Enemy.extend({
    init:function(position){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = 60;
        this.width = 142/2;
        this.height = 142/2;
        this.type = 'flight';
        this.node = null;
        this.life = 50000;

        this.radius = 200;
        this.acumSimCos = 0;

        this.setPosition(position.x,position.y);

        this.boundsCollision = true;

    },
    build: function(){
        // console.log('criou o Heart');
        var self = this;
        var motionArray = this.getFramesByRange('dragon10',0,14);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);
        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.play('idle');
        this.centerPosition = {x:this.width/2, y:this.height/2};

        this.updateable = true;
        this.collidable = true;
        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();

        // this.acumSimCos += 0.05;
        this.virtualVelocity.x = 5;//Math.sin(this.acumSimCos) * 10;
        this.virtualVelocity.y = -5;//Math.cos(this.acumSimCos) * 10;
    },
    debug:function(){
        // draw a shape
        // console.log('debug', this.debugGraphic.parent);
        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getContent().parent.addChild(this.debugGraphic);
        }
        this.debugGraphic.clear();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900);
        this.debugGraphic.moveTo(this.bounds.x ,this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h);
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h);
        this.debugGraphic.endFill();
    },
    update: function(){


        // this.debug();
        this._super();
        this.getBounds();
        // console.log(this.bounds);
        // this.updateCollisionPoints();

        // console.log(this.collisionPoints);
        // if(this.getTexture()){
        //     this.getContent().position.x = 80;
        //     this.getContent().position.y = -20;
        //     this.range = this.bounds.w / 2;
        // }

        // this.velocity.x = 2;
        // this.velocity.y = -2;
        this.acumSimCos += 0.05;
        this.virtualVelocity.x = Math.sin(this.acumSimCos) * 5;
        this.virtualVelocity.y = Math.cos(this.acumSimCos) * 5;

    },
    preKill:function(){
        var self = this;
        this.updateable = false;
        this.collidable = false;
        TweenLite.to(this.getContent(), 0.5, {alpha:0, onComplete:function(){self.kill = true;}});
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection){
        this.isTouch = true;
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            this.velocity.y = 0;
        }
    },
});

var Player = Class.extend({
	init:function(range, parent, label, fireLayer){
		// this._super( true );
        this.updateable = false;
        this.deading = false;
		this.scales = {min:1, max:2};
		this.averrageScale = this.scales.min + (this.scales.max - this.scales.min) / 2;
        this.range = Math.floor(range / this.averrageScale);
        this.standardRange = Math.floor(range / this.averrageScale);
        this.width = 0;
        this.height = 0;
        this.type = 'player';
        this.label = label;
        // console.log(label);
        this.node = null;
        this.life = 5;
        this.startPosition = null;
        this.parentClass = parent;
        this.fireLayer = fireLayer;

        if(label == "PLAYER0"){
            this.standardVelocity = {x:8,y:8};
            this.virtualVelocity = {x:0,y:0};
            this.force = {x:3,y:3};
            this.velocity = {x:0,y:0};
            this.shootMaxAcum = 10;
            this.color = 0x0000FF;
            this.fireRange = this.standardRange * 0.3;
            this.firePower = 1;
            this.fireSpeed = - APP.gameVariables.shootSpeedStandard * 1.3;
        }else{
            this.standardVelocity = {x:8,y:8};
            this.virtualVelocity = {x:0,y:0};
            this.force = {x:2,y:2};
            this.velocity = {x:0,y:0};
            this.shootMaxAcum = 30;
            this.color = 0xFF0000;
            this.fireRange = this.standardRange * 0.6;
            this.firePower = 3;
            this.fireSpeed = - APP.gameVariables.shootSpeedStandard;
        }

        this.entityContainer = new PIXI.DisplayObjectContainer();

        this.collisionDebug = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.collisionDebug);

        this.hitContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.hitContainer);

        this.playerContainer = new PIXI.DisplayObjectContainer();
		this.entityContainer.addChild(this.playerContainer);

		this.standardScale = null;

		this.hitPolygon(this.color,true);
		this.debugPolygon(Math.random() * 0xFFFFFF,true);

		this.playerImage = new SimpleSprite("img/assets/teste1.png", {x:0.5, y:0.8});
        this.playerContainer.addChild(this.playerImage.getContent());
        this.playerImage.getContent().tint = this.color;

        this.playerImage.getContent().rotation = -45 / 180 * 3.14;
        // console.log(this.playerImage.getContent())
        this.playerImage.getContent().scale.x = 1;
        this.playerImage.getContent().scale.y = 2;
        this.getContent().interactive = true;
        this.hitContainer.interactive = true;



        this.mouseDown = false;
        var self = this;
        this.hitContainer.mousedown = this.hitContainer.touchstart = function(data)
        {
    //      data.originalEvent.preventDefault()
            this.data = data;
            this.dragging = true;
            self.mouseDown = true;

            var newPosition = this.data.getLocalPosition(self.getContent().parent);
            self.goTo(newPosition);
        };
        
        this.hitContainer.mouseup = this.hitContainer.mouseupoutside = this.hitContainer.touchend = this.hitContainer.touchendoutside = function(data)
        {
            this.dragging = false;
            this.data = null;
            self.mouseDown = false;

            self.virtualVelocity = {x:0,y:0};
            self.targetPosition = self.getPosition();
        };
        this.hitContainer.mousemove = this.hitContainer.touchmove = function(data)
        {
            if(this.dragging && self.mouseDown)
            {
                var newPosition = this.data.getLocalPosition(self.getContent().parent);
                // console.log(newPosition);
                // newPosition.x -=  self.getPosition().x - newPosition.x;
                // newPosition.y -=  self.getPosition().y - newPosition.y;

                self.goTo(newPosition);
            }
        }
        

	},
    setParentLayer: function(layer){
        this.layer = layer;
    },
	boundsPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(1,color);
        // debugPolygon.beginFill(color);
        debugPolygon.drawRect(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height);
        // this.debugPolygon.alpha = 0.5;
        this.collisionDebug.addChild(debugPolygon);
    },
	debugPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(1,0x00FF00);
        // debugPolygon.beginFill(color);
        debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0.5;
        this.collisionDebug.addChild(debugPolygon);
    },
	hitPolygon: function(color, force){
        debugPolygon = new PIXI.Graphics();
        debugPolygon.lineStyle(0.5,color);
        debugPolygon.beginFill(color);
        debugPolygon.drawCircle(0,0,this.range * 2);
        debugPolygon.alpha = force?0:0.5;
        this.hitContainer.addChild(debugPolygon);
    },
	build:function(){
		var self = this;
        this.centerPosition = {x:0, y:0};
        // this.centerPosition = {x:this.width/2, y:this.height/2};
        this.updateable = true;
        this.collidable = true;

        this.onMouseDown = false;

        this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;

        this.growFactor = APP.gameVariables.growFactor;

        scaleConverter(this.playerContainer.width, this.range * 4, 1, this.playerContainer);

    	this.standardScale = {x:0,y:0};
    	this.standardScale.x = this.playerContainer.scale.x;
    	this.standardScale.y = this.playerContainer.scale.y;

    	this.bounds = new PIXI.Rectangle(-this.range, -this.range, this.range*2, this.range*2);
    	// this.boundsPolygon(0x00FF00);
    },

	reset:function(){
		this.shootAcum = 0;
		
		this.getContent().scale.x = this.getContent().scale.y = this.averrageScale;
		this.mouseDown = false;

		this.updateable = true;
        this.collidable = true;

        this.targetPosition = null;

        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};

	},
	goTo:function(position, force){
        

        this.targetPosition = position;
        // console.log(this.targetPosition);
		if(force){
			this.getContent().position.x = position.x;
			this.getContent().position.y = position.y;
		}
	},
	getContent:function(){
		return this.entityContainer;
	},
	toAverrageScale:function(){

		this.shootAcum = this.shootMaxAcum;
		TweenLite.to(this.getContent().scale, 0.1,{x:this.averrageScale,y:this.averrageScale});
	},
	updateScale:function(target, totalPlayers){
		
		
		if(target.getContent().scale.x < target.scales.max){

			newTargetScale = {x:0,y:0};
			newTargetScale.x = target.getContent().scale.x + this.growFactor/totalPlayers;
			newTargetScale.y = target.getContent().scale.y + this.growFactor/totalPlayers;

			// TweenLite.to(target.getContent().scale, 0.1, {x:newTargetScale.x, y:newTargetScale.y});
			target.getContent().scale = newTargetScale;

			target.range = target.standardRange * target.getContent().scale.x;
			this.range = this.standardRange * this.getContent().scale.x;


		}


		if(target.getContent().scale.x == this.getContent().scale.x)
		{
			return
		}

		newTargetScale = {x:this.scales.min + this.scales.max - target.getContent().scale.x,y:this.scales.min + this.scales.max - target.getContent().scale.x};
		//target.getContent().scale.x = target.getContent().scale.y += this.growFactor;
		
		this.getContent().scale = newTargetScale;
		// TweenLite.to(this.getContent().scale, 0.1, {x:newTargetScale.x, y:newTargetScale.y});

		//this.getContent().scale.x = this.getContent().scale.y = this.scales.min + this.scales.max - target.getContent().scale.x;		
	},
	shoot:function(){
		if(this.shootAcum <= 0){
			// console.log("this");
			this.shootAcum = this.shootMaxAcum;
			var fire = new Fire({x:0, y:this.fireSpeed}, this.fireRange, this.color, this.layer, this.firePower);
			fire.build();
			fire.setPosition(this.getPosition().x, this.getPosition().y - this.velocity.y - this.range);
            this.layer.addChild(fire);
			// this.fireLayer.addChild(fire);
		}
	},
	update:function(){
		// this._super();
		if(this.shootAcum > 0){
			this.shootAcum --;
		}
		this.range = this.standardRange * this.getContent().scale.x;


        if(this.targetPosition && pointDistance(this.targetPosition.x, this.targetPosition.y, this.getContent().position.x,this.getContent().position.y) < this.range){
            this.velocity = {x:0, y:0};
            this.virtualVelocity = {x:0, y:0};
            this.targetPosition = null;
        }
        if(this.targetPosition){
            var angle = -Math.atan2(this.targetPosition.y - this.getContent().position.y, this.targetPosition.x - this.getContent().position.x) * 180 / Math.PI;

            // angle = angle * 180 / Math.PI;
            angle += 90;
            angle = -angle / 180 * Math.PI;
            // this.getContent().rotation = angle;
            this.virtualVelocity.x =-Math.sin(angle) * this.standardVelocity.x;
            this.virtualVelocity.y = Math.cos(angle) * this.standardVelocity.y;
        }

        if(this.velocity.x < this.virtualVelocity.x && this.virtualVelocity.x > 0){
            this.velocity.x += this.force.x;
        }else if(this.velocity.x > this.virtualVelocity.x && this.virtualVelocity.x < 0){
            this.velocity.x -= this.force.x;
        }

        if(this.velocity.y < this.virtualVelocity.y && this.virtualVelocity.y > 0){
            this.velocity.y += this.force.y;
        }else if(this.velocity.y > this.virtualVelocity.y && this.virtualVelocity.y < 0){
            this.velocity.y -= this.force.y;
        }

        this.getContent().position.x += this.velocity.x;
        this.getContent().position.y += this.velocity.y;
	},
	collide:function(arrayCollide){
		// console.log(arrayCollide);
        // console.log('fireCollide', arrayCollide[0].type);
        // console.log(arrayCollide[0].type);
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                // this.getContent().tint = 0xff0000;
                // this.preKill();
                if(this.parentClass){
                	this.parentClass.gameOver();
                	// this.preKill();
                }
                // arrayCollide[0].hurt(this.power);

            }
        }
    },
    getPosition:function(){
    	return this.getContent().position;
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){
            	// self.kill = true;
            	self.parentClass.gameOver();
            }});

        }
    },
});

var Environment = Class.extend({
	init:function(mapBounds){
		this.environmentContainer = new PIXI.DisplayObjectContainer();
		this.assetsList = [];
		this.velocity = {x:0,y:0};
		this.updateable = true;
		// console.log(this);
		this.mapBounds = mapBounds;
		this.wallsScale = 0.1;
		

		this.floor = new EnvironmentObject("img/assets/Floor.png", {x:this.mapBounds.width});
		this.getContent().addChild(this.floor.getContent());
		this.floor.getContent().position.x = this.mapBounds.x;
		// scaleConverter(this.floor.getContent().width, windowWidth, 1 - this.wallsScale * 2, this.floor.getContent());
		// this.floor = new SimpleSprite("img/assets/Floor.png");
		// this.getContent().addChild(this.floor.getContent());

		this.leftWall = new EnvironmentObject("img/assets/SideWall.png", {x:APP.getGameController().getTileSize().width * 2}, {y:APP.getGameController().getTileSize().width});
		this.getContent().addChild(this.leftWall.getContent());
		this.leftWall.getContent().position.x = - this.leftWall.getContent().width / 2;

		this.rightWall = new EnvironmentObject("img/assets/SideWall2.png", {x:APP.getGameController().getTileSize().width * 2}, {y:APP.getGameController().getTileSize().width});
		this.getContent().addChild(this.rightWall.getContent());
		
		// this.rightWall.getContent().scale.x *= -1;
		this.rightWall.getContent().position.x = this.mapBounds.width + this.rightWall.getContent().width / 2;

		//-this.leftWall.getContent().width;

		this.assetsList.push(this.floor);
		this.assetsList.push(this.rightWall);
		this.assetsList.push(this.leftWall);
	},
	update:function(){
		// console.log(this.assetsList.length);
		for (var i = this.assetsList.length - 1; i >= 0; i--) {
			this.assetsList[i].velocity = this.velocity;
			this.assetsList[i].update();
		};
		// this.environmentContainer.position.x += this.velocity.x;
		// this.environmentContainer.position.y += this.velocity.y;
	},
	setParentLayer:function(layer){
		this.parentLayer = layer;
	},
	getContent:function(){
		return this.environmentContainer;
	}
});

var EnvironmentObject = Class.extend({
	init:function(imgSrc, mainScale, correctionPosition){
		this.correctionPosition = correctionPosition;
		if(this.correctionPosition == null){
			this.correctionPosition = {x:0,y:0};
		}
		this.environmentContainer = new PIXI.DisplayObjectContainer();

		this.img = new SimpleSprite(imgSrc);
		if( mainScale.x){
			this.img.getContent().width = mainScale.x;
			// scaleConverter(this.img.getContent().width, windowWidth, mainScale.x, this.img.getContent());
		} if( mainScale.y){
			this.img.getContent().height = mainScale.y;
			// scaleConverter(this.img.getContent().height, windowHeight, mainScale.y, this.img.getContent());
		}

		this.assetList = [];

		var totAssets = Math.ceil((windowHeight * 1.5) / this.img.getContent().height) + 1;
		for (var i = 0; i < totAssets; i++) {
			this.img = new SimpleSprite(imgSrc);
			this.environmentContainer.addChild(this.img.getContent());
			if( mainScale.x){
				this.img.getContent().width = mainScale.x;
				// scaleConverter(this.img.getContent().width, windowWidth, mainScale.x, this.img.getContent());
			}else if( mainScale.y){
				this.img.getContent().height = mainScale.y;
				// scaleConverter(this.img.getContent().height, windowHeight, mainScale.y, this.img.getContent());
			}
			this.img.getContent().position.y = (this.img.getContent().height - this.correctionPosition.y) * i - this.img.getContent().height ;

			this.assetList.push(this.img);
		};

		this.velocity = {x:0,y:0};
		
	},
	update:function(){
		// console.log(this.velocity);
		for (var i = this.assetList.length - 1; i >= 0; i--) {
			this.assetList[i].getContent().position.x += this.velocity.x;
			this.assetList[i].getContent().position.y += this.velocity.y;
			if(this.velocity.y > 0){
				if(this.assetList[i].getContent().position.y + this.velocity.y > windowHeight * 1.5){					
					this.assetList[i].getContent().position.y = this.getMinPosition() -this.assetList[i].getContent().height + this.velocity.y + this.correctionPosition.y;
				}
			}else if(this.velocity.y < 0){
				if(this.assetList[i].getContent().position.y + this.velocity.y + this.assetList[i].getContent().height < 0){
					this.assetList[i].getContent().position.y = this.getMaxPosition() + this.assetList[i].getContent().height + this.velocity.y + this.correctionPosition.y;
				}
			}
		};
	},
	getMaxPosition:function(){
		var maxPosition = -999999999999;
		for (var j = this.assetList.length - 1; j >= 0; j--) {
			if(this.assetList[j].getContent().position.y > maxPosition){
				maxPosition = this.assetList[j].getContent().position.y;
			}
		};
		return maxPosition
	},
	getMinPosition:function(){
		var minPosition = 999999999999;
		for (var j = this.assetList.length - 1; j >= 0; j--) {
			if(this.assetList[j].getContent().position.y < minPosition){
				minPosition = this.assetList[j].getContent().position.y;
			}
		};
		return minPosition
	},
	getContent:function(){
		return this.environmentContainer;
	}
});

/*jshint undef:false */
var DefaultBehaviour = Class.extend({
    init: function (config){
		this.entity = null;
		this.config = config;
		
	},
	build:function(entity){
		this.entity = entity;
		this.entity.velocity.x = 2;
	},
	update: function(){


		if(this.entity.velocity.x > 0 && this.entity.getPosition().x > this.config.maxPosition||
			this.entity.velocity.x < 0 && this.entity.getPosition().x < this.config.minPosition){
			this.entity.velocity.x *= -1;
		}
		// else if(this.entity.velocity.x < 0 && this.entity.getPosition().x < this.config.minPosition){
		// 	this.entity.velocity.x = 1;
		// }

		//this.entity.update();
		// this.sideAcum --;
		// if(this.sideAcum <= 0)
		// {
		// 	this.entity.setVelocity(-1,this.entity.velocity.y*-1);
		// 	this.sideAcum = this.sideMaxAcum;
		// }

		// if(this.fireAcum >= this.fireFreq)
		// {
		// 	var pr = new Fire(true, new this.entity.fireBehaviour.clone());
		// 	pr.build();
		// 	this.fireAcum = 0;
		// 	this.entity.layer.addChildFirst(pr);		
		// 	pr.setPosition(this.entity.getPosition().x,this.entity.getPosition().y);
		// 	pr.setVelocity(-this.fireSpeed,0);
		// }
		// else
		// {
		// 	this.fireAcum ++;
		// }
		// if(this.entity.getPosition().x < -20 || this.entity.getPosition().x > windowWidth + 50 || this.entity.getPosition().y < -30 || this.entity.getPosition().y > windowHeight)
		// {
		// 	this.entity.kill = true;
		// }

		// this.entity.sprite.position.x += this.entity.velocity.x;
		// this.entity.sprite.position.y += this.entity.velocity.y;
			
		// if(this.entity.velocity.x > 0)
		// 	this.entity.setScale(-1,1 );
		// else if(this.entity.velocity.x < 0)
		// 	this.entity.setScale(1,1 );
    },
});
/*jshint undef:false */
var ScaleBehaviour = Class.extend({
    init: function (config){
		// this.player = player;
		this.entity = null;
		this.config = config;

	},
	build:function(entity){
		this.entity = entity;
		this.entity.scaleVelocity = APP.gameVariables.growFactor / 4;
	},
	update: function(){


		if(this.entity.scaleVelocity > 0 && this.entity.getContent().scale.x > this.config.maxScale||
			this.entity.scaleVelocity < 0 && this.entity.getContent().scale.x < this.config.minScale){
			this.entity.scaleVelocity *= -1;
		}
			this.entity.getContent().scale.x = this.entity.getContent().scale.y += this.entity.scaleVelocity; 
		// else if(this.entity.velocity.x < 0 && this.entity.getPosition().x < this.config.minPosition){
		// 	this.entity.velocity.x = 1;
		// }

		//this.entity.update();
		// this.sideAcum --;
		// if(this.sideAcum <= 0)
		// {
		// 	this.entity.setVelocity(-1,this.entity.velocity.y*-1);
		// 	this.sideAcum = this.sideMaxAcum;
		// }

		// if(this.fireAcum >= this.fireFreq)
		// {
		// 	var pr = new Fire(true, new this.entity.fireBehaviour.clone());
		// 	pr.build();
		// 	this.fireAcum = 0;
		// 	this.entity.layer.addChildFirst(pr);		
		// 	pr.setPosition(this.entity.getPosition().x,this.entity.getPosition().y);
		// 	pr.setVelocity(-this.fireSpeed,0);
		// }
		// else
		// {
		// 	this.fireAcum ++;
		// }
		// if(this.entity.getPosition().x < -20 || this.entity.getPosition().x > windowWidth + 50 || this.entity.getPosition().y < -30 || this.entity.getPosition().y > windowHeight)
		// {
		// 	this.entity.kill = true;
		// }

		// this.entity.sprite.position.x += this.entity.velocity.x;
		// this.entity.sprite.position.y += this.entity.velocity.y;
			
		// if(this.entity.velocity.x > 0)
		// 	this.entity.setScale(-1,1 );
		// else if(this.entity.velocity.x < 0)
		// 	this.entity.setScale(1,1 );
    },
});
/*jshint undef:false */
var StandardPlayerBehaviour = Class.extend({
    init: function (){
		this.player = null;
		
	},
	build:function(player){
		this.player = player;
	},
	update: function(){

    },
});
var PlayerModel = Class.extend({
    init:function(){
    	this.standardVelocity = {x:8,y:8};
        this.virtualVelocity = {x:0,y:0};
        this.force = {x:0.5,y:0.5};
        this.velocity = {x:0,y:0};
        this.shootMaxAcum = 10;
        this.color = 0x0000FF;
        this.fireRange = this.standardRange * 0.3;
        this.fireSpeed = - APP.gameVariables.shootSpeedStandard;
    }
});
/*jshint undef:false */
function pointDistance(x, y, x0, y0){
	return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
	return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
	return rad / (Math.PI / 180);
}

function scaleConverter(current, max, _scale, object) {
	// console.log(current, max, scale);
	var scale = (max * _scale) / current;

    if(!object){
        return scale;
    }
    if(object.scale){
        object.scale.x = object.scale.y = scale;
    }else if(object.getContent() && object.getContent().scale){
        object.getContent().scale.x = object.getContent().scale.y = scale;
    }
    return scale;
}
function shuffle(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function testMobile() {
    var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
var gameView = document.getElementById('game');

var windowWidth = possibleFullscreen()?screen.width:window.innerWidth;// * 2;//750,
windowHeight = possibleFullscreen()?screen.height:window.innerHeight;// * 2;//1334;

var renderer;
var windowWidthVar = screen.width;
windowHeightVar = screen.height;
var retina = 1.5;
console.log(gameView);
var renderer = PIXI.autoDetectRecommendedRenderer(windowWidth, windowHeight, {antialias:true, resolution:retina, view:gameView});
// document.body.appendChild(renderer.view);

var APP;
APP = new Application();
APP.build();
var first = false;
var orientation = "PORTAIT"
function update() {
	requestAnimFrame(update );
	if(!first){
		var tempRation =  orientation === "PORTAIT" ?(window.innerHeight/windowHeight):(window.innerWidth/windowWidth);
		var ratio = tempRation;
		windowWidthVar = windowWidth * ratio;
		windowHeightVar = windowHeight * ratio;
		renderer.view.style.width = windowWidthVar+'px';
		renderer.view.style.height = windowHeightVar+'px';
		// first = true;
	}
	APP.update();
	renderer.render(APP.stage);
}

var initialize = function(){
	// //inicia o game e da um build
	// PIXI.BaseTexture.SCALE_MODE = 2;
	requestAnimFrame(update);
};

(function () {
	var App = {
		init: function () {
			initialize();
		}
	};
	$(App.init);
})();

function initADMOB(){
	if(!window.cordova){
	  		return;
	  	}

			var admobid = {};
			if( /(android)/i.test(navigator.userAgent) ) {
				admobid = {
					banner: 'ca-app-pub-9306461054994106/8419773176',
					interstitial: 'ca-app-pub-9306461054994106/9896506375',
				};
			} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
				admobid = {
					banner: 'ca-app-pub-9306461054994106/3989573573',
					interstitial: 'ca-app-pub-9306461054994106/5466306778',
				};
			} else {
				admobid = {
					banner: 'ca-app-pub-9306461054994106/2770192371',
					interstitial: 'ca-app-pub-9306461054994106/4246925578',
				};
			}
			if(AdMob){
				AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
				AdMob.createBanner( {adId: admobid.banner,position: AdMob.AD_POSITION.BOTTOM_CENTER,autoShow: true,adSize:AdMob.AD_SIZE.FULL_BANNER} );
				document.addEventListener('onAdLoaded', function(data){});
		        document.addEventListener('onAdPresent', function(data){});
		        document.addEventListener('onAdLeaveApp', function(data){});
		        document.addEventListener('onAdDismiss', function(data){});
			}
		
}

function possibleFullscreen(){
	if(!testMobile()){
		return false
	}
	var elem = gameView;
	return  elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}
var isfull = false;
function fullscreen(){
	if(isfull){
		return;
	}
	var elem = gameView;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	}

	// updateResolution(screenOrientation, gameScale);

	isfull = true;
}






