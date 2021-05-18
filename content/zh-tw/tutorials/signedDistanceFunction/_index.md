---
title: "Signed Distance Function"
date: 2021-04-27T21:53:27+08:00
lastmod: 2021-04-27T21:53:27+08:00
draft: false
keywords: []
description: "signed distance function tutorial"
tags: [shader]
category: tutorial
author: ""
sectionTypes: content
featured_image: /tutorials/signeddistancefunction/tutorial_example_B.gif
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

## 距離場教學 - 數學原理以及運用方式

### 前言

為了能支撐住畫面渲染的效能消耗，GPU中多個核心可以平行運算數個像素的顏色

這也代表每個像素的運算是被孤立的，像素不能和其他像素溝通，只能夠知道自己所需的訊息，例如 : 位置

在這種限制之下也使得一種特別的運算方式得以實現 - 距離場 Signed Distance Function

一種能夠描述空間中任意位置對於虛擬形狀最接近表面的距離的函數，看似單純但距離場的組合特性以及空間操作性為它帶來無限的可能

運用在圖像渲染中可以不靠一張貼圖就 "計算出" 複雜的形狀甚至是分形，也因此 SDF 算法是深受 program artists 喜愛的數學工具

{{< sc_pathImage tutorial_example_B.gif "80%">}}

教學中會從頭解說距離場的數學原理，如何使用距離場繪製圖形和動畫，最終帶各位製作出一個完整的 2D 距離場動畫

### 基礎知識

閱讀這篇教學會需要基本的著色器以及線性代數知識，才能夠有效運用，裡面會省略基本的著色器數值特性，以及線代的數學算式

但就算不懂這些基礎也沒關西，可以只讀解說邏輯的部分，它仍然很有趣

**著色器的部分需要了解的有** 

- 著色器的變量計算特性以及函數功能
- 向量空間與色彩空間的轉換特性

**線性代數需要了解的部分有**

- 線性代數的圖形意義
- 線性代數的向量空間邏輯
- 合成矩陣運算順序對結果造成的影響
- dot product (點積、內積) 的向量投影性質
- cross product (叉積、外積) 的表面法線計算

### 章節題目

根據教學進度，中間會穿插一些測驗題，會附上結果的圖，但不會有程式碼，請加油 :P

### 備註

教學中函數命名的大小寫沒有固定是作者的問題，你們可以依照自己習慣的規則就好

### 教學頁面

{{< sc_sectionPageList displayData="none" >}}

### 參考資料


[Shader Tutorials by Ronja](https://www.ronja-tutorials.com/)

[The Book of Shaders](https://thebookofshaders.com/)

[Soft maximum for convex optimization](http://www.johndcook.com/blog/2010/01/13/soft-maximum/)

