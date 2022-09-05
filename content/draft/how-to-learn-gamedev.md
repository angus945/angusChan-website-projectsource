---
title: "How to Learn Gamedev"
date: 2022-09-02T07:42:25+08:00
lastmod: 2022-09-02T07:42:25+08:00

draft: true

description:
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

<!--more-->

接續 給初學者的資源

上篇文章要各位跟著做 是因為要大量接觸基本知識

這篇則是在你擁有足夠基礎的後續

看的懂教學內容但要自己嘗試製作卻不知所措的

拆分問題的能力

從實際專案 用拆分的方式逐步構建出整個專案

要注意的是 這個系列不會有逐步的教學 甚至連程式碼都不會有

但相對的是 對於拆分出的每個問題 這邊都會提供對應的 資源 如解決方法 關鍵字 

這篇的目的是讓入門者了解 分而治之

文章需要你對使用的開發工具有基本的認識
以及基本的腳本編寫能力

但內容無論是在什麼引擎基本都通用
不要想做到和參考一致
以能達到效果為目的

不考慮維護 只有如何達成目的

----

flappy bird 

初步拆分 遊戲中有兩大最重要的元素 支撐遊戲運作的核心 

兩個元素
水管 鳥 

先從鳥開始
鳥 只論他本身 不考慮互動
受到地心引力影響
玩家點擊會往上飛
持續向又移

地心引力
查詢 physics fall down gravity 
movedown 
自己寫 或使用組件

點擊網上飛還可以拆更細
點擊
mouse click 

往上飛
jump 
fly up
push up 

玩家的持續移動

接下來是水管
不斷在路徑上生成
拆分 
生成水管 
在路徑上 不斷
改變高度

攝影機跟隨

到這裡基本元素都已經構建完成
交互規則

玩家每穿越一次就會加分 反之撞到就會死亡
加分開始做 判斷位置 碰撞箱

死亡 碰撞箱

最後就構建出完整的遊戲了
所有無論多複雜的遊戲 都會像這樣 進行拆解
將複雜的問題拆分為簡單的小塊後解決








