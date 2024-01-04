# Candy Pot 糖罐

~~这里是一罐糖, 用来喂猴~~

这里有一些脚本, 运行于 [Tampermonkey](https://www.tampermonkey.net/)

(点击图片以安装)

* [ ![Bibibili 优化](docs/logo-bilibili-optimizer.svg) ](https://github.com/FirokOtaku/CandyPot/raw/master/bilibili-optimizer.user.js)
  * 实在受不了 B 站这个垃圾 UI 了,  
    写了个简单的脚本 **按照我自己的口味** 处理页面内容
  * 去掉页面 Header 中的无用入口
  * 去掉首页轮播
  * 去掉直播推荐
  * 去掉少量广告
* [ ![小黑盒优化](docs/logo-xiaoheihe-optimizer.svg) ](https://github.com/FirokOtaku/CandyPot/raw/master/xiaoheihe-optimizer.user.js)
  * 不让复制粘贴内容是吧, 非得让下 APP 是吧?

## 改动记录

### Bibibili 优化

* 0.5.1
  * 修复错误
* 0.5.0
  * 优化清理代码
  * 追加清理项
* 0.4.0
  * 清理方式变为仅隐藏 dom 节点, 而不再直接移除, 避免 B 站的 Vue 实例运行出现问题
  * 现在会移除 AdBlock 提示
  * 不再隐藏动态按钮

### 小黑盒优化

* 0.1.0
  * 允许复制文字和图片内容
  * 隐藏 APP 下载按钮
