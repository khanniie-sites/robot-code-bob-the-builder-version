var CounterObj = function(count){
	this.count = count;
}
var counter = new CounterObj(0);
var loop = false;
var endpoint;
var startpoint;
var timecounter = 1;
var times = 500;

var Blocks = function() {
    this.arr = [];
}

var Piece = function(l, t, f, divid, div, height, inloop, loopid, bref) {
    this.div = div;
    this.toppos = t;
    this.height = height;
    this.totalheight = height;
    this.leftpos = l;
    this.funct = f;
    this.divid = divid;
    this.inloop = inloop;
    this.loopid = loopid;
    this.bref = bref;
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
var RepeatForeverFunct = function(){
	this.type ="repeatforeverfunct";
    // this.bref = [];
	//index of arrays that are inside it
	this.height;
}
var RepeatFunct = function(inputid){
	this.type ="repeatfunct";
	this.times = -1;
	//index of arrays that are inside it
	// this.bref = [];
	this.height;
    this.inputid = inputid;
}

var test = new Blocks();

function searchBlockArrayForDiv(arr, divname) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].divid === divname) {
            return i;
        }
    }
    return -1;
}

var act = function(tid, p) {
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
    if (p.funct.type ==="repeatforeverfunct" && p.bref.length > 0){
    	loop = true;
        endpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        startpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        for(var i = 0; i< p.bref.length; i++){
            if(searchBlockArrayForDiv(test.arr, p.bref[i]) > endpoint){
                endpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
            if(searchBlockArrayForDiv(test.arr, p.bref[i]) < startpoint){
                startpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
        }
        counter.count = startpoint - 1;
    }
    if (p.funct.type ==="repeatfunct"){
        loop = true;
        times = parseInt(document.getElementById(p.funct.inputid).value, 10);
        if(!(times>0)){
            alert("please enter a value into the loop!");
            endscript = true;
            return;
        }
        timecounter = 1;
        endpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        startpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        for(var i = 0; i< p.bref.length; i++){
            if(searchBlockArrayForDiv(test.arr, p.bref[i]) > endpoint){
                endpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
            if(searchBlockArrayForDiv(test.arr, p.bref[i]) < startpoint){
                startpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
        }
        counter.count = startpoint - 1;
    }
}

function compileActions() {
    times = 500;
    timecounter = 1;
    endscript = false;
    counter.count = 0;
    startpoint = 0;
    //console.log(test.arr);
    endpoint = test.arr.length - 1;
    var tid = setTimeout(mycode, 300);

    function mycode() {
        //console.log(counter.count);
        if (counter.count > endpoint || endscript) {
            clearTimeout(tid);
        }
        else if(counter.count <= endpoint){
        	act(tid, test.arr[counter.count]);
       		counter.count++;
           
            if(timecounter >= times){
                times = 500;
                loop = false;
                endpoint = test.arr.length - 1;
            }
       		if(loop && counter.count > endpoint){
       			counter.count = startpoint;
                 timecounter++;
       		}
        	tid = setTimeout(mycode, 500);
        }
        
    }
}

function stopActions(){
    //counter.count = 0;
    forever = false;
    endscript = true;
}


