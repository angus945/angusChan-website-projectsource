---
title: "【開發日誌】個人網站重建"
date: 2022-07-12
lastmod: 

draft: false

description: 個人網站的重建過程分享
tags: [website, hugo]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/rebuild-the-website/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

 
## 網站重建 +-

從初次建構個人網站到現在已經過去一年了，雖然當時對成果還算滿意，但隨著我寫作的過程也逐漸意識各種缺陷，函示調用不易、專案架構混雜等，所以我決定重建一次網站！

<!--more-->

### 問題分析 +-

為了避免重蹈覆轍，重建開始前必須先釐清舊版網站的問題才行～

**_分類模式_**

我在舊版網站使用的分類模式為：

+ **日誌 Blog**  
  我有將學習過程透過日誌進行記錄的習慣，所以網站當然需要對應的分類。
+ **筆記 Notes**  
  寫筆記也是我常用的學習方法，為了與性質較輕鬆的日誌區隔，因此也建立了筆記分類。
+ **教學 Tutorials**  
  教學是我建立網站的主要原因之一，就是為了將新學習方法所產生產物進行保存，所以教學分類也是必要的。

{{< resources/image "old-hierarchy.jpg" >}}

這個分法沒什麼問題…至少以當時的需求來說沒有，但後來我為了申請百川嘗試寫些性質更為特殊的文章，分類危機也由此浮現。那些文章的內容有關「學習」但並不是學習日誌，與「遊戲」相關卻又不屬於遊戲開發的文章，不可能被歸類在教學與筆記當中，但將他視為日誌也不太恰當。

再來，因為改變學習的方式，我的筆記也開始嘗試將細節解釋清楚，讓他變得更加像一種「教學」，那它應該被分類為 note 還是 Tutorials？又或是分享學習資源的文章，他和學習有關但實際的教學內容又不是我製作的，該放在 tutorials 還是 blog？

所以，這次重建的目的之一就是為了配合新的寫作模式尋找更是當的分類方法。

**資源混雜** 

除了分類以外，專案內容混亂也是一個原因。初次建立網站時各方面的知識都還不充足，製作過程時走一步算一步，而在我反覆修改下產生的就是一個難以維護的專案架構。

{{< resources/image "old-functions.jpg" "100%" "自訂函式的方法，建立一個獨立的 HTML 腳本並透過 Hugo 語法中的 partial 關鍵自調用" >}}

## 重新開始 +-

這次重建一樣會使用現成的資源開發，畢竟我不是專攻網頁設計，重建的目的也不是為了學習，與其大費周章從頭刻出介面與排版，不如尋找喜歡的模板修改再把自己的專業結合進去，才能有效率的展現技能～

所以我這次也打算使用 Hugo 建立網站，重複的部份可以參考舊版網站的[開發日誌]({{< ref "devlog/build-the-fistsite" >}})，這篇就只把重點放在新的東西上。

### 模板選擇 +-

