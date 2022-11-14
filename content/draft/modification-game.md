---
title: "【筆記】如何讓遊戲支援模組開發"
date: 
lastmod: 

draft: true

description:
tags: [unity, game-develop, programming, data-driven, modification]

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

## 概括

遊戲模組是什麼 以及他是如何運作的 怎麼讓遊戲支援模組開發

遊戲模組 是一種能讓玩家對遊戲內容進行擴展的 手段

改變角色外觀 添加道具 甚至

Minecraft 就是相當經典的案例

文章的環境為 Unity，但概念基本上是通用的 

## 資料驅動 Data Driven

嘗試查詢的話

這裡整理成 三大重點

### 動態資料 streaming load

遊戲必須主動去抓

Steam 工作坊其實不是甚麼黑魔法 只是幫你下載到 模組資料夾 而已
主要還是遊戲本身去抓路徑 讀取

Streaming Assets System.IO
通常遊戲
開發者必須提供管道 符合條件才能抓取動態資料
否則是無效的

### 資料格式 format

定義資料格式 

定一一個資料需要有甚麼
例如一個怪物
血量ㄇ
速度
攻擊力
圖片
用一個文字 (或其他輕量資料格式) 文件定義

玩家只要複製這個文件，把內容修改成自己像要的樣子
就添加了一個新的怪物進遊戲

資料可簡易可複雜
簡單的就是 向上面的範例 修改參數與外觀
複雜的可能能改變邏輯與行為甚至規則本身



比較推薦使用 XML Extensible Markup Language 
Json 適合格式固定的資料，如本地化字表文件

### 擴展行為 Lua, Dll

直譯與編譯

程式語言 要和電腦溝通
就和不同國家的人一樣，

編譯就像一口氣將整篇文章翻譯完畢再閱讀
而直譯便是在閱讀的同時進行翻譯，

當然也可以手刻一個虛擬機去跑你的自訂程式

能否支援模組開發 直接取決於開發者 (程式的能力)


## 實作範例
用 System.IO 與 System.XML 和 MoonSharp
不細部解釋內容 只提供一個簡單的方向


動態載入資料
File.ReadAllText();

使用 XML 定義
XMLSerializer

並用 Lua 附加行為
new Script()
DoString




---

https://ecampusontario.pressbooks.pub/gamedesigndevelopmenttextbook/chapter/game-modifications-player-communities/
https://www.techopedia.com/definition/3841/modification-mod
















