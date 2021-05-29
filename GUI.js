//HAS GAME STARTED.
let hasGameStarted = false;

let beginBtn = {x:centerCanvasX - (canvasCol * 100) / 2, y:centerCanvasY + (canvasCol * 90) / 2,
     width: canvasCol * 100, height:canvasCol * 40};

//Work Out Mouse Positions
let mousePos = {x: 0, y: 0};

function drawMainMenu(){
    //Draw The Begin Button
    if(cursorInBeginBtn()){
        ctx.fillStyle = "red";
        document.body.style.cursor = "pointer";
    }else{
        ctx.fillStyle = "#bfbfbf";
        document.body.style.cursor = "default";
    }
    
    ctx.fillRect(beginBtn.x, beginBtn.y, beginBtn.width, beginBtn.height);
    ctx.fillStyle = "black";
    ctx.font = `${canvasCol * 20}px Arial`;
    ctx.fillText("Begin", centerCanvasX - canvasCol * 23,centerCanvasY + canvasCol * 70);
    //Draw Opening Text
    ctx.fillStyle = "black";
    ctx.font = `bold ${canvasCol * 40}px Arial`;
    ctx.fillText("Tank Battle", centerCanvasX - canvasCol * 100,canvasRow * 140);
    //Draw Credits Text
    ctx.font = `bold ${canvasCol * 30}px Arial`;
    ctx.fillText("By Luke F. Courtney", centerCanvasX - canvasCol * 150,canvasRow * 880);
}

//Is cursor in begin BTN
function cursorInBeginBtn(){
    if(mousePos.x>beginBtn.x && mousePos.x<beginBtn.x+beginBtn.width && mousePos.y>beginBtn.y && mousePos.y<beginBtn.y+beginBtn.height){
        return true;
    }else{
        return false;
    }
}

//Show the user controls
function showUserControls(){
    //PLAYER 1 - RED
    ctx.fillStyle = "black";
    ctx.font = `${canvasCol * 30}px Arial`;
    ctx.fillText("Player One",  canvasCol * 430,canvasRow * 250);
    ctx.fillStyle = "#ff1a1a";
    ctx.font = `${canvasCol * 30}px Arial`;
    ctx.fillText("Move: wsad, Fire: q",  canvasCol * 370,canvasRow * 330);
    //PLAYER 2 - GREEN
    ctx.fillStyle = "black";
    ctx.font = `${canvasCol * 30}px Arial`;
    ctx.fillText("Player Two",  canvasCol * 430,canvasRow * 432);
    ctx.fillStyle = "#33cc33";
    ctx.font = `${canvasCol * 30}px Arial`;
    ctx.fillText("Move: Arrow Keys, Fire: Space",  canvasCol * 300,canvasRow * 512);
}

//Draw score counter
function drawScoreCounter(){
    //RED TANK SCORE
    ctx.fillStyle = "#ff1a1a";
    ctx.font = `${canvasCol * 40}px Arial`;
    ctx.fillText("Red", canvasCol * 180,canvasRow * 850);
    ctx.fillStyle = "black";
    ctx.font = `${canvasCol * 40}px Arial`;
    ctx.fillText(redTankScore, canvasCol * 210,canvasRow * 940);
    //GREEN TANK SCORE
    ctx.fillStyle = "#33cc33";
    ctx.font = `${canvasCol * 40}px Arial`;
    ctx.fillText("Green", canvasCol * 705,canvasRow * 850);
    ctx.fillStyle = "black";
    ctx.font = `${canvasCol * 40}px Arial`;
    ctx.fillText(greenTankScore, canvasCol * 760,canvasRow * 940);
}

addEventListener("mousemove", e => {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
});

addEventListener("click", e => {
    if(cursorInBeginBtn()){
        hasGameStarted = true;
        document.body.style.cursor = "default";
    }
});