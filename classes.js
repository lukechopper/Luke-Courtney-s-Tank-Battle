class Tank{
    constructor(x, y, width, height, image){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.rotationSpeed = 3;
        this.rotationDirection = "NAN";
        this.rotationStore = 90;
        this.direction = "NAN";
        this.moveSpeed = canvasCol * 2;
        this.canShoot = true; //Prevent cannon balls from being spammed
        this.blockedDirection = "NAN";
        this.blockedRotation = "NAN";
        this.lastKeyPressed = ["NAN","NAN"] //First is dir. Second is rotation.
        this.tankVsTankCol = false; //Used in tank on tank collision
        this.destroyState = "NAN";
        this.alphaLevel = 1;
    }
    rotate(){
        let centerX = this.x + (this.width / 2);
        let centerY = this.y + (this.height / 2) + tankHitBox.height;
        ctx.translate(centerX, centerY);
        if(this.rotationDirection === "RIGHT" && this.blockedRotation !== "RIGHT"){
            this.rotationStore += this.rotationSpeed;
            if(this.blockedRotation === "LEFT"){
                this.blockedRotation = "NAN";
                this.blockedDirection = "NAN";
                this.tankVsTankCol = false;
            } 
        } 
        if(this.rotationDirection === "LEFT" && this.blockedRotation !== "LEFT"){
            this.rotationStore -= this.rotationSpeed;
            if(this.blockedRotation === "RIGHT"){
                this.blockedRotation = "NAN";
                this.blockedDirection = "NAN";
                this.tankVsTankCol = false;
            }
        } 
        let fixedRotation = degreesIntoRadians(this.rotationStore) - degreesIntoRadians(90);
        let fixedRotationInDegrees = this.rotationStore - 90;
        ctx.rotate(fixedRotation);
        //Reset 'rotationStore' if it needs to be reset
        if(fixedRotationInDegrees > 360 || fixedRotationInDegrees < -360) this.rotationStore = 90;
        ctx.translate(-centerX, -centerY);
    }
    move(){
        ctx.save();
        let centerX = this.x + (this.width / 2);
        let centerY = this.y + (this.height / 2) + tankHitBox.height;
        ctx.translate(centerX, centerY);
        ctx.rotate(0); //Restore rotation so that we can move tank in the proper direction
        let velocityX = Math.cos(degreesIntoRadians(this.rotationStore));
        let velocityY = Math.sin(degreesIntoRadians(this.rotationStore));
        if(this.direction === "FORWARD" && this.blockedDirection !== "FORWARD"){
            this.x -= velocityX * this.moveSpeed;
            this.y -= velocityY * this.moveSpeed;
            if(this.blockedDirection === "BACKWARD"){
                this.blockedRotation = "NAN";
                this.blockedDirection = "NAN";
                this.tankVsTankCol = false;
            }
        }else if(this.direction === "BACKWARD" && this.blockedDirection !== "BACKWARD"){
            this.x += velocityX * this.moveSpeed;
            this.y += velocityY * this.moveSpeed;
            if(this.blockedDirection === "FORWARD"){
                this.blockedRotation = "NAN";
                this.blockedDirection = "NAN";
                this.tankVsTankCol = false;
            }
        }
        ctx.translate(-centerX, -centerY);
        ctx.restore();
    }
    destroy(){
        this.alphaLevel -= 0.05;
        if(this.alphaLevel < 0) {
            this.alphaLevel = 0;
        }
        ctx.globalAlpha = this.alphaLevel;
    }
    draw(){
        if(this.direction !== "NAN") this.move();
        ctx.save();
        if(this.destroyState === "BEGIN") this.destroy();
        this.rotate();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
//GLOBAL VARIABLES: TANK CLASS
const tankWidth = canvasCol *  23;
const tankHeight = canvasCol * 33;


class CannonBall{
    constructor(x, y, vx, vy){
        this.x = x;
        this.vx = vx;
        this.y = y;
        this.vy = vy;
        this.radius = canvasCol * 3;
        this.alphaLevel = 1;
        this.creationDate = new Date();
        this.shouldDestroy = false;
        this.collTime = null; //Used to prevent any collision errors
    }
    move(){
        this.x += this.vx;
        this.y += this.vy;
        if(new Date() - this.creationDate >= 8000){
            this.destroy();
        }else{
            this.draw();
        }
    }
    destroy(){
        ctx.save();
        this.alphaLevel -= 0.05;
        if(this.alphaLevel < 0) {
            this.alphaLevel = 0;
            this.shouldDestroy = true;
        }
        ctx.globalAlpha = this.alphaLevel;
        this.draw();
        ctx.restore();
    }
    collide(){
        if(this.collTime){
            /*If there has been less then 3 milliseconds before last collision, then we know that the ball must be
            stuck in a wall. In which case we will seperate the ball from the wall so that it is no longer stuck.*/
            if(new Date() - this.collTime < 3){
                let angle = Math.atan2(this.vy, this.vx);
                let newVx = Math.cos(angle);
                let newVy = Math.sin(angle);
                this.x += newVx * (this.radius * 2);
                this.y += newVy * (this.radius * 2);
            }
        }

        this.collTime = new Date();
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

let cannonBalls = [];