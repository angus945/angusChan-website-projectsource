---
title: "距離場的數學原理以及圖形繪製方法"
date: 2021-07-27
draft: false
keywords: []
description: "從頭解說距離場的數學原理，並教妳們如何使用距離場繪製圖形"
tags: [shader, SDF, math]
category: tutorial
author: ""
sectionTypes: content
featured_image: /tutorials/signeddistancefunction/featured.gif
listable: true
important: 1

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: true
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---

## Signed Distance Function

### 序章

為了能支撐住畫面渲染的效能消耗，GPU 中通常會有多個核心，用來同時間平行運算數個像素的顏色。也因為並行的關係，正常情況下每個像素的運算是被孤立的，像素不能和其他像素溝通，只能夠知道自己所需的訊息，例如 : 位置。

在這種限制之下，也使得一種特別的運算方式得以實現 - 距離場 Signed Distance Function

這是一種能夠描述空間中任意位置對於虛擬形狀最接近表面的距離的函數，看似單純但距離場的組合特性以及空間操作性為它帶來無限的可能。運用在圖像渲染中可以不靠一張貼圖就 "計算出" 複雜的形狀，甚至是分形。也因此 SDF 算法是深受 programming artists 喜愛的數學工具，尤其在 shadertoy 上能看到各種令人驚豔的藝術創作。

這個教學會從頭解說距離場的數學原理，如何使用距離場繪製圖形和動畫，並最終帶各位製作出一個完整的 2D 距離場動畫。

{{< pathImage "example.gif" "80%" >}}

### 基礎知識

閱讀這篇教學會需要基本的著色器以及線性代數知識，才能夠有效運用，裡面會省略基本的著色器數值特性，以及線代的數學算式。但就算不懂這些基礎也沒關西，可以只讀解說邏輯的部分，它仍然很有趣。

**_著色器的部分需要了解的有_**

- 著色器的變數計算特性以及函數功能
- 向量空間與色彩空間的轉換特性

**_線性代數需要了解的部分有_**

- 線性代數的圖形意義
- 線性代數的向量空間邏輯
- 合成矩陣運算順序對結果造成的影響
- dot product (點積、內積) 的向量投影性質
- cross product (叉積、外積) 的表面法線計算

### 章節題目

根據教學進度，中間會穿插一些測驗題，會附上結果的圖，但不會有程式碼，請加油 :P

### 錯誤備註

由於作者本人學藝不精，對著色器的知識不夠齊全，教學中有些部分自作聰明將判斷式改為 lerp step 等函數運算，但事實上這對效能的幫助不大，甚至還會造成負優化，所以在過程中看到這部分的修改時可以忽略沒關係 (如果我沒刪乾淨)

[Shader中if和for的效率问题以及使用策略](https://zhuanlan.zhihu.com/p/33260382)

### 教學頁面 (更新中)

基本設置

初步理解

距離計算

距離上色

距離判斷

更多形狀

位移旋轉

形狀組合

空間操作

進階形狀

組合範例

動畫方法

動畫範例

動畫緩動

動畫時間

反鋸齒修

進階繪圖

進階上色

分形繪製

最終範例

結語

### 特別感謝

派大星教授加博士先生
