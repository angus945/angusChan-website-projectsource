---
title: "關於教育，我們能夠在遊戲設計中學到什麼"
date: 2021-07-04T19:48:18+08:00
lastmod: 2021-07-04T19:48:18+08:00
draft: true
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
important: 10

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

<!-- 關於教育，我們能夠在遊戲設計中學到什麼 -->
<!-- 遊戲的教育意義，我們從遊戲設計理論中學到什麼 -->

## 前言

自學了一段時間，加上前陣子關於學習的文章
我查了不少關於教育和學習的資料來看

提到了關於被動和主動學習的差異，而在尋找資料的過程中我也發現了
很多被推崇的教育方式似乎都與 "遊戲設計" 有點關聯
Game base learning 以及 Gamification 一詞越來越常出現在先進的教育中體制

這篇文章就讓我們聊聊
遊戲具有的教育意義，以及我們能從遊戲設計的理論中學到什麼

---

## 教育中遇到的問題

首先先來觀察

以及遊戲中的差異

### 目標不明確

首先

第一個問題就是學生沒有學習的目標

或許某些人會想，學習本身不就是目標嗎?

但是在更深入一點，位什麼學生在學校學習

為了取得更好的成績

這是教師和家長的期望，而不是學生選擇的目標

### 成就感不足

在過去的文章中，就有提到過成就感的重要性，而在制式教育中學生無法獲得這項東西

<!-- 成就感直接影響到了是否有動力持續前行 -->

### 失敗被汙名化

在學校中與制式教育中，我們更傾向於將失敗這件事汙名化，你無法一次次地參加測驗直到通過

更不要說考試將直接關乎你的 "價值"

**_Trial and Error_**

嘗試錯誤法，又稱 "試錯"

遊戲中因為有不斷重來的機會，因此玩家願意嘗試更多事情

**_RogueLike_**

RogueLike 為一種遊戲類型的代稱，這是種相當特殊的遊戲類型，他會給予玩家極大的挫折感，但人們依舊願意一次次嘗試直到通關，這是為什麼呢?

首先讓我介紹一下給非遊戲玩家了解，這種類型的遊戲有兩大核心要素

+ 隨機生成  
  遊戲具有隨機性，這意味者每次挑戰時會遇到的情況都不相同，你不可能僅透過記憶關卡設計來達成勝利

+ 永久死亡  
  遊戲中無法任意存讀檔，並且死亡將失去一切並從頭來過
  這種機制捨去了上面說到的試錯機會，玩家必須謹慎地走每一步、下每一個決策
  你可能在終點以前失去一切，也可能苟延殘喘的獲得勝利

{{< pathImage "noita.gif" >}}

從上述兩點就能夠了解這是一項挫折感極大的遊戲類型，但人們依舊願意一次次嘗試直到通關，甚至是多次通關，這是為什麼呢?

因為失敗也是遊戲的過程之一，玩家必須在不斷的失敗中學習，直到你熟悉遊戲機制，直到你理解了敵人行為

**_回到現實_**

遊戲鼓勵玩家接受失敗，或許你認為現實中沒有重來的機會?

但這不就顯的更重要了? 學生在學校失敗的目的，是為了在現實中成功

### 齊頭式標準

如果教師選擇用統一的速度
有些學生會感到無聊，而有些很快就跟不上了

系統應該要讓學生能按自己的步調前進

遊戲中有所謂的難度選項

更甚至的還有所謂的 "動態難度"

### 內容遠超需求

回顧一下現實中的教育，從國中到高中，學校就像工廠一樣傾倒大量的資訊給我們，
並期望我們能夠記住這一切，並在需要的時候回想起來

**_教學關卡_**

當然這項問題也被反應在遊戲所謂的 "教學關卡" 中
以前的教學方式，當玩家剛進入遊戲時，我們透過教學關卡教導玩家在完過程所需的一切，當真正開始遊玩時玩家能透過這些知識

{{< pathImage "tutorial.jpg" >}}

對於沒有接觸過遊戲開發領域的人們來說，看起來很正常 ? 學習所需的一切，等需要的時候拿出來運用

但事實上，開發者在這種作法中意識到一項問題 - 玩家的 "學習意願" 是和投注時間是呈正比的

{{< pathImage "tutorial_investment.jpg" >}}

，所以當遊戲一開始就向你傾倒一堆教學時，這些通常超出了玩家所需範圍，也導致學習意願下降

**_依需求分佈_**

遊戲設計師如何解決這項問題呢?

