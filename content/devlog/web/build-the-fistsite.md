---
title: "【日誌】建立人生的第一個網站"
date: 2021-05-11
lastmod: 2022-06-24

draft: false

description: "從頭學習前端和使用 Hugo 建立網站的過程"
tags: [website]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/build-the-fistsite/

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
listable: [recommand, all]

---

## 為什麼想建立網站

在寫完第一篇長篇教學後，我也開始希望有個人網站能專放教學和筆記這種專業向的內容，不然平時都在巴哈上發日誌，專業文章和日常文章混在一起的話未來想當履歷也不方便。

<!--more-->

再來是巴哈上的客群主要都中文語系這塊，如能夠將網站內容翻譯成英文版本的話，也才有機會和更多厲害的人交流~

因為我沒有任何網頁知識，所以剛開始想透過現有的部落格平台或建立工具開發就好。但是研究了 Blogger 和 WordPress 等資源後發現它們和理想的部落格架構都有些落差，因此最後還是決定學習前端，搭配 Hugo 與 GitHub page 來建立網站。

### 參考資料

由於學習習慣，初學時我通常會以影片資源為主。而這次的主要參考資料為 Youtube 頻道 Mike Dane 的 Web Development 系列教學。

HTML - [HTML - Build a Website | Tutorial](https://www.youtube.com/watch?v=Ny1g1eQHnCI&list=PLLAZ4kZ9dFpMSXUYwxDFOvyxlssug29Fu)

CSS - [CSS - Style Your Website | Tutorial](https://www.youtube.com/watch?v=WZ2uqGkHoR0&list=PLLAZ4kZ9dFpNO7ScZFr-WTmtcBY3AN1M7)

Javascript - [Javascript - Programming Language | Tutorial](https://www.youtube.com/watch?v=_jlPywA4dKs&list=PLLAZ4kZ9dFpPQbcrA-SzALJeFm23tPrAI)

Hugo - [Hugo - Static Site Generator | Tutorial](https://www.youtube.com/watch?v=qtIqKaDlqXo&list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3)

### 選擇主題

Hugo 的一大賣點就是它的龐大[主題庫](https://themes.gohugo.io/)，裡面收錄了不少網頁模板供人使用，只需要只需要下載後放進專案資料夾就好。畢竟我拿手的也不是設計相關領域，製作網站還是以現有的模板修改更適合。

自從接觸筆記工具 notion 後，我就很喜歡那種簡潔的筆記風格，因此我也選擇了相似的主題 [Even](https://themes.gohugo.io/hugo-theme-even/) 作為網站的初始模板。

{{< resources/image theme.jpg >}}

## 修修改改

模板決定後就可以根據需求修改內容了。雖然這個主題本身就攜帶不少功能，但有些客製化的需求還是只有自己知道，我也是為此才特意學習前端的基礎知識。

### 教學主頁

為了讓不同系列的教學有各自頁面，我使用資料夾將相同系列的教學放在一起，透過 Hugo 的列表功能作為教學主頁。

但由於需求與模板中提供的功能不一致，所以我必須修改模板。預設的列表只能展示在頁面內容底部，為了自由選擇顯示列表的位置，我將模板的功能獨立成一個函式，讓我能在編輯文章時手動插入列表。

{{< resources/image listoutPages.jpg >}}

### 上一章、下一章

有了教學頁面後，教學內容的模板也需要稍微修改。為了方便讀者閱讀連續教學，我也在教學頁面的底部添加上下章的連結，用於快速引導。

{{< resources/image nextPage.jpg >}}

### 圖片嵌入

圖文並茂的文章才能有效加深讀者印象，因此圖片嵌入是必不可少的功能。雖然 Hugo 本身就有提供基本的函式讓使用者將圖片嵌入文章內容中，但它必須用完整的檔案路徑才能找到圖片。

由於個人習慣，我會將資料夾與檔案名稱命名的比較完整，若每次都要輸入落落長的路徑還是太不方便了。為了更方便嵌入，我寫了一個自訂函式來使用，他可以自動透過文章的路徑尋找對應位置上的資源，如此一來我就能省略重複的資料夾路徑了。

 ```pathImage displayImage.jpg```

{{< resources/image displayImage.jpg >}}

### 閱讀更多 

網站預計會有三種類型的文章：教學、筆記、部落格，這個主題能夠直接設置頂部的瀏覽菜單，但是點進去後的效果不太理想，它只列出頁面標題而已。

我想要像巴哈姆特那樣，有大標題、描述和文章預覽圖，所以也自行修改了列表頁面的模版。參考主題網站裏提供的 [Demo](https://themes.gohugo.io/theme/hugo-theme-even/) 修改出期望的列表樣式，並將預覽圖嵌在區塊的右側。

{{< resources/image readmore.jpg >}}

標題下方也列出了文章的標籤，方便讀者快速理解文章中有哪些內容。

{{< resources/image tags.jpg >}}

### 翻頁列表

我使用「閱讀更多」的區塊來列出文章，但一口氣全列出的話會導致列表過長，讓讀者難以尋找文章。

為了避免問題，我透過 Hugo 的迴圈將列表分次包進 Html 容器中，再透過判斷 URL paramater 來進行頁面切換。

{{< resources/image turnpageList.gif >}}

後來才發現 Hugo 就有內建分頁系統了，所以我等於做了沒意義的功能…囧

### 標籤列表

Hugo 本身就有很方便的標籤系統，他能夠自動產生各個標籤的列表頁面，但我希望能將標與類型區分開來，也必須對對應的模板修改才行。

{{< resources/image tagTabview1.gif >}}

這就是模板中完全沒有的功能了，所以花不少額外時間製作，研究 js 腳本和 css 配製後才完成了美觀一點切換列表。

{{< resources/image tagTabview2.jpg >}}

參考資料

[tabview](https://www.w3schools.com/howto/howto_js_tabs.asp)

### 移除滾動條

因為真的覺得網頁滾動條很醜，就想辦法隱藏它了。雖然他本身不算複雜，但為了確保在各瀏覽器上都有效也花了點時間。

```CSS
html,body
{
    overflow: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
}
body::-webkit-scrollbar
{
    display: none;
}
```

### 內容導覽

把移除滾動條後，為了讓讀者能夠知道自己看到哪裡，得再文章中提供內容導覽才行。

雖然這個主題本身就有提供相關功能，但在我修修改改的過程中也不小心弄壞了，只好花額外的時間去修它 :P

{{< resources/image tableOfContent.png >}}

過程中也注意到模板裡的腳本計算有些錯誤，在判斷距離的時候少減了一次間隔，導致捲動會在特定位置上跳動，修正後就大功告成了。

```js
//                              there
if (scrollTop < minScrollTop - SPACING)
{
  $toc.css(tocState.start);
} 
```

### 關於頁面

為了幫助讀者了解自己與網站，自我介紹也是不可或缺的部分。我將介紹分為兩個部分：關於我和關於這個網站，可以透過頁面上方的選項切換要顯示的內容。

{{< resources/image about.gif >}}

### 語言設置

多語言也是我建立網站的主要目的之一，Hugo 因為網址和資料夾結構相同的特性，設置多語言不是件難事，只需要將不同語言的文章用不同資料夾分開即可，Hugo 會幫忙完成複雜的工作。

{{< resources/image languages1.jpg >}}

在訪客第一次進入網站主頁面的時候，使用 js 取得瀏覽器使用的語言，並將其引導適當的網頁上。

為了讓讀者切換語言，我也添加了一個語言選擇器，透過 localstorage 來儲存設置，點擊展開後就可以進行切換，

{{< resources/image languages2.jpg >}}

### 網站託管

我過去沒有接觸過任何網頁技術，資料庫相關的後端知識也是，因此網站託管的部分也是依靠現有資源達成的。

我使用 github page 來進行網站託管，只需要建立一個 username.github.io 的儲存庫後，將建置完畢的網站資料夾資料夾後上傳就能完成了，真方便 :D

{{< youtube 2MsN8gpT6jY >}}

### 留言板

為了增加交流機會，留言板也是不可或缺的重要功能。

~~我使用的是 Disqus 提供的留言板，Hugo 中只需要設置...~~ 

捨棄，會強制塞一個比留言板本身還要大的廣告…

後來我改用 [CommentBox](https://commentbox.io/) 當網站的留言版了，它裝起來方便而且版面也乾淨許多，留言時也可以方便的登入。

{{< resources/image comment.jpg >}}

### 流量追蹤 

為了分析訪客的閱覽偏好，網站也使用了 [Google Analytics](https://analytics.google.com) 進行流量分析。

{{< resources/image googleAnaltics.jpg >}}

但是不斷的編輯造成網頁有九成的流量都是我自己，所以得設定流量過濾，確保蒐集到的資料能正確反映現實。

> 目前僅顯示通用 Analytics (分析) 資源的篩選器。篩選器無法套用到 Google Analytics (分析) 4 資源。
> Displaying Filters for Universal Analytics Properties only. Filters cannot be applied to Google Analytics 4 Properties.

因為版本問題，找半天才發現如何進行過濾設置，新版本需要到 "資源 > 資料設定 > 資料篩選器" 設定才行。

{{< resources/image analtics_filte1.jpg >}}

[Can't create filter views even though I have all ADMIN accesses in all levels ](https://support.google.com/analytics/thread/89743745/can-t-create-filter-views-even-though-i-have-all-admin-accesses-in-all-levels?hl=en)

[GA4 Data filters](https://support.google.com/analytics/answer/10108813)

### 主頁面

該有的功能都有了，最後也是最重要的就是網站主頁面。因為還沒有經營網站的經驗，我也不確定主畫面該放什麼好，所以就在簡單的打招呼之後列出推薦文章而已 ~

{{< resources/image home.jpg >}}

## 結語

從開始學網頁到完工大概一個月了，雖然接觸新知識很有趣，但畢竟我的主要領域不在這，摸到現在也開始膩了，所以見好就收吧 !

總結來說，我對人生中的第一個網頁相當滿意，和我期望中的網頁幾乎一模一樣，之後會在這裡更新一些教學、筆記和部落格文章，敬請期待~

### 翻譯文章

英文版本的文章我是透過 Grammarly 進行輔助翻譯的，但我的英文能力慘不忍睹，希望翻譯的過程能多少讓我進步點 D:

我在修正文章翻譯時都會保留筆記的，如果可以請能幫我指出翻譯文章的句子和語法的錯誤 Orz

### 感謝閱讀

感謝閱讀到這裡的各位！

順帶一題，如果是從其他地方點進網站的人可能不清楚，我的主要活動地點在巴哈姆特的[小屋](https://home.gamer.com.tw/homeindex.php?owner=angus945)，那裏幾乎每天都會發日誌，歡迎來交流 ~
