var Blocks = function() {
    this.arr = [];
}

var Piece = function(l, t, f, divid) {
    this.toppos = t;
    this.leftpos = l;
    this.funct = f;
    this.divid = divid;
}

var MoveFunct = function() {
    this.type = "movefunct";
}
var RotateLeftFunct = function() {
    this.type = "rotateleftfunct";
}
var RotateRightFunct = function() {
    this.type = "rotaterightfunct";
}
var CanMoveFunct = function(direction) {
    this.type = "canmovefunct";
    this.direction = direction;
}

var test = new Blocks();

var act = function(p) {
    if (p.funct.type === "movefunct") {
        bot.move();
    }
    if (p.funct.type === "rotateleftfunct") {
        bot.rotateLeft();
    }
    if (p.funct.type === "rotaterightfunct") {
        bot.rotateRight();
    }
    if (p.funct.type === "canmovefunct") {
        if(bot.canmove(p.funct.direction))
            alert("good to go!");
        
    }
}

function compileActions() {
    var count = 0;
    var tid = setTimeout(mycode, 1000);

    function mycode() {
        if (count > test.arr.length) {
            clearTimeout(tid);
        }
        act(test.arr[count]);
        count++;
        tid = setTimeout(mycode, 1000);
    }
}
