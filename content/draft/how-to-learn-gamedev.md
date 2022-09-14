---
title: "【教學】如何自學遊戲開發"
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

## 前言 -

這個系列是接續在[【資源】整理給 Unity 初學者的起步資源]({{< ref "learn\resources\unity-beginner" >}})之後的，如果你是完全沒任何知識的新手，建議從上篇文章開始。

這篇是在你擁有足夠基礎的後續，已經對自己使用的開發工具有基本的認識，能夠看懂教學資源中的腳本內容，並跟隨教學製作出一些成品，針對「能夠理解教學內容，但不知道如何靠自己完成專案」的人提供更進一步的自學指引。

本系列 不會有逐步的教學內容，不會教各位怎麼寫程式，取而代之的是展示遊戲開發時的實做思維，在遊戲開發的過程中如何查詢尋找資源、查詢資料、與解決問題。

由於資源量的多寡，建議的環境為 Unity 與 C#，但無論是 Unreal, RPG Maker 或其他環境，實際上思維都是通用的

### 注意事項 -

在「這個階段」的學習建議

+ 不要考慮優化、維護，只要思考如何達成目的即可

+ 避免跟隨完整教學製作，用自己的方法拆解問題，尋找解答

+ 儘管重複造輪子，造過一次在換不同方式造

<!-- + 問題解決的方法千千百百種，只要能解決問題就是好方法 -->

## 重點

### 如何查詢資料

以 Google 搜尋引擎為例

關鍵字的片段進行蒐集，不需要完整句子 

用英文用英文用英文查！

以遊戲開發來說，基本的問題結構為 (你的工具) + (你的條件) + (你的問題)

(unity) (how to) (make game) 

(unity) (update) (not working)

(unity) (sprite renderer) (not showing)

當然這只是一種範例
如果查詢不到你要的解答，可以修改關鍵字、增減條件等等

### 如何拆分問題

如果你不知道該怎麼描述問題，有可能問題太過「複雜」，簡單來說就是這個問題是由多個問題所組成的（以下簡稱複合問題）

因此在面對問題時就會不知道如何描述 或是描述後搜索不到自己要的解答 

這時就必須要先將問題進行拆分 將他拆分為數個獨立的單一問題 再透過分而治之的方式解決

<!-- 拆分之前首先要 將問題的表面的雜訊剔除 -->

假如「讓玩家根據鍵盤的 WASD 移動」就屬於複合問題，它由兩個子問題組成，分別是讓移動與鍵盤輸入

先取得了鍵盤輸入與物體移動的方法，再將它們結合，解決複合問題

(unity) (player input, keyboard input)

(unity) (object, player) (move, movement)

或是你想要讓玩家碰到的物體消失（吃掉什麼的），玩家碰到、消失


<!-- 註：雖然可以用 -->


## 範例
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








