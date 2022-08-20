---
title: "【專案】山鴉的回顧"
date: 2022-05-30T21:51:04+08:00
lastmod: 2022-05-30T21:51:04+08:00

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
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

山鴉行動 

回顧 

150 篇日誌

我寫程式的習慣 很常重構 雖然這是同一個專案 但對我來說其實像 十幾個專案 

我知道怎麼拆分系統 

重構後的程式比較好嗎？當然，每次重構都是當時根據經驗想出的最佳作法

但問題是程式不是像美術、音效之類的資源能說換就換，

（尤其在能力不足的時候）

就像水彩畫一樣，每畫一筆都會對畫布產生永久的影響

山鴉的程式就像一面又髒又濕 隨時可能破掉畫布一樣


## 單例

看到就倒彈

媽的每次維護問題都你造成的

需要場景實例

執行順序

以及最可怕的全域訪問性

一大堆的 Manager 和 System

## 

裝備 和 敵人 

所有參數 行為 都是 企劃我在引擎裡手動更新的

我現在懂資料驅動的概念

砍掉？抱歉噢單例檔著 這想砍基本上等於重作整個專案了

但

## 濫用繼承

繼承很方便

尤其物件導向新手通常都是從重複使用程式的角度開始學

我也是如此

血量系統 敵人框架

繼承 更適合用來定義「框架」

而不是為了「重用」而把所有工作塞進父類別


## 抱歉

主要是對自己說的 我真的沒辦法逃避這種感覺

泛型 模組化 

也有和人協作程式的經驗

資料驅動

但

教學 Boss 都因為 BUG 砍了


我也不希望拿「還是學生」當擋箭牌 對我來說就是真沒做好 

很難過 不是做不到 而是沒辦法做



剛剛聽的東西其實大部分我都做得到，以現在的能力來看的話，但山鴉的時間跨度對我來說太大了，現在的程式真的是很危險的狀態，我沒辦法把這些現在學到的東西用進去，一堆東西都因為 BUG 砍了，我不希望拿還是學生當擋箭牌，對我來說就是真沒做好，所以抱歉 D:

