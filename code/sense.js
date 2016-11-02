/**
 * interface
 */
module.exports = {
    initOnReady: initOnReady
}

var nowevent;
var nowdevice;
var nowpos;
var nowtime;
var nowtool;
var paper = require("./paper.js");

function initOnReady() {
    nowevent = null;
    nowdevice = null;
    nowtime = null;
    nowpos = "move";
    var area = $("#sense_area");

    setHandlerMouse(area, "mouseup");
    setHandlerMouse(area, "mousedown");
    setHandlerMouse(area, "mousemove");   
}

function getXY(dev, e) {
    if(dev == "touch") {
        var oe = e.changedTouches[0];
        return {x: oe.pageX, y: oe.pageY}
    } else {
        var oe = e.originalEvent;
        return {x: oe.offsetX, y: oe.offsetY};
    }   
}
function addLog(dev, elabel, time, tool, e) {
    var xy = getXY(dev, e);
    var logs = $("#logs");
    if(nowtime == null) {
        var diff = "－";
    } else {
        var diff = moment(time).diff(nowtime);
    }
    var tddev = "<td class='hdn'>" + dev + "</td>";
    var tdevent = "<td>" + elabel + "</td>";
    var tdxy = "<td>(" + xy.x + "," + xy.y + ")</td>";
    var tdtime = "<td>" + time + "("+ diff + "msec)</td>";
    var tdtool = "<td>" + tool + "</td>";
    var log = "<tr>" + tddev + tdtime + tdevent + tdtool + tdxy + "</tr>";
    logs.prepend(log);
    // touchなら表示
    if(elabel == "touch") {
        paper.draw(xy.x, xy.y, tool);
    } else {
        paper.clear();
    }
}
function setHandlerMouse(area, elabel) {
    area.on(elabel, function(e) {
        if(nowdevice == null || (nowdevice != "pointer" && nowdevice != "touch")) {
            nowdevice = "mouse";
            nowevent = elabel;
            if(elabel == "mouseup") {
                nowpos = "move";
            } else if(elabel == "mousedown"){
                nowpos = "touch";
            }
            sensetime = moment().format("YYYY-MM-DD HH:mm:ss.SSSS");
            nowtool = $("[name='tool']:checked").val();
            addLog(nowdevice, nowpos, sensetime,nowtool, e);
            nowtime = sensetime;
        } else {
            nowdevice = null;
            nowevent = null;
        }
    });
}

