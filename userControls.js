//GLOBAL VARIABLES
let p1RotationKey = ""; //The current rotation key for p1
let p1DirectionKey = "";
let p1ReleasedFireKey = true;
let p1NumOfCannonBalls = 0;
//PLAYER 2 VARIABLES -> Copy of player 1's
let p2RotationKey = "";
let p2DirectionKey = "";
let p2ReleasedFireKey = true;
let p2NumOfCannonBalls = 0;

//Game Control event listeners
addEventListener("keydown", e => {
    //Sideways keys. Only 1 at a time.
    if(e.key === "d"){
        redTank.rotationDirection = "RIGHT";
        p1RotationKey = "d";
        redTank.lastKeyPressed[1] = "d";
    }else if(e.key === "a"){
        redTank.rotationDirection = "LEFT";
        p1RotationKey = "a";
        redTank.lastKeyPressed[1] = "a";
    }
    //Forwards keys. Only 1 at a time
    if(e.key === "w"){
        redTank.direction = "FORWARD";
        p1DirectionKey = "w";
        redTank.lastKeyPressed[0] = "w";
    }else if(e.key === "s"){
        redTank.direction = "BACKWARD";
        p1DirectionKey = "s";
        redTank.lastKeyPressed[0] = "s";
    }
    //Shoot a cannonBall
    if(e.key === "q"){
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
            }, 100);
        }
    }
    //PLAYER 2 VARIATIONS OF THE ABOVE CODE
    if(e.key === "ArrowRight"){
        greenTank.rotationDirection = "RIGHT";
        p2RotationKey = e.key;
        greenTank.lastKeyPressed[1] = "ArrowRight";
    }else if(e.key === "ArrowLeft"){
        greenTank.rotationDirection = "LEFT";
        p2RotationKey = e.key;
        greenTank.lastKeyPressed[1] = "ArrowLeft";
    }
    //Forward keys
    if(e.key === "ArrowUp"){
        greenTank.direction = "FORWARD";
        p2DirectionKey = e.key;
        greenTank.lastKeyPressed[0] = "ArrowUp";
    }else if(e.key === "ArrowDown"){
        greenTank.direction = "BACKWARD";
        p2DirectionKey = e.key;
        greenTank.lastKeyPressed[0] = "ArrowDown";
    }
    //Shoot a cannonball
    if(e.key === "m"){
        if(greenTank.canShoot && p2ReleasedFireKey && p2NumOfCannonBalls < 5){
            let centerX = greenTank.x + greenTank.width / 2;
            let topY = greenTank.y;
            let newValues = workOutNewPoints(greenTank.x + (greenTank.width / 2), greenTank.y + (greenTank.height / 2) + tankHitBox.height,
            centerX, topY, degreesIntoRadians(greenTank.rotationStore) - degreesIntoRadians(90));
            //Work out new velocities
            let speed = canvasCol * 3;
            let velocityX = -Math.cos(degreesIntoRadians(greenTank.rotationStore)) * (speed);
            let velocityY = -Math.sin(degreesIntoRadians(greenTank.rotationStore)) * (speed);
            cannonBalls.push(new CannonBall(newValues.x, newValues.y, velocityX, velocityY)); 
            //Prevent cannonball from being fired until timeout has elapsed
            greenTank.canShoot = false;
            p2ReleasedFireKey = false;
            p2NumOfCannonBalls++;
            setTimeout(() => {
                greenTank.canShoot = true;
            }, 100);
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
    if(e.key === "q"){
        p1ReleasedFireKey = true;
    }
    //PLAYER 2 VARIATION OF THE ABOVE CODE
    if(e.key === p2RotationKey){
        greenTank.rotationDirection = "NAN";
    }
    if(e.key === p2DirectionKey){
        greenTank.direction = "NAN";
    }
    if(e.key === "m"){
        p2ReleasedFireKey = true;
    }
});
