// ==UserScript==
// @name         Label Studio 优化
// @homepage     https://github.com/FirokOtaku/CandyPot
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  优化 Label Studio 使用体验
// @author       Firok
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labelstud.io
// @grant        none
// ==/UserScript==

'use strict'

/**
 * * 0.3.0
 *   * 增加辅助标注快捷键
 * */
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

    const pot = {
        url: 'http://localhost:39270',
    }
    window['pot'] = pot

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

    /**
     * 获取页面上正在标注的图片内容
     * @return {HTMLElement}
     * */
    function getMarkingImage()
    {
        const list = [...document.getElementsByClassName('konvajs-content')]
        return list.length > 0 ? list[0] : null
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
        // 辅助标注
        else if(event.key === 'i')
        {
            const taskId = new URL(document.location.href).searchParams.get('task')
            const url = `${pot.url}?taskId=${taskId}`

            // const exchange = new XMLHttpRequest()
            // exchange.onreadystatechange = () => {
            //     if(exchange.readyState === 4)
            //     {
            //         const ok = exchange.status === 200
            //         console.log(
            //             exchange.status,
            //             exchange.statusText,
            //             ok ? '辅助标注完成' : '辅助标注出错',
            //         )
            //     }
            // }
            // exchange.open('get', url)
            // exchange.send()

            // 解决跨域问题? 解决个屁
            // 又不是不能用
            const win = window.open(url, 'waiting..', 'popup=true,width=100,height=100,left=50,top=50')
            window.focus()
            setTimeout(() => win.close(), 1000);
        }
    })
    document.body.addEventListener('contextmenu', (event) => {
        switch (event.button)
        {
            case 2: // 鼠标右键
            {
                // 检查是否在图片上面
                const domImage = getMarkingImage()
                if(domImage === null) return
                const bbox = domImage.getBoundingClientRect()

                const mouseClientX = event.clientX, mouseClientY = event.clientY
                if(mouseClientX >= bbox.left && mouseClientX <= bbox.right && mouseClientY >= bbox.top && mouseClientY <= bbox.bottom)
                {
                    event.preventDefault()
                    // 模拟点击撤销按钮

                    const domButtonUndo = document.querySelector('div.lsf-history-buttons > button:nth-child(1)[aria-label="Undo"]')
                    const isDisabled = domButtonUndo.hasAttribute('disabled')
                    if(!isDisabled) domButtonUndo.click()
                }
            }
        }
    })

    console.log(`
    Alt + [1-9] = 快速选择标注标签
    Alt + C = 隐藏和显示所有区域
    Alt + S = 保存
    Alt + Q = 上一张图片
    Alt + W = 下一张图片
    Alt + I = 辅助标注
    右键图片 = 撤销
    `)
}()
