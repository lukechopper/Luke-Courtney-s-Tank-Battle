//Generate Background Border
let stageWidth = canvasCol * generateRandomNumber(200, 900);
let stageX = canvasCol * 500 - (stageWidth / 2); //Half way width. 500 is half of 1000
let stageHeight = canvasRow * generateRandomNumber(300, 700);
let stageY = canvasRow * 380 - (stageHeight / 2); //Y is slightly offset to make room for main menu

function backgroundBorder(){
    //Draw Background
    ctx.fillStyle = "#E6E6E6";
    ctx.fillRect(stageX, stageY, stageWidth, stageHeight);
    //Draw Border
    ctx.strokeStyle = "#4D4D4D";
    ctx.lineWidth = canvasCol * 7;
    ctx.strokeRect(stageX, stageY, stageWidth, stageHeight);
}

//Create 2 dimensional Array required for random map generation
function create2DArray(num, row, col){
    let array = [];
    for(let i = 0; i < row; i++){
        array.push([]);
        for(let j = 0; j < col; j++){
            array[i].push(num);
        }
    }
    return array;
}

//Get values to base our 2D Array
let pathWidth = Math.round(stageWidth / (canvasRow * 85));
let pathHeight = Math.round(stageHeight / (canvasCol * 85));
//So randomly generated barriers fit stage width & height
let stageDivPathWidth = stageWidth / pathWidth;
let stageDivPathHeight = stageHeight / pathHeight;

function createMap(){
    //Highest number of turns that the algorithm can make when making the map
    let maxWalls = 15;
    //Longest time in a single direction before changing direction
    let maxLength = 10;
    //Generate Map
    let map = create2DArray(1, pathHeight, pathWidth);
    //Generate starting row & column
    let currentRow = Math.floor(Math.random() * pathHeight);
    let currentCol = Math.floor(Math.random() * pathWidth);
    //Walls can only travel: left, right, up, down
    //We access rows first, then columns.
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    //Will hold random direction
    let lastDirection = [];
    //Will hold random direction
    let randomDirection = null;
    //Loop will run until 'maxWalls' is zero.
    while(maxWalls){
    //Will have to go in a completely new direction. Cannot go back on itself
    do{
        randomDirection = directions[Math.floor(Math.random() * directions.length)];
    }while ((randomDirection[0] === -lastDirection[0] &&    
        randomDirection[1] === -lastDirection[1]) || 
       (randomDirection[0] === lastDirection[0] &&  
        randomDirection[1] === lastDirection[1]));

    let randomLength = Math.ceil(Math.random() * maxLength);
    //Will serve as iterator. So that 'randomLength' can be evaluated.
    let wallLength = 0;

    while(wallLength < randomLength){
        //Exit loop if trying to go outside of the stage's boundaries
        if(((currentRow === 0) && (randomDirection[0] === -1))||  
        ((currentCol === 0) && (randomDirection[1] === -1))|| 
        ((currentRow === pathHeight - 1) && (randomDirection[0] === 1)) ||
     ((currentCol === pathWidth - 1) && (randomDirection[1] === 1)))   
    { 
        break; 
    }else{
        //Change the current cell in the 2D Array to be 0 instead of 1 (represent its occupancy)
        map[currentRow][currentCol] = 0;
        currentRow += randomDirection[0];
        currentCol += randomDirection[1];
        //Iterate the iterator. While loop evaluation.
        wallLength++;
    }
    }
    //Update our values. Unless the last loop broke because of an immediate collision
    if(wallLength){
        lastDirection = randomDirection;
        //Loop will end when all the walls have run out
        maxWalls--;
    }
    }
    return map;
}

//Generate barriers from map
function generateMapGraphics(map, val){
    let barrierStore = [];
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[i].length; j++){
            if(map[i][j] === val){
                barrierStore.push({x: j, y: i});
            }
        }
    }
    return barrierStore;
}

//Randomly generated map
let randomMap = createMap();

//Condense path so that Array is easier to render
function condensePath(pathArr){
    let yGroup = [];
    //Dividing path into cols
    for(let i = 0; i < pathHeight; i++){
        let pathSect = pathArr.filter(path => path.y === i);
        yGroup.push(pathSect);
    }
    let xGroup = [];
    //Dividing path into rows
    yGroup.forEach((group, yValue) => {
        let seperateX = group.map(g => g.x);
        seperateX = removeDuplicates(seperateX);
        seperateX = seperateX.sort((a,b) => a - b); //Sort to ascending order
        
        let splitX = splitArrayMissingVal(seperateX);
        splitX.forEach(split => {
            let newCord = {x: split[0], length: split.length, y: yValue};
            xGroup.push(newCord);
        });

    });

    return xGroup;
}

let barriers = generateMapGraphics(randomMap, 1);
barriers = condensePath(barriers);

function drawMap(){
    backgroundBorder();
    //Draw Barriers
    barriers.forEach(barrier => {
        ctx.fillStyle = "#4D4D4D";
        ctx.fillRect(stageX + (barrier.x * stageDivPathWidth), stageY + (barrier.y * stageDivPathHeight),
        (stageDivPathWidth ) * barrier.length, stageDivPathHeight + 1);
    });
}

//Generate new map to avoid infinite loop
function newMap(){
    //Generate Background Border
    stageWidth = canvasCol * generateRandomNumber(200, 900);
    stageX = canvasCol * 500 - (stageWidth / 2); //Half way width. 500 is half of 1000
    stageHeight = canvasRow * generateRandomNumber(300, 700);
    stageY = canvasRow * 380 - (stageHeight / 2); //Y is slightly offset to make room for main menu
    //Get values to base our 2D Array
    pathWidth = Math.round(stageWidth / (canvasRow * 85));
    pathHeight = Math.round(stageHeight / (canvasCol * 85));
    //So randomly generated barriers fit stage width & height
    stageDivPathWidth = stageWidth / pathWidth;
    stageDivPathHeight = stageHeight / pathHeight;
    //Randomly generated map
    randomMap = createMap();
    barriers = generateMapGraphics(randomMap, 1);
    barriers = condensePath(barriers);
}
