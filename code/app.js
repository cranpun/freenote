var nowdevice;
var nowevent;
var nowpos;

function setHandlerTouch(area, elabel) {
    area.on(elabel, function(e) {
        if(nowdevice == null || nowdevice != "pointer") {
            nowdevice = "touch";
            nowevent = elabel;
            addLog(nowdevice, elabel, e);
        } else {
            nowdevice = null;
            nowevent = null;
        }
        e.preventDefault();
    });
}

function setHandlerPointer(area, elabel) {
    area.on(elabel, function(e) {
        if(nowdevice = null) {
            nowdebice = "pointer";
            nowevent = elabel;
            addLog(nowdevice, elabel, e);
        } else {
            nowdevice = null;
            nowevent = null;
        }
        e.preventDefault();
    });
}

$(function() {
    nowevent = null;
    nowdevice = null;
    nowpos = "move";
    var area = $("#sense_area");
    var device = $("#device");
    var xy = $("#xy");

    setHandlerMouse(area, "mouseup");
    setHandlerMouse(area, "mousedown");
    setHandlerMouse(area, "mousemove");

//    setHandlerTouch(area, "touchstart");
//    setHandlerTouch(area, "touchend");
//    setHandlerTouch(area, "touchmove");

//    setHandlerPointer(area, "pointerdown");
//    setHandlerPointer(area, "pointerup");
//    setHandlerPointer(area, "pointermove");

});