我們將教學內容進行拆分，在玩家的遊玩過程中
{{< pathImage "tutorial_investment.jpg" >}}

這種做法可以將訊息傳遞的時機，等到玩家真正需要時再向其展示

inverted pyramid of decision making

事實上不是如此嗎
當我們嘗試解決一項問題時，才是學習的最好時機

**_現實_**

回到現實，要讓學生們在遇到問題時才學習顯然是不實際的，畢竟學校的目的就是為了讓學生學習未來應對問題的方法

但現在卡住的問題是，學

因此最簡單的方法就是在課堂中穿插應用

### 阻止思考

學校將

**_點擊這裡，然後按一下那個按鈕_**

遊戲中的教學也犯過這種錯誤，

透過引導你的動作來完成某樣事情，點擊這裡、點擊UI、按一下這個按鍵、拖動這項元素，嗯...你在做事! 你真聰明! 但這樣真的有效嗎?

事實上這種學習方法被稱作 "動覺學習 kinaesthetic learning"，或許再動作類遊戲中很適合，但是在思考、策略遊戲中就不太有效了

> As for as the game is concerned; I have advanced. But as for as my brain is concerned; I've learned nothing. Asher Vollmer - Designer, Threes

<!-- 對比現實中的學習
這兩者就是運動類和思考類知識

現代教育中還有一個很大的問題就是，學校常常告訴我們什麼是 "正確" 的，要我們將其全部記下
但是思考類知識需要的是 "思考"

盲目地遵循指示並不是學習的有效方式，

讓我們回到遊戲，開發著們是怎麼面對這項難題的
以遊戲 Threes 為例，這是一款簡單的益智遊戲，透過滑動組合出數字
他可以簡單地告訴玩家要如何滑動，向左滑動兩次，向上滑動兩次
{{< pathImage "tutorial_threes_A.gif" >}}
但是他說，將數字推到牆壁來重新排列，使用牆壁來使兩個數字相加
{{< pathImage "tutorial_threes_B.gif" >}}

對玩家來說，他們只是在玩遊戲，而沒意識到自己正在學習 -->

### 抹殺創造力

就像工廠製作機械一樣，學校 "打造出" 一位位的模板化學生
作文的目的是取得分數，心得必須要迎合，學生不能夠表達自己，學校告訴我們什麼是對的

如果出現了一個能讓你自由發揮的環境，

**_SandBox_**

沙盒

---

## 遊戲化

遊戲化 Gamification 一詞並不是近年來才出現的，事實上在十年前就有人關注以及嘗試融合至教育中

上學不是件有趣的事，相信大多制式教育中的學生都這麼認為，但學習應該要更有趣才對，讓學生們樂在其中才能最大化教育的意義，我們應該重視這件事情

> We learn best when we’re fully engaged - when it doesn’t feel like we’re learning, but simply enjoying ourselves

### 遊戲化課堂

<!-- 貓會透過遊玩訓練狩獵技巧 學習或許辛苦，但不必是痛苦的 -->

Institute of Play

Codecademy

Duolingo

### 實行的難點

**_觀念革新_**

第一就是過時的觀念，人的思維並不是願意輕易接受改變的

> I never get "My students had an A in your class, but I have a problem with the philosophy is you class"

**_汙名化的遊戲_**

**_成本過高_**

### 整個社會都可以參與

---

Game Base Learning 並不是 "容易"
並不是 Game Base Learning 就一定比原本的方式還好，遊戲也有優劣的，

---

## 結語

### 參考資料

[Video Games in Education: How Gaming Can Sharpen the Mind](https://plarium.com/en/blog/video-games-help-education/)

[Gamification of learning](https://en.wikipedia.org/wiki/Gamification_of_learning)

[Classroom Game Design: Paul Andersen at TEDxBozeman](https://www.youtube.com/watch?v=4qlYGX0H6Ec)

[Gamification in Higher Education | Christopher See | TEDxCUHK](https://www.youtube.com/watch?v=d8s3kZz1yQ4)

[Educational video game](https://en.wikipedia.org/wiki/Educational_video_game)

<!-- game tutorial -->

[Can We Make Better Tutorials for Complex Games?](https://www.youtube.com/watch?v=-GV814cWiAw)

[Half-Life 2's Invisible Tutorial](https://www.youtube.com/watch?v=MMggqenxuZc)

<!-- more -->
https://www.kpbs.org/news/2014/jul/31/gaming-education-video-games-have-educational-valu/
https://review42.com/resources/video-game-statistics/