import * as $ from 'jquery';
//import { RGBColor } from "./mytypes/RGBColor.d";
import { CN } from "./CN";

export class Paper {
    private preX: number;
    private preY: number;

    constructor() {
        this.initWrapHeight_();
        this.initWrapWidth_();
        this.fitWrap();
    }
    private initWrapHeight_() {
        // 画面の高さ - (topnavi + いろいろマージン）

        var wrap = $(CN.cssid_wrap_freenote);
        var h_topnav = $(CN.cssid_topnav).height();
        var h_window = $(window).height();

        // // 上部の15px、下部の15px、borderの上15px、下15pxを除く
        var height = h_window - 15 - 15 - 15 - 15 - h_topnav;
        wrap.height(height);

        // 初期化
        this.clearState();

        // クリーンのハンドラ登録
        $(CN.cssid_bt_clean).on("click", () => {
            let wrap = $(CN.cssid_wrap_freenote);
            let paperCtx = this.getContext2D_();
            paperCtx.clearRect(0, 0, wrap.width(), wrap.height());
        });
    }
    private initWrapWidth_() {
        // 横幅はCSSで自然と最大になるのでそのまま。
        var wrap = $(CN.cssid_wrap_freenote);
        wrap.width(wrap.width());
    }

    public fitWrap() {
        var canv = $(CN.cssid_freenote);
        var wrap = $(CN.cssid_wrap_freenote);
        canv.attr("width", wrap.width());
        canv.attr("height", wrap.height());
    }

    private getContext2D_() {
        var canv = $(CN.cssid_freenote);
        var dCanv = <HTMLCanvasElement>canv[0];
        return dCanv.getContext("2d");
    }

    public clearState() {
        this.preX = null;
        this.preY = null;
    }

    public draw(x, y) {
        var clr = this.getColor_();
        var tool = this.getTool_();
        this.drawProc_(x, y, tool, clr);
    }


    private drawProc_(x, y, tool, clr) {
        var paperCtx = this.getContext2D_();
        paperCtx.beginPath();
        if (this.preX == null) {
            // 最初のポイント
            paperCtx.moveTo(x, y);
        } else {
            // 次のポイントなので前回の位置を初期値に。
            paperCtx.moveTo(this.preX, this.preY);
        }

        if (tool == "pen") {
            paperCtx.lineTo(x, y);
            paperCtx.lineCap = "round";
            paperCtx.lineWidth = 2;
            paperCtx.strokeStyle = clr;
            paperCtx.stroke();
        } else if (tool == "del") {
            paperCtx.clearRect(x - 20, y - 20, 40, 40);
        }

        // 現在の位置を保存
        this.preX = x;
        this.preY = y;
    }


    private getTool_() {
        return $("[name='tool']:checked").val();
    }

    private getColor_() {
        //return new RGBColor($("#penclr").css("background-color")).toHex();
        return "#FFFFFF";
    }

}
