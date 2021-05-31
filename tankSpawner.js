//Declare here so we don't get errors about accessing them before decleration
let tankSpawnPos1, tankSpawnPos2;
let redTank, greenTank,testForTankOnTankColl;
let tanks = [];

//Get a random section of path to spawn tanks on in the Y axis
let nonBarriers = generateMapGraphics(randomMap, 0);
nonBarriers = condensePath(nonBarriers);

function getRandomYSlice(){
    let yCord = nonBarriers.map(nB => nB.y);
    yCord = splitArrayMissingVal(yCord);
    if(yCord.length === 1){
        return yCord[0];
    }else{
        return yCord[Math.floor(Math.random() * yCord.length)];
    }
}

let randomYSlice = getRandomYSlice();

function spawnTank(otherTank){
    let xCord = null;
    let yCord = null;

    let preventInfiniteLoop = 0;

    do{
        preventInfiniteLoop++;

        xCord = generateRandomNumber(stageX + tankWidth , (stageX + stageWidth) - (tankWidth ) );
        yCord = stageY + (randomYSlice[Math.floor(Math.random() * randomYSlice.length)] * stageDivPathHeight);
        
        if(preventInfiniteLoop >= 10){
            loadANewLevel();
            return;
        }
    }while(tankInBarrier({x:xCord,y:yCord,width:tankWidth,height:tankHeight}, otherTank));
    
    return{
        x: xCord,
        y: yCord
    }
}