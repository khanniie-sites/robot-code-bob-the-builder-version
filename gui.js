//document.oncontextmenu = document.body.oncontextmenu = function() {return false;}

//globalvar -----------------------------------------------------------

var blockhei = 23;
var isOverTextBox = false;

//helper classes---------------------------------------------------------------

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function addClass(el, someClass) {
    if (el) {
        el.className += el.className ? ' ' + someClass : someClass;
    }
}

//returns index
function searchBlockArrayForDiv(arr, divname) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].divid === divname) {
            return i;
        }
    }
    return -1;
}

function searchBrefForDiv(arr, divname) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === divname) {
            return i;
        }
    }
    return -1;
}

// function isLayer(layerarr, piece){
//     for(var i = 0; i< layerarr.length; i++){
//         if(piece === layerarr[i]){
//             return true;
//         }
//     }
//     return false;
// }
function deeperLayer(pabove, pbelow) {
    var res = false;
    if (pabove.layer.length > pbelow.layer.length) {
        res = true;
    }
    return [res, pabove.layer.length - pbelow.layer.length];
}

function calculateArrPos(offset, blockhei, inloop, layer) {
    var top = offset - offset % blockhei;
    var pos = 0;
    var arrpos = top / blockhei;
    var change = 0;
    for (var i = 0; i < arrpos; i++) {
        if (test.arr[i] != null) {
            if (i != 0 && deeperLayer(test.arr[i - 1], test.arr[i])[0]) {
                console.log(deeperLayer(test.arr[i - 1], test.arr[i])[0]);
                arrpos -= deeperLayer(test.arr[i - 1], test.arr[i])[1];
                change += deeperLayer(test.arr[i - 1], test.arr[i])[1];
            } else if (test.arr[i].outer && test.arr[i].bref.length < 1) {
                arrpos--;
                change++;
            }
        }
    }
    console.log(arrpos, change);
    if (arrpos > test.arr.length) {
        arrpos = test.arr.length;
    }
    return arrpos;
    //return [inlooparrpos, arrpos];
}

//drag and drop---------------------------------------------------------------

function DragPart(elem, height, x_elem, y_elem, piece) {
    this.selected = elem;
    this.x_elem = x_elem;
    this.y_elem = y_elem;
    this.height = height;
    this.bref = [];
    this.pi = piece;
}

//pos of mouse
var x_pos = 0,
    y_pos = 0;
//array of all DragPart elements being dragged (just one obj if one block, if loop or if then multiple)    
var dragbit = [];

//fires when you pick up piece
function drag_init(elem) {
    if (isOverTextBox) {
        return false;
    }
    var trect = elem.getBoundingClientRect();
    var height = trect.bottom - trect.top;
    //putting pieces into dragbit arrays

    //if the piece is within the dropbox
    if (hasClass(elem, "used")) {
        var element = test.arr[searchBlockArrayForDiv(test.arr, elem.id)];
        var numremove = 1;

        //add first element
        var temp = new DragPart(elem, height, x_pos - elem.offsetLeft, y_pos - elem.offsetTop, element);
        dragbit.splice(0, 0, temp);
        dragbit[0].bref = element.bref;

        //if loop, get stuff inside loop too
        if (hasClass(elem, "outer")) {
            numremove = element.bref.length + 1;
            for (var i = 0; i < element.bref.length; i++) {
                var tempinarr = test.arr[searchBlockArrayForDiv(test.arr, element.bref[i])];
                var temp = new DragPart(document.getElementById(element.bref[i]), tempinarr.height, x_pos - document.getElementById(element.bref[i]).offsetLeft, y_pos - document.getElementById(element.bref[i]).offsetTop, tempinarr);
                dragbit.push(temp);
                dragbit[i + 1].bref = tempinarr.bref;
            }
        }

        //if the element was in a loop, remove its id from the loop's storage and change the height of the loop
        if (element.inloop) {
            //get the loop element that the block was assigned to
            for (var l = 0; l < element.layer.length; l++) {
                var loopele = element.layer[l];
                //change height of that element, both in css and in the array object
                loopele.div.style.height = loopele.height - element.height + "px";
                loopele.height -= element.height;
                //remove from loop's block ref storage
                loopele.bref.splice(searchBrefForDiv(loopele.bref, elem.id), 1);
            }
        }
        //shifts all elements below up
        for (var j = searchBlockArrayForDiv(test.arr, elem.id) + 1; j < test.arr.length; j++) {
            test.arr[j].toppos -= element.height;
        }

        //remove all blocks from main block array
        test.arr.splice(searchBlockArrayForDiv(test.arr, elem.id), numremove);

        //reflect position changes on screen
        for (var j = 0; j < test.arr.length; j++) {
            document.getElementById(test.arr[j].divid).style.top = test.arr[j].toppos + "px";
            document.getElementById(test.arr[j].divid).style.left = test.arr[j].leftpos + "px";
        }
    }
    //if unused, grabbed from toolbox
    else {
        //if it's not the bot, aka if it's a block, duplicate it
        if (elem != b) {
            duplicate(elem.id);
        }
        //console.log(height);
        var temp = new DragPart(elem, height, x_pos - elem.offsetLeft, y_pos - elem.offsetTop, null);
        dragbit.splice(0, 0, temp);
    }
}

