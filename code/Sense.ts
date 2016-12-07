import { CN } from "./CN";
import { Paper } from "./Paper";

export class Sense {

    // 発生したデバイス：座標取得に利用。mouse, touch
    private nowdevice: string;
    // 現在のツール
    private nowtool: string
    // 現在の位置：up / down
    private nowpos: string;

    // paper object
    private paper: Paper;

    constructor(o_paper: Paper) {
        this.paper = o_paper;
    }

    public setHandler() {
        let freenote = $(CN.cssid_freenote);
        this.setHandlerMouse_(freenote, "mouseup");
        this.setHandlerMouse_(freenote, "mousedown");
        this.setHandlerMouse_(freenote, "mousemove");
        this.setHandlerMouse_(freenote, "mouseleave");

        this.setHandlerTouch_(freenote, "touchstart");
        this.setHandlerTouch_(freenote, "touchleave");
        this.setHandlerTouch_(freenote, "touchmove");
        this.setHandlerTouch_(freenote, "touchend");
    }

    // event handlerのためアロー関数
    private setHandlerMouse_(freenote: JQuery, elabel: string): void {
        freenote.on(elabel,  (e: JQueryEventObject) => {
            
            // タッチが先に検知されるので優先する。
            if (this.nowdevice != "touch") {
                this.nowdevice = "mouse";
                let xy = this.getXY_(this.nowdevice, e);

                // 位置の更新
                if (elabel == "mouseup") {
                    this.nowpos = "up";
                } else if (elabel == "mousedown") {
                    this.nowpos = "down";
                } else if (elabel == "mouseleave") {
                    // 設置したまま外に出た場合は離したとみなす。
                    this.nowpos = "up"
                }

                // 現在の位置に従って描画
                if (this.nowpos == "down") {
                    this.paper.draw(xy.x, xy.y);
                } else {
                    this.paper.clearState();
                }
            }
            // 一通りのイベント検知が終わったのでdeviceをnullに。
            // 次に、マウスイベントが拾えるように。 
            this.nowdevice = null;
        });
    }

    // event handlerのためアロー関数
    private setHandlerTouch_ = (freenote: JQuery, elabel: string): void => {
        freenote.on(elabel, (e: JQueryEventObject) => {
            e.preventDefault();
            this.nowdevice = "touch";
            let xy = this.getXY_(this.nowdevice, e);

            if (elabel == "touchend") {
                this.nowpos = "up";
            } else if (elabel == "touchstart") {
                this.nowpos = "down";
            } else if (elabel == "touchleave") {
                // 領域の外に出たら終了
                this.nowpos = "up"
            }

            // 現在の位置に従って描画
            if (this.nowpos == "down") {
                this.paper.draw(xy.x, xy.y);
            } else {
                this.paper.clearState();
            }

        });
    }


    private getXY_(dev: string, e: JQueryEventObject) {
        if (dev == "touch") {
            let te = <TouchEvent>e.originalEvent;
            let oe = te.changedTouches[0];
            let tg = e.target.getBoundingClientRect();
            return { x: oe.clientX - tg.left, y: oe.clientY - tg.top }
        } else {
            return { x: e.offsetX, y: e.offsetY };
        }
    }
}