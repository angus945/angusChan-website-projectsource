---
title: "我的第一個專案 - 投擲地牢"
date: 2021-05-18T19:55:10+08:00
lastmod: 2021-05-18T19:55:10+08:00
draft: true
keywords: []
description: "我人生中第一個完成的遊戲專案，長篇心得"
tags: [gamedev, devlog]
category: "blog"
author: "angus chan"
featured_image: "/blog/myfirstproject/featured.jpg"
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


## 起因



### 道具和庫存系統

在兩年前我做了個道具和庫存系統，這個系統被做的相當泛用，導入就後也不需要多做設定，只需要建立道具的 Prefab 然後設置識別 ID 和屬性就好，其他放置、疊加丟棄都被包括在系統中

{{< sc_pathImage "inventory.gif" "70%" >}}

https://home.gamer.com.tw/creationDetail.php?sn=4596708

### 自學報告

再來是當時離隔年四月的自學期中報告蠻接近的，所以就想說嘗試做個相較完整的專案來當報告的成品

## 投擲地牢 !

這篇文章是在完成專案的一年後寫的，所以有些細節已經忘了，這篇是看過去的紀錄文章寫出的濃縮版本

### 瞄準，投擲 !

投擲武器 - 當玩家靠近道具時可以使用空白鍵拾取，並透過滑鼠左鍵瞄準投擲
{{< sc_pathImage "player_throw.gif" "70%" >}}

輔助瞄準 - 瞄準時會出現線條和準心，並使用程式為瞄準線添加簡單的動畫，線條虛線是透過滾動 uv 來達成的
{{< sc_pathImage "player_aiming.gif" "70%" >}}

穿牆修復 - 
遊戲中高速移動的物體，可能因為幀數不足而發生穿隧的現象，最簡單的修正方法就是對道具經過的路徑進行設限投射，檢查路徑上是否有障礙物

### 更多道具 !

添加更多不同的道具和武器來提高遊戲豐富度，不過為了保留一點神秘感這裡就不詳細解釋它們的效果

消耗品 - 消耗性道具，但是可以疊加好幾個並連續投擲
{{< sc_pathImage "item_throwing.jpg" "70%" >}}

法杖 - 兩種類型的魔法杖，相當稀有的掉落物
{{< sc_pathImage "item_magicWand.jpg" "70%" >}}

魔法劍 - 三種擁有擁有特殊效果的的魔法劍，只能和商人購買
{{< sc_pathImage "item_magicSword.jpg" "70%" >}}

藥水瓶 - 一次性使用的藥水瓶，扔出破裂後會有殺傷性的特殊效果
{{< sc_pathImage "item_potions.jpg" "70%" >}}

炸彈 - 投擲後可以造成範圍殺傷的兩種炸彈，也可能炸傷玩家
{{< sc_pathImage "item_bombs.jpg" "70%" >}}

錢幣 - 遊戲中的貨幣，可以和商人購買稀有武器或是也拿來丟
{{< sc_pathImage "item_money.jpg" "70%" >}}

心形容器 - 遊戲中的回復手段，只要使用它來投擲敵人就行，而回復的血量就是疊加數量
{{< sc_pathImage "item_healHeart.jpg" "70%" >}}

### 敵人 !

為了不讓玩家在地圖中自嗨，需要為遊戲添加一個敵人 !

追逐 - 最最基本的敵人行為，朝玩家方向移動
{{< sc_pathImage "enemy_tracing.gif" "70%" >}}

攻擊 - 敵人攻擊前會有會有簡單的變色和停頓作為前搖，然後朝玩家當時所在的方向進行衝撞，路徑上會留下一些粒子來提高辨識度，玩家必須要在攻擊前就先離開敵人的攻擊路徑
{{< sc_pathImage "enemy_attack.gif" "70%" >}}

道具 - 擊殺怪物後會掉落不同的武器道具，這也是玩家的主要道具來源
{{< sc_pathImage "enemy_treasure.gif" "70%" >}}

### 更多敵人 !

為了提告遊戲的豐富度及環境的變化性，我也為遊戲多添加了幾種不同類型的敵人

射手 - 遠距離射擊的射手怪物，待在原地蓄力一段時間後朝玩家方向發射子彈，當玩家靠近時會試圖保持距離，用有較少的血量
{{< sc_pathImage "enemy_shooter.gif" "70%" >}}

砲手 - 遠距離投射滯物的史萊姆，如果待在滯留物裡的話會持續受傷，移動緩慢但是血量很厚
{{< sc_pathImage "enemy_slime.gif" "70%" >}}

召喚師 - 會召喚小怪的召喚師，每隔一段時間會產生出一隻小鬼來攻擊玩家，為了防止地圖被小鬼淹沒，每隻召喚師都有各自的召喚上限
{{< sc_pathImage "enemy_summoner.gif" "70%" >}}

小鬼 - 移動速度和攻擊速度較快，血量和攻擊範圍較小的惱人小鬼們，只會被召喚師召喚
{{< sc_pathImage "enemy_little.gif" "70%" >}}

這三種類型就能為遊戲；
解決遠距離支援的射手和砲手；解決不斷產生小鬼的召喚師；解決眼下威脅最大的追兵

補給怪 - 他們是會掉落回血道具和錢幣的特殊怪物
{{< sc_pathImage "enemy_supply.jpg" "70%" >}}
<!-- TODO 圖片 -->

### 地圖

遊戲中使用的地圖和場景，地圖是使用 Unity Tile map 繪製的