雖然我不討厭舊網頁的樣式，但它背景一片死白讓晚上時會太吃力，所以這次就改找了可以切換黑白主題的極簡模板 [fuji](https://themes.gohugo.io/themes/hugo-theme-fuji/)，讓讀者可以根據需求透過右下角的按鈕切換樣式。

{{< resources/image "fuji-theme.jpg" "80%" "引用自主題的預覽圖" >}}

為了對切換功能進行擴展，我也研究了模板中的原始碼，似乎與一種能用變數指定數值的層階層式樣式表 "scss" 有關。具體的運作原理我也不清楚，我只有摸到足夠讓我擴展內容的程度而已，總之這是一個蠻理想的模板～

```scss
body {
  background-color: var(--color-bg);
  color: var(--color-font);

  @include link-1();
}
```

### 文章分類 +-

Hugo 建立出的網站結構會與資料夾相同，所以沒取好名稱就可能引發和之前一樣的分類危機。第一次做的時候由於正處於寫作模式的轉形期，才會發生規劃和實際需求不符的狀況，所以這次重建的首個任務就是確認好自己的需求為何。

+ **日誌 Devlog**  
  專案開發與學習日誌，通常是用於紀錄與分享自己的學習過程，盡量以有趣為主所以不會有太具體的實做與技術細節。

+ **學習 Learn**  
  通常是學習筆記與教學之類的文章，會有更多實做細節，一方面加深自己的印象，另一方面也是為了回饋陪伴我學習的社群夥伴。除此之外，整理出的學習資源也會分享在這個類別中。

+ **文章 Post**  
  其他個人文章，分享自己對各種事情的經歷與看法，例如自學歷程、學習感想之類的。

### 資源嵌入 +-

圖文並茂的內容是吸引目光的要點之一，適時插入圖片能有效幫讀者帶入情境，而在技術文章中圖片也是幫助讀者理解內容的重要手段。

舊網站當然也有製作資源嵌入用的函式，它會根據文章網址自動抓取對應位置的資源，使我不必手動指定整個路徑。將所有工作都交給程式雖然輕鬆，但也意味者我失去了這些事的主導權，意思是：我必須配合程式尋找的路徑，將資源放在「正確」的位置上。

為了在輕鬆與控制權之間取得平衡，我將新系統設計成只需要手動設置一次路徑，後續調用函式時就會根據設定的路徑尋找資源，如此一來就能自由指定資源的路徑，同時免除麻煩的輸入工作。

```toml
resources: /devlog/rebuild-the-website/
```

+ **圖片嵌入**  
  {{< resources/image "resources-image.jpg" "80%" "可以設定圖片的註解" >}}

+ **音效嵌入**  
  {{< resources/audio "resources-audio.mp3" >}}

+ **資源嵌入**  
  {{< resources/assets "" "可以連接到網頁的儲存庫，用於分享程式原始碼之類的" >}}

### 內容上色 +-

除了嵌入圖片以外，我也習慣透過上色文字來強調某些內容。雖然 markdown 能夠直接接收 `html` 與 `css` 格式，<span style="color:red">但要插入完整標籤還是太麻煩了</span>，會導致文章難以修改。

```markdown
<span style="color:red">但要插入完整標籤還是太麻煩了</span>
```

後來我研究了更多上色方法後才發現 html 其實可以自訂標籤，所以我就訂了單字 <h>  h  </h> 當做強調重點、單字 <c>  c  </c> 當作註解，以及單字  <r> r </r> 作為警告。

```markdown
所以我就訂了單字 <h>  h  </h> 當做強調重點、單字 <c>  c  </c> 當作註解，以及單字  <r> r </r> 作為警告顏色。
```

雖然我還是不希望文章原始檔有標籤語言，但與以前相比已經簡潔許多了。

### 著色器嵌入 +-

除了常規的嵌入與上色外，這次我也新增了一個重要的功能：著色器嵌入。

我在初學習著色器時曾看到一個很有趣的互動式教學網站 [The Book of Shaders](https://thebookofshaders.com/)，網站中所有的著色器都是實時渲染的，可以即時對讀者的動作產生反應。網站官方也有公開它們的[函式庫](https://github.com/patriciogonzalezvivo/glslCanvas
)供人使用，只需要透過 javaScript 引用後就可以方便的嵌入著色器元素並自動渲染，於是我也將它整合進自己的嵌入函式，如此一來就能添加更多有趣的內容了。

{{< resources/shader "300 300" "resources-shader.frag" >}}{{</ resources/shader >}}

比較麻煩的是 Hugo 不會在文件資源改動後即時更新網站，導致預覽起來有點麻煩，所以我只能透過 vscode 的插件 [glsl-canvas](https://marketplace.visualstudio.com/items?itemName=circledev.glsl-canvas) 進行初步除錯。

### 互動式內容 +-

為了提高互動性我也添加能讓讀者修改參數的功能，當讀者載入網站的時候，初始化著色器的腳本會搜索一遍所有內容，並將網頁元素的輸入事件與著色器連接，達成動態修改參數的功能。

**一維浮點 - float silder**

{{< resources/shader "300 300" "resources-shader.frag" >}}
float u_colorR 0 1 0.5,
float u_colorG 0 1 0.5,
float u_colorB 0 1 0.5
{{</ resources/shader >}}

**一維整數 - int silder**

{{< resources/shader "300 300" "resources-shader.frag" >}}
int u_shape 0 2 0
{{</ resources/shader >}}

**二維浮點 - vector picker**

{{< resources/shader "300 300" "resources-shader.frag" >}}
vector u_position -1 -1 1 1 0 0
{{</ resources/shader >}}

如果讀者在修改參數時能夠即時展現影響，就能更有效的加深印象了～

{{< resources/assets "resources-shader.frag" "> 想看這個著色器的原始碼可以點我 <" >}}

### 程式框修正 +-

說到筆記和教學，範例絕對是當中不可缺少的部份。雖然模板有提供預設的程式嵌入框，但它沒有標注語言的功能，我的文章時常混雜一種以上的程式語言，要是範例沒有標注語言會提高閱讀難度。

```
default code block
```

我嘗試過研究 hugo 的 markdown to html 編譯資料，但太複雜所以放棄了，最後只是透過 hugo 的 Regex 搜索函式直接抓出所有 html 程式匡，硬插了 `<span>` 和 `<hr>` 上去，粗暴但有效。

```hugo
{{ $codeblocks := findRE "<code class=\"language-(.*)\">(.|\n)*?</code>" $content }}
```

Regex 真的是神器，現在我只要編寫文章時有在 markdown 的 code block 上添加語言類別就能自動顯示標題了～

```cs
void function()
{
    // csharp code block
}
```

```hlsl
fragment()
{
    // shader code block
}
```

{{< resources/image "code-block.jpg" >}}

如此一來讀者在閱讀時也能輕鬆許多，不用額外備註或是靠內容差異去猜語言了。

### 推薦清單 +-

主頁面是網站的門面，也是留下第一印象的重要方法，由於網站是以學習日誌與技術文章為主軸建立的，所以我決定用「推薦清單」幫助訪客快速了解內容的性質。雖然之前也有做過一樣的功能，但當時是透過文章屬性的「重要度」去排序清單，清單會自動尋找重要度最高的文章顯示，達成推薦功能。

雖然重要度的做法有效，但缺點就是每次都只能顯示固定的內容。而這次，我為了展示更多文章所以作了「隨機推薦」的功能，可以透過文章的屬性調整它能否被推薦。

```toml
# listable: [recommand, all]
```

網站建置時就會根據這些屬性過濾出文章，並將重點資料打包成 json 陣列傳遞給 javaScript 使用，透過隨機抽取資料的方式在網頁載入時改變頁面內容，就能達成我要的隨機功能了。

{{< resources/image "recommand-json.jpg" "80%" "透過 json 格式傳遞資料就能讓 javaScript 更方便使用" >}}

{{< resources/image "recommand-list.jpg" "80%" "主頁面的推薦清單" >}}

### 滾動條修正 +-

因為覺得網頁滾動條不夠美觀，之前為了防止整體美感被破壞直接將它隱藏了，但後來收到回饋說這會導致閱讀長篇文章的時候難以辨識當前進度，以及無法讓讀者快捲動文章（不是所有人都喜歡用中鍵），所以這次我決定將滾動修成好看的樣式。

在 chrome 中我使用的是 overlay 的格式，讓滾動條覆蓋在頁面上就不需要醜醜的欄位了，但 firefox 不兼容這種樣式，所以改將欄位改細並調整配色讓它更好看。

{{< resources/image "website-scrollbar.jpg" >}}

### 動態背景 +-

即使有黑白樣式的切換功能，還是無法改變單色背景太單調的事實，雖然只要簡單的放個圖片就能改善...但我覺得這樣不夠有趣，既然我擁有著色器的知識，有不拿它來做酷酷的動態背景的理由嗎？當然沒有！

背景的著色器我決定使用 three.js 框架製作，雖然設置起來更加複雜，但也能讓我微調更多細節，包括材質屬性、3D 模型（如果有）以及渲染幀數等等。背景是使用一個覆蓋全畫面的 canvas 繪製的，網頁部份處理起來不算複雜，重點還是取決於著色器的內容。

{{< resources/image "background-track.gif" "100%" "透過 GPU Buffer 繪製出滑鼠軌跡" >}}

為了能展示更多酷酷的背景，我也將推薦清單的思路應用在背景上，每次進入網站時都會隨機改變背景的樣式與細節。

{{< resources/image "background-watercolor.jpg" "100%" "水彩風格的背景，每次重新整理都會有變化歐" >}}

## 感謝閱讀 +

### 成果對比 +-

最後再和剛開始的樣子做個對比，這次的網站有更多功能、更乾淨的專案架構以及漂亮的動態背景，極簡風格只需要稍微修飾就很有質感了～

{{< resources/image "compare-light.jpg" "100%" "和原本的亮色主題對比" >}}

{{< resources/image "compare-dark.jpg" "100%" "和原本的暗色主題對比" >}}

有個好看的網站不只能吸引更多人閱覽，更重要的是也能提升我充實內容的動力，寫日誌對我來說也是一件重要的事，能在漂亮的網站上分享自己的歷程可是一件令人開心的事 :)

{{< outpost/likecoin >}}

### 待做清單 +-

新版網站還沒有留言功能，雖然之前使用過幾個外嵌的留言版，但不是廣告被塞爆就是不支援訪客留言，所以決定先擱著等之後有空學習後端在自己做吧，敬請期待 ~

<!-- https://mail.google.com/mail/u/0/#search/comment/FMfcgzGkZkRcSJXXdJrMVjSMpZxSjxGg -->

