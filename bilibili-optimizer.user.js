// ==UserScript==
// @name         B 站优化
// @homepage     https://github.com/FirokOtaku/CandyPot
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @description  优化 B 站布局, 清理部分广告和无用内容
// @author       Firok
// @match        *.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      vue.js        https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
// @require      beer.min.css  https://cdn.jsdelivr.net/npm/beercss@3.6.8/dist/cdn/beer.min.css
// @require      beer.min.js   https://cdn.jsdelivr.net/npm/beercss@3.6.8/dist/cdn/beer.min.js
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

/*
* - 0.9.0
*   - 优化页面右上角托盘显示样式
*   - 优化信息流内容屏蔽代码
* */
(function() {
    'use strict'

    // const textVueJs = GM_getResourceText('vue.js')
    // const textBeerMinCss = GM_getResourceText('beer.min.css')
    // const textBeerMinJs = GM_getResourceText('beer.min.js')

    setTimeout(() => {
        const domStyle = document.createElement('style')
        domStyle.innerHTML = `
    .v-popover-content.header-favorite-popover, .favorite-panel-popover > div
{
    height: calc(100vh - 80px) !important;
    max-height: calc(100vh - 80px) !important;
}
#favorite-content-scroll {
    height: calc(100vh - 90px - 40px) !important;
    max-height: calc(100vh - 90px - 40px) !important;
}

.right-entry > li:nth-child(4) > div:nth-child(2)
{
    margin-left: -100px !important;
    height: calc(100vh - 90px - 40px) !important;
    max-height: calc(100vh - 90px - 40px) !important;
    
    .v-popover-content, .dynamic-panel-popover, #biliHeaderDynScrollCon {
        height: calc(100vh - 90px - 40px) !important;
        max-height: calc(100vh - 90px - 40px) !important;
    }
}
.right-entry > li:nth-child(5) > div:nth-child(2) 
{
    margin-left: -200px !important;
}

.v-popover-content, .history-panel-popover {
    height: calc(100vh - 90px - 50px) !important;
    max-height: calc(100vh - 90px - 50px) !important;
}
.header-tabs-panel__content {
    height: calc(100vh - 90px - 105px) !important;
    max-height: calc(100vh - 90px - 105px) !important;
}
.right-entry > li:nth-child(6) > div:nth-child(2)
{
    margin-left: -160px !important;
    
    .header-tabs-panel {
        height: 54px !important;
        max-height: 54px !important;
    }
}

.video-sections-content-list
{
    height: 400px !important;
    min-height: 400px !important;
    max-height: 400px !important;
}

.feed-card, .bili-feed-card
{
    margin-top: 0 !important;
}

.bili-feed4-layout
{
    padding-bottom: 160px;
}

#nav-searchform
{
    background-color: rgba(255, 255, 255, 0.1) !important
}
#nav-searchform:focus-within
{
    background-color: rgba(255, 255, 255, 0.35) !important
}
.nav-search-content
{
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: black !important;
}
.nav-search-content:focus-within
{
    background-color: rgba(255, 255, 255, 0.8) !important;
}
.nav-search-input
{
    background-color: transparent !important;
}
.search-panel
{
    background-color: rgba(255, 255, 255, 0.9) !important;
}

.history-item
{
    border: rgba(0, 0, 0, 0.1) 1px solid
}
.trending-item:hover
{
    background: transparent !important;
    color: var(--text_link);
}
`
        document.head.appendChild(domStyle)
    }, 1000)

    function remove(dom)
    {
        dom.parentElement.removeChild(dom)
    }
    function _hide(dom)
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
    function hide(dom)
    {
        let result = _hide(dom)

        let parentDom = dom.parentElement
        while(parentDom != null)
        {
            if(parentDom.classList.contains('bili-feed-card'))
            {
                result |= _hide(parentDom)

                parentDom = null
            }

            parentDom = parentDom.parentElement
        }

        return result
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
                '时光',
                'BML',
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
        // 自定义拦截
        // 暂时没有实现
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
