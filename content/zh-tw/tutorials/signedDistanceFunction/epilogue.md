---
title: "二十章 結語"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: false
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
order: 20
similarpagelink: byorder
listable: true

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: true
likecoin: false
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

## 揮灑創意

恭喜各位，了解距離場背後的數學原理的你們，現在能夠畫出各種精美的圖形和設計細緻的動畫了，請在程式的畫布裡盡情揮灑吧 !

{{< pathImage "rain.gif" "50%" >}}

雖然已經盡可能地提供更多種圖形和操作的範例，但仍然無法涵蓋所有，所以你們得透過範例中提供的的思路來創造出更多形狀，不要反而被幾個範例給侷限了 :D

{{< pathImage "gears.gif" "50%" >}}

至於有沒有更輕鬆的方法使用距離場繪製 2D 圖案，我目前是沒有看過相關的工具，所以還是只能一點一點雕了吧，不過將函數整理好後其實也不適什麼難事，需要的只有創意 !

{{< pathImage "fractal.gif" "50%" >}}

### 實際運用

教學中除了基本的數學原理之外，提供的範例都比較偏向視覺表現的的豐富度，因此內容更適用於藝術創作而非實際運用的部分。

但是距離場背後的觀念在實際運用中的範圍仍相當廣泛，例如貼圖著色的部分可以讓我們將 texture 繪製在任何位置，或是運用組合原理就能做出不需要 stencil buffer 的 2D 的圖片遮罩。

{{< pathImage "mask.gif" "50%" >}}

雖然教學使用的環境是 Unity ，但他背後的數學原理無論在哪都是通用的，所以只要根據需求調整即可。在你們有距離場的觀念後，遇到問題時也不妨使用距離場的角度思考看看，說不定會獲得意外的解答。

### 更進一步

教學中我們只有將形狀繪製在 2D 平面上，但其實 Signed Distance Function 是能夠將渲染拓展到三維空間的，只需要透過一種特別的射線計算 - Ray Marching (sphere tracing)

{{< pathImage "sphereTracing.jpg" "50%" >}}

使用這種算法甚至能將分形渲染到三維空間中。

{{< youtube "EkZsPcsV7yE" >}}
<!-- (https://www.youtube.com/watch?v=EkZsPcsV7yE) -->

但這又是另一大學問了，有興趣的人可以自己透過關鍵字查詢，在有了距離場的數學觀念後，相信各位也能輕鬆的了解 Ray Marching 的原理

**_Signed Distance Function 教學到此為止，感謝各位的閱讀 ! 請勿擅自轉載_**

**_作者 - 樂小呈_**