function move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    for (var i = 0; i < dragbit.length; i++) {
        dragbit[i].selected.style.left = (x_pos - dragbit[i].x_elem) + 'px';
        dragbit[i].selected.style.top = (y_pos - dragbit[i].y_elem) + 'px';
    }
}

function destroy() {
    if (dragbit.length > 0) {
        if (dragbit[0].selected === b) {
            snap();
        } else {
            snapB();
        }
    }
    dragbit = [];
}

//fires after mouseup from the bot, gets the bot to snap to grid
function snapB() {
    //grab dimensions of the box where they'll be dropped in
    var db = document.getElementById("dropbox");
    var dbrect = db.getBoundingClientRect();
    //for later use
    var inloop = false;
    //if within the dimensions of the dropbox (with scroll factored in)
    if (dragbit.length > 0 && x_pos > dbrect.left + window.scrollX && x_pos < dbrect.right + window.scrollX && y_pos > dbrect.top + window.scrollY && y_pos < dbrect.bottom + window.scrollY) {
        //grab how much it's offset from the top of the box by
        var offset = y_pos - dbrect.top;
        //use this to caluclate where it should be dropped in the array
        var loopid = "undef";
        var layer = [];

        //checks if it landed within any of the loops
        for (var i = 0; i < test.arr.length; i++) {
            if (test.arr[i].outer) {
                //get loop info
                var ele = test.arr[i];
                var loopele = document.getElementById(ele.divid);
                var looprect = loopele.getBoundingClientRect();
                //if within constraints of loop, add to loop's block reference and register loop to itself
                if (y_pos >= looprect.top + blockhei && y_pos <= looprect.bottom) {
                    loopid = loopele.id;
                    inloop = true;
                    //add the dragbit ids to the loop's block reference
                    for (var k = 0; k < dragbit.length; k++) {
                        ele.bref.push(dragbit[k].selected.id);
                    }
                    //reset loop height
                    var totalhei = 0;
                    for (var d = 0; d < dragbit.length; d++) {
                        totalhei += dragbit[d].height;
                    }
                    //if new loop, reset height (because it's a slightly different height in the beginning)
                    if (ele.bref.length < 2) {
                        test.arr[i].height = 46 + totalhei;
                    }
                    //just add height of new block
                    else {
                        test.arr[i].height += totalhei;
                    }
                    //reset height in css
                    loopele.style.height = test.arr[i].height + "px";
                }
            }
        }
        if (inloop) {
            var ele = test.arr[searchBlockArrayForDiv(test.arr, loopid)];
            for (var a = 0; a < ele.layer.length; a++) {
                layer.push(ele.layer[a]);
            }
            layer.push(ele);
        }

        //actually start placing blocks   ******************************

        //-------setting a top and left placement point for where we will start placing our dragged pieces------------//

        var top = 0;
        var shift = dragbit[0].height;
        var left = 0;
        var res = calculateArrPos(offset, blockhei, inloop, layer);

        //if block that's being set is within the loop, 
        if (inloop) {
            //look at the piece above it
            var lastpiece = test.arr[res - 1];
            //if the bit you're placing is going to first within the loop
            if (lastpiece.divid === loopid) {
                //... make the top placement point the first point in loop
                top = lastpiece.toppos + blockhei;
                //also, shift the left placement point to the right because it's new in the loop
                left = lastpiece.leftpos + 20;
            }
            //else, make the placement point behind the other piece in the loop
            else {
                //grab last piece IN SAME LAYER AS THE ONE YOU'RE PLACING IT IN
                var lastpieceinsamelayer;
                for (var b = 0; b < res; b++) {
                    if (test.arr[b].layer.length == layer.length) {
                        lastpieceinsamelayer = test.arr[b];
                    }
                }
                //set top based on that
                top = lastpieceinsamelayer.toppos + lastpieceinsamelayer.height;
                left = lastpieceinsamelayer.leftpos;
            }
        }
        //if not in loop
        else {
            //get the top posititon by adding up all pieces above it
            for (var d = 0; d < res; d++) {
                //loop height already includes the height of the stuff within bc it stretches to include them
                if (!test.arr[d].inloop)
                    top += test.arr[d].height;
            }
            //default left pos
            left = -200;
        }
        //------------------end of determining top and left----------------------

        //setting the drag pieces to the top placement
        for (var g = 0; g < dragbit.length; g++) {
            //in case you're dragging a loop, you have make sure the blocks within remain indented by changing the left position
            if (g != 0 && dragbit[g].pi.inloop && dragbit[g - 1].selected.id === dragbit[g].pi.loopid) {
                left = dragbit[g - 1].pi.leftpos + 20;
            }
            //reflect the block's changes in css
            dragbit[g].selected.style.top = top + "px";
            dragbit[g].selected.style.left = left + "px";
            //if it were already used, get old loop info for the blocks inside
            if (g != 0 && dragbit[g].pi != null) {
                var newlayer = [];
                i = layer.length;
                while (i--) newlayer.push(layer[i]);

                newlayer.push(dragbit[0]);

                doit(dragbit[g].selected, res + g, top, left, dragbit[g].pi.inloop, dragbit[g].pi.loopid, dragbit[g].bref, newlayer);
            } else {
                doit(dragbit[g].selected, res + g, top, left, inloop, loopid, dragbit[g].bref, layer);
            }
            top += blockhei;
        }
        for (var g = res + dragbit.length; g < test.arr.length; g++) {
            if (!test.arr[g].inloop && dragbit.length < 2 && test.arr[g - 1].inloop && test.arr[searchBlockArrayForDiv(test.arr, test.arr[g - 1].loopid)].bref.length < 2) {
                var shiftoffset = blockhei - (test.arr[searchBlockArrayForDiv(test.arr, test.arr[g - 1].loopid)].toppos + test.arr[searchBlockArrayForDiv(test.arr, test.arr[g - 1].loopid)].height - test.arr[g].toppos);
                //console.log(shiftoffset);
                shift -= shiftoffset;
            }
            test.arr[g].toppos += shift;
            test.arr[g].div.style.top = test.arr[g].toppos + "px";
        }
    }
    // if it didn't land within the dropbox, DELETE IT FROM EXISTANCE
    else if (dragbit.length > 0) {
        for (var c = 0; c < dragbit.length; c++)
            dragbit[c].selected.parentNode.removeChild(dragbit[c].selected);
    }
}

