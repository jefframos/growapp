/*jshint undef:false */
var GameController = Class.extend({
    init:function(){
    	APP.mapData = {
            cols: 11,
            rows: 15
        }

        APP.gameVariables = {
            verticalSpeed: windowHeight * 0.002,
            // verticalSpeed: windowHeight * 0.002,
            // enemyCounter: (windowHeight * 0.007) * windowHeight / APP.mapData.rows,
            // enemyCounter: (windowHeight * 0.005) *this.getTileSize().height,
            enemyRespaw: 5,
            growFactor: windowWidth * 0.0001,
            shootSpeedStandard: windowHeight * 0.008,
        }
        this.buildMap();
    },
    buildMap:function(){
    	map = 
        
        "00500005000\n"+
        "00050005000\n"+
        "00005005000\n"+
        "00000505000\n"+
        "00000055000\n"+
        "00000005000\n"+
        "00000070000\n"+
        "00000500000\n"+
        "00005000000\n"+
        "00050000000\n"+
        "00500000000\n"+
        "00000000050\n"+
        "00800000050\n"+
        "00000000050\n"+
        "00000000090\n"+
        "00000000050\n"+
        "00000000050\n"+
        "00000000050\n"+
        "05000000050\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00000000000\n"+
        "00010003050"
        

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
    	console.log(this.entityList);
    },
    updateEnemiesRow:function(id){
    	entities = [];
    	tempEntity = null;
    	id = (this.entityList.length - APP.mapData.rows - id - 1);
    	if(id < 0){
    		console.log("ACABOU O LEVEL");
    		return;
    	}
    	for (var i = this.entityList[id].length - 1; i >= 0; i--) {
    		tempEntity = this.entityList[id][i];
			if(tempEntity){
				entities.push(
					this.getEnemy(tempEntity.i,
    					-1,
    					tempEntity.type));
			}
    	}
    	return entities
    },
    getInitScreenEntities:function(){
    	entities = [];
    	tempEntity = null;
    	for (var i = this.entityList.length - 1; i >= this.entityList.length -  APP.mapData.rows; i--) {
    		console.log(i);
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
    	if(type == 8){
    		tempSize *= 2;
    	}
		tempEnemy = new Enemy("ENEMY", {width:tempSize});
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
        return tempEnemy

    },
    getRandom:function(min, max){
        ret = Math.floor(Math.random()*(max - min) + min);
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
    	if(this.mapArray.length >= rowID){
    		return;
    	}

    	// console.log(this.mapArray[rowID]);
    }
});
