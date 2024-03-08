// ==UserScript==
// @name         Label Studio 优化
// @homepage     https://github.com/FirokOtaku/CandyPot
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  优化 Label Studio 使用体验
// @author       Firok
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labelstud.io
// @grant        none
// ==/UserScript==

'use strict'

!function() {
    /**
     * 检查是否是 Label Studio 页面
     * @type {HTMLElement[]}
     * */
    const listLabelStudioMain = [...document.getElementsByClassName('ls-content-wrapper')]
    const domLabelStudioMain = listLabelStudioMain.length > 0 ? listLabelStudioMain[0] : null
    if(domLabelStudioMain == null)
    {
        console.log('Label Studio 优化 - 未检测到 Label Studio 页面, 停止执行')
        return
    }
    else
    {
        console.log('Label Studio 优化 - 检测到 Label Studio 页面, 执行优化')
    }

    /**
     * 获取可选标签
     * @return {HTMLElement[]}
     * */
    function getListLabels()
    {
        const ret = []
        /**
         * @type {HTMLElement[]}
         * */
        const listContainer = [...document.getElementsByClassName('lsf-labels')]
        if(listContainer.length > 0)
        {
            const domContainer = listContainer[0]
            for(let child of domContainer.children)
                ret.push(child)
        }
        return ret
    }

    /**
     * 获取当前图片列表
     * */
    function getListImages()
    {
        const ret = {
            doms: [],
            selected: -1,
            length: -1,
        }
        /**
         * @type {HTMLElement[]}
         * */
        const listImages = [...document.getElementsByClassName('dm-table__row-wrapper')]
        for(let step = 0; step < listImages.length; step++)
        {
            const dom = listImages[step]
            const selected = [...dom.classList].includes('dm-table__row-wrapper_selected')
            ret.doms.push({ dom, selected, })
            if(selected) ret.selected = step
        }
        ret.length = listImages.length
        return ret
    }

    // 注入快捷键
    document.body.addEventListener('keydown', (event) => {
        if(!event.altKey) return

        // 标签快速选中
        if(event.key >= '1' && event.key <= '9')
        {
            let code = event.key - '0'
            const listLabels = getListLabels()
            if(code <= listLabels.length - 1)
                listLabels[code - 1].click()
        }
        // 隐藏和显示所有区域
        else if(event.key === 'c')
            document.querySelector('button.lsf-view-controls')?.click()
        // 保存
        else if(event.key === 's')
            document.querySelector('button.lsf-submit')?.click()
        // 上一张图片 下一张图片
        else if(event.key === 'q' || event.key === 'w')
        {
            const images = getListImages()
            const direction = event.key === 'q'
            if(direction)
            {
                if(images.selected > 0)
                    images.doms[images.selected - 1].dom.click()
            }
            else
            {
                if(images.selected < images.length - 1)
                    images.doms[images.selected + 1].dom.click()
            }
        }
    })
    document.body.addEventListener('mousedown', (event) => {
        console.log('mouse click', event)
    })
}()
