---
title: "建立人生的第一個網站"
date: 2021-05-11
lastmod: 2021-05-11

draft: false

description: "從頭學習前端和使用 Hugo 建立網站的過程"
tags: [website, devlog]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/build-the-fistsite/

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
listable: [recommand, new, all]

---

<!--more-->
## 為什麼想建立網站
在寫完我的第一篇長篇教學後，想說寫的還蠻不錯的(自肥)所以也想搞個個人網站用來專放教學和筆記，不然平時都只在巴哈上發紀錄文，文章和日誌混在一起有點亂，如果未來想當履歷交什麼的也不方便

再來是巴哈上的客群主要都中文語系這塊，我也希望能和一些外國的人交流，開拓視野而且多少能和讓英文進步一點

剛開始找了些可以用來建立部落格的網站或工具 Blogger、wordpress，挑來挑去都不是很理想，所以最後還是決定好好網頁前端自己做，使用 Hugo 搭配 github page 來建立靜態網站

這是我學程式三年到現在第一次接觸前端，在這之前連 html 都不會，但有了過去兩年多的自學經驗現在從頭學也不是一項難事...至少以能建立自己的網站為標準不是難事 :P

### 參考資料
我主要參考為 Mike Dane 的 Web Development 系列教學，其餘的就是邊做邊查資料

