//Check to see if cannon ball has left viewport. If it has then we should delete it from Array.
function cannonBallLeftViewport(cannonBall, index){
    if(cannonBall.x + cannonBall.radius < 0 ||
        cannonBall.x - cannonBall.radius > canvas.width ||
        cannonBall.y + cannonBall.radius < 0 ||
        cannonBall.y - cannonBall.radius > canvas.height){
            setTimeout(() => {
                cannonBalls.splice(index, 1);
            }, 0);
        }
}

//Check to see if tank has collided with the object held as the second argument of the function. le -> left edge, etc.
function hasTankHitObject(tank, obj){
    //Work out rotated coordinates for tank
    let rt = getRotatedTankCoordinates(tank);
    //Top Left Edge
    if(rt.tl.x < obj.le || rt.tl.y < obj.te || 
        rt.tl.x > obj.re || rt.tl.y > obj.be ){
        tank.blockedDirection = "FORWARD";
        tank.blockedRotation = "LEFT";
    //Top Right Edge
    }else if(rt.tr.x < obj.le || rt.tr.y < obj.te || rt.tr.x > obj.re || 
        rt.tr.y > obj.be ){
        tank.blockedDirection = "FORWARD";
        tank.blockedRotation = "RIGHT";
    //Bottom Left Edge
    }else if(rt.bl.x < obj.le ||rt.bl.y < obj.te ||
        rt.bl.x > obj.re || rt.bl.y > obj.be){
            tank.blockedDirection = "BACKWARD";
            tank.blockedRotation = "RIGHT";
    //Bottom Right Edge
    }else if(rt.br.x < obj.le || rt.br.y < obj.te || rt.br.x > obj.re || 
        rt.br.y > obj.be){
            tank.blockedDirection = "BACKWARD";
            tank.blockedRotation = "LEFT";
    }
}

//Check to see if cannon balls have hit the edge of the canvas
function cannonBallsHitEdgeOfCanvas(cannonBall){
    if(cannonBall.x - cannonBall.radius < stageX){
        //Left edge collision
        cannonBall.x = stageX + cannonBall.radius;
        cannonBall.vx *= -1;
    }else if(cannonBall.x + cannonBall.radius > stageX + stageWidth){
        //Right edge collision
        cannonBall.x = (stageX + stageWidth) - cannonBall.radius;
        cannonBall.vx *= -1;
    }else if(cannonBall.y - cannonBall.radius < stageY){
        //Top edge collision
        cannonBall.y = stageY + cannonBall.radius;
        cannonBall.vy *= -1;
    }else if(cannonBall.y + cannonBall.radius > stageY + stageHeight){
        //Bottom edge collision
        cannonBall.y = (stageY + stageHeight) - cannonBall.radius;
        cannonBall.vy *= -1;
    }
}

//Check to see if tank is in barrier. Used to prevent tank from spawning in barrier.
function tankInBarrier(tank){
    let collision = false;
    barriers.forEach(barrier => {
        //Work out barrier edges
        let leftEdge = stageX + (barrier.x * stageDivPathWidth);
        let rightEdge = leftEdge + (barrier.length * stageDivPathWidth);
        let topEdge = stageY + (barrier.y * stageDivPathHeight);
        let bottomEdge = topEdge + stageDivPathHeight + 1;

        if(
            !(tank.x>rightEdge || 
            tank.x+tank.width<leftEdge || 
            tank.y>bottomEdge || 
            tank.y+tank.height<topEdge)
        ){
            collision = true;
        }

    });
    return collision;
}

//Check to see if cannonBall has collided with barrier
function cannonInBarrier(cannonBall){
    for(let i = 0; i < barriers.length; i++){
        let barrier = barriers[i];

        //Work out barrier edges
        let leftEdge = stageX + (barrier.x * stageDivPathWidth);
        let width = (stageDivPathWidth ) * barrier.length;
        let topEdge = stageY + (barrier.y * stageDivPathHeight);
        let height = stageDivPathHeight + 1;
        //Distance between circle centre & rectangle centre
        var distX = Math.abs(cannonBall.x - leftEdge - width/2);
        var distY = Math.abs(cannonBall.y - topEdge - height/2);
        //Too far apart to be colliding
        if (distX > (width/2 + cannonBall.radius)) { continue; }
        if (distY > (height/2 + cannonBall.radius)) { continue; }
        // SIDE COLLISIONS
        if (distX <= (width/2)) { cannonBallHitBarrier(cannonBall, "LONG"); } 
        if (distY <= (height/2)) { cannonBallHitBarrier(cannonBall, "SIDE"); }
    
        // CORNER COLLISIONS
        var dx=distX-width/2;
        var dy=distY-height/2;
        if (dx*dx+dy*dy<=(cannonBall.radius*cannonBall.radius)){
            cannonBallHitBarrier(cannonBall, "DIAG");
        }
    }
}

//Respond to a collision between cannonBall & barrier
function cannonBallHitBarrier(cannonBall, type){
    //See if they where going sideways or not
    if(type === "LONG"){
        cannonBall.vy *= -1;
    }else if(type === "SIDE"){
        cannonBall.vx *= -1;
    }else if(type === "DIAG"){
        if(Math.abs(cannonBall.vx) > Math.abs(cannonBall.vy)){
            cannonBall.vy *= -1;
        }else{
            cannonBall.vx *= -1;
        }
    }
}

//Check to see if tank has hit one of the barriers
function hasTankCollidedWithBarrier(tank){
    barriers.forEach(barrier => {
        //Work out barrier edges
        let leftEdge = stageX + (barrier.x * stageDivPathWidth);
        let rightEdge = leftEdge + (barrier.length * stageDivPathWidth);
        let topEdge = stageY + (barrier.y * stageDivPathHeight);
        let bottomEdge = topEdge + stageDivPathHeight + 1;
        //Find rotated tank coordinates
        let rt = getRotatedTankCoordinates(tank);
        //Top Left Edge Only
        if(rt.tl.x>leftEdge && rt.tl.x<rightEdge && rt.tl.y>topEdge && rt.tl.y<bottomEdge){
            tank.blockedDirection = "FORWARD";
            tank.blockedRotation = "LEFT";
        //Top Right Edge Only
        }else if(rt.tr.x>leftEdge && rt.tr.x<rightEdge && rt.tr.y>topEdge && rt.tr.y<bottomEdge){
            tank.blockedDirection = "FORWARD";
            tank.blockedRotation = "RIGHT";
        //Bottom Left Edge Only
        }else if(rt.bl.x>leftEdge && rt.bl.x<rightEdge && rt.bl.y>topEdge && rt.bl.y<bottomEdge){
            tank.blockedDirection = "BACKWARD";
            tank.blockedRotation = "RIGHT";
        //Bottom Right Edge Only
        }else if(rt.br.x>leftEdge && rt.br.x<rightEdge && rt.br.y>topEdge && rt.br.y<bottomEdge){
            tank.blockedDirection = "BACKWARD";
            tank.blockedRotation = "LEFT";
        }
    });
}