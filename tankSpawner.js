function spawnTankOne(){
    let xCord = null;
    let yCord = null;

    let preventInfiniteLoop = 0;

    do{
        preventInfiniteLoop++;

        xCord = generateRandomNumber(stageX + tankWidth , (stageX + stageWidth) - (tankWidth ) );
        yCord = generateRandomNumber(stageY + tankHeight , (stageY + stageHeight) - (tankHeight ) );
        
        if(preventInfiniteLoop >= 10){
            newMap();
            preventInfiniteLoop = -1;
        }
    }while(tankInBarrier({x:xCord,y:yCord,width:tankWidth,height:tankHeight}));
    
    return{
        x: xCord,
        y: yCord
    }
}

function spawnTankTwo(otherTank){
    let xCord = null;
    let yCord = null;

    let preventInfiniteLoop = 0;

    do{
        preventInfiniteLoop++;

        xCord = generateRandomNumber(stageX + tankWidth , (stageX + stageWidth) - (tankWidth ) );
        yCord = generateRandomNumber(stageY + tankHeight , (stageY + stageHeight) - (tankHeight ) );
        
        if(preventInfiniteLoop >= 10){
            //Red tank needs to be given a new position based on the new map that has been generated
            newRedTank = spawnTankOne();
            redTank = new Tank(newRedTank.x, newRedTank.y,
                tankWidth, tankHeight, redTankImg);
            preventInfiniteLoop = -1;
        }
    }while(tankInBarrier({x:xCord,y:yCord,width:tankWidth,height:tankHeight}, otherTank));
    
    return{
        x: xCord,
        y: yCord
    }
}