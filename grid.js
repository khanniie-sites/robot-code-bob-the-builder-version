var endscript = false;

//grid properties
var maxWidth = 350;
var width = 5;
var height = 5;
var blockWid = maxWidth / width;

//canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var rect = c.getBoundingClientRect();


//BOT!!!!!
var b = document.getElementById("bot");

//bot class
function Bot() {
    //column
    this.xarrpos;
    //row
    this.yarrpos;
    this.direction = 0;
}
//the robot functions
Bot.prototype.move = function() {
    //polar coordinates inverted kinda ish
    //0- right/ 90- down/ 180 - left/ 270 -up
    if (bot.canmove("forward")) {
        if (this.direction == 0) {
            this.xarrpos++;
        }
        if (this.direction == 180) {
            this.xarrpos--;
        }
        if (this.direction == 90) {
            this.yarrpos++;
        }
        if (this.direction == 270) {
            this.yarrpos--;
        }
    }

    rect = c.getBoundingClientRect();
    b.style.left = this.xarrpos * blockWid + rect.left + window.scrollX + "px";
    b.style.top = this.yarrpos * blockWid + rect.top + window.scrollY + "px";
}
Bot.prototype.rotateLeft = function() {
    this.direction -= 90;
    if (this.direction < 0) {
        this.direction = 270;
    }
    b.style.transform = "rotate(" + this.direction + "deg)";
}
Bot.prototype.rotateRight = function() {
    this.direction += 90;
    if (this.direction > 270) {
        this.direction = 0;
    }
    b.style.transform = "rotate(" + this.direction + "deg)";
}
Bot.prototype.canmove = function(direction) {
    var angle;
    if(direction === "undef"){
        alert("choose a direction!");
    }
    if (direction === "right") {
        angle = (this.direction + 90) % 360;
    }
    if (direction === "left") {
        angle = (this.direction + 270) % 360;
    }
    if (direction === "forward") {
        angle = this.direction;
    }
    if (direction === "backward") {
        angle = (this.direction + 180) % 360;
    }
    if (angle == 0) {
        if (this.xarrpos + 1 < width && !m.grid[this.xarrpos + 1][this.yarrpos].obstacle) {
            return true;
        }
    } else if (angle == 180) {
        if (this.xarrpos - 1 >= 0 && !m.grid[this.xarrpos - 1][this.yarrpos].obstacle) {
            return true;
        }
    } else if (angle == 90) {
        if (this.yarrpos + 1 < height && !m.grid[this.xarrpos][this.yarrpos + 1].obstacle) {
            return true;
        }
    } else if (angle == 270) {
        if (this.yarrpos - 1 >= 0 && !m.grid[this.xarrpos][this.yarrpos - 1].obstacle) {
            return true;
        }
    }
    alert("no good! you've hit an obstable or reached a wall! :(");
    endscript = true;
    return false;
}


// Grid class
//height, width, grid array
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
// width, x coordinate, y coordinate, 
function Cell(xcoor, ycoor, wid, a, b) {
    this.width = wid;
    this.x = xcoor;
    this.y = ycoor;
    this.arrayPos = [a, b];
    this.obstacle = false;
}

function drawGrid(m) {
    c.width = maxWidth;
    c.height = height * blockWid;
    for (var i = 0; i < m.grid.length; i++) {
        for (var j = 0; j < m.grid[0].length; j++) {
            var temp = m.grid[i][j];
            if (temp.obstacle) {
                ctx.fillRect(temp.x, temp.y, temp.width, temp.width);
            }
            ctx.rect(temp.x, temp.y, temp.width, temp.width);
            ctx.stroke();
        }
    }
}

function returnObs(m) {
    var arr = [];
    for (var i = 0; i < m.grid.length; i++) {
        for (var j = 0; j < m.grid[0].length; j++) {
            var temp = m.grid[i][j];
            if (temp.obstacle) {
                arr.push(temp);
            }
        }
    }
    return arr;
}

function setPrevObstacles(m, arr) {
    for (var i = 0; i < arr.length; i++) {
        var temp = arr[i];
        if (temp.arrayPos[0] < m.length && temp.arrayPos[1] < m[0].length) {
            var cell = m[temp.arrayPos[0]][temp.arrayPos[1]];
            cell.obstacle = true;
        }

    }
}

var adjust = function() {
    if (this.id === "widthslider") {
        width = this.value;
        blockWid = maxWidth / width;
    }
    if (this.id === "heightslider") {
        height = this.value;
    }
    b.style.width = blockWid + "px";
    b.style.height = blockWid + "px";
    var obstacles = returnObs(m);
    m = new Grid();
    setPrevObstacles(m.grid, obstacles);
    drawGrid(m);
    if(bot.xarrpos !=null){
        b.style.left = m.grid[bot.xarrpos][bot.yarrpos].x + rect.left + "px";
        b.style.top = m.grid[bot.xarrpos][bot.yarrpos].y + rect.top + "px";
    }
    document.getElementById("widthvalue").innerHTML= width;
    document.getElementById("heightvalue").innerHTML = height;
};

document.getElementById("widthslider").addEventListener("mouseup", adjust);
document.getElementById("heightslider").addEventListener("mouseup", adjust);

document.getElementById("myCanvas").addEventListener("click", function(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var temp = m.grid[(x - x % blockWid) / blockWid][(y - y % blockWid) / blockWid];
    if (temp.obstacle) {
        temp.obstacle = false;
        ctx.fillStyle = 'white';
    } else {
        temp.obstacle = true;
        ctx.fillStyle = 'black';
    }
    ctx.fillRect(temp.x + 1, temp.y + 1, temp.width - 2, temp.width - 2);
});

var m = new Grid();
var bot = new Bot();
drawGrid(m);



