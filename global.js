const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//Set the width & height of the canvas to the viewport width & height
canvas.width = innerWidth;
canvas.height = innerHeight;
//Split the dynamically sized canvas into cols & rows. Canvas will have 100 of each.
let canvasCol = null;
let canvasRow = null;
//CANNOT play game if viewport is to small
if(innerWidth > 453 && innerHeight > 216){
    canvasCol = canvas.width / 1000;
    canvasRow = canvas.height / 1000;
}
//Get the coordinate that lies dead in the middle of the canvas
let centerCanvasX = canvas.width / 2;
let centerCanvasY = canvas.height / 2;
//KEEP TRACK OF SCORE
let redTankScore = 0;
let greenTankScore = 0;

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
    //Middle Top & Middle Bottom
    let middleTop = workOutNewPoints(centerX, centerY, tank.x + (tank.width / 2), tank.y + tankHitBox.height, rotatedAngle);
    let middleBottom = workOutNewPoints(centerX, centerY, tank.x + (tank.width / 2), tank.y + tank.height, rotatedAngle);


    return{
        tl: topLeft,
        tr: topRight,
        bl: bottomLeft,
        br: bottomRight,
        mt: middleTop,
        mb: middleBottom,
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

//Find distance (classic Pythagorus function)
function findDistance(fromX, fromY, toX, toY){
    let a = Math.abs(fromX - toX);
    let b = Math.abs(fromY - toY);
 
    return Math.sqrt((a * a) + (b * b));
}

//Functional objects for the Seperate Axis Theorum (SAT)
function xy(x,y){
    this.x = x;
    this.y = y;
};

function polygon(vertices, edges){
    this.vertex = vertices;
    this.edge = edges;
};

//The actual Seperate Axis Theorum function
function sat(polygonA, polygonB){
    var perpendicularLine = null;
    var dot = 0;
    var perpendicularStack = [];
    var amin = null;
    var amax = null;
    var bmin = null;
    var bmax = null;
    for(var i = 0; i < polygonA.edge.length; i++){
         perpendicularLine = new xy(-polygonA.edge[i].y,
                                     polygonA.edge[i].x);
         perpendicularStack.push(perpendicularLine);
    }
    for(var i = 0; i < polygonB.edge.length; i++){
         perpendicularLine = new xy(-polygonB.edge[i].y,
                                     polygonB.edge[i].x);
         perpendicularStack.push(perpendicularLine);
    }
    for(var i = 0; i < perpendicularStack.length; i++){
         amin = null;
         amax = null;
         bmin = null;
         bmax = null;
         for(var j = 0; j < polygonA.vertex.length; j++){
              dot = polygonA.vertex[j].x *
                    perpendicularStack[i].x +
                    polygonA.vertex[j].y *
                    perpendicularStack[i].y;
              if(amax === null || dot > amax){
                   amax = dot;
              }
              if(amin === null || dot < amin){
                   amin = dot;
              }
         }
         for(var j = 0; j < polygonB.vertex.length; j++){
              dot = polygonB.vertex[j].x *
                    perpendicularStack[i].x +
                    polygonB.vertex[j].y *
                    perpendicularStack[i].y;
              if(bmax === null || dot > bmax){
                   bmax = dot;
              }
              if(bmin === null || dot < bmin){
                   bmin = dot;
              }
         }
         if((amin < bmax && amin > bmin) ||
            (bmin < amax && bmin > amin)){
              continue;
         }
         else {
              return false;
         }
    }
    return true;
}