---
title: "遊戲的教育意義，我們從遊戲設計的理論中學到什麼"
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

<!-- 圖 -->

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

### 成就感不足 -

在過去的文章中，就有提到過成就感的重要性，而在制式教育中學生無法獲得這項東西

住:目標和成就感直接關聯，

**_遊戲中的回報_**

過於明確的目標和回報可能導致 - 動機偏移

<!-- http://www.chrishecker.com/Achievements_Considered_Harmful%3F -->
<!-- 動機偏移 Overjustification 一詞就是用來表示這種狀況 -->

**_意外的回報_**

在上個章節中有說到，但事實上有一種獎勵方式 - 驚喜

注意這個回報必須是低價值的，否則還是會造成動機偏移

設計師們在世界中藏了寶藏，但沒有告知玩家

而玩家在某次發現了隱藏的寶藏後，這會激勵玩家積極的探索世界的各個角落

> When they create their games, [Nintendo's designers] don't tell you how to play their game in order to achieve some kind of mythical reward. There are things you can do in the game that will result in some sort of reward or unexpected surpirise. In my mind, that really encourages the scense of exploration rather than the sense of 'If I do that, i'm going to get some sort of artificial point or scorce.' Bill Trinen, Nintendo

**_一句稱讚_**

孩子們只是需要一句稱讚

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

### 齊頭式的步調 -

如果教師選擇用特定的速度教學，對班上的一些學生來說沒問題，但有些學生會感到無聊，而另一些很快就跟不上了

**_難度設定_**

在遊戲設計中常會有所謂的難度設定，玩家可以根據自己的需求調整難度，遊戲會跟去難度設置，從調整參數到整個遊戲系統修改都可能

如此一來就能配合各種玩家，或是讓玩家先從簡單的模式熟悉後，再挑戰更高的難度

**_學生的步調_**

如果系統能讓學生能按自己的步調前進

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

### 體制阻止思考 -+

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

**_隱形的教學_**

在上個章節中有說到



**_思考和回饋_**

引導學生思考，並給予適當的回饋

### 抹殺創造力 -

就像工廠製作機械一樣，學校教育出一位位模板化的學生，打造出一台台的考試機器

學生們的家政課被拿來考國文，美術課被借去上數學，寫作的目的是取得更高的分數，而非表達自己的想法，為了填充心得字數而抄封底的(提要?)

你們說，身處這種環境中，如果出現了一個能讓你自由發揮的世界，孩子們能不被吸引嗎?

**_Sandbox_**

沙盒 Sandbox，在遊戲開發的領域中代表者一種類型，就如同它的名稱一樣，裝著沙的盒子，用沙子建立起自己的世界

> the metaphor a child playing in a sandbox...produc a world from sand. Steve Breslin - Game historian

創造一詞就是對這種類型的遊戲最好的描述

而說到沙盒遊戲，最標誌性的當然就是 Minecraft，玩家們在這之中打造一個又一個世界，孩子們在這裡建築自己的避風港

{{< pathImage "sandbox_minecraftA.jpg" >}}
<!-- The Lord of the Rings in Minecraft: Celebrating 10 years of building! -->

在這個世界，沒有人會對你的創作指指點點，你可以在這個虛擬的畫布上揮灑創意

**_不該用模板化的標準看待孩子們的創意_**

如果教師和家長能夠發現並接受孩子的創意

如果能夠不對心得打分數

不要求學生寫出所謂 "好的" 作文，而是寫出自己的看法

住: 對於那些不善長在課堂上發言的孩子們，可以讓他們透過寫的

---

## 遊戲化

上學不是件有趣的事，相信大多制式教育中的學生都這麼認為，但學習應該要更有趣才對，讓學生們樂在其中才能最大化教育的意義，我們應該重視這件事情

> We learn best when we’re fully engaged - when it doesn’t feel like we’re learning, but simply enjoying ourselves

遊戲化 Gamification 一詞並不是近年來才出現的，事實上在十年前就有人關注以及嘗試融合至教育中，

### 遊戲化課堂

現實中有些機構嘗試透過遊戲化的教育來讓學生學習，這裡就提供一些案例給各位參考

**_Institute of Play_**

非營利組織
<!-- 結束營運 -->

**_Codecademy_**

使用遊戲化來教程式

**_Duolingo_**

使用遊戲化來教人學習語言

**_模擬訓練_**

遊戲可能夠被用來進行模擬訓練，從汽車駕駛到外科手術

### 實行的難點

**_人不會輕易接受改變_**

第一就是過時的觀念，人的思維並不是願意輕易接受改變的

<!-- > I never get "My students had an A in your class, but I have a problem with the philosophy is you class" -->

**_遊戲一詞被汙名化_**

遊戲一詞在某些保守觀念中還是拜抱有負面看法

**_成本過高_**

無論是遊戲軟體，又或者是硬體

**_會受改革影響到的損失者_**

當然得，改革本身就會對所有處在環境中的人造成影響，可能導致受影響者不積極甚至阻止改革

### 整個社會

遊戲化當然不只被運用在教育上，整個社會都、整個世界能被遊戲改變

**_Opower_**

試圖讓人們降低水電費的公司，他們看到改變人們行為的最好方式就是 - 展示他們的鄰居是怎麼做的，就像第一部分中說到的競爭目標

所有人都認不希望自己的水電費高於平均值，以改變他們的行為

最終他們在一年內節省了 2.5 億美元的水電費

**_Eterna_**

一個建立RND結構的遊戲

人們發現新的結構

最後，世界上的普通人們發現數以千計科學家們未見過的 RNA 結構

### 寓教於樂

除了將教育遊戲化，許多遊戲也試著將遊戲教育化，讓遊戲不只是娛樂，已達成寓教於樂的目的

**_Infinifactory_**

解決謎題的方法是找出解答 Discover The Solution

解決問題的方法是創造解答 Inventing A Solution

因此這種類型的遊戲比起解出 "謎題"，應該說是解決 "問題"

**_SpaceChem_**

編碼知識

被幾所英國的學校使用

**_Kerbal Space Program_**

讓玩家在遊戲中建造火箭， 工程學知識

<!-- https://www.kerbalspaceprogram.com/game/kerbal-space-program/ -->

**_SimCity_**

模擬城市教孩子們關於城市規劃、資源管理之類的事情，甚至還有 "汙染挑戰" 向玩家展示歌學與環境的複雜關係

**_Minecraft_**

以及當然的，Minecraft 的紅石系統一直都是很好的教材

使用紅石電路做出邏輯閘，做出計算機、或是圖形繪製的電腦，演奏器

---

## 結語

### 參考資料

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