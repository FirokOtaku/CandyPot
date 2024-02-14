/**
 * one line script
 * bilibili clean share
 * @version 0.1.0
 * @author Firok
 * */
'use strict'

!function(){
    let url = window.location.host + window.location.pathname
    if(!url.includes('bilibili.com'))
        return

    let title = document.title
    if(title.endsWith('_哔哩哔哩_bilibili'))
        title = title.slice(0, -14)

    navigator.clipboard.writeText(`${title} ${url}`).finally(() => {})
}()
