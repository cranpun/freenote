class Paper {
    private static cssid_canvas:string = "";
    cunstructor() {

    }
}

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

    // 高さの調節
    var wh = $(window).height();
    // // 上部の15px、下部の15px、コントローラの34px、さらにborderの上15px、下15pxを除く
    var wph = wh - 15 - 15 - 15 - 15- 34;
    wrap.height(wph);
    wrap.width(wrap.width());

    var canv = $("#sense_area");
    canv.attr("width", wrap.width());
    canv.attr("height", wrap.height());

    // jQueryオブジェクトではなくDOMを取得。
    var c = canv[0];
    // DOMのgetContextを取得
    paperCtx = c.getContext("2d");

    // 初期化
    clear();

    // クリーンのハンドラ登録
    $("#clean").on("click", cleanAll);

    // test_logdraw();
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
        paperCtx.clearRect(x - 20, y - 20, 40, 40);
    }

    // 現在の位置を保存
    preX = x;
    preY = y;
}

function cleanAll() {
    var wrap = $("#sense_area_wrap");
    paperCtx.clearRect(0,0, wrap.width(), wrap.height());
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

    draw(100, 100);
    draw(200, 100);
    draw(200, 200);
    draw(100, 200);
    draw(100, 100);
    drawProc(200, 200, "del", "");

    paperCtx = tmp;
}
