//Get access to the 2 tank images
const redTankImg = new Image();
redTankImg.src="Assets/redTank.png";
redTankImg.onload = loadImages;
const greenTankImg = new Image();
greenTankImg.src="Assets/greenTank.png";
greenTankImg.onload = loadImages;
//Generate random spawn values
const tankSpawnPos1 = spawnTankOne();
let redTank = new Tank(tankSpawnPos1.x, tankSpawnPos1.y,
 tankWidth, tankHeight, redTankImg);
 const tankSpawnPos2 = spawnTankTwo({x:tankSpawnPos1.x,y:tankSpawnPos1.y});
let greenTank = new Tank(tankSpawnPos2.x, tankSpawnPos2.y,
    tankWidth, tankHeight, greenTankImg);
let tanks = [redTank, greenTank];
//So tank has a proper point of rotation without the firing muzzle
const tankHitBox = {height: canvasCol * 4}
//No point checking for a tank on tank collision when other tank has been removed from Array.
let testForTankOnTankColl = true;

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(animate);

    //Background needs to be drawn above everything else
    drawMap();
    
    tanks.forEach((tank, index) => {
        //Edges of the canvas take into account the border's width
        hasTankHitStage(tank, {le: stageX + canvasCol * 2, re: stageX + stageWidth - (canvasCol * 2), 
            te: stageY + canvasRow * 5, be: stageY + stageHeight - (canvasRow * 5)});
        hasTankCollidedWithBarrier(tank);
        hasCannonBallHitTank(tank);
        if(testForTankOnTankColl) tankOnTankColl(index);
        tank.draw();
        //Remove tank if it has fully disapeared
        if(tank.alphaLevel <= 0){
            setTimeout(() => {
                tanks.splice(index, 1);
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
}


let numberOfImages = 2;
function loadImages(){
    if(--numberOfImages > 0) return;

    animate();
}