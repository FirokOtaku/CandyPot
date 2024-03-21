// ==UserScript==
// @name         PTable 优化
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  去除 PTable 页面上的广告
// @author       Firok
// @match        *ptable.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ptable.com
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`#Notice { display: none !important; }`)
})();
