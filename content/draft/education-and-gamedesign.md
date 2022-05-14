---
title: "從遊戲設計反思教育"
date: 2021-07-16
lastmod: 

draft: true

description: "聊聊我從體制教育觀察到的問題，以及遊戲設計中是如何面對類似問題的"
tags: [learning, education]

## image for preview
feature: "/post/education-and-gamedesign/featured.jpg"

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /post/education-and-gamedesign/

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
listable: [recommand, new, all]

---

## 前言

在個人網站完成後，我嘗試寫了自己的第一篇文章 [自學了三年](https://angus945.github.io/zh-tw/blog/aboutlearning/)。文章中提到了關於記憶和學習的差異，以及主動和被動學習的區別。

為了讓文章內容更豐富，我查閱了許多關於學習和教育的文章，而我也在這個過程中注意到一些事情。遊戲化 Gamification 和數位遊戲式學習 game based learning 不斷出現在搜索頁面中，似乎很多被推崇的教育方式，都與遊戲和遊戲設計的理論有點關聯?

這篇文章就讓我們聊聊，遊戲所具有的教育意義、遊戲和現實的差別，以及我們能從遊戲設計的理論中學到什麼吧。不過本人目前沒有真正學習過關於教育相關的知識，所以文中許多言論只是停留在心得和觀點而已，可能提不出什麼有建設性的建議。

---

## 教育中遇到的問題

首先來談談我過去待在制式教育中時，所觀察到的各項問題，可能對學生們造成什麼影響。

並與遊戲中相似或值得參考的地方進行類比，看看現實問題與遊戲中的差別又在哪裡，而遊戲設計師們又是怎麼面對類似情形的。

### 缺乏學習動機

動機，也就是驅動人們做某件事情的原因，現在教育第一個問題就是 <h> "學生們缺乏學習動機" </h> 。或許某些人會想，學習知識這件事本身不就是嗎? 是的，至少最初的立意是這樣，但現在已經變調了。

現在，學生去上學的目的是追求成績，為了進入名校，為了讓家長與左鄰右舍比較，為了滿足社會的期望。 <h> "而不是為了自己" </h>。

**_遊戲如何驅使玩家做某事_**

<!-- 當我們說到在遊戲中驅使玩家做某事，首先會想到的就是 "任務" 系統。開發著透過任務系統來引導玩家，無論是必定要完成的主線劇情任務，抑或是自由選擇的支線任務，他們的目的都是為了{{ orange "給玩家一個 \"目標\"，好讓玩家產生行動的動機" >}}。 -->

許多開放世界都透過這種方式來引導玩家，把一個一個的任務 Icon 放入地圖中，讓玩家去任務地點接下並執行。

遊戲 "告訴玩家" 接下來該做什麼，而玩家們就會義無反顧地去完成。若是對遊戲或遊戲設計理論不熟悉的人，可能覺得是這樣沒錯，但真的有那麼簡單嗎 ?

**_為什麼避免過於明確的目標_**

有些玩家不喜歡遊戲提供過多的資訊，因為有點破壞遊戲體驗。遊戲中可能包含了許多有深度的任務，但想要到達任務地點，玩家只需要跟著導航從A走到B點，而不是利用環境所具有的資訊進行探索。這讓人感覺自己不在遊戲中，而是隔著一扇窗戶 "玩遊戲"。

{{< resources/image "goal_wizart.jpg" "80%" "圖片引用自 Following the Little Dotted Line, wizard 3" >}}

或許這是為了大眾化的妥協，但是開發著們也可以為遊戲加入沒有輔助，或者是只有簡單提示的的可選任務，玩家必須自己探索並找出具體位置。

{{< resources/image "goal_treasureMap.jpg" "80%" "圖片引用自 Following the Little Dotted Line, Red Dead Redemption 2" >}}

這些任務可以鼓勵玩家真正的認識和探索世界，讓好奇心引導玩家，而不僅僅是跟隨著導航行動而已。

<!-- {{ greenline >}}
當然，直接從選項設置中把所有輔助都關掉後，也可以讓原本的任務具有探索性質。但如果任務設計之初就是建立在提示之上的，可能讓選擇關閉的玩家寸步難行。
{{ greenline -->

**_什麼情況中不該為玩家訂立目標_**

上面的部分說到了透過任務來給玩家提供目標，但在另一種類型的遊戲中，適用的情況又不同了。

假如遊戲世界中藏有大量寶藏，而你希望鼓勵玩家尋找它們。因此你給了張畫出所有詳細埋藏點的地圖，那麼玩家在看過地圖後將直接到寶藏地點取得寶藏，然後...沒有然後了，玩家忽略掉世界上的其他地方，用最高的效率搜括所有寶藏。

沙盒類生存遊戲 Don't Starve 在設計之初也是有所謂的任務系統的。因為開發者發現它們的測試人員不知道該如何玩這款遊戲，所以馬上就卡住了。但其實測試人員只需要簡單的提示，跨越一開始的障礙後便能自發的去實驗、探索並獲得樂趣了。

<!-- 為此，作者(Klei)決定為遊戲添加一系列小型的教學目標(例如存活幾天、採集什麼資源)，來幫助新手玩家入門。結果就是，玩家雖然學會了如何玩這款遊戲，但在此之外都一團糟，因為玩家現在{{ orange "只專注於這些任務中，並將其他的一切都視為干擾任務的雜訊" >}}。 -->

{{< resources/image "goal_dontStorveNoise.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Don't starve" >}}

<!-- 玩家們用最無聊的方式遊玩遊戲，只為了完成手上的任務。他們 <h> "避免任何有風險的舉動和探索" >}}，因為可能導致任務失敗。但這不是作者所期望的，玩家們在完成了任務後也會失去方向。 -->

> In structuring the game as a series of explicit tasks to be completed, we taught the player to depend upon those tasks to create meaning in the game.  kelei - don't storve

最後，作者透過調整 UI 設計，透過微妙的提示引導玩家如何開始，解決了入門的難題。而原先得任務系統則被拋至一旁，讓玩家自己去學習才是最好的做法。

{{< resources/image "goal_dontStorveUI.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Don't starve" >}}

如果一個遊戲是關於實驗、探索和創造，那麼我們反而不應該為玩家訂立目標，因為 <h> "過於明確的目標可能限制玩家的創造和想像力" >}} ，而這些影響即使是完成了任務後依然存在。

科幻考古遊戲 Outer Wilds 的設計也是基於這種原理。開發者避免遊戲主動圖供玩家目標，讓玩家僅憑好奇心去探索各個星球。

{{< resources/image "goal_outerWilds.jpg" "80%" "圖片引用自 Outter Wilds Staem 宣傳圖片" >}}

**_競爭心理_**

無論是與他人的競爭，或是為了超越過去的自己，都是驅使你做的更好的極強動力。

