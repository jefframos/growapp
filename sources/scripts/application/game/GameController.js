/*jshint undef:false */
var GameController = Class.extend({
    init:function(){
    	APP.mapData = {
            cols: 9,
            rows: 12,
            mapCols: 11
        }

        if(window.location.hash) {
            APP.rotation = window.location.hash.substr(1);
          // Fragment exists
        } else {
          // Fragment doesn't exist
            APP.rotation = 30;
        }
        console.log(APP.rotation);
        APP.gameRotation = APP.rotation / 180 * 3.14;
        APP.isometricScale = 0.5;
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
        "00000000000\n"+
        "00000005000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "06000000000\n"+
        "00000000000\n"+
        "00000070000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000006000\n"+
        "00000000000\n"+
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
        "00000000000\n"+
        "00000000000\n"+
        "60000000700\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00800000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "06000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00080000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
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
    					-7,
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
