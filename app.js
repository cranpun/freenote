/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var sense = __webpack_require__(1);
	var paper = __webpack_require__(2);
	$(function() {
	    sense.initOnReady();
	    paper.initOnReady();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
	var paper = __webpack_require__(2);
	
	function initOnReady() {
	    // 現在の状態を初期化
	    nowdevice = null;
	    nowtool = "pen";
	
	    var area = $("#sense_area");
	
	    setHandlerMouse(area, "mouseup");
	    setHandlerMouse(area, "mousedown");
	    setHandlerMouse(area, "mousemove");
	    setHandlerMouse(area, "mouseleave");
	
	    setHandlerTouch(area, "touchstart");
	    setHandlerTouch(area, "touchleave");
	    setHandlerTouch(area, "touchmove");
	    setHandlerTouch(area, "touchend");
	}
	
	function getXY(dev, e) {
	    if (dev == "touch") {
	        var oe = e.originalEvent.changedTouches[0];
	        var tg = e.target.getBoundingClientRect();
	        return { x: oe.clientX - tg.left, y: oe.clientY - tg.top }
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
	                paper.draw(xy.x, xy.y);
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
	            paper.draw(xy.x, xy.y);
	        } else {
	            paper.clear();
	        }
	
	    });
	}
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    draw: draw,
	    clear: clear,
	    initOnReady: initOnReady
	}
	
	var paperCtx;
	var preX;
	var preY;
	var RGBColor = __webpack_require__(3);
	
	function initOnReady() {
	    // サイズ調整
	    var wrap = $("#sense_area_wrap");
	
	    // 高さの調節
	    var wh = $(window).height();
	    // // 上部の15px、下部の15px、コントローラの34px、さらにborderの上15px、下15pxを除く
	    var wph = wh - 15 - 15 - 34 - 15 - 15;
	    wrap.height(wph);
	
	    var canv = $("#sense_area");
	    canv.attr("width", wrap.width());
	    canv.attr("height", wrap.height());
	
	    // バタバタするのを避けるために非表示にしてたのを復帰
	    wrap.css("display", "block");
	
	    // jQueryオブジェクトではなくDOMを取得。
	    var c = canv[0];
	    // DOMのgetContextを取得
	    paperCtx = c.getContext("2d");
	
	    // 初期化
	    clear();
	
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
	        paperCtx.clearRect(x - 10, y - 10, 20, 20);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		Based on rgbcolor.js by Stoyan Stefanov <sstoo@gmail.com>
		http://www.phpied.com/rgb-color-parser-in-javascript/
	*/
	
	module.exports = function(color_string) {
	    this.ok = false;
	    this.alpha = 1.0;
	
	    // strip any leading #
	    if (color_string.charAt(0) == '#') { // remove # if any
	        color_string = color_string.substr(1,6);
	    }
	
	    color_string = color_string.replace(/ /g,'');
	    color_string = color_string.toLowerCase();
	
	    // before getting into regexps, try simple matches
	    // and overwrite the input
	    var simple_colors = {
	        aliceblue: 'f0f8ff',
	        antiquewhite: 'faebd7',
	        aqua: '00ffff',
	        aquamarine: '7fffd4',
	        azure: 'f0ffff',
	        beige: 'f5f5dc',
	        bisque: 'ffe4c4',
	        black: '000000',
	        blanchedalmond: 'ffebcd',
	        blue: '0000ff',
	        blueviolet: '8a2be2',
	        brown: 'a52a2a',
	        burlywood: 'deb887',
	        cadetblue: '5f9ea0',
	        chartreuse: '7fff00',
	        chocolate: 'd2691e',
	        coral: 'ff7f50',
	        cornflowerblue: '6495ed',
	        cornsilk: 'fff8dc',
	        crimson: 'dc143c',
	        cyan: '00ffff',
	        darkblue: '00008b',
	        darkcyan: '008b8b',
	        darkgoldenrod: 'b8860b',
	        darkgray: 'a9a9a9',
	        darkgreen: '006400',
	        darkkhaki: 'bdb76b',
	        darkmagenta: '8b008b',
	        darkolivegreen: '556b2f',
	        darkorange: 'ff8c00',
	        darkorchid: '9932cc',
	        darkred: '8b0000',
	        darksalmon: 'e9967a',
	        darkseagreen: '8fbc8f',
	        darkslateblue: '483d8b',
	        darkslategray: '2f4f4f',
	        darkturquoise: '00ced1',
	        darkviolet: '9400d3',
	        deeppink: 'ff1493',
	        deepskyblue: '00bfff',
	        dimgray: '696969',
	        dodgerblue: '1e90ff',
	        feldspar: 'd19275',
	        firebrick: 'b22222',
	        floralwhite: 'fffaf0',
	        forestgreen: '228b22',
	        fuchsia: 'ff00ff',
	        gainsboro: 'dcdcdc',
	        ghostwhite: 'f8f8ff',
	        gold: 'ffd700',
	        goldenrod: 'daa520',
	        gray: '808080',
	        green: '008000',
	        greenyellow: 'adff2f',
	        honeydew: 'f0fff0',
	        hotpink: 'ff69b4',
	        indianred : 'cd5c5c',
	        indigo : '4b0082',
	        ivory: 'fffff0',
	        khaki: 'f0e68c',
	        lavender: 'e6e6fa',
	        lavenderblush: 'fff0f5',
	        lawngreen: '7cfc00',
	        lemonchiffon: 'fffacd',
	        lightblue: 'add8e6',
	        lightcoral: 'f08080',
	        lightcyan: 'e0ffff',
	        lightgoldenrodyellow: 'fafad2',
	        lightgrey: 'd3d3d3',
	        lightgreen: '90ee90',
	        lightpink: 'ffb6c1',
	        lightsalmon: 'ffa07a',
	        lightseagreen: '20b2aa',
	        lightskyblue: '87cefa',
	        lightslateblue: '8470ff',
	        lightslategray: '778899',
	        lightsteelblue: 'b0c4de',
	        lightyellow: 'ffffe0',
	        lime: '00ff00',
	        limegreen: '32cd32',
	        linen: 'faf0e6',
	        magenta: 'ff00ff',
	        maroon: '800000',
	        mediumaquamarine: '66cdaa',
	        mediumblue: '0000cd',
	        mediumorchid: 'ba55d3',
	        mediumpurple: '9370d8',
	        mediumseagreen: '3cb371',
	        mediumslateblue: '7b68ee',
	        mediumspringgreen: '00fa9a',
	        mediumturquoise: '48d1cc',
	        mediumvioletred: 'c71585',
	        midnightblue: '191970',
	        mintcream: 'f5fffa',
	        mistyrose: 'ffe4e1',
	        moccasin: 'ffe4b5',
	        navajowhite: 'ffdead',
	        navy: '000080',
	        oldlace: 'fdf5e6',
	        olive: '808000',
	        olivedrab: '6b8e23',
	        orange: 'ffa500',
	        orangered: 'ff4500',
	        orchid: 'da70d6',
	        palegoldenrod: 'eee8aa',
	        palegreen: '98fb98',
	        paleturquoise: 'afeeee',
	        palevioletred: 'd87093',
	        papayawhip: 'ffefd5',
	        peachpuff: 'ffdab9',
	        peru: 'cd853f',
	        pink: 'ffc0cb',
	        plum: 'dda0dd',
	        powderblue: 'b0e0e6',
	        purple: '800080',
	        rebeccapurple: '663399',
	        red: 'ff0000',
	        rosybrown: 'bc8f8f',
	        royalblue: '4169e1',
	        saddlebrown: '8b4513',
	        salmon: 'fa8072',
	        sandybrown: 'f4a460',
	        seagreen: '2e8b57',
	        seashell: 'fff5ee',
	        sienna: 'a0522d',
	        silver: 'c0c0c0',
	        skyblue: '87ceeb',
	        slateblue: '6a5acd',
	        slategray: '708090',
	        snow: 'fffafa',
	        springgreen: '00ff7f',
	        steelblue: '4682b4',
	        tan: 'd2b48c',
	        teal: '008080',
	        thistle: 'd8bfd8',
	        tomato: 'ff6347',
	        turquoise: '40e0d0',
	        violet: 'ee82ee',
	        violetred: 'd02090',
	        wheat: 'f5deb3',
	        white: 'ffffff',
	        whitesmoke: 'f5f5f5',
	        yellow: 'ffff00',
	        yellowgreen: '9acd32'
	    };
	    color_string = simple_colors[color_string] || color_string;
	    // emd of simple type-in colors
	
	    // array of color definition objects
	    var color_defs = [
	        {
	            re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
	            example: ['rgba(123, 234, 45, 0.8)', 'rgba(255,234,245,1.0)'],
	            process: function (bits){
	                return [
	                    parseInt(bits[1]),
	                    parseInt(bits[2]),
	                    parseInt(bits[3]),
	                    parseFloat(bits[4])
	                ];
	            }
	        },
	        {
	            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
	            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
	            process: function (bits){
	                return [
	                    parseInt(bits[1]),
	                    parseInt(bits[2]),
	                    parseInt(bits[3])
	                ];
	            }
	        },
	        {
	            re: /^(\w{2})(\w{2})(\w{2})$/,
	            example: ['#00ff00', '336699'],
	            process: function (bits){
	                return [
	                    parseInt(bits[1], 16),
	                    parseInt(bits[2], 16),
	                    parseInt(bits[3], 16)
	                ];
	            }
	        },
	        {
	            re: /^(\w{1})(\w{1})(\w{1})$/,
	            example: ['#fb0', 'f0f'],
	            process: function (bits){
	                return [
	                    parseInt(bits[1] + bits[1], 16),
	                    parseInt(bits[2] + bits[2], 16),
	                    parseInt(bits[3] + bits[3], 16)
	                ];
	            }
	        }
	    ];
	
	    // search through the definitions to find a match
	    for (var i = 0; i < color_defs.length; i++) {
	        var re = color_defs[i].re;
	        var processor = color_defs[i].process;
	        var bits = re.exec(color_string);
	        if (bits) {
	            var channels = processor(bits);
	            this.r = channels[0];
	            this.g = channels[1];
	            this.b = channels[2];
	            if (channels.length > 3) {
	                this.alpha = channels[3];
	            }
	            this.ok = true;
	        }
	
	    }
	
	    // validate/cleanup values
	    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
	    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
	    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
	    this.alpha = (this.alpha < 0) ? 0 : ((this.alpha > 1.0 || isNaN(this.alpha)) ? 1.0 : this.alpha);
	
	    // some getters
	    this.toRGB = function () {
	        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
	    }
	    this.toRGBA = function () {
	        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.alpha + ')';
	    }
	    this.toHex = function () {
	        var r = this.r.toString(16);
	        var g = this.g.toString(16);
	        var b = this.b.toString(16);
	        if (r.length == 1) r = '0' + r;
	        if (g.length == 1) g = '0' + g;
	        if (b.length == 1) b = '0' + b;
	        return '#' + r + g + b;
	    }
	
	    // help
	    this.getHelpXML = function () {
	
	        var examples = new Array();
	        // add regexps
	        for (var i = 0; i < color_defs.length; i++) {
	            var example = color_defs[i].example;
	            for (var j = 0; j < example.length; j++) {
	                examples[examples.length] = example[j];
	            }
	        }
	        // add type-in colors
	        for (var sc in simple_colors) {
	            examples[examples.length] = sc;
	        }
	
	        var xml = document.createElement('ul');
	        xml.setAttribute('id', 'rgbcolor-examples');
	        for (var i = 0; i < examples.length; i++) {
	            try {
	                var list_item = document.createElement('li');
	                var list_color = new RGBColor(examples[i]);
	                var example_div = document.createElement('div');
	                example_div.style.cssText =
	                        'margin: 3px; '
	                        + 'border: 1px solid black; '
	                        + 'background:' + list_color.toHex() + '; '
	                        + 'color:' + list_color.toHex()
	                ;
	                example_div.appendChild(document.createTextNode('test'));
	                var list_item_value = document.createTextNode(
	                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
	                );
	                list_item.appendChild(example_div);
	                list_item.appendChild(list_item_value);
	                xml.appendChild(list_item);
	
	            } catch(e){}
	        }
	        return xml;
	
	    }
	
	}


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map