遊戲開發者 Zach 製作了許多的高品質問題解決類遊戲 (Problem Solving)，在這些遊戲中你可以隨心所欲的建造機器，只要機器能正確運作並達成目標，那麼就能通關。

{{< resources/image "spaceChem.jpg" "80%" "圖片引用自 spaceChem 宣傳圖" >}}

而解決問題有無數種方案，在遊戲中也是如此。因此為了鼓勵玩家優化系統，他在遊戲中添加了成就來鼓勵玩家不斷設計出更好的系統。

{{< resources/image "goal_challanges.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Spacechem" >}}

<!-- 但是在後來的遊戲中，作者卻將成就系統全數移除了。因為他們注意到遊戲裡其實就有比隨機閥值的成就更有效、更有說服力的東西，某種經由大量基準得出的東西 - 統計數據，比起隨便設置的成就，{{ orange "展示出玩家的排名能更有效的激發玩家競爭心理，以此驅動玩家不斷挑戰" >}}。 -->

{{< resources/image "goal_competition.jpg" "80%" "圖片引用自 The Psychological Trick That Can Make Rewards Backfire, Opus Magnum" >}}

> a goal that you set yourself is way more powerful than a goal someone else set for you. Zach - Opus Magnum, game wisdom

因此，若遊戲是關於自我挑戰，或者爭奪積分排名等社交目標，激發玩家自身的競爭心理，可能會比作者的設定目標門檻更有效。目標是一項可完成的清單，但是{{ orange "分數和排名的競爭是沒有終點的" >}}，這也解釋了為什麼我們在現在，甚至未來都還能看到俄羅斯方塊的玩家。

**_行為心理學_**

在思考動機時，最常見的區分方式就是外在和內在動機。

簡單來說，外在動機指的是我們 <h> "為了任務之外的原因(如獎賞)去做某事" >}}。通常被稱為工作；而內在動機指的則是我們 <h> "為了任務本身去做的事情" >}}，即使沒有任何回報，因為我們覺得做這件事有意義或很愉快。通常我們叫它興趣。

內在動機被證明是更加強大的，持續的時間也更長。人們可以終其一生都在享受興趣，玩家們願意漫無目的在世界中探索，只因為那很有趣。

而外在動機只有在獎賞存在的情況下持續。如果無法獲得薪水，有誰還願意工作，如果失去了獎勵，也沒有玩家願意去解無聊的重複任務。

<!-- 現在的學生們沒有驅動自己的內在動機，只有被社會強加的外在動力，因此{{ orange "學生們很難發自內心的驅使自己讀書" >}}。如果有方法提供學生們內在動機，而不僅僅是被要求去讀，可以很大程度的提高學習意願。 -->

<!-- {{ greenline >}}
要注意的是，只有 "自發性的" 競爭心理能夠賦予內在動機。因此要求學生們競爭排名是沒正面效益的，還可能削弱原本就存在的內在動機，這種情況被稱作動機偏移，在下個章節中會提到。
{{ greenline -->

### 成就感的匱乏

在過去的文章中，就有提到過成就感的重要性，而制式教育中的學生卻無法在學習過程中，獲得充足的成就感。成就感是驅動人們持續學習的燃料，如果缺乏燃料將失去動力在深空中漂泊。

**_遊戲中的回報_**

那麼遊戲中是如何提供玩家成就感的呢?

當我們講到遊戲是如何提供玩家成就感，許多人會想到的是，完成任務獎勵金錢，或者是擊殺敵人的數值提升。遊戲透過不斷增加的數字來讓玩家感覺到進步，使用虛偽的獎勵讓人感到滿足?

或許其中是有數值成長的部分在，但很可惜，遊戲設計不是那麼單純的事。

**_克服的困難_**

遊戲能真正夠提供長久成就感的原因，其實就和現實是一樣的 - 克服困難，只有 <h> "克服困難所帶來的成就感，才可以提供持續的內在動力" >}}，而數值增長只是附帶的表層回報而已。

開始冒險 > 進行試煉 > 解決難題 > 面對危機 > 獲得寶物 > 回歸平凡，許多暢銷小說和影集都諄尋著這項公式 - 英雄旅程 Hero's journey。而當然的，我們在遊戲中也能看到相似的影子。

{{< resources/image "reward_heroJourney.jpg" "60%" "圖片引用自 What makes a hero? - Matthew Winkler" >}}

從經過設計的難度曲線中，就能明顯感受到相同規律。也是這種克服難題後的心理激勵，才能真正有效的驅使玩家前去迎接更多挑戰。

{{< resources/image "difficultyCurve.jpg" "100%" "圖片引用自 Difficulty Curves Start At Their Peak" >}}

**_動機偏移_**

<!-- 讓我們回到數值獎勵上。事實上，這種做法不只是效益不高，{{ orange "甚至還可能造成反效果" >}}。在上個章節中我們有談論到行為心理學中的內在和外在動機，內在動機是強大的，而外在則不是。 -->

有大量的證據顯示，當外在動機被附加到一個原本就具有內在動機的任務上時，我們 <h> "反而會對這件事情失去興趣" >}}，動機偏移 Overjustification Effect 一詞就是用來描述這種情況的。

這種情形當然也會發生在遊戲設計上，而數值回報就屬於一種附加的外在動機。如果一個遊戲提供了大量數值類的的回報，或者遊戲就是使用這種方式吸引玩家的，那麼開發著就必須不斷地創造新的目標和獎賞，否則遊戲將失去對玩家的吸引力。
<!-- 
{{ greenline >}}
被附加的外在動機並不限於正面的附加(獎勵)，負面的附加也會造成動機偏移，而且會讓人更快失去對一件事的興趣。明明對某些事情有自發的動力，但卻在受到父母壓力後失去熱誠是很正常的心理現象。
{{ greenline -->

當然也不是說目標和獎勵一無是處，他們可以 <h> "為行動過程添加明確的結構和進展" >}}，畢竟不是所有玩家都擅長自我激勵。但要小心，別讓遊戲對玩家的吸引變成數值而非遊戲本身了。

**_意外的回報_**

其實有一種獎勵方式是不會引發動機偏移的，那就是意外的獎勵。只要獎勵的形式是無形、低價值、意想不到的，以及能讓人感覺到獎勵和自己的行動有相互關聯，那麼就能 <h> "對本身存在的內在動機起到激勵作用。" >}}

假如設計師們在世界中，藏了許多影藏的寶藏，但沒有告知玩家這件事，在玩家某次不經意地發現這件事後，將激勵玩家在後續的過程積極的探索世界的各個角落。

{{< resources/image "reward_mario.jpg" "80%" "圖片截自 The Psychological Trick That Can Make Rewards Backfire" >}}

**_如何獲得成就感_**

要如何在意願不足的情況下，提供成就感真的是一大難題，這兩者基本上是直接關聯的 D:

