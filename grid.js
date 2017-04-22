var blockWid = 50;
var width = 5;
var height = 5;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Grid class
function Grid() {
    this.wid = width;
    this.hei = height;
    this.grid = [];
    for (var i = 0; i < this.wid; i++) {
        var row = [];
        for (var j = 0; j < this.hei; j++) {
            row.push(new Cell(i * blockWid, j * blockWid, blockWid, i, j));
        }
        this.grid.push(row);
    }
}

//Cell class
function Cell(xcoor, ycoor, wid, a, b) {
    this.width = wid;
    this.x = xcoor;
    this.y = ycoor;
    this.arrayPos = [a, b];
    this.bot = false;
    this.obstacle = false;
}

function drawGrid(m) {
    c.width = width * blockWid;
    c.height = height * blockWid;
    for (var i = 0; i < m.grid.length; i++) {
        for (var j = 0; j < m.grid[0].length; j++) {
            var temp = m.grid[i][j];
            if(temp.obstacle){
                ctx.fillRect(temp.x, temp.y, temp.width, temp.width);
            }
            ctx.rect(temp.x, temp.y, temp.width, temp.width);
            ctx.stroke();
        }
    }
}
function returnObs(m){
    var arr = [];
    for (var i = 0; i < m.grid.length; i++) {
        for (var j = 0; j < m.grid[0].length; j++) {
            var temp = m.grid[i][j];
            if(temp.obstacle){
                arr.push(temp);
            }
        }
    }
    return arr;
}
function setPrevObstacles(m, arr){
    for (var i = 0; i < arr.length; i++) {
        var temp = arr[i];
        if(temp.arrayPos[0] < m.length && temp.arrayPos[1] < m[0].length){
            var cell = m[temp.arrayPos[0]][temp.arrayPos[1]];
            cell.obstacle = true;
        }
        
    }
}

var adjust = function() {
    if (this.id === "widthslider") {
        width = this.value;
    }
    if (this.id === "heightslider") {
        height = this.value;
    }
    var obstacles = returnObs(m);
    m = new Grid();
    setPrevObstacles(m.grid, obstacles);
    drawGrid(m);
};

document.getElementById("widthslider").addEventListener("mouseup", adjust);
document.getElementById("heightslider").addEventListener("mouseup", adjust);

document.getElementById("myCanvas").addEventListener("click", function(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var temp = m.grid[(x - x%blockWid)/blockWid][(y - y%blockWid)/blockWid];
    temp.obstacle = true;
    ctx.fillRect(temp.x, temp.y, temp.width, temp.width);

});

var m = new Grid();
drawGrid(m);