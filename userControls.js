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
    if(e.key === "q" && !gamePaused && tanks.indexOf(redTank) !== -1){
        if(redTank.canShoot && p1ReleasedFireKey && p1NumOfCannonBalls < 5){
            let centerX = redTank.x + redTank.width / 2;
            let topY = redTank.y;
            let newValues = workOutNewPoints(redTank.x + (redTank.width / 2), redTank.y + (redTank.height / 2) + tankHitBox.height,
            centerX, topY, degreesIntoRadians(redTank.rotationStore) - degreesIntoRadians(90));
            //Work out new velocities
            let speed = canvasCol * 3;
            let velocityX = -Math.cos(degreesIntoRadians(redTank.rotationStore)) * (speed);
            let velocityY = -Math.sin(degreesIntoRadians(redTank.rotationStore)) * (speed);
            if(cannonInBarrierBoolean(new CannonBall(newValues.x, newValues.y, velocityX, velocityY))){
                return;
            }
            cannonBalls.push(new CannonBall(newValues.x, newValues.y, velocityX, velocityY)); 
            //Prevent cannonball from being fired until timeout has elapsed
            redTank.canShoot = false;
            p1ReleasedFireKey = false;
            p1NumOfCannonBalls++;
            setTimeout(() => {
                redTank.canShoot = true;
            }, 100);
            playAudio(shootSFX);
        }
    }
    //PLAYER 2 VARIATIONS OF THE ABOVE CODE
    if(e.key === "ArrowRight"){
        greenTank.rotationDirection = "RIGHT";
        p2RotationKey = e.key;
    }else if(e.key === "ArrowLeft"){
        greenTank.rotationDirection = "LEFT";
        p2RotationKey = e.key;
    }
    //Forward keys
    if(e.key === "ArrowUp"){
        greenTank.direction = "FORWARD";
        p2DirectionKey = e.key;
    }else if(e.key === "ArrowDown"){
        greenTank.direction = "BACKWARD";
        p2DirectionKey = e.key;
    }
    //Shoot a cannonball
    if(e.key === " " && !gamePaused && tanks.indexOf(greenTank) !== -1){
        if(greenTank.canShoot && p2ReleasedFireKey && p2NumOfCannonBalls < 5){
            let centerX = greenTank.x + greenTank.width / 2;
            let topY = greenTank.y;
            let newValues = workOutNewPoints(greenTank.x + (greenTank.width / 2), greenTank.y + (greenTank.height / 2) + tankHitBox.height,
            centerX, topY, degreesIntoRadians(greenTank.rotationStore) - degreesIntoRadians(90));
            //Work out new velocities
            let speed = canvasCol * 3;
            let velocityX = -Math.cos(degreesIntoRadians(greenTank.rotationStore)) * (speed);
            let velocityY = -Math.sin(degreesIntoRadians(greenTank.rotationStore)) * (speed);
            if(cannonInBarrierBoolean(new CannonBall(newValues.x, newValues.y, velocityX, velocityY))){
                return;
            }
            cannonBalls.push(new CannonBall(newValues.x, newValues.y, velocityX, velocityY)); 
            //Prevent cannonball from being fired until timeout has elapsed
            greenTank.canShoot = false;
            p2ReleasedFireKey = false;
            p2NumOfCannonBalls++;
            setTimeout(() => {
                greenTank.canShoot = true;
            }, 100);
            playAudio(shootSFX);
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
    if(e.key === " "){
        p2ReleasedFireKey = true;
    }
});