不過，關於數值類的回報，我覺得他反而能在制式教育中起到不少效果。就如章節中說的，他可以為過程添加明確的結構和進展，因此對於學習這種短期無法看到效果的事情來說，量化的獎勵反而能給予學生成就感。

<!-- {{ greenline >}}
這裡的量化獎勵不是指 $$ 這類實質獎勵，如果真的給錢的話也可能產生動機偏移。這裡是指像 duolingo 平台的那種虛擬數值獎勵，可以明確的讓人知道自己的學習成果。
{{ greenline -->

### 失敗被汙名化

在遊戲中失敗受到什麼實質逞罰呢? 什麼都不會，你只需要點擊復活、讀檔或者重新開始並再次挑戰就好。你可以在一次又一次的失敗中學習，不斷的嘗試直到通關為止。

{{< resources/image "failure_minecraft.jpg" "80%" "圖片截自 death.fell.accident.water" >}}

我們都知道從失敗中學習是相當棒的一件事，但在學校與制式教育(甚至是整個社會)的環境中，卻傾向於 <h> "將失敗這件事汙名化" >}} 。無論長輩們認為現在的孩子多 "嬌貴"，事實上 <h> "學生們身處在一個會被公開測試以及質疑的高壓環境" >}}。失敗是可恥的，你犯的錯會被所有人知道。

<!-- {{ greenline >}}
當然，有些工作環境也是如此。但如果大人都為此感到痛苦，更何況是在學習階段就要承受的孩子們。
{{ greenline -->

<!-- 在學校中，你無法一次次地重複參加測驗直到通過，考試這件事情本質上是好的，他的目的是為了驗證自己的所學。但他的潛在意義改變了，{{ orange "成績被和學生的價值綁定在一起" >}}，變成令人恐懼的夢魘。 -->

**_Trial and Error_**

嘗試錯誤法，又稱 "試錯"，這個詞的意思是透過反覆和多樣的嘗試，直到達成某樣目的(或放棄嘗試)。

遊戲中因為有所謂的存檔機制，玩家能夠在遇到難題以前先進行存檔，並在失敗或好奇不同的可能性時，透過讀檔再次重試。因為 <h> "有了不斷重來的機會，玩家會願意嘗試更多事情" >}}。
<!-- 
{{ greenline >}}
有些玩家會在稍微出錯後就選擇讀檔，但我是屬於不喜歡讀檔的那種。我覺得面對失敗比較有趣，因為這可以提高你每次下決策時的謹慎程度，幒之還是因人而異吧，無悔萬歲。
{{ greenline -->

不只是遊戲，試錯法也被運用在各領域中。化學家們隨機的嘗試不同化學品，直到找出具有所需效果的那個。而各種運動競技的隊伍也透過不斷試錯，在競賽中嘗試不同策略和陣容，累積經驗最終擊敗對手。

甚至是生物進化的過程本身，也屬於一種極長期的試錯過程。隨機的突變和遺傳變異都是為了 <h> "測試不同改變對於環境的適應性" >}}。在經過長時間的不斷試錯後，最具適應性的基因組被保留了下來。

**_RogueLike_**

遊戲中有一種相當特殊的類型被稱作 RogueLike，是我最喜歡的遊戲類型之一，而他有兩大核心要素

+ 隨機生成 - 遊戲具有一定的隨機性，每次挑戰時玩家要面對的情況都會不相同，不同的地圖、不同的敵人和遭遇不同的事件

+ 永久死亡 - 遊戲過程中無法任意存讀檔，並且死亡將讓你失去一切，只能從頭來過

隨機性意味著你不能透過記憶關卡配置來破關，而永久死亡意味著玩家必須謹慎地走每一步、下每一個決策。有可能一路順遂卻在終點前失去一切，也可能苟延殘喘卻堅持到勝利。

{{< resources/image "failure_noita.gif" "100%" "圖片引用自 noita 介紹" >}}

從上述的特性就能夠表達出，這是一種會給人極大挫折感的遊戲類型。但人們依舊願意一次次嘗試，承受一次次慘烈的失敗直到通關，甚至嘗試通關數次，這是為什麼呢?

因為 <h> "失敗也是遊戲的過程之一" >}}，失敗在 Roguelike 中是理所當然的事情。玩家必須從不斷的失敗中學習，觀察這個世界的運作方式，熟悉所有敵人的行為，不斷學習直到獲得足夠的知識後才有可能通關。

因此，只有能接受失敗並學習的人，才能在 Roguelike 的洗禮下堅持住。

**_現實中的失敗_**

<!-- 失敗是學習的過程之一，失敗是再正常不過的事情。雖然現實中沒有讀檔的機會，但只會讓失敗顯得更加重要，因為在學習過程中失敗的目的，就是為了{{ orange "讓自己在未來無法失敗時能取得成功" >}}。 -->

SpaceX 數次的試射失敗，是為了讓載人火箭成功。而學生在學校每面對一次失敗，每從失敗中學習一次，就會降低未來遭遇失敗的機率。

不要將失敗給汙名化，鼓勵學生嘗試並給予適當回饋。將成績和價值的關聯移除，成績是學生用來驗證所學，而 <h> "不是讓學校、教師以及家長用來排名和競爭" >}}。

把目光放在學生學到了什麼，才能讓它們真正接受失敗並從中學習。

### 齊頭式的標準

體制中的所有學校都使用相同課綱，而課堂中的學生都只能依照教師的進度上課。而且還要同時學許多不同科目，在這種環境中的學生們，每天都被迫面對巨大的壓力。

但是 <h> "每個學生擅長的都不同，適合的學習步調也不同" >}}。如果教育體制要求所有學生都用同樣標準，對一部分人來說能夠接受，對另一部份來說可能就太過簡單或困難了。

**_遊戲中的難度_**

在難度曲線中，有塊被心理學家和遊戲設計師們稱作的 "心流" 區域，這是一塊最適當的的難度範圍，不會簡單到讓人覺得無聊，但也不會困難到讓你無法繼續。當我們處在這一範圍中的時候，會對於眼前的事物相當專注，並感覺時間飛逝。

{{< resources/image "difficulty_flow.jpg" "80%" "圖片引用自 What Capcom Didn't Tell You About Resident Evil 4" >}}

所有遊戲都試圖讓玩家的感受維持在這個區域內，因此會有所謂的 "難度設定"。讓玩家可以根據自己的需求調整難度，而遊戲會根據選取的難度，調整參數甚至是整個系統簡化都有可能。

如此一來就能配合各種程度的玩家，或者讓他們從簡單的模式熟悉後，再去挑戰更高的難度。

**_動態難度設置_**

但難度選項也不是萬能的，最直觀的解釋方法就是 - 我要怎麼在一進入遊戲，還對實際難度不了解的時候選擇適合的難度?

{{< resources/image "difficulty_mene.jpg" "80%"  >}}

