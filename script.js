//Get access to the 2 tank images
const redTankImg = new Image();
redTankImg.src="Assets/redTank.png";
redTankImg.onload = loadImages;
const greenTankImg = new Image();
greenTankImg.src="Assets/greenTank.png";
greenTankImg.onload = loadImages;
//Generate random spawn values
//RED TANK - PLAYER 1. GREEN TANK - PLAYER 2.
tankSpawnPos1 = spawnTank();
redTank = new Tank(tankSpawnPos1.x, tankSpawnPos1.y,
 tankWidth, tankHeight, redTankImg);
tankSpawnPos2 = spawnTank({x:tankSpawnPos1.x,y:tankSpawnPos1.y});
greenTank = new Tank(tankSpawnPos2.x, tankSpawnPos2.y,
    tankWidth, tankHeight, greenTankImg);
tanks = [redTank, greenTank];
//So tank has a proper point of rotation without the firing muzzle
const tankHitBox = {height: canvasCol * 4}
//No point checking for a tank on tank collision when other tank has been removed from Array.
testForTankOnTankColl = true;

//Pause game - then load a new level
function updateScores(){
    gamePaused = true;
    setTimeout(() => {
        if(tanks.indexOf(redTank) !== -1){
            redTankScore++;
        }else if(tanks.indexOf(greenTank) !== -1){
            greenTankScore++;
        }
    }, 1500);
    setTimeout(() => {
        loadANewLevel();
    }, 3000);
}

function loadANewLevel(){
    newMap();

    tankSpawnPos1 = spawnTank();
    redTank = new Tank(tankSpawnPos1.x, tankSpawnPos1.y,
    tankWidth, tankHeight, redTankImg);
    tankSpawnPos2 = spawnTank({x:tankSpawnPos1.x,y:tankSpawnPos1.y});
    greenTank = new Tank(tankSpawnPos2.x, tankSpawnPos2.y,
        tankWidth, tankHeight, greenTankImg);
    tanks = [redTank, greenTank];

    cannonBalls = [];
    p1NumOfCannonBalls = 0;
    p2NumOfCannonBalls = 0;

    gamePaused = false;
    testForTankOnTankColl = true;
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(animate);

    if(hasGameStarted){
        //Background needs to be drawn above everything else
        drawMap();
        
        tanks.forEach((tank, index) => {
            //Edges of the canvas take into account the border's width
            hasTankHitStage(tank, {le: stageX + canvasCol * 2, re: stageX + stageWidth - (canvasCol * 2), 
                te: stageY + canvasRow * 5, be: stageY + stageHeight - (canvasRow * 5)});
            hasTankCollidedWithBarrier(tank);
            hasCannonBallHitTank(tank);
            tank.draw();
            //Remove tank if it has fully disapeared
            if(tank.alphaLevel <= 0){
                setTimeout(() => {
                    tanks.splice(index, 1);
                    //PREVENT ANOTHER MAP LOAD IF BOTH TANKS ARE DESTROYED
                    if(testForTankOnTankColl){
                        setTimeout(() => {
                            updateScores();
                        }, 3000);
                    }
                    testForTankOnTankColl = false;
                }, 0);
            }
        });

        cannonBalls.forEach((cannonBall, index) => {
            //Destroy cannonBall if it's opacity has faded
            if(cannonBall.shouldDestroy){
                setTimeout(() => {
                    cannonBalls.splice(index, 1);
                    p1NumOfCannonBalls--;
                }, 0)
            }
            cannonBall.move();
            cannonBallsHitEdgeOfCanvas(cannonBall);
            //Remove from Array if it has left the canvas
            cannonBallLeftViewport(cannonBall, index);
            cannonInBarrier(cannonBall);
        });
        //GUI
        drawScoreCounter();
    }else{
        drawMainMenu();
        showUserControls();
    }
}


let numberOfImages = 2;
function loadImages(){
    if(--numberOfImages > 0) return;

    animate();
}