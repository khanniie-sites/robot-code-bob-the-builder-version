function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

var classname = document.getElementsByClassName("piece");
for (var i = 0; i < classname.length; i++) {

    classname[i].addEventListener("mousedown", function() {
        drag_init(this);
        return false;
    })
}

document.onmousemove = move_elem;

var selected = null,
    x_pos = 0,
    y_pos = 0,
    x_elem = 0,
    y_elem = 0;

function drag_init(elem) {
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

function move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}
function destroy(){
    if(selected === b){
        snap();
    }
    else{
        snapB();
    }
    selected = null;
}

//fires after mouseup from the bot, gets the bot to snap to grid
function snapB() {
    if (selected != null) {
        if(test.arr.length < 1){
            test.arr.push(new Piece(-200, 23, new MoveFunct(), selected.id));
        }
        else{
            var lastpiece = test.arr[test.arr.length-1];
        if (hasClass(selected, "move")) {
            test.arr.push(new Piece(-200, lastpiece.toppos + 23, new MoveFunct(), selected.id));
        }
        else if (hasClass(selected, "rotateleft")) {
            test.arr.push(new Piece(-200, lastpiece.toppos + 23, new RotateLeftFunct(), selected.id));
        }
        else if (hasClass(selected, "rotateright")) {
            test.arr.push(new Piece(-200, lastpiece.toppos + 23, new RotateRightFunct(), selected.id));
        }
        else if (hasClass(selected, "canmove")) {
            test.arr.push(new Piece(-200, lastpiece.toppos + 23, new CanMoveFunct("forward"), selected.id));
        }
        }    
        selected.style.top = test.arr[test.arr.length-1].toppos + "px";
        selected.style.left = test.arr[test.arr.length-1].leftpos + "px";
        selected = null;
    }

}

function duplicate(theid) {
    var original = document.getElementById(theid);
    var clone = original.cloneNode(true); // "deep" clone
    var first = original.id.substring(0,2);
    var second = original.id.substring(2);
    clone.id = first + ++second;
    // or clone.id = ""; if the divs don't need an ID
    original.parentNode.appendChild(clone);
    original = document.getElementById(clone.id);
    original.addEventListener("mousedown", function() {
        drag_init(this);
        return false;
    })

}

//drag and drop for bot placement
var selected = null,
    x_pos = 0,
    y_pos = 0,
    x_elem = 0,
    y_elem = 0;

function drag_init(elem) {
    selected = elem;
    if(selected!=b)
    duplicate(selected.id);
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

function move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}
//fires after mouseup from the bot, gets the bot to snap to grid
function snap() {
    if (selected) {
        var rect = c.getBoundingClientRect();
        var xoffset = x_pos - rect.left;
        var xinarray = (xoffset - xoffset % blockWid) / blockWid;
        var yoffset = y_pos - rect.top;
        var yinarray = (yoffset - yoffset % blockWid) / blockWid;

        if (!m.grid[xinarray][yinarray].obstacle && x_pos > rect.left && x_pos < rect.right && y_pos > rect.top && y_pos < rect.bottom) {
            selected.style.left = xinarray * blockWid + rect.left + "px";
            selected.style.top = yinarray * blockWid + rect.top + "px";
            bot.xarrpos = xinarray;
            bot.yarrpos = yinarray;
        } else {
            selected.style.left = "380px";
            selected.style.top = '90px';
        }
    }
    selected = null;
}

//buttons to control the bot
document.getElementById("move").addEventListener("click", function() {
    bot.move();
});
document.getElementById("left").addEventListener("click", function() {
    bot.rotateLeft();
});
document.getElementById("right").addEventListener("click", function() {
    bot.rotateRight();
});
document.getElementById("forward").addEventListener("click", function() {
    if (bot.canmove("forward")) {
        alert("good to go!");
    }
});
document.getElementById("backward").addEventListener("click", function() {
    if (bot.canmove("backward")) {
        alert("good to go!");
    }
});
document.getElementById("rightt").addEventListener("click", function() {
    if (bot.canmove("right")) {
        alert("good to go!");
    }
});
document.getElementById("leftt").addEventListener("click", function() {
    if (bot.canmove("left")) {
        alert("good to go!");
    }
});



document.getElementById('bot').onmousedown = function() {
    drag_init(this);
    return false;
};
document.getElementById('bot').onmouseup = function() {
    snap();
};
document.onmousemove = move_elem;
document.onmouseup = destroy;

document.getElementById("compileact").addEventListener("click", compileActions);