如果玩家一開始就選擇了錯的難度，可能讓實際的難度曲線在心流範圍外。尤其在非重複遊玩型的線性劇情遊戲中，玩家可能在不理想的體驗下結束遊戲，從此沒有再開啟過。

<!-- 為了應對這種可能，動態難度設置 dynamic difficulty setting 被發明出來，這項系統可以根據玩家在遊戲中的表現，{{ orange "被動中且隱密地修改遊戲難度" >}}，好將難度曲線維持在不同玩家的心流範圍中。 -->

惡靈古堡 Resident Evil 4 中，除了常規的難度選項以外就有隱藏的動態難度設置。如果玩家表現的良好(命中率高、時常閃過敵人攻擊)，那麼隨者遊戲進行敵人將變得更具威脅和侵略性。反之，若玩家不斷受傷或死亡，那麼遊戲將變簡單，敵人的反應會變更慢，而箱子裡的財寶會更加豐厚。

{{< resources/image "difficulty_dynamic.jpg" "80%" "圖片截自 What Capcom Didn't Tell You About Resident Evil 4" >}}

當然其實也有其他遊戲使用這種設置，但很難被注意到。這就是動態難度精妙的地方了，有些硬核玩家不喜歡遊戲過於明目張膽的 "幫助" 它們，如果不事先知情，大多玩家 <h> "甚至連這一系統的存在都不會發現" >}}。

{{< resources/image "difficulty_burk.jpg" "80%" "圖片截自 What Capcom Didn't Tell You About Resident Evil 4" >}}

**_絕對的難度_**

當然，有些遊戲對於自己的難度是不容質疑的，例如黑暗靈魂。這是因為設計者想要的就是 <h> "讓玩家處於壓倒性的劣勢中，並最終戰勝敵人以此獲得巨大的長就感" >}}。

強大的敵人只是為了鼓勵玩家熟悉戰鬥系統，善用格檔、背刺對付敵人，透過 i-frames 的無敵效果閃躲揮砍來的巨劍；地圖中的陷阱鼓勵玩家仔細觀察，利用吊橋來陷害敵人；而那些強到不可思議的 Boss，則會讓你在砍下最後一刀時感到如釋重負。

{{< resources/image "difficulty_darkSouls.jpg" "80%" "圖片截自 Should Dark Souls Have an Easy Mode?" >}}

> Ever since Demon's Souls, I've really been pursuing marking games that give players a scense of accomplishment by overcoming tremedous odds. Hidetaka Miyazaki

如果失去了高難度的挑戰，將會削弱每次擊殺敵人、每條發現的捷徑、每次的死裡逃生和每次擊敗 boss 帶來的成就感。

