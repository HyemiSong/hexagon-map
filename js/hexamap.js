/*
Author: Hyemi Song (github.com/HyemiSong)
Content: Hexagon Map on Canvas
First Release: Jan.8.2019
*/
reset = () => {
    canvas = document.getElementById("canvas"); //because we are looping // each location has its own canvas ID
    ctx = canvas.getContext('2d');
    //ctx.beginPath();

    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Restore the transform
    ctx.restore(); // CLEARS THE SPECIFIC CANVAS COMPLETELY FOR NEW DRAWING

    // Redraw canvas and map
    start()

}

start = () => {
    //Canvas Setting
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const cfg = {
            ctxMargin: .99,
            lineWeight: 1,
            lineJoin: "round",
            pixeltranslate: 0.5,
            fillColor: "rgba(255,232,0,1)",
            strokeColor: "rgba(0,0,0,0.5)",
            shadowColor: "rgba(0,0,0,0.4)",
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffSetY: 0
    }
          ctx.lineJoin = cfg.lineJoin;
          ctx.lineWidth = cfg.lineWeight;
          ctx.translate(cfg.pixeltranslate, cfg.pixeltranslate);
          canvas.width = window.innerWidth * cfg.ctxMargin;
          canvas.height = window.innerHeight * cfg.ctxMargin;

    //Data
    const randomData = Math.floor(Math.random()*(1000-1)+1);
    const data = { total: randomData, maxCount: 200 }

    //Variables
    const TO_RADIANS = Math.PI/180;
    const multiply = 0.59;
    const hexRadius = () => { return Math.floor(cellGrid().width*multiply/innerGrid(1)); }
    const innerCircleRadius = () => { return hexRadius()/2*Math.sqrt(3); } // I don't understand // circle half radius

    //Set Draw Area
    const cellGrid = () => {
        const cellW = canvas.width/3;
        const cellH = cellW;
        const x = (canvas.width-cellW)/2;
        const y = (canvas.height-cellH)/2;
        const margin = (data.total > data.maxCount) ? 1 : 0.85;
        return { x1: x, y1: y, width: cellW, height: cellH, margin: margin }
    }

    //Set inner grid
    const innerGrid = (count) => {
        let pow = Math.pow(count, 2);
        let result;

        if ( data.total > pow ) {
            result = count + 1;
            return innerGrid(result)
        } else {
            result = count;
            return result;
        }
    }

    //Methods
    //Draw Hexagon
    const drawHex = (x,y) => {
        let r = hexRadius()*cellGrid().margin;
        let cornerRadius = (data.total > data.maxCount/5) ? 0 : 1;
        let midPoint = cornerRadius*Math.sqrt(3);
        let radiusData = [
            {x:-1,   y:0,  q1:0.25, q2:-0.25, q3:1,    q4:0},
            {x:-1,   y:-1, q1:0,    q2:0,     q3:0.25, q4:1},
            {x:0.25, y:-1, q1:0,    q2:0,     q3:-1,   q4:1}
        ]

        ctx.beginPath();
        ctx.moveTo(x-midPoint,y-r);
        for (let i = 0; i<=5; i++) {

             let multiply = (i < 3) ? 1 : -1;
             let j = i%3;
             let xPos = x+Math.cos((i*60-90)*TO_RADIANS)*r;
             let yPos = y+Math.sin((i*60-90)*TO_RADIANS)*r;
        
             ctx.lineTo(
                xPos+(midPoint*radiusData[j].x)*multiply, 
                yPos+(midPoint*radiusData[j].y)*multiply);

             ctx.quadraticCurveTo( 
                xPos+(midPoint*radiusData[j].q1)*multiply, 
                yPos+(midPoint*radiusData[j].q2)*multiply, 
                xPos+(midPoint*radiusData[j].q3)*multiply, 
                yPos+(midPoint*radiusData[j].q4)*multiply )
         }

        ctx.closePath();
        ctx.strokeStyle = cfg.strokeColor;
        ctx.stroke();
        ctx.fillStyle = cfg.fillColor;
        // ctx.shadowColor = cfg.shadowColor;
        // ctx.shadowBlur = (data.total > data.maxCount*0.1) ? 0:cfg.shadowBlur;
        // ctx.shadowOffsetX = cfg.shadowOffsetX;
        // ctx.shadowOffsetY = cfg.shadowOffsetY;
        ctx.fill();
    }

    const drawHexLinear = () => {
        let rc = innerCircleRadius()*2;
        let rh = hexRadius()*2;
        let rePosX, rePosY, quo, indent, margin;
        const x1 = cellGrid().x1;
        const y1 = cellGrid().y1;
        const col = innerGrid(1);
        const totalCount = data.total;

        for (let i = 0; i < totalCount; i++){
            quo = Math.floor(i / col);
            indent = (quo == 0 || quo%2 == 0) ? 0:rc*0.5;
            rePosX = (i >= col) ? x1+(rc*0.5)+indent+(rc*i)-(col*rc*quo) : x1+(rc*0.5)+indent+(rc*i);
            rePosY = (i >= col) ? y1+(rh*0.5)+(rh*quo)-(rh/4*quo) : y1+(rh*0.5)+(rh*quo);
            drawHex(rePosX, rePosY);
        }
    }
    
    const drawCellLine = () => {
    //draw cell
        // ctx.rect(canvas.width/2-cellGrid().width/2, canvas.height/2-cellGrid().height/2, cellGrid().width, cellGrid().height )
        // ctx.stroke()
    }

    drawHexLinear();
    drawCellLine();
}

