//Get access to the 2 tank images
const redTankImg = new Image();
redTankImg.src="Assets/redTank.png";
redTankImg.onload = loadImages;
const greenTankImg = new Image();
greenTankImg.src="Assets/greenTank.png";
greenTankImg.onload = loadImages;
//Generate random spawn values
const redTankSpawn = spawnTank();
let redTank = new Tank(redTankSpawn.x, redTankSpawn.y,
 tankWidth, tankHeight, redTankImg);
//So tank has a proper point of rotation without the firing muzzle
const tankHitBox = {height: canvasCol * 4}


function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(animate);

    //Background needs to be drawn above everything else
    drawMap();
    //Edges of the canvas take into account the border's width
    hasTankHitObject(redTank, {le: stageX + canvasCol * 2, re: stageX + stageWidth - (canvasCol * 2), 
        te: stageY + canvasRow * 5, be: stageY + stageHeight - (canvasRow * 5)});
    hasTankCollidedWithBarrier(redTank);

    redTank.draw();

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