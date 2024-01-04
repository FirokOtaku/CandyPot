// ==UserScript==
// @name         小黑盒优化
// @homepage     https://github.com/FirokOtaku/CandyPot
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  优化小黑盒布局, 允许复制文字和图片内容, 隐藏 APP 下载按钮
// @author       Firok
// @match        *.xiaoheihe.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoheihe.cn
// @grant        none
// ==/UserScript==

/**
 * - 0.1.0
 *   - 允许复制文字和图片内容
 *   - 隐藏 APP 下载按钮
 * */
(function() {
    'use strict'

    // Your code here...
    const style = document.createElement('style')
    style.innerText = `
* {
    user-select: auto !important;
}
.hb-share-header, .hb-qrc, .app-btn
{
    display: none !important;
}
`
    document.body.appendChild(style)
})();