function doit(selected, index, top, left, inloop, loopid, bref, lay) {
    if (hasClass(selected, "move")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new MoveFunct(), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "rotateleft")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new RotateLeftFunct(), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "rotateright")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new RotateRightFunct(), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "cangof")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new CanMoveFunct("forward"), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "cangob")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new CanMoveFunct("backward"), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "cangol")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new CanMoveFunct("left"), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "cangor")) {
        test.arr.splice(index, 0, new Piece(left, lay, top, new CanMoveFunct("right"), selected.id, selected, blockhei, inloop, loopid, bref, false));
    } else if (hasClass(selected, "repeatf")) {
        var trect = selected.getBoundingClientRect();
        test.arr.splice(index, 0, new Piece(left, lay, top, new RepeatForeverFunct(), selected.id, selected, trect.bottom - trect.top, inloop, loopid, bref, true));
    } else if (hasClass(selected, "repeat")) {
        var second = selected.id.substring(2);
        var trect = selected.getBoundingClientRect();
        test.arr.splice(index, 0, new Piece(left, lay, top, new RepeatFunct("tp" + second), selected.id, selected, trect.bottom - trect.top, inloop, loopid, bref, true));
    } else if (hasClass(selected, "if")) {
        var second = selected.id.substring(2);
        var trect = selected.getBoundingClientRect();
        test.arr.splice(index, 0, new Piece(left, lay, top, new IfFunct("id" + second), selected.id, selected, trect.bottom - trect.top, inloop, loopid, bref, true));
    } else if (hasClass(selected, "elseif")) {
        var second = selected.id.substring(2);
        var trect = selected.getBoundingClientRect();
        test.arr.splice(index, 0, new Piece(left, lay, top, new ElseIfFunct("ed" + second), selected.id, selected, trect.bottom - trect.top, inloop, loopid, bref, true));
    } else if (hasClass(selected, "else")) {
        var trect = selected.getBoundingClientRect();
        test.arr.splice(index, 0, new Piece(left, lay, top, new ElseFunct(), selected.id, selected, trect.bottom - trect.top, inloop, loopid, bref, true));
    }
    if (!hasClass(selected, "used"))
        addClass(selected, "used");
}

