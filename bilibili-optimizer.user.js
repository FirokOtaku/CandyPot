// ==UserScript==
// @name         B 站优化
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  优化 B 站布局, 清理无用控件
// @author       Firok
// @match        *.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    setTimeout(() => {
        const domStyle = document.createElement('style')
        domStyle.innerHTML = `
    .v-popover-content.header-favorite-popover
{
    height: calc(100vh - 80px) !important;
    max-height: calc(100vh - 80px) !important;
}

.video-sections-content-list
{
    height: 400px !important;
    min-height: 400px !important;
    max-height: 400px !important;
}

.container>*:nth-of-type(n + 8)
{
    margin-top: 0 !important;
}
`
        document.head.appendChild(domStyle)
    }, 1000)

    function remove(dom)
    {
        dom.parentElement.removeChild(dom)
    }

    function collectRemovingHeader()
    {
        const ret = []
        const listPopWrap = [...document.getElementsByClassName('v-popover-wrap')]
        for(const elePopWrap of listPopWrap)
        {
            function shouldRemove(text)
            {
                switch (text)
                {
                    case '游戏中心':
                    case '创作中心':
                    case '会员购':
                    case '漫画':
                    case '直播':
                    case '赛事':
                    case '大会员':
                    case '下载客户端':
                    case '这一年':
                    case '推荐服务':
                    case '动态':
                    case '投稿':
                        return true
                    default:
                        return false
                }
            }
            if(shouldRemove(elePopWrap.textContent) || shouldRemove(elePopWrap.innerText))
            {
                ret.push({
                    type: `header`,
                    dom: elePopWrap,
                    caption: `Header - ${elePopWrap.textContent} - ${elePopWrap.innerText}`,
                })
            }
        }
        return ret
    }

    function collectRemovingCard()
    {
        const ret = []
        const listLivingCard = [
            ...document.getElementsByClassName('bili-live-card'),
            ...document.getElementsByClassName('floor-single-card'),
        ]
        for(const card of listLivingCard)
        {
            ret.push({
                type: 'living',
                dom: card,
                caption: `Card - ${card.textContent}`
            })
        }
        const listEmptyCard = [
            ...document.getElementsByClassName('bili-video-card'),
            ...document.getElementsByClassName('feed-card'),
        ]
        for(const card of listEmptyCard)
        {
            if(card.innerText === '')
            {
                ret.push({
                    type: 'empty',
                    dom: card,
                    caption: `Empty - ${card.textContent}`,
                })
            }
        }
        return ret
    }

    function collectRemovingCarousel()
    {
        const ret = []
        const list = [
            ...document.getElementsByClassName('carousel-area'),
            ...document.getElementsByClassName('recommended-swipe-core'),
            ...document.getElementsByClassName('recommended-swipe'),
        ]
        for(const ca of list)
        {
            ret.push({
                type: 'carousel',
                dom: ca,
                caption: `Carousel`,
            })
        }
        return ret
    }

    function collectRemovingAd()
    {
        const ret = []
        const list = [
            ...document.getElementsByClassName('ad-report'),
            ...document.getElementsByClassName('ad-floor-exp'),
        ]
        for(const ad of list)
        {
            ret.push({
                type: 'ad',
                dom: ad,
                caption: `Ad - ${ad.textContent}`,
            })
        }

        return ret
    }

    function collectBlocked()
    {
        ;
    }

    const threadRemoval = setInterval(() => {
        for(let info of [
            ...collectRemovingHeader(),
            ...collectRemovingCard(),
            ...collectRemovingCarousel(),
            ...collectRemovingAd(),
        ])
        {
            try
            {
                remove(info.dom)
                console.log(`移除元素: `, info.caption)
            }
            catch (ignored) { }

        }
    }, 2000);
})();
