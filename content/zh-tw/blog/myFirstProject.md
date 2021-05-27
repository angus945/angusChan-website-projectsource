---
title: "我的第一個專案 - 投擲地牢"
date: 2021-05-18T19:55:10+08:00
lastmod: 2021-05-18T19:55:10+08:00
draft: false
keywords: []
description: "人生中第一個完成的遊戲專案，開發過程及心得"
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


## 第一個完成的專案

在 2019 年初時，我完成了人生中第一個遊戲專案 - 投擲地牢

當時會開始這專案的原因是腦中突然出現了很有趣的想法 - 如果遊戲中所有武器都只能用丟的會怎樣 ? 

再來是年初時也離我非學的期中報告蠻接近的，但在這之前我的所有專案都只有做出簡單的雛型就停止了，許多構想都超出當時的能力範圍，所以就想說嘗試做個相較完整的專案來當報告的成品

綜合以上因素，於是我就開始這項專案了 !

事隔多年有些細節已經忘了，這篇文章是根據過去開發紀錄所寫出的濃縮版開發過程以及心得

### 道具和庫存系統

在兩年前我做了個道具和庫存系統，它被做的相當泛用，導入就後也不需要多做設定，只要建立道具的 Prefab 然後設置識別 ID 和屬性就好，其他如放置、疊加和丟棄的功能都被包括在系統中

{{< sc_pathImage "inventory.gif" "70%" >}}

所以也是專案中使用的核心系統之一 ~

## 投擲地牢 !

遊戲的核心機制是所有道具都只能"丟"，劍不要用丟的來傷害敵人，魔法棒要用丟的來施放法術 (ﾟ∀。)

### 瞄準，投擲

遊戲的核心機制 - 投擲 !

拾取和投擲 - 當玩家靠近道具時可以使用空白鍵拾取，並透過滑鼠左鍵瞄準投擲
{{< sc_pathImage "player_throw.gif" "70%" >}}

輔助瞄準 - 瞄準時會出現線條和準心，並使用程式為瞄準線添加簡單的動畫，線條虛線是透過滾動 uv 來達成的
{{< sc_pathImage "player_aiming.gif" "70%" >}}

穿牆修復 - 遊戲中高速移動的物體，可能因為幀數不足而發生穿隧的現象，最簡單的修正方法就是對道具經過的路徑進行設限投射，檢查路徑上是否有障礙物
{{< sc_pathImage "player_raycast.jpg" "50%" >}}

起初在玩家進行瞄準時，會有些微的攝影機縮放和位移來增加視線範圍，但後來測試感覺效果不好就移除了，因為不斷的撿取和投擲會導致畫面劇烈晃動...但仔細想想應該是我程式的設計不良的問題才對 D:

### 更多道具

添加更多不同的道具和武器來提高遊戲豐富度，不過為了保留一點神秘感這裡就不詳細解釋它們的效果

基礎武器 - 基本的武器，各自都有不同的耐久以及殺傷力
{{< sc_pathImage "item_basis.jpg" "70%" >}}

消耗品 - 只能投擲一次的消耗性道具，但是可以疊加好幾個並連續投擲
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

不同武器獲得的機率不同，適合對付的對象也有差異，所以玩家無法使用一種武器打遍天下

並且因為只能夠投擲的設計，扔出武器後就得移動去找其他武器或嘗試撿回來，這意味著玩家必須在不斷移動的同時尋找目標及適合的武器 !

### 敵人

為了不讓玩家一個人在地圖中自嗨，需要為遊戲添加一個敵人 !

追逐 - 最最基本的敵人行為，不斷朝玩家的方向移動
{{< sc_pathImage "enemy_tracing.gif" "70%" >}}

攻擊 - 敵人攻擊前會有會有簡單的變色和停頓作為前搖，然後朝玩家當時所在的方向進行衝撞，所以玩家必須要在攻擊前就先離開敵人的攻擊路徑才能避開攻擊
{{< sc_pathImage "enemy_attack.gif" "70%" >}}

道具 - 擊殺怪物後會隨機掉落不同的基礎道具以及落符合自身定位的特殊道具，這也是玩家的主要道具來源
{{< sc_pathImage "enemy_treasure.gif" "70%" >}}

### 更多敵人

除了只有追逐行為的基礎敵人，我也添加了幾種額外的類型來提高遊戲的豐富度及環境的變化性

射手 - 遠距離射擊的射手怪物，待在原地蓄能一段時間後朝玩家方向發射子彈，能夠在遠處干擾玩家並為進戰敵人提供掩護，當玩家靠近時會試圖保持距離，用有較少的血量
{{< sc_pathImage "enemy_shooter.gif" "70%" >}}

砲手 - 遠距離投射滯物的史萊姆，如果玩家待在滯留物裡的話會持續受到傷害，能夠有效限制玩家的的走位範圍，移動緩慢但是血量很厚
{{< sc_pathImage "enemy_slime.gif" "70%" >}}

召喚師 - 每隔一段時間會產生出一隻小鬼來追擊玩家的召喚師，如果不將他解決將會永無止境的產生小鬼出來

