/**
 * interface
 */
module.exports = {
    initOnReady: initOnReady
}

// 発生したデバイス：座標取得に利用。mouse, touch
var nowdevice;
// 現在のツール
var nowtool;
// 現在の位置：up / down
var nowpos;

// 図描画オブジェクト
var paper = require("./paper.js");

function initOnReady() {
    // 現在の状態を初期化
    nowdevice = null;
    nowtool = "pen";

    var area = $("#sense_area");

    setHandlerMouse(area, "mouseup");
    setHandlerMouse(area, "mousedown");
    setHandlerMouse(area, "mousemove");
    setHandlerMouse(area, "mouseleave");
}

function getXY(dev, e) {
    if (dev == "touch") {
        var oe = e.changedTouches[0];
        return { x: oe.pageX, y: oe.pageY }
    } else {
        var oe = e.originalEvent;
        return { x: oe.offsetX, y: oe.offsetY };
    }
}

function setHandlerMouse(area, elabel) {
    area.on(elabel, function (e) {
        // タッチが先に検知されるので優先する。
        if (nowdevice != "touch") {
            nowdevice = "mouse";
            xy = getXY(nowdevice, e);
            tool = getTool();
            clr = getColor();

            // 位置の更新
            if (elabel == "mouseup") {
                nowpos = "up";
            } else if (elabel == "mousedown") {
                nowpos = "down";
            } else if (elabel == "mouseleave") {
                // 設置したまま外に出た場合は離したとみなす。
                nowpos = "up"
            }

            // 現在の位置に従って描画
            if (nowpos == "down") {
                paper.draw(xy.x, xy.y, tool, clr);
            } else {
                paper.clear();
            }
        }
        // 一通りのイベント検知が終わったのでdeviceをnullに。
        // 次に、マウスイベントが拾えるように。 
        nowdevice = null;
    });
}

function setHandlerTouch(area, elabel) {
    area.on(elabel, function (e) {
        e.preventDefault();
        nowdevice = "touch";
        xy = getXY(nowdevice, e);
        tool = getTool();
        clr = getColor();

        if (elabel == "touchend") {
            nowpos = "up";
        } else if (elabel == "touchstart") {
            nowpos = "down";
        } else if (elabel == "touchleave") {
            // 領域の外に出たら終了
            nowpos = "up"
        }
        
        // 現在の位置に従って描画
        if (nowpos == "down") {
            paper.draw(xy.x, xy.y, tool, clr);
        } else {
            paper.clear();
        }

    });
}


function getTool() {
    return $("[name='tool']:checked").val();
}

function getColor() {
    return "#FFFFFF";
}