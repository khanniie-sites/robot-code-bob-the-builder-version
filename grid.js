var blockWid = 50;
var width = 5;
var height = 5;
// var obstacles = [new Cell(0, 0, blockWid, true, [0, 0])];

// Grid class
function Grid() {
    this.wid = width;
    this.hei = height;
    this.grid = [];
    for (var i = 0; i < this.wid; i++) {
        var row = [];
        for (var j = 0; j < this.hei; j++) {
            var temparr = [i, j];
            row.push(new Cell(i * blockWid, j * blockWid, blockWid, false, temparr));
        }
        this.grid.push(row);
    }
}

//Cell class
function Cell(xcoor, ycoor, wid, tf, arrayPos) {
    this.width = wid;
    this.x = xcoor;
    this.y = ycoor;
    this.obstacle = tf;
    this.arrayPos = arrayPos;
}

function drawGrid(m) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.width = width * blockWid;
    c.height = height * blockWid;
    for (var i = 0; i < m.grid.length; i++) {
        for (var j = 0; j < m.grid[0].length; j++) {
            var temp = m.grid[i][j];
            ctx.rect(temp.x, temp.y, temp.width, temp.width);
            ctx.stroke();
        }
    }
    // for (var i = 0; i < obstacles.length; i++) {
    //     var temp = obstacles[i];
    //     ctx.fillRect(temp.x, temp.y, temp.width, temp.width);
    // }
}

var adjust = function() {
    if (this.id === "widthslider") {
        width = this.value;
    }
    if (this.id === "heightslider") {
        height = this.value;
    }

    n = new Grid();
    drawGrid(n);
};

document.getElementById("widthslider").addEventListener("mouseup", adjust);
document.getElementById("heightslider").addEventListener("mouseup", adjust);

// document.getElementById("myCanvas").addEventListener("click", function() {

// });

var m = new Grid();
drawGrid(m);