地圖 - 遊戲的地圖，使用簡單的錐形來提高開闊感
{{< sc_pathImage "map.jpg" "70%" >}}

陷阱 - 當有目標從上方經過時會戳傷目標的尖刺陷阱
{{< sc_pathImage "map_trap.jpg" "70%" >}}

清除 - 因為敵人不斷的掉落道具，導致場景中會有過多的武器在地上，所以在每一波開始時會清除場景中的低階道具
{{< sc_pathImage "map_clear.gif" "70%" >}}

儲存箱 - 用來保存道具的箱子，避免道具被清除 (但好像沒什麼用，因為我把清除道具改成只清除低階的了)
{{< sc_pathImage "map_chest.gif" "70%" >}}

商人 - 在地圖最上方的商人，玩家可以收集金幣並向商人購買稀有武器，只需要將錢錢扔給他並撿起道具就是購買，商人會判斷金幣的疊加數量就知道是否足以購買道具 :D
{{< sc_pathImage "map_shop.gif" "70%" >}}


### 遊戲循環 !

遊戲採用的是接機類型的無盡模式，遊戲會持續進行直到玩家死亡，因為這種模式實作簡單也不需要花太多時間設計關卡

標題 - 簡單布置了一下進入遊戲時的標題畫面
{{< sc_pathImage "scene_title.gif" "70%" >}}

轉場 - 使用主角和南瓜頭的動畫當轉場畫面 :D
{{< sc_pathImage "scene_translate.gif" "70%" >}}

暫停 - 遊戲中可以使用 esc 暫停，畫面右上角的問號可以觀看教學說明
{{< sc_pathImage "scene_pause.jpg" "70%" >}}

生怪 - 遊戲中的怪物以會一波一波形式出現，並隨著波數提高逐漸增加數量，每波結束後可以撿起地圖中央的獎勵道具進錄下一波
{{< youtube "VnYIzaqBwEM" >}}

### 畫面控制 !

縮放 - 起初在玩家瞄準時有些微的攝影機縮放和位移，但後來測試感覺效果不好就移除了
{{< sc_pathImage "camera_aimScale.gif" "70%" >}}

震動 - 玩家受傷時添加了攝影機晃動和短暫的放慢效果來提高辨識度，效果挺不錯的 :D
{{< sc_pathImage "camera_hurt.gif" "70%" >}}


### 音效 !

https://home.gamer.com.tw/creationDetail.php?sn=4654337
https://home.gamer.com.tw/creationDetail.php?sn=4655231
https://home.gamer.com.tw/creationDetail.php?sn=4656276

### 背景音樂 !

https://home.gamer.com.tw/creationDetail.php?sn=4677539

## 結語

感謝各位閱讀到這 :)

專案的開發時長為一個月，作為第一次完成的遊戲作品，我其實是相當滿意的 :D

附上最終遊玩畫面的影片，然後幀數有點低是我電腦錄製的問題 ):

{{< youtube "rp3Zl8S3GPg" >}}

遊戲發佈在 Itch.io 上，有興趣的可以下載來玩玩看 - [點我下載](https://angus945.itch.io/drop-throw-dungeon)

也有在國內的遊戲平台木屋發佈歐 - [點我下載](https://indiecabin.net/project/DropThrowDungeon_p)

### 真正的構想

其實專案一開始不是想做成這種街機遊戲的無盡模式

我真正想做的其實是一個半解謎類型的地牢，用自製的道具交互系統做物理解謎，其實原本道具系統裡還有簡單的物理交互

{{< sc_pathImage "interaction1.gif" "70%" >}}
{{< sc_pathImage "interaction2.gif" "70%" >}}

差不多就是引火把木門燒開，用水滅火來通過一些區域這種，想說先做的簡單的小地圖測試，成功了在擴大

這就是為甚麼一開始的地圖會比較大張一點，但還是超出當時的能力範圍了，沒辦法繼續做下去，所以來想說先做個簡單一點的，讓4月的報告有東西可以看，所以就改成現在這種一波一波打怪的形式

機會還是希望能真正完成它啦，現在的程式能力和觀念相比過去也提升許多了，但最缺的就是時間了 D:

[當時的心得文章](https://home.gamer.com.tw/creationDetail.php?sn=4680762)

[完整的開發日誌](https://home.gamer.com.tw/creationCategory.php?owner=angus945&c=450268)

### 缺陷

當然以現在的角度來看遊戲中有許多相當大缺陷

首先我當時沒有數據化的概念，每個道具都用 Prefab 儲存在資料夾中佔據相當大的空間，而且在遊戲場景裝也都用各自的實體物件儲存，而不是現在用物件容器替換資料的做法

那個道具系統在這專案之後就被我封存了，不過在那時我對這個系統還蠻滿意的 :D

再來是對設計模式和遊戲架構的熟悉度不夠，封裝沒做好、單例橫行導致程式碼就像打結的毛線球一樣，重頭再做一次都比修改來的輕鬆把

最後是設計上的問題 - 難度過高，因為在測試的時候不段重複試玩導致我容易習慣遊戲的難度，於是也就不斷提高遊戲難度，果然外部意見真的很重要阿

### 使用資源

專案使用的美術資源為 itch.io 作者 [0x72](https://itch.io/profile/0x72) 繪製的 CC0 Pixel art

[16x16 Dungeon Tileset](https://0x72.itch.io/16x16-dungeon-tileset)

[dungeontileset-ii](https://0x72.itch.io/dungeontileset-ii)