{{< sc_pathImage "enemy_summoner.gif" "70%" >}}
小鬼 - 速度較快但血量和攻擊範圍較小的惱人小鬼們，在玩家缺少武器時能夠施加當大的壓力，只會被召喚師召喚 (註: 這是舊圖，其中一隻後來變成召喚師了)
{{< sc_pathImage "enemy_little.gif" "70%" >}}

為了防止地圖被小鬼淹沒，所以每隻召喚師都有各自的召喚上限，當存活的小鬼達到一定數量時就會暫停召喚

補給怪 - 他們是會掉落回血道具和錢幣的特殊怪物，頭上有小圖案來提示自己會掉落什麼道具
{{< sc_pathImage "enemy_supply.jpg" "70%" >}}

這幾種類型就能為遊戲添加相當大的刺激和變化性，究竟該先處理眼下最具威脅性的追兵? 還是不斷進行遠距離干擾的射手? 又或者是召喚一堆小鬼讓戰鬥沒完沒了的召喚師? 

每種類型的怪物累積到一定程度後都會相當棘手，所以玩家必須不斷改變戰略才能在混亂的環境中存活

### 地圖

遊戲中使用的地圖和場景，我是使用 Unity Tile map 布置的

地圖 - 遊戲的地圖，使用簡單的錐形來提高開闊感，左右和下方是怪物出現的位置
{{< sc_pathImage "map.jpg" "70%" >}}

陷阱 - 當有目標從上方經過時會戳傷目標的尖刺陷阱
{{< sc_pathImage "map_trap.jpg" "70%" >}}

清除 - 因為敵人不斷的掉落道具會導致場景中有過多的武器在地上，所以系統會在每一波開始時清除場景中的低階道具
{{< sc_pathImage "map_clear.gif" "70%" >}}

儲存箱 - 用來保存道具的箱子，避免道具被清除 (但好像沒什麼用，因為我把清除道具改成只清除低階的了)
{{< sc_pathImage "map_chest.gif" "70%" >}}

商人 - 在地圖最上方的商人，玩家可以收集金幣並向商人購買稀有武器，只需要將錢錢扔給他並撿起道具就好，商人會判斷金幣的疊加數量是否足以購買道具 :D
{{< sc_pathImage "map_shop.gif" "70%" >}}

### 遊戲循環

遊戲採用的是街機類型的無盡模式，所以會持續進行直到玩家死亡，這種模式實作簡單也不需要花太多時間設計關卡，相當適合作為遊戲原型的運作機制

標題 - 簡單布置了一下進入遊戲時的標題畫面
{{< sc_pathImage "scene_title.gif" "70%" >}}

轉場 - 使用主角和南瓜頭的動畫當轉場畫面 :D
{{< sc_pathImage "scene_translate.gif" "70%" >}}

暫停 - 遊戲中可以使用 esc 暫停，畫面右上角的問號可以觀看教學說明
{{< sc_pathImage "scene_pause.jpg" "70%" >}}

生怪 - 遊戲中的怪物以會一波一波形式出現，前六波為遊戲的教學關，分別展示了各種不同類型的怪物，每波結束後可以撿起地圖中央的獎勵道具進入下一波
{{< youtube "rrv-nQufUzQ" >}}

雖然遊戲是採用無盡模式，但我的生怪算法讓會每一波的難度提升相當顯著，敵人會隨著波數提高而逐漸增加總數量、出生頻率以及場景中的最大怪物數量，以避免重複作業的冗餘和煩躁感，反而會提供不斷提升難度的刺激感

### 音效

遊戲的音效是我找 CC0 素材後再自己使用 Audacity 調整出來的，修改頻率音高等等，讓音效更適合遊戲的風格
{{< sc_pathImage "audio.jpg" "70%" >}}

這裡就稍微放幾個音效展示 ~

投擲道具 - 高速飛行的風切聲

{{< sc_pathAudio "audio_throw.mp3" >}}

丟棄道具 - 娛樂性較高的彈出音效 XD

{{< sc_pathAudio "audio_dropItem.mp3" >}}

購買道具 - 當然是標誌性的收銀機音效 !

{{< sc_pathAudio "audio_cashRegister.mp3" >}}

道具損毀 - 響亮的金屬碎裂聲

{{< sc_pathAudio "feedback_itemBroken.mp3" "0.5" >}}

金屬武器擊中 - ㄎㄧㄤ

{{< sc_pathAudio "audio_metalHit.mp3" >}}

藥水瓶碎裂 - ㄆㄧㄤ ~

{{< sc_pathAudio "audio_glassBroken.mp3" >}}

除了編輯音效以外，使用程式微調音高也是遊戲中慣用的技巧，音效在撥放時都會隨機的小幅度修改音高和音量，以避免重複播放造成的單一感

### 背景音樂

遊戲的背景音樂是使用 8bit 音樂編曲軟體 BoscaCeoilscaCeoil 製作的，但因為過去沒學過任何編曲知識，所以只有透過簡單的旋律循環來當背景音樂
{{< sc_pathImage "bgm.jpg" "70%" >}}

雖然只使用簡單的旋律，不過可以透過程式來動點手腳讓它不那麼單調 ~