HTML - [HTML - Build a Website | Tutorial](https://www.youtube.com/watch?v=Ny1g1eQHnCI&list=PLLAZ4kZ9dFpMSXUYwxDFOvyxlssug29Fu)

CSS - [CSS - Style Your Website | Tutorial](https://www.youtube.com/watch?v=WZ2uqGkHoR0&list=PLLAZ4kZ9dFpNO7ScZFr-WTmtcBY3AN1M7)

Javascript - [Javascript - Programming Language | Tutorial](https://www.youtube.com/watch?v=_jlPywA4dKs&list=PLLAZ4kZ9dFpPQbcrA-SzALJeFm23tPrAI)

Hugo - [Hugo - Static Site Generator | Tutorial](https://www.youtube.com/watch?v=qtIqKaDlqXo&list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3)

### 選擇主題
Hugo 有不少的社群製作的[主題](https://themes.gohugo.io/)能夠使用，導入也很方便，只需要下載後放進 themes 資料夾就好

花了一些時間找到理想的主題，也就是你們現在看到的這個，版面乾淨簡潔而且內文格式和 Notion 蠻相似的，然後又有畫面自適應功能所以就決定是他了 - [Even](https://themes.gohugo.io/hugo-theme-even/)

{{< resources/image theme.jpg >}}

## 修修改改

決定了主題之後就拿裡面的模板開始修改，主要考量到時間因素而且畢竟我主修也不是網頁，拿現有的模板來修改才是最適合的選項

雖然這個主題已經有不少功能，但有些地方還是要自己做才能達成目的，把寫好的文章放進去看看，摸一摸主題裡提供的模板之後就可以開始修修改改了

### 教學主頁

為了讓不同系列的教學有各自的主頁面，我使用資料夾將相同系列的教學放在一起，使用 _index.md 當主頁面文件

這個主題中 _index.md 使用的模板是 section，但主題中提供的 section template 只有列出資料夾文件的功能，無法讀取 _index.md 的內容來顯示，所以為了達到教學主頁面的目的我必須修改預設模板

首先是內容的部分，只需要使用 Hugo 語法的```{{ .Content }}```就能取得，但模板會一口氣畫出所以有文字內容，這樣子我的子頁面就只能在主頁面的最底部列出了

但我希望搭配文字內容列出頁面，所以我也將原本模板中的列出功能移至獨立的 shortcode 中，好讓我在 markdown 文件中自由選擇列表放置的位置

{{< resources/image listoutPages.jpg >}}

### 上一章 下一章

有了主頁面，接下來就是教學頁面

基本的頁面使用的是 single template，沒什麼好修改的，但為了讓訪客在閱讀系列教學時更方便，我將教學頁面的底部添加移動到上下章的連結

因為基本頁面中不會有資料夾其他頁面的資訊，所以我得讓它先取得父層後在取得這個資料夾裏的所有頁面，並且用索引值找出上下章

{{< resources/image nextPage.jpg >}}

### 圖片顯示

文章中會附上圖片來搭配閱讀，雖然 Hugo 本身就有提供基本的 shortcode 來方便使用者在文章中放置圖片，但它必須輸入絕對路徑才能找到圖片位置

由於個人習慣，我的資料夾結構和檔案名稱都比較複雜，所以輸入絕對路徑還是不夠方便，為了省去一長串路徑我也寫了一個 shortcode 來自動找圖片的路徑，透過文檔的路徑來存取在 static 資料家中相同相對路徑的圖片

這樣一來我只需要輸入圖片的名稱就能顯示圖片了 ```resources/image displayImage.jpg```

{{< resources/image displayImage.jpg >}}

### 閱讀更多 

網站預計會有幾種類型的文章 - 教學、筆記、部落格，這個主題能夠直接設置頂部的瀏覽菜單，但是點進去後的效果不太理想，它只有單純的列出頁面標題而已

我想要有大標題、描述和文章預覽圖，所以又再修改了一次 section temaplet (因為也是資料夾頁面)，並使用文章的前題變量來選擇頁面類型

主題中本來就有提供相關的 css 使用了，所以我直接參考主題網站裏提供的 [Demo](https://themes.gohugo.io/theme/hugo-theme-even/) 來做出期望的列表樣式，並且添加覽圖在區塊的右側

{{< resources/image readmore.jpg >}}

然後我也讓顯示標題下面列出標籤用來簡單分類文章

{{< resources/image tags.jpg >}}

### 翻頁列表

我使用"閱讀更多"的區塊來列出當前類型的所有文章，但文章多的時候全部列出來會好長一條，所以要限制一次列出的數目方便閱讀

我透過 Hugo 語法裡陣列的 first 和 last 寫了一個 partials 模板來取得特定範圍間的頁面，使用時只需要輸入起點和數目就好

使用迴圈將不同範圍中的頁面包進 Html 容器中，再透過 javascript 判斷 URL paramater 的當前的頁面來切換容器顯示

{{< resources/image turnpageList.gif >}}

這麼做有個問題就是，每次翻頁瀏覽器都會把完整的列表載入一次，再重新設置 display 一部分，不過就先到此為止吧，等文章量大到載入變慢再來找解決方法 :P


### 文章標籤

Hugo 本身就有很方便的標籤系統，他能夠自動產生符合列出文章的頁面，但因為所我有文章都使用同個標籤系統，所以自動產生的頁面會把所有類型的文章混在一起

為了防止這點，我在標籤頁面裡加了 tabview 來對列出的文章進行過濾，這是我網站裡花最多時間研究的部份了，因為使用的主題裡完全沒有相似的功能，所以得找 javascript 資料來讀

{{< resources/image tagTabview1.gif >}}

最後在使用主題裡的 css 修改出一個適合 tabview 的版本

{{< resources/image tagTabview2.jpg >}}

參考資料

[tabview](https://www.w3schools.com/howto/howto_js_tabs.asp)

### 移除滾動條

沒什麼特別的原因，因為很醜所以我將滾動條移除了，為了移除他我也花了不少時間，瀏覽器差異讓人很頭痛，修好一個壞一個 ):

在經過不斷的查詢和修改後，終於整理出了能夠在三大瀏覽器上正常運作的 css 腳本了

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

把滾動條移除後為了讓讀者能夠知道自己看到哪裡，文章需要在提供內容導覽才行

雖然這個主題本身就有提供內容導覽的模板，但因為我的修修改改不小心弄壞他了，所以也花不少時間才找出被弄壞的地方

{{< resources/image tableOfContent.png >}}

修的時候也注意到主題作者 javascript 裡的計算有些錯誤，在判斷距離的時候少減了一次間隔導致畫面捲動時看起來不順暢，修正後就大功告成了

```js
//                              there
if (scrollTop < minScrollTop - SPACING)
{
  $toc.css(tocState.start);
} 
```

### 關於頁面

自我介紹在網站中也是不可或缺的部分，我的關於頁面有兩個部分 - 自我介紹和網站介紹，原本寫在同一個文件中但發現用串列的放介紹不太合適，所以就拿之前的 tabview 過來修出顯示內容的功能

{{< resources/image about.gif >}}

### 語言設置

多語言 - 這也是我建立網站的主要目的之一，Hugo因為網址和資料夾結構相同的特性，設置多語言不是件難事，只需要將不同語言的文章用不同資料夾分開即可，Hugo 會幫忙完成複雜的工作

{{< resources/image languages1.jpg >}}

在訪客第一次進入網站主頁面的時候，我使用 javascript 取得訪客時瀏覽器使用的語言重新導向到對應的網頁

以及做出一個語言選擇器，點擊展開後就可以切換語言，並用 localstorage 來儲存語言設置

{{< resources/image languages2.jpg >}}

### 網站託管

我使用 github page 來進行網站託管，真的是蠻方便的功能，只需要建立一個 username.github.io 的儲存庫後，將建置的 public 資料夾上傳就好了 :D

{{< youtube 2MsN8gpT6jY >}}


### 留言板

為了不讓網站像只有我一個人自嗨，所以能和其他人交流的首要選項就是添加留言板 !

~~我使用的是 Disqus 提供的留言板，Hugo 中只需要設置...~~ NOPE Disqus 會強制塞一個比留言板本身還要大的廣告 ==

所以我改用 [CommentBox](https://commentbox.io/) 當網站的留言版了，它裝起來方便而且版面也乾淨許多，留言時也可以方便的登入

{{< resources/image comment.jpg >}}


### 流量追蹤 

為了分析訪客的偏好和類型，我使用 [Google Analytics](https://analytics.google.com) 進行流量分析

這個主題裡也有完成流量追蹤的功能，只不過 Google Analytics 更新到第 4 版了，主題裡的功能似乎過舊所以就重新找了資料修正...雖然我也不確定現在這樣有沒有正確運作 

噢看來他有效，我一直忘記要放進 html 的 ```<head></head>``` 裡了
{{< resources/image googleAnaltics.jpg >}}

但是不斷的編輯網頁造成有九成的流量都是我自己，所以要設定流量過濾

> 目前僅顯示通用 Analytics (分析) 資源的篩選器。篩選器無法套用到 Google Analytics (分析) 4 資源。
> Displaying Filters for Universal Analytics Properties only. Filters cannot be applied to Google Analytics 4 Properties.

因為版本問題無法設置過濾，找半天才發現好像是版本的問題，舊版本的過濾器沒辦法用所以要到 "資源 > 資料設定 > 資料篩選器" 那裏設定才行

{{< resources/image analtics_filte1.jpg >}}

總之現在流量追蹤也能正常運作了


參考資料

[Can't create filter views even though I have all ADMIN accesses in all levels ](https://support.google.com/analytics/thread/89743745/can-t-create-filter-views-even-though-i-have-all-admin-accesses-in-all-levels?hl=en)

[GA4 Data filters](https://support.google.com/analytics/answer/10108813)

### 主頁面

該有的功能都有了，最後也是最重要的就是 - 主頁面

但其實網站剛做出來我對主頁面還沒想法，所以就先打招呼之後列出幾個文章給訪客看

{{< resources/image home.jpg >}}

簡單也有簡單的好 ~

## 結語

從開始學網頁到現在大概一個月了，說真的也做到有點厭倦了，雖然過程學到不少東西但畢竟興趣不在這，所以見好就收吧 !

總結來說，我對人生中的第一個網頁相當滿意，和我期望中的網頁幾乎一模一樣 :D

之後會在這裡更新一些教學、筆記和部落格文章，敬請期待 ~

### 翻譯文章

英文版本的文章我是透過 Grammarly 進行輔助翻譯的，但我的英文能力慘不忍睹，希望翻譯的過程能多少讓我進步點 D:

我在修正文章翻譯時都會保留筆記的，如果可以請能幫我指出翻譯文章的句子和語法的錯誤 Orz

### 感謝閱讀

感謝閱讀到這裡的各位，你們的關注是我持續更新的最大動力 !

順帶一題，如果是從其他地方點進網站的人可能不清楚，我的主要活動地點在巴哈姆特的[小屋](https://home.gamer.com.tw/homeindex.php?owner=angus945)，那裏幾乎每天都會發日誌，歡迎來蕉流蕉流 ~


