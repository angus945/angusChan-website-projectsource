---
title: "遊戲的教育意義，我們能從遊戲設計的理論中學到什麼"
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
important: 1

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

自學遊戲開發一段時間，前陣子寫了一篇 [關於學習](http://localhost:1313/zh-tw/blog/aboutlearning/) 的心得文章。為了讓文章更豐富，我在寫作的過程中也查了不少於教育和學習的資料來看。

文章中提到了關於記憶和學習的區別，以及被動學習和主動學習的差異。在我閱讀和寫作的過程中注意到一件事情，那就是很多被推崇的教育方式似乎都與遊戲設計的理論有點關聯?

這篇文章就讓我們聊聊，遊戲所具有的教育意義、遊戲和現實的差別，以及我們能從遊戲設計的理論中學到什麼吧。

不過要聲明一下，本人目前沒有實際受過教育知識相關的教育，所以文章中可能提不出什麼有建設性的建議。

---

## 教育中遇到的問題

首先先來說說我過去待在制式教育中所觀察到的，我們的制式教育有什麼問題，可能對學生們造成什麼影響，以及現實問題與差別又在哪裡，遊戲設計師們怎麼解決類似問題?

### 缺乏學習動機 +

動機，也就是驅動人們做某件事情的原因，我們第一個問題就是學生們缺乏學習的動機。或許某些人會想，學習知識這件事本身不就是嗎? 是的，至少最初的立意是這樣，但現在已經變調了。

現在，學生去上學的目的是追求成績，為了讓家長與左鄰右舍比較，為了滿足社會的期望，而不是為了自己。

**_遊戲如何驅使玩家做某事_**

當我們說到在遊戲中驅使玩家做某些事，首先想到的就是所謂的 "任務"。開發著透過任務系統來引導玩家，無論是必定要完成的主線劇情任務，抑或是視情況達選擇的支線任務，他們的目的都是為了給玩家一個 "目標"，好讓玩家產生完成某事的動機。

許多開放世界都透過這種方式來引導玩家，把一個一個的任務 Icon 放入地圖中，讓玩家去任務地點接下任務並執行。

<!-- https://www.youtube.com/watch?v=FzOCkXsyIqo -->

遊戲 "告訴玩家" 接下來該做什麼，而玩家們就會義無反顧地去完成。若是對遊戲或遊戲設計理論不熟悉的人，可能覺得是這樣沒錯，但真的有那麼簡單嗎 ?

**_為什麼避免過於明確的目標_**

有些玩家不喜歡遊戲提供過多的資訊，因為有點破壞了遊戲體驗。遊戲中可能有許多有深度的任務，但想要到達任務地點，玩家只需要跟著導航從A走到B點，而不是利用環境所具有的資訊進行探索。這讓人感覺自己不在遊戲中，而是隔著一扇窗戶 "玩遊戲"。

{{< pathImage "goal_wizart.jpg" "80%" "圖片引用自 Following the Little Dotted Line, wizard 3" >}}

或許這是為了大眾化的妥協，但是開發著們也可以為遊戲加入沒有輔助，或者是只有簡單提示的的可選任務，玩家必須自己探索並找出具體位置。

{{< pathImage "goal_treasureMap.jpg" "80%" "圖片引用自 Following the Little Dotted Line, Red Dead Redemption 2" >}}

這些任務可以鼓勵玩家真正的認識和探索世界，讓好奇心引導玩家，而不僅僅是跟隨著導航。

{{< text/greenLine >}}
當然，直接從選項設置中把所有輔助都關掉後，也可以讓原本的任務具有探索性質。但如果任務設計之初就是建立在提示之上的，可能讓選擇關閉的玩家寸步難行。
{{</ text/greenLine >}}

**_什麼情況中不該為玩家訂立目標_**

上面的部分說到了透過任務來給玩家提供目標，但在另一種類型的遊戲中，適用的情況又不同了。

假如遊戲世界中藏有大量寶藏，而你希望玩家能夠找到它們，因此你給了他們一章詳細的埋藏點地圖，那麼玩家會直接到寶藏地點取得寶藏，然後...沒有然後了，玩家忽略掉世界上的其他地方，用最高的效率搜括所有寶藏。

沙盒類生存遊戲 Don't Starve 在設計之初是有所謂的任務系統的。因為開發者們意識到測試人員不知道如何玩這款遊戲，所以馬上就卡住了。但測試人員只需要簡單的提示，跨越一開始的障礙後，便能去實驗、但所並獲得樂趣。

為此，作者(Klei)決定為遊戲添加一系列小型的教學目標幫助玩家入門(例如存活幾天、採集多少資源)，而結果就是玩家學會了如何玩這款遊戲，但除此之外卻一團糟。因為玩家現在只專注於這些任務中，而把其他的一切都視為干擾任務的雜訊。

{{< pathImage "goal_dontStorveNoise.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Don't starve" >}}

玩家們用最無聊的方式遊玩遊戲，只為了完成首讓的任務，避免任何有風險的舉動和探索，並且在任務完成以後失去積極度。

> In structuring the game as a series of explicit tasks to be completed, we taugh the player to sepend upon those tasks to create meaning in the game.  kelei - don't storve

最後，作者透過調整 UI 設計，透過微妙的提示引導玩家如和開始，解決了入門的難題。而原先得任務則被拋至一旁，讓玩家自己去學習。

{{< pathImage "goal_dontStorveUI.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Don't starve" >}}

如果一個遊戲是關於實驗、探索和創造，我們反而不應該為玩家訂立目標。因為過於明確的目標可能限制玩家的創造和想像力，即使是完成了任務以後影響依然存在。

科幻考古遊戲 Outer Wilds 的設計也是基於這種原理，避免遊戲中主動圖供玩家目標，讓玩家僅憑好奇心去探索各個星球。

{{< pathImage "goal_outerWilds.jpg" "80%" "圖片引用自 Outter Wilds Staem 宣傳圖片" >}}

<!-- https://www.youtube.com/watch?v=1ypOUn6rThM -->

**_競爭之心_**

人類的競爭心態，無論是與他人的競爭，又或者為了超越過去的自己，都是驅使你做的更好的極強動力。

遊戲開發者 Zach 製作了許多的高品質問題解決 (Problem Solving) 類遊戲，在這些遊戲中你可以隨心所欲的建造機器，只要他能夠正確運作並解決問題，那麼就能通關。

{{< pathImage "spaceChem.jpg" "80%" "圖片引用自 spaceChem 宣傳圖" >}}

而這種類型的遊戲也意味者有無數的解決方案，因此為了鼓勵玩家優化系統，他在遊戲中添加了成就來驅使玩家挑戰。

{{< pathImage "goal_challanges.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Spacechem" >}}

但是他在後來的遊戲中卻將他們全數移除了，因為他們注意到遊戲中有比隨機閥值的成就任務更有效，更有說服力的東西，某種經由大量基準得出的東西 - 統計數據，比起隨便設置的成就，展示出玩家的排名能反而能更有效的激發玩家動力。

{{< pathImage "goal_competition.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Opus Magnum" >}}

> a goal that you set yourself is way more powerful than a goal someone else set for you. Zach - Opus Magnum, game wisdom

因此，如果遊戲是關於挑戰自己，或者爭奪排名等社交目標，可能會比單單的設定一個門檻還有動力。目標是一項可完成的清單，但是分數、排行榜和競爭是沒有終點的，這也解釋了為什麼我們現在甚至未來都仍能看到玩家遊玩俄羅斯方塊。

**_行為心理學_**

在思考動機時，最常見的區分方式就是外在和內在動機。簡單來說外在動機指的是我們為了任務之外的原因(如獎賞)去做某事，也就是所謂的工作；而內在動機指的則是我們為了任務本身去做的事情，因為我們覺得愉快或有意義，即使沒有任何回報，也就是所謂的興趣。

內在動機被證明是更加強大的，持續的時間也更長。人們可以終生享受一種興趣，玩家們願意漫無目的在世界中探索，只因為那很有趣；而外在動機只有在獎賞存在的情況下持續。如果無法獲得薪水還有誰願意工作，如果失去了獎賞，也沒有玩家願意去解無聊的重複任務。

現在的學生們沒有驅動自己的內在動機，只有被社會強加的外在動力。因此學生們很難發自內心的驅動自己讀書，如果有方法提供學生們內在動機，可以很大程度的改善情況。

<!-- 老實說這章應該是全文中最難寫的一章。尤其是最後部分提到的競爭目標， -->

### 成就感的匱乏 -

在過去的文章中，就有提到過成就感的重要性，而在制式教育中學生無法獲得這項東西

**_遊戲中的回報_**

遊戲中是如何提供玩家成就感的呢?

任務後的獎勵，數值提升?

**_克服的困難_**

遊戲能夠提供長久成就感的原因主要來自於

克服困難所帶來的成就感

可以提供持續的內在動力

**_動機偏移_**

讓我們回到數值獎勵上，事實上這種做法的效益不高，甚至造成反效果

在上個章節中我們有談論到行為心理學的外在和內在動機

有大量的證據顯示，當外在動機被附加到一個有內在動機的任務上時，我們會對這件事情失去興趣，

當失去獎賞時可能將完全失去動力

而錯誤的獎賞就可能導致這種情形發生

這種情形當然也會發生在遊戲設計上

當更多的外在動機系統，如明確的目標、進度和

而開發著必須不斷地創造新的目標和獎賞，否則遊戲將失去對玩家的吸引力

當然這不是說目標和獎勵一無是處，他們可以為遊玩過程添加結構和進展，但需要謹慎使用

<!-- 雖然現代手遊趨向於這種狀態，但那還涉及了沉沒成本等心理因素，這裡先不討論 -->
<!-- http://www.chrishecker.com/Achievements_Considered_Harmful%3F -->
<!-- 動機偏移 Overjustification 一詞就是用來表示這種狀況 -->

**_意外的回報_**

在上個章節中有說到，但事實上有一種獎勵方式不會引起動機偏移 - 驚喜

獎賞能夠起到的是激勵作用，只要他是出乎意料且低價值的

<!-- 注意這個回報必須是低價值的，否則還是會造成動機偏移 -->

設計師們在世界中藏了寶藏，但沒有告知玩家

而玩家在某次發現了隱藏的寶藏後，這會激勵玩家積極的探索世界的各個角落

<!-- **_一句稱讚_**

孩子們只是需要一句稱讚 -->

### 失敗被汙名化 +

在遊戲中失敗受到什麼實質逞罰呢? 什麼都不會，你只需要點擊重新開始，或回到上個存檔點再次挑戰就好。透過一次又一次的失敗並從中學習，不斷的嘗試直到通關為止。

我們都知道從失敗中學習是相當棒的一件是，但在學校與制式教育中，我們更傾向於將失敗這件事汙名化。無論那些長輩認為現在的孩子多 "嬌貴"，事實是學生們身處在一個會被公開測試以及質疑的高壓環境，失敗是可恥的，你犯的錯會被所有人知道。

{{< text/greenLine >}}
當然，有些工作環境也是如此。但如果大人都為此感到痛苦，更何況是在學習階段就要承受的孩子們。
{{</ text/greenLine >}}

在學校中，你無法一次次地重複參加測驗直到通過，考試這件事情本質上是好的，他的目的是為了驗證自己的所學，但他的潛在意義也變了，成績被和學生的價值綁訂在一起。

<!-- 學校是個高壓的環境 https://www.youtube.com/watch?v=ZZvRw71Slew 10:00 -->
<!-- 失敗是可以的 https://www.youtube.com/watch?v=Go0BQugwGgM -->

**_Trial and Error_**

<!-- https://en.wikipedia.org/wiki/Trial_and_error -->

嘗試錯誤法，又稱 "試錯"，這個詞的意思是透過反覆和多樣的嘗試，直到達成某樣目的或者放棄嘗試。

遊戲中因為有所謂的存檔機制，玩家能夠在遇到難題以前先進行存檔，並在失敗時(或單純好奇其他可能性)透過讀檔再次重試。因為有了不斷重來的機會，玩家會願意嘗試更多事情。

不只是遊戲，試錯法也被運用在各領域中。化學家們隨機的嘗試不同化學品，直到找出具有所需效果的那個。而各種運動競技的隊伍也透過不斷試錯，在競賽中嘗試不同策略和陣容，累積經驗最終擊敗對手。

甚至是生物進化的過程本身，也屬於一種極長期的試錯過程。隨機的突變和遺傳變異都是為了測試不同改變對環境的適應性。在經過長時間的試錯後，最具有適應性的基因組保留了下來。

**_RogueLike_**

遊戲中有一種相當特殊的類型被稱作 RogueLike，是我相當喜歡的遊戲類型，而他有兩大核心要素

+ 隨機生成 - 遊戲具有相當的隨機性，每次挑戰時會玩家會遇到的情況都不相同，不同的地圖、不同的敵人和不同的事件

+ 永久死亡 - 遊戲過程中無法任意存讀檔，並且死亡將失去一切並從頭來過

隨機性意味著你不能透過記憶關卡配置來破關，而永久死亡意味著玩家必須謹慎地走每一步、下每一個決策。有可能一路順遂卻在終點以前失去一切，也可能苟延殘喘卻堅持到勝利。

{{< pathImage "noita.gif" "100%" "圖片引用自 noita 介紹" >}}

從上述的特性就能夠表達出這是一種挫折感極大的遊戲類型，但人們依舊願意一次次嘗試，承受一次次慘烈的失敗直到通關，甚至是多次通關，這是為什麼呢?

因為失敗也是遊戲的過程之一，失敗是理所當然的事情。玩家必須在不斷的失敗中學習，觀察這個世界的運作方式，熟悉所有敵人的行為，不斷學習直到你吸收了能幫助通關的知識。只有能接受失敗並學習的人，才能在這種遊戲的洗禮下堅持住。

**_現實中的失敗_**

失敗是學習的過程之一，失敗是再正常不過的事情。雖然現實中沒有讀檔的機會，但只會讓失敗顯得更加重要，因為現在失敗的目的，是為了在未來無法失敗得時候成功。

SpaceX 數次的試射失敗，是為了讓後續載人火箭成功。而學生在學校每面對一次失敗，每從失敗中學習一次，就會降低未來遭遇失敗的機率。

不要將失敗給汙名化，鼓勵學生嘗試並給予適當回饋。將成績和價值的關聯移除，成績是學生用來驗證所學，而不是讓學校、教師和家長排名和競爭。把目光放在學到了什麼，才能讓學生們真正接受失敗並從中學習。

### 齊頭式的標準 -

體制中的所有學生都使用相同課綱

課堂上的學生都依教師的進度上課

但事實是每個學生擅長的都不同，

如果體制對所有學生使用相同的標準

更不用說還有許多種科目，在這種體制下學生們被迫

教師選擇用特定的速度教學，對班上的一些學生來說沒問題，但有些學生會感到無聊，而另一些很快就跟不上了

<!-- https://www.youtube.com/watch?v=K5tPJDZv_VE -->
<!-- https://www.youtube.com/watch?v=zFv6KAdQ5SE -->

**_遊戲中的難度_**

被心理學家和遊戲設計師們稱作的 "心流" 區域，這是一個遊戲的難度區塊，不會簡單到讓人覺得無療，也不會困難到讓你無法繼續。

{{< pathImage "difficulty_flow.jpg" "80%" "圖片引用自 What Capcom Didn't Tell You About Resident Evil 4" >}}

所有遊戲都試圖讓玩家感受能維持在這個區域內

在遊戲設計中常會有所謂的難度設定，玩家可以根據自己的需求調整難度，遊戲會跟去難度設置，從調整參數到整個遊戲系統修改都可能

如此一來就能配合各種玩家，或是讓玩家先從簡單的模式熟悉後，再挑戰更高的難度

**_動態難度設置_**

難度選項也不是萬能的，最好的解釋方法就是 - 我要如何在對遊戲不了解的時候選擇自己難度

如果玩家選擇了錯的難度可能

為了應對這種可能 動態難度設置 dynamic difficulty setting 被發明出來，他可以根據玩家的表現在被動中修改難度設置，好將難度曲線維持在

惡靈古堡 Resident Evil 4 中除了常規的難度選項意外就有動態難度

{{< text/greenLine >}}
其實也有其他遊戲使用這種設置，但她精妙的地方就是在於很難讓人注意到
{{</ text/greenLine >}}

**_輔助模式_**

有些難度較高的遊戲，即使是簡單模式也很令人錯愕

有些人想要體驗遊戲中的劇情，卻被可怕的壓力阻擋

為此，輔助模式誕生了

**_鎖定難度_**

當然，有些遊戲對於自己的難度是不容質疑的

例如黑暗靈魂

**_學生的步調_**

如果系統能讓學生能按自己的步調前進

在處於心流的狀態下學習會比強制塞入高難度中更有效果

### 內容遠超需求 +

從國中到高中，回顧一下現實中的教育教了哪些東西 - 國英數自社、生物化、歷地公以及其他複雜到列出來很麻煩的科目。學校在短短幾年內就傾倒了大量的知識給學生，並期望學生能夠學會這一切，在未來需要的時候回想起來。

過去的文章有講過，尤其是在被動學習的環境下學生們沒有應用所學的機會，因此將所有知識作為資訊記憶，而非真正的學習。學生們不斷重複記憶和遺忘的過程，容易對一切感覺到厭煩而逐漸消磨學習意願。

**_遊戲中的教學關卡_**

當然這項問題遊戲設計師們也有遇到過，並被反映在所謂的 "教學關卡" 設計中。

以前的教學方式是，當玩家剛進入遊戲時，遊戲會透過一系列關卡教導玩家在完過程所需的一切，當真正開始，玩家能透過這些知識在遊戲的世界中生存。

{{< pathImage "tutorial.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

看起來很正常? 我們的教育也是如此，我們教學生在學校時學習未來可能需要的一切知識傾倒給學生(tutorial)，並期望他們在需要時能扣運用這些知識(gameplay)。

但事實上，開發者在這種作法中意識到一項問題 - 玩家的 "學習意願" 是和投注時間是呈正比的。

{{< pathImage "tutorial_investment.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

所以當遊戲一開始就向你傾倒一堆教學時，這些通常超出了玩家所需範圍，也導致學習意願下降。在開始有趣的遊戲以前需要先經過又臭又長的教學關卡，這種做法可能導致玩家有糟糕的學習體驗，還可能直接阻止玩家進入遊戲真正好玩的部分。

<!-- https://www.youtube.com/watch?v=-GV814cWiAw -->

**_拆分並依需求分佈_**

遊戲設計師如何解決這項問題呢? 事實上，並沒有任何規定說我們一定得在開始前交會玩家一切，這意味著我們其實可以將教學內容進行拆分，並分佈在玩家的遊玩過程中。

{{< pathImage "tutorial_split.gif" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

這種作法有許多優點，第一也是最大的優點就是剛剛說的，透過推遲教學發放的時機，遊戲可以等到玩家投入更多時間後在將進階的部分展示給玩家看，以此避免學習意願不足的問題。並且玩家幾乎可以立刻開始真正的遊戲，而不用先將無聊的教學破完。

最後則是，這種做法可以將訊息傳遞的時機，等到玩家真正需要時再向其展示(例如第一次開啟工作檯介面時才顯示合成道具的教學)，如此一來

{{< text/greenLine >}}
其實還有一個優點是，如果拆分的夠細甚至可以設計出 "隱形的教學"，但我覺得她更適合放在下一章中
{{</ text/greenLine >}}

**_更加複雜的遊戲_**

拆分教學的做法可以在線性，或者是內容隨遊玩進度增加的(如銀河惡魔城 Metroidvania game)中有效。但如果在機制複雜的遊戲中，像是經營、戰略和 4X 類型，拆分的單純作法或許無效...又或者說難以達成。

因為這種類型的遊戲，通常所有的系統都是環環相扣 (以科幻 4X 為例可能有星球、影響力、建設、科研、內政、外交、市場及軍事等)，但這就沒有解決方法了嗎?

{{< pathImage "tutorial_stellaris.jpg" "80%" "圖片截自 stellaris 宣傳用圖" >}}

我們能從 "文明帝國 Civilization" 這款遊戲中學習，他的創造者發明了一個名詞 - 決策的倒金字塔 inverted pyramid of decision making。

當遊戲開始時，第一個回合只有一個決定要做 - 選擇定居點。而第二個回合你要做的也只有決定要建設什麼，再來你要決定新的單位該做什麼事，以及新的城市要作什麼決策。

不久之後，這些決策開始膨脹，最後玩家將管理數百個單位及城市，每回合能夠做出數十個決策。

{{< pathImage "tutorial_decision.gif" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

文明在遊戲過程中，從模糊地圖中的一個定居地、成長為一個由複雜國家組成的龐大帝國。藉著緩慢增加複雜度而不是一口氣展示所有系統，他做到了相成功的教學。

{{< pathImage "tutorial_civilization.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

{{< text/greenLine >}}
之前一直不懂有什麼難的，寫到這裡才意識到許多 4X 的教學設計其實都很糟糕，對就是說你 Stellaris。雖然文明的教學算不錯的，但實際感受還是因人而異，因為這類遊戲的複雜度本來就不是所有人能接受。
{{</ text/greenLine >}}

**_應用的重要性_**

回到現實，雖然前幾部分說到的是拆分教學直到玩家有足夠意願時才給予，但現讓學生們爭正遇到問題時才給予知識顯然不實際，畢竟學校的目的就是為了讓學生學習未來應對問題的方法。

因此，這裡真正想提的是 "應用"，透過在課堂中插應用的部分，讓學生了解所學的用圖，以此提高學生們的學習意願，而不是一股腦地把所有東西灌注給學生。

### 體制阻止思考 +

同樣的，因為應試教育的關係，雖然學習知識也能夠達成獲得成績的目的，但在這種體制下的學生通常更傾向於記住答案。抄筆記、畫重點、背公式，學生不斷重複機械性的動作，試圖將一切資訊寫入大腦，而不是去思考和了解背後的邏輯。

**_點擊這裡，然後按一下那個按鈕_**

同樣的，我們能夠在遊戲教學中看到類似的身影，由些遊戲教學透過引導你的 "動作" 來完成某樣事情 - 點擊這裡、選取這些單位、按一下這個按鍵、拖動這項元素，嗯...你在做事! 你真聰明!

{{< pathImage "tutorial_clickthere.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

但這樣真的有效嗎? 事實上這種作法被稱作動覺學習 kinaesthetic learning，這是種透過身體行為行動來學習的方法。

或許動作類遊戲中有效，畢竟動作操作是其中占比相當大的成分，但是對於思考策略類 (像上章說的 4X) 就不那麼適合了，光是讓玩家點擊市場介面的按鈕無法讓它們了解遊戲中複雜的金融機制。玩家雖然照著指示完成了教學，但還是不知道遊戲怎麼玩。顯然盲目諄循指示並不是好的學習方法。

> As for as the game is concerned; I have advanced. But as for as my brain is concerned; I've learned nothing. Asher Vollmer - Designer, Threes

**_引導式教學_**

來看看開發著們是怎麼面對這項難題的。以遊戲 Threes 為例，這是一款簡單的益智遊戲，玩家必須透過滑動組合出數字。

教學可以簡單地告訴玩家要如何滑動(向左滑動兩次，向上滑動兩次)，但遊戲卻是透過提示的方式，引導玩家思考(將數字推到牆壁來重新排列，使用牆壁來使兩個數字相加)。

{{< pathImage "tutorial_threes_B.gif" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

雖然這只是簡單的任務，但也足夠驅使玩家自己動腦筋，而非照著指示行動。再讓我們看看複雜遊戲是如何達成的，以動物園之星 Planet Zoo 為例。

遊戲中的第一個教學教導玩家改善動物的福利，動物園中的老虎因為棲地不是合而感到不適。遊戲透過簡單明瞭的提示告訴玩家這件事，引導玩家思考如何改善棲地。而不是告訴玩家點開地形編輯面板，選擇某種地面後鋪設在棲地中。

"Aww, poor dabs! I'm sure it can't have escaped your attenction that the tigers look a bit miffed. That's because they aren't too keen on the type of terrain."

接者，他要求你去改善動物園中所有動物的整體福利。

"Well then, all of that should give you a pretty good understanding of how to make animals happy, so I'd like you to go check on all the other animals in the zoo and fix up any issues with their habitats."

{{< pathImage "tutorial_zoo.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

遊戲讓玩家繼續下去，而在這個過程中玩家幾乎沒得到任何的直接指導，因此必須將剛剛學到的付諸實現，並進行一些批判性思考來填補知識的空白部分。從一項簡單的任務開始，然後讓你思考並解決更多問題，相當卓越的教學方法。

<!-- 回饋 -->

**_隱形的教學_**

假如遊戲開發者作了一款遊戲，遊戲中玩家可以透過肢解怪物的部位來達成有效傷害，那麼該怎麼告訴玩家這件事?

絕命異次元 Dead Space 是這樣做的，他先是用地圖上的血書說 CUT OFF THEIR LIMGS，接著跳出一個提示說 "把腳射斷以造成額外傷害" ，再來拿到一個音訊記錄說你得切斷敵人的腳，然後又有個角色打電話來再說一次...然後再再跳出一次視窗提示。

{{< pathImage "tutorial_deadSpace_A.jpg" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Dead Space" >}}

最後，玩家可能還是搞不清楚狀況，也可能覺得自己被當作嬰兒了。有沒有更好的做法呢? 讓我們看看戰慄時空 Half Life 中是如何教會玩家類似情形的。

在玩家第一次進入 Ravenholm(地名) 時會看到這個場景，一隻被鋸片切開的殭屍。

{{< pathImage "tutorial_invsible_A.jpg" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Half Life" >}}

接著，通往下個區域的門口被鋸片所阻擋了，因此玩家必須先用重力槍將鋸片取下。在此同時，視野正前方的場景中走出一隻殭屍，於是玩家反射性地按下發射紐，高速飛出的鋸片將殭屍切成兩半。

{{< pathImage "tutorial_invsible_B.gif" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Half Life" >}}

兩個橋段，過程不到 10 秒玩家就學會了鋸片可以有效地對付殭屍。遊戲中每個部分都高明的引導著玩家行動，沒有人告訴玩家該怎麼做，也不需要惱人的彈出視窗重複強調，只有透過 "示範" 來展示規則。

每當有新的威脅時，巧妙的遊戲設計都會讓玩家先站在安全的地方，並展示出遊戲規則。

{{< pathImage "tutorial_invsible_C.gif" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Half Life 展示藤壺怪的掠食方式" >}}

{{< text/greenLine >}}
其實很多老式遊戲，如 Super Mario Bros(1985) 都有做到這種隱形教學。不光是設計師的思考精妙，也是當時硬體限制下的必須，開發者們只能透過將教學融入關卡的方式來減少遊戲空間。
{{</ text/greenLine >}}

**_思考和回饋_**

遊戲中透過引導玩家思考的方式，教會他們一項項遊戲中的複雜機制。透過示範的方法，讓玩家在不知不覺下學習。

如果這個體制能引導學生思考，而不僅僅是記下一切，能夠對學習的多個層面起到顯著效果。

### 創造力被抹殺 +

就像工廠製作機械一樣，制式教育中的學校使用模板打造出一台台的考試機器。

學生們的家政課被拿來考國文，美術課被借去上數學。為了分數將自己沒經歷過的事情形容的歷歷在目，為了填充心得字數而抄封底的提要，寫作的目的變成取得更好的成績，而非表達自己的想法，分享自己的經歷。

在寫這章時，我突然意識到各種題材中的反烏托邦世界似乎出現在學校的影子裡。而就像各種作品中一樣，人們開始嚮往一個不受拘束，能夠自由展現創意和想法的世界。

{{< pathImage "schoolisafactory.jpg" "100%" "google image school is a factory" >}}

**_Sandbox_**

沙盒 Sandbox，在遊戲開發的領域中代表者一種類型，就如同它的名稱一樣，裝著沙的盒子。用沙子建立起自己的世界，創造一詞就是對這種類型的遊戲最好的描述。

> the metaphor a child playing in a sandbox...produc a world from sand. Steve Breslin - Game historian

而說到沙盒遊戲，最標誌性的當然就是 Minecraft，玩家們在這之中打造一個又一個世界，孩子們在這裡建築自己的城堡。

{{< pathImage "sandbox_minecraftA.jpg" "100%" "圖片截自 The Lord of the Rings in Minecraft: Celebrating 10 years of building!" >}}

在這個世界，沒有人會對你的創作指指點點，你可以在這個虛擬的畫布上揮灑創意。

**_不該用模板化的標準看待孩子們的創意_**

作文不應該用一條條的規章評分，心得應該表達真實感受，孩子們的創意不該被教育抹煞。

---

## 遊戲化的教育 +

上學不是件有趣的事，相信大多制式教育中的學生都這麼認為。但學習應該要更有趣才對，只有讓學生們樂在其中才能最大化教育的效益，我們應該重視這件事情。

> We learn best when we’re fully engaged - when it doesn’t feel like we’re learning, but simply enjoying ourselves

遊戲化 Gamification 一詞並不是近年來才出現的，事實上在十年前就有人關注以及嘗試融合至教育中。現實中也有些機構嘗試透過遊戲化的教育來讓學生學習，這裡就提供一些案例給各位參考。

**_Institute of Play_**

由一群遊戲設計師成立於 2007 年的教育類非營利組織，期間持續為學校提供課程設計、教育計劃以及企業的培訓或研討會。

他們推崇的主要學習法為互連學習 Connected Learning，其關鍵在於運用網絡和數位媒體帶來的豐富資訊和社會聯繫。互連學習有三大核心

+ 興趣 - 興趣有助於我們集中註意力，能夠使人堅持更長久並學習的更深入
+ 支持 - 學習者在同伴和導師的支持下，更能從挫折和挑戰中堅持下來
+ 機會 - 課堂以外的成功需要有與現實職業有密切聯繫，提供學習者們在校內外互連學習的機會

{{< pathImage "connectedLearning.jpg" "80%" "圖片引用自 Institute of Play 網站上的 connected learning 解說" >}}

雖然組織已經關閉，但是他們將大量 [資源](https://clalliance.org/resources/) 保留了下來，可以在網路上找到。

<!-- https://en.wikipedia.org/wiki/Connected_learning -->
<!-- https://clalliance.org/institute-of-play/ -->

**_Duolingo_**

透過遊戲化的設計來教人學習語言，一天只需要花十到三十分鐘即可，重複聽、讀、寫 直到能牢牢記住，隨者使用者等級增加難度曲線，透過每日進度的獎勵機制，鼓勵人們維持學習。
[Duolingo](https://www.duolingo.com)

{{< pathImage "duolingo.jpg" "80%" "圖片截自 duolingo 網站" >}}

### 整個社會 +

遊戲化當然不只被運用在教育上，整個整個世界能被遊戲改變，無論是透過遊戲化改變人們的行為，抑或是運用廣大玩家的創意解決難題。

**_Opower_**

試圖讓人們降低水電費的公司，他們看到改變人們行為的最好方式就是 - 展示他們的鄰居是怎麼做的，就像第一部分中說到的競爭目標。所有人都認不希望自己的水電費高於平均值，因此以改變了他們的行為，最終他們在一年內節省了 2.5 億美元的水電費。

{{< pathImage "ted_opower.jpg" "80%" "圖片截自 TED 演講 Gamification to improve our world: Yu-kai Chou" >}}

**_Eterna: Solving With The Crowd_**

由科學家開發的遊戲，遊戲中教了玩家 RNA 結構的設計和基本概念，並且有一些謎題可供玩家挑戰。

{{< pathImage "eteRNA.jpg" "80%" "圖片截自 TED 演講 Future of Creativity and Innovation is Gamification: Gabe Zichermann" >}}

遊戲中還有實驗室模式，允許玩家自由研究各種 RNA 結構，而這也是遊戲誕生的主要原因之一，目的是希望用廣大的玩家創意解決相關難題。最後，作為玩家的普通人們幫助科學家發現數以千計過去未見過的 RNA 結構。

<!-- https://en.wikipedia.org/wiki/EteRNA -->

<!-- https://www.researchgate.net/figure/EteRNA-puzzle-Each-of-the-nucleotide-bases-is-represented-by-four-different-colours-and_fig3_264560893 -->

### 寓教於樂 +

除了將教育遊戲化，許多遊戲也試著將遊戲教育化，寓教於樂就是這類遊戲最好的描述之詞。

如果說解決謎題的方法是 "找出" 解答 (Discover The Solution)，那麼解決問題的方法就是 "創造" 解答 (Inventing A Solution)，遊戲中有種特殊的類別就可以被稱作問題解決類 Problem Solving 遊戲。

<!-- https://www.youtube.com/watch?v=w1_zmx-wU0U -->

**_SpaceChem_**

透過編寫程序設計出生產線，並自動化各種化學鍵的組合。這款遊戲也被一些學術機構納入教材，用於教授化學與程式編寫的相關觀念。

{{< pathImage "spaceChem.jpg" "80%" "圖片引用自 spaceChem 宣傳圖" >}}

**_Kerbal Space Program_**

一款高科學度的沙盒模擬類遊戲，玩家可以在其中設計各種形狀的太空載具，並且在真實的物理模擬下實現現實中的太空軌道操作。

遊戲中還有供玩家學習天體物理、遊戲元素、機師發展和導航技能的訓練模式，因此在科學界的社群中吸引了眾多科學家和航太工業從者的興趣，也啟發了許多想要投身於航太與其他類似領域的人。

{{< pathImage "kerbalSpaceProgram.jpg" "80%" "圖片引用自 Kerbal Space Program 宣傳圖" >}}
<!-- https://www.kerbalspaceprogram.com/game/kerbal-space-program/ -->

**_Minecraft_**

以及，Minecraft 當然的也屬於這類型遊戲，他的紅石系統一直都是很好的電子電路教材。從各種分類及建造的自動化系統，到使用紅石邏輯閘建立出的計算機都能做出。

{{< pathImage "minecraft_calculator.jpg" "80%" "圖片截自 Puzzle Solving... or Problem Solving?" >}}

---

## 結語

### 環環相扣 +

我盡力將各種問題分割開來，以確保每個章節的內容都有所區別，但教育也和遊戲設計一樣，許多問題之間都是環環相扣的，一項缺點可能造成好幾種引響，一個結果也可能是由複數原因造成的。

要在思考教育體制問題的同時，還要尋找切題的遊戲設計理論來解說真的是一項難題(尤其是前兩章)，希望這篇文章能讓各位滿意。

這些都是我自身觀察以及查閱資料後得出的主要問題，當然並不是每項問題所有學生都一定經歷過，但依然是現有體制中存在且不可忽略的問題。

### 感謝閱讀 -

再次打破字數紀錄了

這篇文章本身也讓我受益良多

可惜的還是目前沒有教育相關知識，所以只能提供感想而非有建設性的建議。

從前言到結語之間我自己也學到不少知識

感謝閱讀!

### 參考資料

{{< text/greenLine >}}
為了避免清單過長，我會把一些表層資料(如 wiki)給註解掉，完整清單的可以開網頁除錯看
{{</ text/greenLine >}}

[Achievements Considered Harmful?](http://www.chrishecker.com/Achievements_Considered_Harmful)

[Trial and error](https://en.wikipedia.org/wiki/Trial_and_error)

[Can We Make Better Tutorials for Complex Games?](https://www.youtube.com/watch?v=-GV814cWiAw)

<!-- gamification -->

[The Future of Creativity and Innovation is Gamification: Gabe Zichermann at TEDxVilnius](https://www.youtube.com/watch?v=ZZvRw71Slew)

[Video Games in Education: How Gaming Can Sharpen the Mind](https://plarium.com/en/blog/video-games-help-education/)

[Gamification of learning](https://en.wikipedia.org/wiki/Gamification_of_learning)

[Classroom Game Design: Paul Andersen at TEDxBozeman](https://www.youtube.com/watch?v=4qlYGX0H6Ec)

[Gamification in Higher Education | Christopher See | TEDxCUHK](https://www.youtube.com/watch?v=d8s3kZz1yQ4)

[Educational video game](https://en.wikipedia.org/wiki/Educational_video_game)

[New educational video game used in schools](https://www.gamasutra.com/view/pressreleases/154246/New_educational_video_game_used_in_schools.php)

<!-- 寓教於樂 -->

[Puzzle Solving... or Problem Solving?](https://www.youtube.com/watch?v=w1_zmx-wU0U)

<!-- https://www.kpbs.org/news/2014/jul/31/gaming-education-video-games-have-educational-valu/ -->

<!-- https://review42.com/resources/video-game-statistics/ -->