function duplicate(theid) {
    var original = document.getElementById(theid);
    var clone = original.cloneNode(true); // "deep" clone
    var first = original.id.substring(0, 2);
    var second = original.id.substring(2);
    clone.id = first + ++second;
    original.parentNode.appendChild(clone);
    original = document.getElementById(clone.id);
    original.addEventListener("mousedown", function() {
        drag_init(this);
        return false;
    })
    if (first === "rp") {
        var secondd = original.childNodes[0].childNodes[2].nextSibling.id.substring(2);
        secondd = parseInt(secondd, 10);
        original.childNodes[0].childNodes[2].nextSibling.id = "tp" + ++secondd;
        document.getElementById("tp" + secondd).addEventListener('mouseenter', function() {
            isOverTextBox = true;
        })
        document.getElementById("tp" + secondd).addEventListener('mouseleave', function() {
            isOverTextBox = false;
        })
    } else if (first === "if") {
        var secondd = original.childNodes[0].childNodes[2].nextSibling.id.substring(2);
        secondd = parseInt(secondd, 10);
        original.childNodes[0].childNodes[2].nextSibling.id = "id" + ++secondd;
        document.getElementById("id" + secondd).addEventListener('mouseenter', function() {
            isOverTextBox = true;
        })
        document.getElementById("id" + secondd).addEventListener('mouseleave', function() {
            isOverTextBox = false;
        })
    } else if (first === "ei") {
        var secondd = original.childNodes[0].childNodes[2].nextSibling.id.substring(2);
        secondd = parseInt(secondd, 10);
        original.childNodes[0].childNodes[2].nextSibling.id = "ed" + ++secondd;
        document.getElementById("ed" + secondd).addEventListener('mouseenter', function() {
            isOverTextBox = true;
        })
        document.getElementById("ed" + secondd).addEventListener('mouseleave', function() {
            isOverTextBox = false;
        })
    }
}


//fires after mouseup from the bot, gets the bot to snap to grid
function snap() {
    if (dragbit[0].selected) {
        var rect = c.getBoundingClientRect();
        if (x_pos > rect.left + window.scrollX && x_pos < rect.right + window.scrollX && y_pos > rect.top + window.scrollY && y_pos < rect.bottom + window.scrollY) {
            var xoffset = x_pos - rect.left - window.scrollX;
            var xinarray = (xoffset - xoffset % blockWid) / blockWid;
            var yoffset = y_pos - rect.top - window.scrollY;
            var yinarray = (yoffset - yoffset % blockWid) / blockWid;
            if (!m.grid[xinarray][yinarray].obstacle) {

                dragbit[0].selected.style.left = xinarray * blockWid + rect.left + window.scrollX + "px";
                dragbit[0].selected.style.top = yinarray * blockWid + rect.top + window.scrollY + "px";
                bot.xarrpos = xinarray;
                bot.yarrpos = yinarray;
            }
        } else {
            dragbit[0].selected.style.left = "380px";
            dragbit[0].selected.style.top = '90px';
        }
    }
}

//eventlisteners ---------------------------------------------------------------------------


//buttons to control the bot
document.getElementById("movebtn").addEventListener("click", function() {
    bot.move();
});
document.getElementById("leftrbtn").addEventListener("click", function() {
    bot.rotateLeft();
});
document.getElementById("rightrbtn").addEventListener("click", function() {
    bot.rotateRight();
});
document.getElementById("forwardbtn").addEventListener("click", function() {
    if (bot.canmove("forward", false))
        alert("good to go!");
});
document.getElementById("backwardbtn").addEventListener("click", function() {
    if (bot.canmove("backward", false))
        alert("good to go!");

});
document.getElementById("rightbtn").addEventListener("click", function() {
    if (bot.canmove("right", false))
        alert("good to go!");

});
document.getElementById("leftbtn").addEventListener("click", function() {
    if (bot.canmove("left", false))
        alert("good to go!");
});

document.getElementById('bot').onmousedown = function() {
    drag_init(this);
    return false;
};
document.onmousemove = move_elem;
document.onmouseup = destroy;

document.getElementById("compileact").addEventListener("click", compileActions);
document.getElementById("stop").addEventListener("click", stopActions);

var classname = document.getElementsByClassName("piece");
for (var i = 0; i < classname.length; i++) {

    classname[i].addEventListener("mousedown", function() {
        drag_init(this);
        return false;
    })
}
classname = document.getElementsByClassName("outer");
for (var i = 0; i < classname.length; i++) {

    classname[i].addEventListener("mousedown", function() {
        drag_init(this);
        return false;
    })
}
document.getElementById("tp1").addEventListener('mouseenter', function() {
    isOverTextBox = true;
})
document.getElementById("tp1").addEventListener('mouseleave', function() {
    isOverTextBox = false;
})
document.getElementById("id1").addEventListener('mouseenter', function() {
    isOverTextBox = true;
})
document.getElementById("id1").addEventListener('mouseleave', function() {
    isOverTextBox = false;
})
document.getElementById("ed1").addEventListener('mouseenter', function() {
    isOverTextBox = true;
})
document.getElementById("ed1").addEventListener('mouseleave', function() {
    isOverTextBox = false;
})