<!-- {{ greenline >}}
但即使是超高的難度，他依然會在心流的範圍中，至少對魂系玩家來說是這樣
{{ greenline -->

**_輔助模式_**

除此之外，有些設計者也希望在保持難度的同時，讓遊戲能被更多人接受。因為可能有某些玩家是對遊戲有興趣的，或是想要體驗其中的特定部分，但卻被可怕的難度所阻擋。

以極具爭議的高難度 Roguelite 遊戲 - 黑暗地牢 Darkest Dungeon 為例，即使是回合制戰鬥中也會給玩家極大壓力。而遊戲中有兩項設定相當惹人厭，第一就是敵人的屍體機制，再來則是撤退失敗的判定。

{{< resources/image "difficulty_darkestDungeon_retreatFailed.jpg" "80%" "圖片截自 Should Dark Souls Have an Easy Mode?" >}}

雖然開發著認為這兩項設定是遊戲機制中的必須，但並不是所有玩家都能夠接受。為此，輔助模式誕生了，遊戲中允許玩家修改或關閉某部分機制，以減輕壓力。

{{< resources/image "difficulty_drakestDungeon_gamePlaySetting.jpg" "80%" "圖片截自 What Makes Celeste's Assist Mode Special" >}}

當然的，這些設置都會被藏在選項的深處，並且明確的說明這不是開發者的本意 "我們不建議修改這些選項，除非遊戲真的困難到讓你無法繼續"

> I don't want players to fell like they're being asked to design how the game should work. Tom Francis - Heat Signature
<!-- 
{{ greenline >}}
有些遊戲的輔助模式會以不同形式出現，例如 Mod 或 DLC，不過他們的重點都是清楚地表明了這並非常規遊戲的一部分
{{ greenline -->

**_學生的步調_**

<!-- 如果系統能讓學生能按自己的步調前進，{{ orange "進入心流的狀態下學習，會比追著學校的進度跑還更有效率" >}}。 -->

以遊戲化語言學習平台 duolingo 為例，它透過不同單元的等級機制，能夠有效的配合每個人的學習進度調整難度。

### 內容遠超需求

從小學到高中，回顧一下學校在我們的學習過程中都教了哪些東西。國英數自社、生物化、歷地公以及其他複雜到列出來很麻煩的科目，學校在短短幾年內就 <h> "傾倒了大量的知識給學生" >}}，並期望學生能夠學會這一切，在未來需要的時候回想起來。

<!-- 過去的文章有講過，尤其在應試教育的環境下，學生們連這些知識的用途都不知道，只是將他們全部記下並用以考試，{{ orange "等到真正需要時早已遺忘殆盡" >}}。 -->

<!-- 學生們不斷重複記憶和遺忘的過程，{{ orange "逐漸消磨學習意願並最終對一切感覺到厭煩" >}}。 -->

**_遊戲中的教學關卡_**

當然這項問題遊戲設計師們也遇到過，並被反映在所謂的 "教學關卡" 設計中。

說到遊戲中的教學，首先想到的就是在玩家剛進入遊戲時會遇到的一系列關卡。遊戲在這些關卡中，教玩家遊玩過程中會需要的一切。當遊戲真正開始時，玩家便能透過這些知識，在遊戲的世界中生存。

{{< resources/image "tutorial.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

看起來很正常? 現有的教育也是如此，我們讓學生在學校時學習未來可能需要的一切知識(tutorial)，並期望他們在需要時能運用這些知識(gameplay)。

<!-- 但是，開發者在這種作法中注意到一項問題 - 玩家的{{ orange "學習意願是和投注時間呈正比的" >}}。 -->

{{< resources/image "tutorial_investment.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

<!-- 所以當遊戲剛開始就展示一拖拉庫教學關卡時，往往會超出玩家的需求和意願。在開始有趣的遊戲以前，還得經過又臭又長的教學關卡，這種做法可能導致糟糕的學習體驗，甚至是{{ orange "直接阻止玩家進入遊戲真正好玩的部分" >}}。 -->

**_拆分並依需求分佈_**

那遊戲設計師們是如何解決這項問題呢?

其實並沒有任何規定說，我們一定得在遊戲開始前教會玩家一切。這意味著我們可以 <h> "將教學內容進行拆分，並分佈在玩家的遊玩過程中" >}}。

{{< resources/image "tutorial_split.gif" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

這種作法有許多優點。第一也是最大的優點就如上部分說的，透過延遲教學發放的時機，遊戲可以等到玩家投入更多時間後，再將進階的部分展示給他們看，以避免學習意願不足的問題。玩家也可以立刻開始遊戲，而不用先將無聊的教學破完。

<!-- 以及，這種做法可以讓我們推遲訊息傳遞的時機，{{ orange "等到玩家真正需要時再向其展示" >}}(例如第一次開啟工作檯時，才顯示合成道具的教學)。如此一來便可以很大程度地避免，玩家在先前的遊玩過程中遺忘某些還沒用到的操作。 -->
<!-- 
{{ greenline >}}
其實還有一個優點是，將內容拆分的夠細甚至可以設計出 "隱形的教學"，但我覺得它更適合放在下一章中
{{ greenline -->

**_更加複雜的遊戲_**

拆分教學的做法可以在線性以及內容隨遊玩進度增加的遊戲中有效 (如銀河惡魔城 Metroidvania)。但如果在機制更複雜的遊戲中，像是經營、戰略和 4X 類型，拆分的單純作法或許成效不佳...或難以達成。

因為這種類型的遊戲，通常所有的系統都是環環相扣的，但就沒有解決方法了嗎? (以科幻 4X 為例，可能有星球、影響力、建設、科研、內政、外交、市場及軍事，而這還只是一小部分)

{{< resources/image "tutorial_stellaris.jpg" "80%" "圖片截自 stellaris 宣傳用圖，這還只是複雜系統的其中一部分" >}}

我們能從 "文明帝國 Civilization" 這款遊戲中學習，他的作者發明了一個名詞 - 決策的倒金字塔 inverted pyramid of decision making。

簡單來說，當遊戲開始時，第一個回合只需要做一個決定 - 定居點位置。而第二個回合你要做的也只有決定要建設什麼。接著你才開始決定新的單位該做什麼事，以及新的城市要作什麼決策。

不久後，這些決策開始膨脹，最後玩家將管理數百個單位及城市，在每個回合裡做出數十個決策。

{{< resources/image "tutorial_decision.gif" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

文明在遊戲的過程中，從模糊地圖中的一個定居地、成長為一個由複雜國家組成的龐大帝國。藉著緩慢增加複雜度而不是一口氣展示所有系統，相當優秀的教會了玩家遊戲中的一切。

{{< resources/image "tutorial_civilization.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}
<!-- 
{{ greenline >}}
之前一直不懂有什麼難的，寫到這裡才意識到許多 4X 的教學設計其實都很糟糕，對就是說你 Stellaris。雖然文明的教學算不錯的，但實際感受還是因人而異，因為這類遊戲的複雜度本來就不是所有人都能接受。
{{ greenline -->

**_應用的重要性_**

<!-- 回到現實，雖然章節中說到的是拆分教學，直到玩家有足夠意願時才給予，但現讓學生們爭正遇到問題時才給予知識顯然不實際，畢竟學校的目的就是{{ orange "讓學生學習未來應對問題的方法" >}}。 -->

<!-- 因此，這裡真正想提的是 "應用"，如果可以在課堂中插應用的部分，{{ orange "讓學生了解所學的用途" >}}，能夠有效提高學生們的學習意願，而不是一股腦地把所有東西灌注給學生，並期望它們記住。 -->

### 應試阻止思考

<!-- 同樣的，在應試教育中的關係，學生通常傾向於記憶而非學習，因為 <h> "記住資訊相比真正的吸收知識來說快多了" >}}。抄筆記、畫重點、背公式，學生不斷重複機械性的動作，試圖將一切資訊寫入大腦，{{ orange "而不是去思考和了解背後的邏輯" >}}。 -->

**_點擊這裡，然後按一下那個按鈕_**

當然，我們也能在遊戲教學中看到類似的身影。某些遊戲教學透過引導玩家動作，來讓它們完成某些事情 - 點擊這裡、選取這些單位、按一下這個按鍵、拖動這項元素，嗯...你在做事! 你真聰明!

{{< resources/image "tutorial_clickthere.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

但這樣真的有效嗎? 事實上這種作法被稱作動覺學習 kinaesthetic learning，這是種透過身體行為行動來學習的方法。

或許這種做法在動作類遊戲中有效，畢竟動作遊戲的操作是其中占比相當大的成分。但是對於思考策略類就不那麼適合了(像上章說的 4X 類)。

<!-- 光是讓玩家點擊市場介面的按鈕，無法讓它們了解遊戲中複雜的金融機制；光是拖曳軍團圖示，也無法讓玩家學會兵力分配的邏輯。玩家雖然諄照指示完成了所有教學，但真正開始時還是不知該從何下手，{{ orange "盲目諄循指示並不是好的學習方法" >}}。 -->

> As for as the game is concerned; I have advanced. But as for as my brain is concerned; I've learned nothing. Asher Vollmer - Designer, Threes

**_引導式教學_**

來看看開發著們是怎麼面對這項難題的。以遊戲 Threes 為例，這是一款簡單的益智遊戲，玩家必須透過滑動組合出數字。

教學可以簡單地告訴玩家要如何行動(向左滑動兩次，向上滑動兩次)，但遊戲卻透過提示的方式，引導玩家思考該怎麼做(將數字推到牆壁來重新排列，使用牆壁來使兩個數字相加)。

{{< resources/image "tutorial_threes_B.gif" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

雖然這只是簡單的任務，但也足夠驅使玩家自己動腦筋，而非照著指示行動。

再讓我們看看複雜遊戲是如何達成的，以動物園之星 Planet Zoo 為例。遊戲中的第一個教學教導玩家改善動物的福利，動物園中的老虎因為棲地不正確而感到不適。

"Aww, poor dabs! I'm sure it can't have escaped your attenction that the tigers look a bit miffed. That's because they aren't too keen on the type of terrain."

<!-- 遊戲透過簡單明瞭的提示告訴玩家這件事，{{ orange "引導玩家思考如何改善棲地" >}}。而不是告訴玩家點開地形編輯面板，選擇某種地面後鋪設在棲地中。 -->

接者，他要求你去改善動物園中所有動物的整體福利。

"Well then, all of that should give you a pretty good understanding of how to make animals happy, so I'd like you to go check on all the other animals in the zoo and fix up any issues with their habitats."

{{< resources/image "tutorial_zoo.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games" >}}

遊戲讓玩家繼續下去，而在這個過程中玩家幾乎沒得到任何的直接指導，因此你 <h> "必須將剛剛學到的付諸實現，並進行一些批判性思考來填補知識的空白部分" >}}。從一項簡單的任務開始，然後讓你思考並解決更多問題，相當卓越的教學方法。

**_思考和回饋_**

<!-- 雖然引導式教學能夠有效的讓玩家自己思考，但光這樣仍不是完美的解決方案，{{ orange "因為過程中缺乏了 \"回饋\"" >}}。 -->

當我們進行動覺學習時，我們會透過回饋來判斷自己的行動是否正確。在動作類遊戲中，玩家犯的錯通常都能直觀的被反映在畫面上，像是受傷和死亡。但是在複雜的策略類遊戲中，錯誤的決策往往會在背地裡引響發展，等問題顯現時已經難以找出原因了，因為這類遊戲的 <h> "回饋週期相當漫長" >}}。

為此，遊戲中常常出現所謂的 "顧問" 角色，當玩家做出某些可能造成負面影響的決策時，它們就能夠及時的將訊息回饋給玩家。

在遊戲外星貿易公司 Offworld 中，若玩家以過低價格出售鋁資源，顧問將會出來告訴玩家這和贈送沒兩樣，並接著教導玩家遊戲市場的運作方式。

{{< resources/image "tutorial_feedback.jpg" "80%" "圖片引用自 Can We Make Better Tutorials for Complex Games, Offworld" >}}

<!-- 在遊戲中，教學能夠容易地告訴玩家該如何做，但卻{{ orange "很難將為什麼要這樣做的原因解釋給玩家理解" >}}。如果透過顧問的形式，就能快速提供建議和警告，縮短複雜遊戲的回饋週期，讓玩家了解行動背後的意義。 -->

**_隱形的教學_**

假如開發者設計了一項機制，玩家在遊戲中可以透過肢解怪物的部位來達成有效傷害，那麼我們該怎麼告訴玩家這件事呢?

絕命異次元 Dead Space 是這樣做的，他先是用場景中的血書寫下 CUT OFF THEIR LIMBS，接著跳出一個提示說 "把腳射斷以造成額外傷害"，再來會拿到一個音訊記錄告訴你得切斷敵人的腳，然後又有個角色打電話來再說一次...然後再再跳出一次視窗提示。

{{< resources/image "tutorial_deadSpace_A.jpg" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Dead Space" >}}

最後，玩家可能還是搞不清楚狀況，也可能覺得自己被當作嬰兒了。有沒有更好的做法呢? 讓我們看看戰慄時空 Half Life 中是如何教會玩家類似情形的。

在玩家第一次進入 Ravenholm(地名) 時會看到這個場景，一隻被鋸片切開的殭屍。

{{< resources/image "tutorial_invsible_A.jpg" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Half Life" >}}

接著，通往下個區域的門口被鋸片所阻擋了，因此玩家必須先用重力槍將鋸片取下才能通過。並且在玩家取下鋸片的同時，視野前方的場景(會)走出了一隻殭屍，於是玩家反射性地按下發射鈕，高速飛出的鋸片便斬斷了目標。

{{< resources/image "tutorial_invsible_B.gif" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Half Life" >}}

兩個橋段，不到 10 秒的過程，玩家就學到了鋸片可以有效地對付殭屍。

<!-- 在 Half Life 的遊戲過程中，每個部分都高明的引導著玩家行動。沒有人告訴玩家該怎麼做，也不需要惱人的彈出視窗，{{ orange "只有透過 \"示範\" 來展示給玩家看" >}}。每當有新的威脅時，巧妙的遊戲設計都會讓玩家先站在安全的地方，並展示出遊戲規則。 -->

{{< resources/image "tutorial_invsible_C.gif" "80%" "圖片引用自 Half-Life 2's Invisible Tutorial, Half Life 展示藤壺怪的掠食方式" >}}

<!-- {{ greenline >}}
其實很多老式遊戲，如 Super Mario Bros(1985) 都有做到這種隱形教學。不光是設計師的思考精妙，也是當時硬體限制下的必須，因為開發者們只能透過將教學融入關卡的方式，來減少遊戲空間。
{{ greenline-->

**_思考、回饋和示範_**

遊戲中透過引導玩家思考的方式，教會他們一項項遊戲中的複雜機制；透過給予回饋，讓玩家了解自己決策可能造成的長期影響；並透過示範，讓玩家在不知不覺中遊戲的運作方式。

如果體制能引導思考，給予回饋並在必要時透過示範幫助學生理解，學生才可能真正的學習知識，而非為了考試而記憶資訊。

### 創造力被抹殺

就像工廠製作機械一樣，制式教育中的學校打造出了一台台的考試機器。
<!-- 
學生們的家政課被拿來考國文，美術課被借去上數學。為了分數，將自己沒經歷過的事情形容的歷歷在目，為了填充心得字數而去抄封底的提要。寫作的目的變成取得更好的成績，{{ orange "而非表達自己真正的想法和經歷" >}}。 -->

寫到這章時我突然意識到，學校的影子裡似乎出現了各種題材故事中會看到的反烏托邦社會，人們沒有表達思想的機會，所有人都如同傀儡一般動著，停止思考。

{{< resources/image "schoolisafactory.jpg" "100%" "google image school is a factory" >}}

而也如同各種作品的發展，人們開始嚮往一個不受拘束，能夠自由展現創意和想法的世界。

**_Sandbox_**

沙盒 Sandbox，就如同它的名稱一樣，裝著沙的盒子，用沙子建立起自己的世界。它在遊戲開發的領域中代表一種類型，而 "創造" 一詞就是對這種類型的遊戲最好的描述。

> the metaphor a child playing in a sandbox...produc a world from sand. Steve Breslin, Game historian

而說到沙盒遊戲，最標誌性的當然就是 Minecraft，一個只有方塊的世界，看似乏味卻充滿著無限的可能。玩家們在這之中打造一個又一個世界，而孩子們在這裡建築自己的城堡。在這個世界，沒有人會對你的創作指指點點，你可以在這個虛擬的畫布上揮灑創意。

{{< resources/image "sandbox_minecraftA.jpg" "100%" "圖片截自 The Lord of the Rings in Minecraft: Celebrating 10 years of building!" >}}

**_不該用模板化的標準看待創作_**

<!-- 作文不應該用一條條的規章評分，心得應該表達真實感受，{{ orange "創意不該被教育抹煞" >}}。 -->

我從來沒在作文考試取得過好成績，但現在卻能持續寫日誌，甚至是用萬字的文章來分享自己的經歷和想法。究竟是我不擅長寫作，還是環境阻止我創作?

---

## 遊戲化的教育

上學不是件有趣的事，相信大多制式教育中的學生都這麼認為。但學習應該要更有趣才對，因為 <h> "只有樂在其中時，才能最大化學習的效益" >}}，我們應該重視這件事實。

> We learn best when we’re fully engaged - when it doesn’t feel like we’re learning, but simply enjoying ourselves. 截自參考文章 Video Games in Education: How Gaming Can Sharpen the Mind

第一部分中我們談論了現有教育的問題，以及在遊戲中的相似情形。如果能夠將我們在各種遊戲中看到的優勢引入教育，是否能夠有效的改善學生們的學習狀況?

遊戲化 Gamification 一詞並不是近年來才出現的，事實上在十年前就有人關注以及嘗試融合至教育中，這裡就提供幾個案例給各位參考。

**_Institute of Play_**

由一群遊戲設計師成立於 2007 年的教育類非營利組織，期間持續為學校提供課程設計、教育計劃以及企業的培訓或研討會。

<!-- 他們推崇的主要學習法為互連學習 Connected Learning，其關鍵在於{{ orange "運用網絡和數位媒體帶來的豐富資訊和社會聯繫" >}}。互連學習有三大核心 -->

+ 興趣 - 興趣有助於我們集中註意力，能夠使人堅持更長久並學習的更深入
+ 支持 - 學習者在同伴和導師的支持下，更能從挫折和挑戰中堅持下來
+ 機會 - 課堂以外的成功需要有與現實職業有密切聯繫，提供學習者們在校內外互連學習的機會

{{< resources/image "connectedLearning.jpg" "80%" "圖片引用自 Institute of Play 網站上的 connected learning 解說" >}}

雖然組織已經關閉，但是他們將大量 [資源](https://clalliance.org/resources/) 保留了下來，可以在網路上找到。

**_Duolingo_**

透過遊戲化的設計來讓人學習語言，透過不同學習單元，將語言這種難以在短時間看到成果的學習，用單元等級的方式量化，反而更能讓人有持續的動力。

並且內容難度會隨者使用者等級增加，透過這種方式將難度為持在最適合的範圍中，讓人不斷重複聽、讀和寫，直到能牢牢記住。

以維持為首要目標，透過每日進度的獎勵機制，一天只需要花十到三十分鐘即可，鼓勵人們持續學習。

{{< resources/image "duolingo.jpg" "80%" "圖片截自 duolingo 網站" >}}

[Duolingo](https://www.duolingo.com)
<!-- 
{{ greenline >}}
我是在寫文章的過程中接觸到它的，寫完文章後才意識到 Duolingo 就是一個超正面案例，他們將許多我在文中提到的遊戲優點都融入語言的學習中。
{{ greenline-->

### 整個社會

遊戲化當然不只能運用在教育上，整個整個世界能被遊戲改變。無論是透過遊戲化改善人們的行為，抑或運用廣大玩家的創意解決難題。

**_Opower_**

試圖讓人們降低水電費的公司，他們看到改變人們行為的最好方式就是 - 展示他們的鄰居是怎麼做的。

就像第一部分中說到的競爭目標，公司將鄰居以及社區的平均水電展示給住戶看。而所有人都不希望自己的水電費比別人還高，因此以改善了水電使用的行為。

{{< resources/image "ted_opower.jpg" "80%" "圖片截自 TED 演講 Gamification to improve our world: Yu-kai Chou" >}}

最終，相比於過去他們在一年內節省了 2.5 億美元的水電費。不需要特別提供節省水電的獎勵，單純的展示出平均就能達到如此效果，競爭心理就是如此強大的驅動力。
<!-- 
{{ greenline >}}
當然也不能真的提供獎勵，我們提到過動機偏移了。如果真的提供獎勵可能導致人們開始...偷電。
{{ greenline-->

**_Eterna: Solving With The Crowd_**

由科學家開發的遊戲，遊戲中教了玩家 RNA 結構的設計和基本概念，並且有一些謎題可供玩家挑戰。遊戲中還有實驗室模式，允許玩家自由研究各種 RNA 結構。

{{< resources/image "eteRNA.jpg" "80%" "圖片截自 TED 演講 Future of Creativity and Innovation is Gamification: Gabe Zichermann" >}}

而實驗室模式就是遊戲誕生的主要原因之一，因為科學家們希望 <h> "利用廣大的玩家創意解決相關難題" >}} 。最後，作為玩家的普通人們，透過遊戲幫助科學家發現數以千計，過去未曾見過的 RNA 結構。

### 寓教於樂

除了將教育遊戲化，也有許多開發者試著將娛樂教育化，寓教於樂就是這類遊戲最好的描述之詞。

如果說解決謎題的方法是 "找出" 解答 (Discover The Solution)，那麼解決問題的方法就是 "創造" 解答 (Inventing A Solution)。

而遊戲中有種特殊的類別，就可以被稱作問題解決類遊戲 Problem Solving。

**_SpaceChem_**

透過編寫程序設計出生產線，並自動化各種化學鍵的組合。這款遊戲也被一些學術機構納入教材，用於教授化學和程式編寫的相關概念。

{{< resources/image "spaceChem.jpg" "80%" "圖片引用自 spaceChem 宣傳圖" >}}

**_Kerbal Space Program_**

一款高科學度的沙盒模擬類遊戲，玩家可以在其中設計各種形狀的太空載具，並且在真實的物理模擬下實現現實中的太空軌道操作。

遊戲中還有供玩家學習遊戲元素、天體物理、機師發展和導航技能的訓練模式，因此在科學界的社群中吸引了眾多科學家和航太工業從者的興趣，也啟發了許多想要投身於航太與其他類似領域的人。

{{< resources/image "kerbalSpaceProgram.jpg" "80%" "圖片引用自 Kerbal Space Program 宣傳圖" >}}

**_Minecraft_**

以及當然的，沙盒遊戲的指標 Minecraft 也屬於這類型。他的紅石系統一直都是很好的電子電路教材，從各種分類系統及建造的自動化產線，到使用紅石邏輯閘建立出的計算機都能被做出。

{{< resources/image "minecraft_calculator.jpg" "80%" "圖片截自 Puzzle Solving... or Problem Solving?" >}}

---

## 結語

### 環環相扣

在寫作的過程中，我盡可能地將各種問題分割開來，以確保每個章節的內容都有所區別。我也嘗試思考過哪個問題會造成最大的負面影響，但教育也和遊戲設計一樣，{{ orange "許多問題之間都是環環相扣的" >}}，一項缺點可能造成好幾種影響，而一個結果也可能是由複數原因造成的。

這些都是我自身觀察以及查閱資料後得出的主要問題，雖然並不是每項問題所有學生都一定經歷過，但依然是現有體制中存在且不可忽視的問題。

要在思考教育體制問題的同時，還要尋找切題的遊戲設計理論來對比真的是一項難題(尤其是前兩章)，希望這篇文章能讓各位滿意。

### 面對未來

寫到最後時，我突然思考起了一個問題。為什麼類似的情境下，總能夠在遊戲找到正面的例子，而我們教育體制卻改變的如此緩慢?

不是我刻意只找極端案例來對比，更不是遊戲設計戲比較簡單，而是這背後有個更加現實的差別在。

因為遊戲要面對的是 "玩家市場"，做為商業競爭的一部分，開發者們必須絞盡腦汁讓自己的遊戲比其他競爭者更有趣、更吸引人，讓遊戲將玩家留住越久越好，否則自己將 <h> "遭到市場的無情淘汰" >}}。在如此的壓力下，開發者們得以相當積極的態度改善遊戲，才能在市場中存活。

但是教育體制面對的是 "未來"，糟糕教育所 <h> "造成的影響不會在短時間內顯現" >}}，反而得等到未來十幾二十年才會反映在社會。而且，必須{{ orange "承受糟糕教育所造成影響的人也不是教育的提供者和家長們，而是當時處在體制中的學生" >}}。

**_聰明的漢斯_**

即使經歷過應試教育的學生，也不一定能意識到這項問題。在人們們離開學校後，對於教育這件事情，時常出現兩種完全對立的聲音。

> 畢業了那麼多年，根本就沒用到學校教的知識，當初為什麼要浪費時間在學校學習

> 畢業了越久越覺得，學校的知識非常有用，後悔當初為什麼不好好學習

通常，反方無法了解為什麼正方覺得學校的知識有用；而正面方在面對這種情況時，也時常試圖告訴反方要把目光放遠一點，甚至直接將反方視為上課不認真的學生來簡化答案。

但事實上，這兩種聲音都是正確的。即使是某些能在體制中取得高分的學生，未來也可能站反面的一方。這是為甚麼呢?

<!-- <h>Line >}}
因為兩者所指的 "知識" 根本就不是相同的東西

<!-- 
對於反方來說，當時在學校花費的時間其實是沒有浪費的。因為，當他們還在學校中時，學習的目的是取得分數，而 <h> "知識的用途則是想辦法最大化分數" >}}。當然，這些知識在脫離了學校，{{ orange "不需要分數以後也便無用了" >}}，因此產生了浪費時間的錯覺。 -->

而對於後悔沒好好學的人來說，他們指的則是 <h> "能夠在實際情況中運用的知識" >}}。當然這些學生也不見得在當時沒認真去學，而是在應試教育的體制中，本來就 <h> "不容易學習到真正有用的知識" >}}。

{{< resources/image "knowledgeisuseless.jpg" "80%" "圖片截自 到底是什么培养出了只会考试的 '高分低能' 生？" >}}

因此，只要應試教育存在，這個現象便會不斷出現。兩種聲音都沒有錯，它們都是應試教育下的受害者。

<!-- {{ greenline >}}
聲明一下，這裡不是要去捧素質教育 Quality Education 什麼的，只是提出應試教育造成的問題而已。素質教育也有引發階級複製的問題存在，想多了解的可以去看補充資料的最後一項。
{{ greenline-->

### 感謝閱讀

第二篇文章，一萬五千字!

和上篇一樣，大概花了半個月的時間來寫，寫作真的蠻花時間的，但感覺我越來越喜歡寫作了 ~

從前言到結語之間，我自己其實也學到了不少知識。很多設計理論是在之前就讀過的，但我其實沒有深入了解它們與教育的關聯。篇文章讓我在分享看法的同時，也思考了許多事情，真的很值得。

可惜的就是目前沒有教育相關知識，所以只能提供看法而非有建設性的建議 ):

希望未來有機會真的接觸相關領域，到時說不定又有新的想法可以分享了 ~

同樣的，如果有關於寫作的建議，或者對文章和教育的任何看法都歡迎討論 :D

感謝閱讀!!

如果喜歡文章的話也請幫我按個幾下拍手 ><

{{< likecoin >}}

### 參考資料
<!-- 
{{ greenline >}}
為了避免清單過長，我會把一些表層資料(如 wiki)給註解掉，完整清單的可以開網頁除錯看
{{ greenline-->

[Game Maker's Toolkit](https://www.youtube.com/channel/UCqJ-Xo29CKyLTjn6z2XwYAw)  
這篇文章的重點參考資料，一位由遊戲鑑賞家 Mark Brown 建立的遊戲設計解析頻道。頻道中解釋了各種遊戲設計理論，我的許多設計知識都是從這裡學來的。開發者必看，非開發者也可以了解看看遊戲是如何設計的。

[Following the Little Dotted Line](https://www.youtube.com/watch?v=FzOCkXsyIqo)

[What makes a hero? - Matthew Winkler](https://www.youtube.com/watch?v=Hhk4N9A0oCA)

[The Psychological Trick That Can Make Rewards Backfire](https://www.youtube.com/watch?v=1ypOUn6rThM)  
動機偏移等相關文獻可以在這部影片下方的描述中看到。

<!-- [Overjustification effect](https://en.wikipedia.org/wiki/Overjustification_effect) -->

<!-- [Achievements Considered Harmful?](http://www.chrishecker.com/Achievements_Considered_Harmful) -->

<!-- [Trial and error](https://en.wikipedia.org/wiki/Trial_and_error) -->

[Playing Past Your Mistakes](https://www.youtube.com/watch?v=Go0BQugwGgM)

[Should Dark Souls Have an Easy Mode?](https://www.youtube.com/watch?v=K5tPJDZv_VE)

[What Capcom Didn't Tell You About Resident Evil 4](https://www.youtube.com/watch?v=zFv6KAdQ5SE)

[What Makes Celeste's Assist Mode Special](https://www.youtube.com/watch?v=NInNVEHj_G4)

[Can We Make Better Tutorials for Complex Games?](https://www.youtube.com/watch?v=-GV814cWiAw)

<!-- [Connected learning](https://en.wikipedia.org/wiki/Connected_learning) -->

<!-- [Institute of Play](https://clalliance.org/institute-of-play/) -->

[The Future of Creativity and Innovation is Gamification: Gabe Zichermann at TEDxVilnius](https://www.youtube.com/watch?v=ZZvRw71Slew)

[Video Games in Education: How Gaming Can Sharpen the Mind](https://plarium.com/en/blog/video-games-help-education/)

<!-- [Gamification of learning](https://en.wikipedia.org/wiki/Gamification_of_learning) -->

[Classroom Game Design: Paul Andersen at TEDxBozeman](https://www.youtube.com/watch?v=4qlYGX0H6Ec)

[Gamification in Higher Education | Christopher See | TEDxCUHK](https://www.youtube.com/watch?v=d8s3kZz1yQ4)

[New educational video game used in schools](https://www.gamasutra.com/view/pressreleases/154246/New_educational_video_game_used_in_schools.php)

<!-- [EteRNA](https://en.wikipedia.org/wiki/EteRNA) -->

[Puzzle Solving... or Problem Solving?](https://www.youtube.com/watch?v=w1_zmx-wU0U)

[到底是什么培养出了只会考试的“高分低能”生？](https://www.youtube.com/watch?v=Nd71hHYKtTc)  
文章結語中提到的正反面聲音，內容主是參考自這部影片，他將這項問題解釋的相當清楚，建議有興趣的人看一看。

<!-- [Clever Hans](https://en.wikipedia.org/wiki/Clever_Hans) -->

縮圖來源為 [unsplash.com](https://unsplash.com/) 素材庫
