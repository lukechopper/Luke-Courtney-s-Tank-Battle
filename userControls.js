//GLOBAL VARIABLES
let p1RotationKey = ""; //The current rotation key for p1
let p1DirectionKey = "";
let p1ReleasedFireKey = true;
let p1NumOfCannonBalls = 0;

//Game Control event listeners
addEventListener("keydown", e => {
    //Sideways keys. Only 1 at a time.
    if(e.key === "d"){
        redTank.rotationDirection = "RIGHT";
        p1RotationKey = "d";
    }else if(e.key === "a"){
        redTank.rotationDirection = "LEFT";
        p1RotationKey = "a";
    }
    //Forwards keys. Only 1 at a time
    if(e.key === "w"){
        redTank.direction = "FORWARD";
        p1DirectionKey = "w";
    }else if(e.key === "s"){
        redTank.direction = "BACKWARD";
        p1DirectionKey = "s";
    }
    //Shoot a cannonBall
    if(e.key === " "){
        if(redTank.canShoot && p1ReleasedFireKey && p1NumOfCannonBalls < 5){
            let centerX = redTank.x + redTank.width / 2;
            let topY = redTank.y;
            let newValues = workOutNewPoints(redTank.x + (redTank.width / 2), redTank.y + (redTank.height / 2) + tankHitBox.height,
            centerX, topY, degreesIntoRadians(redTank.rotationStore) - degreesIntoRadians(90));
            //Work out new velocities
            let speed = canvasCol * 3;
            let velocityX = -Math.cos(degreesIntoRadians(redTank.rotationStore)) * (speed);
            let velocityY = -Math.sin(degreesIntoRadians(redTank.rotationStore)) * (speed);
            cannonBalls.push(new CannonBall(newValues.x, newValues.y, velocityX, velocityY)); 
            //Prevent cannonball from being fired until timeout has elapsed
            redTank.canShoot = false;

            p1ReleasedFireKey = false;
            p1NumOfCannonBalls++;
            setTimeout(() => {
                redTank.canShoot = true;
            }, 100)
        }
        
    }
});

addEventListener("keyup", e => {
    if(e.key === p1RotationKey){
        redTank.rotationDirection = "NAN";
    }
    if(e.key === p1DirectionKey){
        redTank.direction = "NAN";
    }
    if(e.key === " "){
        p1ReleasedFireKey = true;
    }
});
