const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//Set the width & height of the canvas to the viewport width & height
canvas.width = innerWidth;
canvas.height = innerHeight;
//Split the dynamically sized canvas into cols & rows. Canvas will have 100 of each.
let canvasCol = canvas.width / 1000;
let canvasRow = canvas.height / 1000;
//Get the coordinate that lies dead in the middle of the canvas
let centerCanvasX = canvas.width / 2;
let centerCanvasY = canvas.height / 2;

//GLOBAL FUNCTIONS
function degreesIntoRadians(degrees){
    return degrees * Math.PI / 180;
}

function workOutNewPoints(cx, cy, vx, vy, rotatedAngle){ //From a rotated object
//cx,cy are the centre coordinates, vx,vy is the point to be measured against the center point
    let dx = vx - cx;
    let dy = vy - cy;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let originalAngle = Math.atan2(dy,dx);
    let velocityX = cx + distance * Math.cos(originalAngle + rotatedAngle);
    let velocityY = cy + distance * Math.sin(originalAngle + rotatedAngle);

    return {
        x: velocityX,
        y: velocityY
    }
}

//Get rotated tank coordinates
function getRotatedTankCoordinates(tank){
    let centerX = tank.x + (tank.width / 2);
    let centerY = tank.y + (tank.height / 2) + tankHitBox.height;
    //Work out rotated angle
    let rotatedAngle = degreesIntoRadians(tank.rotationStore) - degreesIntoRadians(90);
    //Work out tank corners
    let topLeft = workOutNewPoints(centerX, centerY, tank.x, tank.y + tankHitBox.height , rotatedAngle);
    let topRight = workOutNewPoints(centerX, centerY, tank.x + tank.width, tank.y + tankHitBox.height, rotatedAngle);
    let bottomLeft = workOutNewPoints(centerX, centerY, tank.x, tank.y + tank.height, rotatedAngle);
    let bottomRight = workOutNewPoints(centerX, centerY, tank.x + tank.width, tank.y + tank.height, rotatedAngle);

    return{
        tl: topLeft,
        tr: topRight,
        bl: bottomLeft,
        br: bottomRight
    }
}

//Generate a random number between min & max numbers
function generateRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Remove duplicates from Array
function removeDuplicates(array){
    return array.filter((arr, index) => array.indexOf(arr) === index);
}

//Split sorted Array (ascending) on its missing values
function splitArrayMissingVal(array){
    let splitArray = [];

    //Insert null values to Array when it is missing an item
    for(let i = 0; i < array.length; i++){
        if(array[i] !== array[i + 1] - 1 ){
            if(array[i] && array[i + 1]){
                array.splice(i + 1, 0, null);
            }
        }
    }

    let sequenceArray = null;

    //Split the Array on null values
    for(let j = 0; j < array.length; j++){
        if(array[j]===null){
            sequenceArray = null;
        }else{
            if(!sequenceArray){
                //Start a new subArray
                sequenceArray = [];
                splitArray.push(sequenceArray);
            }
            sequenceArray.push(array[j]);
        }
    }

    return splitArray;
    
}



