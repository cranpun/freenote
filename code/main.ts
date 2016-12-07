import * as $ from 'jquery';
import {Paper} from "./Paper";
import {Sense} from "./Sense";

$(function () {
    let p = new Paper();
    let s = new Sense(p);
    s.setHandler();
});
