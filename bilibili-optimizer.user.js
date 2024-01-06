// ==UserScript==
// @name         B 站优化
// @homepage     https://github.com/FirokOtaku/CandyPot
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  优化 B 站布局, 清理部分广告和无用内容
// @author       Firok
// @match        *.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

/*
* - 0.6.0
*   - 现在会清理 **稍后再看** 页面的标题栏
* */
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

.bili-feed4-layout
{
    padding-bottom: 160px;
}
`
        document.head.appendChild(domStyle)
    }, 1000)

    function remove(dom)
    {
        dom.parentElement.removeChild(dom)
    }
    function hide(dom)
    {
        if(dom.style.display !== 'none')
        {
            dom.style.display = 'none'
            dom.style.width = '0'
            dom.style.height = '0'
            dom.style.maxWidth = '0'
            dom.style.maxHeight = '0'
            dom.style.maxInlineSize = '0'
            dom.style.maxBlockSize = '0'
            return true
        }
        return false
    }

    function collectRemovingHeader()
    {
        function shouldRemove(text = '')
        {
            const listTextToRemove = [
                '游戏中心',
                '创作中心',
                '会员购',
                '漫画',
                '直播',
                '赛事',
                '大会员',
                '下载客户端',
                '这一年',
                '世冠',
                '推荐服务',
                // '动态',
                '投稿',
                '百大',
                '来唱歌',
                '大会员',
            ]
            for(const textToRemove of listTextToRemove)
            {
                if(text === textToRemove)
                    return true
            }
            if(text.includes('来跨年'))
                return true
            return false
        }

        const ret = []
        const listPopWrap = [
            ...document.getElementsByClassName('v-popover-wrap'),
            ...document.getElementsByClassName('right-entry-item'),
            ...document.getElementsByClassName('nav-link-item'),
        ]
        for(const elePopWrap of listPopWrap)
        {
            if(shouldRemove(elePopWrap.textContent.trim()) || shouldRemove(elePopWrap.innerText.trim()))
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
            ...document.getElementsByClassName('adblock-tips'),
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
                // remove(info.dom)
                // console.log(`移除元素: `, info.caption)
                if(hide(info.dom))
                    console.log(`隐藏元素: `, info.caption)
            }
            catch (ignored) { }

        }
    }, 2000)
    console.log(`启动页面检查清理循环完成. 如有需要手动停止维护页面请执行:\nclearInterval(${threadRemoval})`)
})();
