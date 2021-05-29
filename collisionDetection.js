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
function hasTankHitStage(tank, stage){
    //Work out rotated coordinates for tank
    let rt = getRotatedTankCoordinates(tank);
    //Top Left Edge
    if(rt.tl.x < stage.le || rt.tl.y < stage.te || 
        rt.tl.x > stage.re || rt.tl.y > stage.be ){
        tank.blockedDirection = "FORWARD";
        tank.blockedRotation = "LEFT";
    //Top Right Edge
    }else if(rt.tr.x < stage.le || rt.tr.y < stage.te || rt.tr.x > stage.re || 
        rt.tr.y > stage.be ){
        tank.blockedDirection = "FORWARD";
        tank.blockedRotation = "RIGHT";
    //Bottom Left Edge
    }else if(rt.bl.x < stage.le ||rt.bl.y < stage.te ||
        rt.bl.x > stage.re || rt.bl.y > stage.be){
            tank.blockedDirection = "BACKWARD";
            tank.blockedRotation = "RIGHT";
    //Bottom Right Edge
    }else if(rt.br.x < stage.le || rt.br.y < stage.te || rt.br.x > stage.re || 
        rt.br.y > stage.be){
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
function tankInBarrier(tank, otherTank){
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
    //After loop
    if(otherTank && !collision){
        if(
            !(tank.x > otherTank.x + tankWidth ||
                tank.x+tank.width<otherTank.x ||
                tank.y>otherTank.y+tankHeight ||
                tank.y+tank.height < otherTank.y)
        ){
            collision = true;
        }
    }
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
            cannonBall.vx *= -1;
        }else{
            cannonBall.vy *= -1;
        }
    }
    cannonBall.collide();
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
        //Diagonal Collisions
        if(rt.mt.x>leftEdge && rt.mt.x<rightEdge && rt.mt.y>topEdge && rt.mt.y<bottomEdge){
            tank.blockedDirection = "FORWARD";
            tank.rotationDirection = "NAN";
        }else if(rt.mb.x>leftEdge && rt.mb.x<rightEdge && rt.mb.y>topEdge && rt.mb.y<bottomEdge){
            tank.blockedDirection = "BACKWARD";
            tank.rotationDirection = "NAN";
        }
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

//Check to see if cannonBall has collided with tank
function hasCannonBallHitTank(tank){
    for(let i = 0; i < cannonBalls.length; i++){
        let cannonBall = cannonBalls[i];
        //We want to prevent the cannonBall from colliding with the tank when it is shot out of it
        if(new Date() - cannonBall.creationDate > 100){
        //Current rotation of tank
        let rotatedAngle = degreesIntoRadians(tank.rotationStore) - degreesIntoRadians(90);
        //Original rotation point of tank
        let centerX = tank.x + (tank.width / 2);
        let centerY = tank.y + (tank.height / 2) + tankHitBox.height;
        //Rotate circle so that it is on the same axis as circle
        let unrotatedCircleX = Math.cos(rotatedAngle) * (cannonBall.x - centerX) - Math.sin(rotatedAngle) *
        (cannonBall.y - centerY) + centerX;
        let unrotatedCircleY = Math.sin(rotatedAngle) * (cannonBall.x - centerX) + Math.cos(rotatedAngle) * 
        (cannonBall.y - centerY) + centerY;
        // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
        let closestX, closestY;
        // Find the unrotated closest x point from center of unrotated circle
        if (unrotatedCircleX  < tank.x){
            closestX = tank.x;
        }else if (unrotatedCircleX  > tank.x + tank.width){
            closestX = tank.x + tank.width;
        }else{
            closestX = unrotatedCircleX ;
        }
        // Find the unrotated closest y point from center of unrotated circle
        if (unrotatedCircleY < tank.y){
            closestY = tank.y + tankHitBox.height;
        }else if (unrotatedCircleY > tank.y + tank.height){
            closestY = tank.y + tank.height;
        }else{
            closestY = unrotatedCircleY;
        }
        //Determine collision
        let distance = findDistance(unrotatedCircleX, unrotatedCircleY, closestX, closestY);

        if(distance < cannonBall.radius){
            tank.destroyState = "BEGIN";
        }
        }

    }
}


//Tank colliding with another tank
function tankOnTankColl(mainTank, action, velocity){
    if(testForTankOnTankColl){
    let index = tanks.indexOf(mainTank);
    //Create a copy of mainTank
    //Allows us to test for collision before we actually move
    let thisTank = Object.assign(Object.create(Object.getPrototypeOf(mainTank)), mainTank);
    if(action === "RIGHT"){
        thisTank.rotationStore += thisTank.rotationSpeed;
    }else if(action === "LEFT"){
        thisTank.rotationStore -= thisTank.rotationSpeed;
    }else if(action === "FORWARD"){
        thisTank.x -= velocity.x * thisTank.moveSpeed;
        thisTank.y -= velocity.y * thisTank.moveSpeed;
    }else if(action === "BACKWARD"){
        thisTank.x += velocity.x * thisTank.moveSpeed;
        thisTank.y += velocity.y * thisTank.moveSpeed;
    }
    //Red tank is at index 0. Green tank is at index 1.
    let otherTank = index === 0 ? tanks[1] : tanks[0];
    //Get rotated coordinates for both tanks. thisTankRotated & otherTankRotated
    let tTR = getRotatedTankCoordinates(thisTank);
    let oTR = getRotatedTankCoordinates(otherTank);
    //Vertices & Edges are listed in clockwise order. Starting from the top right
    let thisTankVertices = [
        new xy(tTR.tr.x, tTR.tr.y),
        new xy(tTR.br.x, tTR.br.y),
        new xy(tTR.bl.x, tTR.bl.y),
        new xy(tTR.tl.x, tTR.tl.y),
    ];
    let thisTankEdges = [
        new xy(tTR.br.x - tTR.tr.x, tTR.br.y - tTR.tr.y),
        new xy(tTR.bl.x - tTR.br.x, tTR.bl.y - tTR.br.y),
        new xy(tTR.tl.x - tTR.bl.x, tTR.tl.y - tTR.bl.y),
        new xy(tTR.tr.x - tTR.tl.x, tTR.tr.y - tTR.tl.y)
    ];
    let otherTankVertices = [
        new xy(oTR.tr.x, oTR.tr.y),
        new xy(oTR.br.x, oTR.br.y),
        new xy(oTR.bl.x, oTR.bl.y),
        new xy(oTR.tl.x, oTR.tl.y),
    ];
    let otherTankEdges = [
        new xy(oTR.br.x - oTR.tr.x, oTR.br.y - oTR.tr.y),
        new xy(oTR.bl.x - oTR.br.x, oTR.bl.y - oTR.br.y),
        new xy(oTR.tl.x - oTR.bl.x, oTR.tl.y - oTR.bl.y),
        new xy(oTR.tr.x - oTR.tl.x, oTR.tr.y - oTR.tl.y)
    ];
    let thisTankPolygon = new polygon(thisTankVertices, thisTankEdges);
    let otherTankPolygon = new polygon(otherTankVertices, otherTankEdges);

    if(sat(thisTankPolygon, otherTankPolygon)){
        return true;
    }else{
        return false;
    }
}
}