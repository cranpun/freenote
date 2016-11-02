module.exports = {
    draw: draw,
    clear: clear,
    initOnReady: initOnReady
}

var paperCtx;
var preX;
var preY;
var RGBColor = require("rgbcolor");
var delclr = "#003200"; 

function initOnReady() {
    // サイズ調整
    var wrap = $("#sense_area_wrap");
    var canv = $("#sense_area");
    canv.attr("width", wrap.width());
    canv.attr("height", wrap.height());

    // 消しゴム色＝背景色を取得
    rgbc = new RGBColor(wrap.css("background-color"));
    delclr = rgbc.toHex(); 

    // jQueryオブジェクトではなくDOMを取得。
    var c = canv[0];
    // DOMのgetContextを取得
    paperCtx = c.getContext("2d");

    // 初期化
    clear();
}

function draw(x, y, tool, clr) {
    console.log("draw");
    paperCtx.beginPath();
    if (preX == null) {
        // 最初のポイント
        paperCtx.moveTo(x, y);
    } else {
        // 次のポイントなので前回の位置を初期値に。
        paperCtx.moveTo(preX, preY);
    }

    if (tool == "pen") {
        paperCtx.lineTo(x, y);
        paperCtx.lineCap = "round";
        paperCtx.lineWidth = 2;
        paperCtx.strokeStyle = clr;
        paperCtx.stroke();
    } else if(tool == "del") {
        paperCtx.lineTo(x, y);
        paperCtx.lineCap = "round";
        paperCtx.lineWidth = 20;
        paperCtx.strokeStyle = delclr;
        paperCtx.stroke();
    }

    // 現在の位置を保存
    preX = x;
    preY = y;
}

function clear() {
    console.log("clear");
    preX = null;
    preY = null;
}