我將音樂輸出為三個不同音軌，並讓它們它們隨著遊戲的狀態進行切換，在標題和暫停畫面時只會撥放單純的節拍，而另外兩種主旋律會在波數和中間的休息狀態切換
{{< youtube e6j6wsMgWWk >}}

不知道為何輸出的不同音軌有些延遲，所以也得想辦法修正到完全同步
{{< sc_pathImage "bgm_tracks.jpg" "70%" >}}

### 回饋加強

如果要在混亂的環境讓玩家知道重要的資訊，遊戲必須要透過某些明顯的手段提示玩家才行，但又不能因此而破壞破壞沉浸感，所以適合的選項就是特效和音效 !

敵人攻擊 - 敵人攻擊前也添加了粒子效果提示，並且攻擊後會在路徑上留下一些粒子來提高辨識度
{{< sc_pathImage "feedback_attack.gif" "70%" >}}

玩家受傷 - 受傷時添加了攝影機晃動和短暫的放慢效果來提高辨識度，大量的粒子來提示敵人的攻擊方向以及沉悶的受傷音效加強衝擊感，效果挺不錯的 :D
{{< sc_pathImage "feedback_hurt.gif" "70%" >}}

道具損毀 - 道具損毀時會播放明顯的音效及特效加強打擊感
{{< sc_pathImage "feedback_itemborken.gif" "70%" >}}

除此之外也還有不少的細節，但這專案已經是一年前的了所以我也忘了很多東西，剩下的就請在遊戲中體驗吧 ~

## 結語

專案的開發時長為一個多月，作為第一次完成的遊戲作品，我其實是相當滿意的 :D

附上最終遊玩畫面的影片，然後幀數有點低是我電腦錄製的問題 ):

{{< youtube "rp3Zl8S3GPg" >}}

### 真正的構想

其實專案一開始不是要做成街機遊戲的無盡模式，我真正想做的其實是一個半解謎類型的地牢

原本道具系統裡還有簡單的物理交互效果，玩家可以透過投擲道具來進行物理解謎

{{< sc_pathImage "real_interaction.gif" "70%" >}}

差不多就是投擲木製品引火把門燒開，用或丟水球滅火來通過一些區域這種，想說先做的簡單的小地圖測試，成功了在擴大

但這還是超出當時的能力範圍了，沒辦法繼續做下去，所以才想說先做個簡單一點的，讓4月的報告有東西可以看，就改成現在這種一波一波打怪的形式

機會還是希望能真正完成它啦，現在的程式能力和觀念相比過去也提升許多了，但最缺的就是時間了 D:

[當時的心得文章](https://home.gamer.com.tw/creationDetail.php?sn=4680762)

[完整的開發日誌](https://home.gamer.com.tw/creationCategory.php?owner=angus945&c=450268)

### 缺陷

當然以現在的角度來看遊戲中有許多相當大缺陷

首先我當時沒有數據化的概念，每個道具都用 Prefab 儲存在資料夾中會佔據相當大的空間，而且在遊戲場景裝也都用各自的實體物件儲存，而不是透過道具容器替換資料達到重用物件的做法

那個道具系統在這專案之後就被我封存了，不過在那時我對這個系統還蠻滿意的 :D

再來是對設計模式和遊戲架構的熟悉度不夠，封裝沒做好而且維護性也不高導致程式碼就像打結的毛線球一樣，重頭再做一次都比修改來的輕鬆吧

最後是設計上的問題 - 難度過高，因為自己在測試的時候不斷試玩導致很容易習慣遊戲的難度，於是就不斷提高遊戲難度導致對不熟悉遊戲的人來說相當困難，果然外部意見真的很重要阿

### 改進

以現在的程度能夠做的比以前好很多，首先是上面說到的數據化，我可以用一個文字檔儲存各種道具的數據或行為，例如: json

```json
Item.json
{
  "damage": 20,
  "durable": 5,
  "onPickup": PushAround 70 12,
  "onBroken": Explosion 10 45,
  "onHit": Heal 5 3,
}
```

並且自訂語法解析器來分析道具的文字檔，在載入文件時創建簡單的道具資料庫，當遊戲要使用這個時就能把事件和參數寫入道具容器中

更進一步說不定還能讓遊戲支援模組開發，不過這都是之後的事了，果然最缺的永遠都是時間 D:

### 使用資源

專案使用的美術資源為 itch.io 作者 [0x72](https://itch.io/profile/0x72) 繪製的 CC0 Pixel art

[16x16 Dungeon Tileset](https://0x72.itch.io/16x16-dungeon-tileset)

[dungeontileset-ii](https://0x72.itch.io/dungeontileset-ii)

至於音效是到處去 CC0 素材庫拼湊的，所以詳細的來源我也忘了 D:

### 感謝閱讀 !

感謝各位閱讀到這 <3

遊戲最終發佈在 Itch.io 上，有興趣的可以下載來玩玩看 - [點我下載](https://angus945.itch.io/drop-throw-dungeon)

也有在國內的遊戲平台木屋發佈歐 - [點我下載](https://indiecabin.net/project/DropThrowDungeon_p)