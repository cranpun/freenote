module.exports = {
    draw: draw,
    clear: clear,
    initOnReady: initOnReady
}

var paperCtx;
var preX;
var preY;
var RGBColor = require("rgbcolor");

function initOnReady() {
    // サイズ調整
    var wrap = $("#sense_area_wrap");
    var canv = $("#sense_area");
    canv.attr("width", wrap.width() - 30);
    canv.attr("height", wrap.height() - 30);

    // jQueryオブジェクトではなくDOMを取得。
    var c = canv[0];
    // DOMのgetContextを取得
    paperCtx = c.getContext("2d");

    // 初期化
    clear();

    test_logdraw();
}

function test_logdraw() {
    // サイズ調整
    var wrap = $("#sense_area_wrap");
    var canv = $("#sense_area_log");
    canv.attr("width", wrap.width() - 30);
    canv.attr("height", wrap.height() - 30);

    // 退避
    var tmp = paperCtx;

    // 上書き用のキャンバス
    paperCtx = canv[0].getContext("2d");

    draw(10, 10);
    draw(20, 10);
    draw(20, 20);
    draw(10, 20);
    draw(10, 10);
    drawProc(20, 20, "del", "");

    paperCtx = tmp;
}

function draw(x, y) {
    var clr = getColor();
    var tool = getTool();
    drawProc(x, y, tool, clr);
}

function drawProc(x, y, tool, clr) {
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
        paperCtx.clearRect(x - 5, y - 5, 10, 10);
    }

    // 現在の位置を保存
    preX = x;
    preY = y;
}

function clear() {
    preX = null;
    preY = null;
}


function getTool() {
    return $("[name='tool']:checked").val();
}

function getColor() {
    return new RGBColor($("#penclr").css("background-color")).toHex();
}
