---
title: "【開發日誌】個人網站重建日誌"
date: 2022-06-08
lastmod: 2022-06-08

draft: true

description:
tags: [website, hugo]

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
 
## 舊版

第一次製作時的[開發日誌]({{< ref "devlog/build-the-fistsite" >}})

一樣是用 Hugo

### 架構混亂

### 資源混雜

不熟悉網頁 修修改改

## 重新開始

一樣從現有的模板開始修改 

這次挑了一個可以切換黑白主題 的極簡模板 fuji

https://themes.gohugo.io/themes/hugo-theme-fuji/

### 文章分類 -

首先先確認需求

第一次做的時候因為不了解需求

資料夾混亂 

先定好文章的分類格式

比較符合我的 分類

日誌 Devlog

開發、學習日誌 分享過程 資源 但沒有很深的技術內容

學習 Learn

筆記、教學之類 更多細節的文章

文章 Post

其他個人文章 分享想法 自學

### 資源鑲入 -

圖文並茂的文章

Hugo 雖然有內建的圖片嵌入？

但是使用上還是麻煩 需要輸入圖片的完整位置

但是我習慣用資料夾分類好 所以每次都輸入完整路徑會很麻煩

為了更方便的嵌入 圖片、音效等等的資源

舊的網站框架我是根據 文章位置自動抓資料夾 

但這樣有個缺點就是每篇文章都得建立一個獨立的資源資料夾

如果再系列文章裡會很麻煩 (像距離場教學)

我現在改成在文章的設置裡可以設置資源路徑 

文章調用 鑲入的時候就會根據 文章設置的

多篇文章可以共用一個資源資料夾

資源鑲入 

音效鄉入

圖片鄉入

著色器也是這樣

### 內容上色 -

習慣用文字上色

用橘色 <h> 強調內容 </h>

<p><c>
綠色備註
</c></p>

原本的架構裡我是透過 hugo 的 shortcode 進行上色

但是它光是 但是要調用上色函式太麻煩了 讓我文章原始碼很難讀 編輯起來也很麻煩

研究一下發現 html 是可以自訂 tag 的

所以就訂了 `<h>` 當 強調

`<c>` 當作註解

雖然我不喜歡原始檔裡有 html 原始碼 但至少比晚整的 css 設置 和 hugo 函式簡單多了

### 著色器嵌入 - 

這次重建也增加了一個重要的新功能 著色器嵌入

從我看到 [The Book of Shaders](https://thebookofshaders.com/) 這個網站後就很有興趣了

只不過第一次製作網站的時候 對各種 都還不熟悉 

這次重建比較有經驗了 就找一些關於 webgl 的資料

(雖然還是拿別人的函式庫來用拉)

Patricio Gonzalez Vivo 提供的網頁著色器函式庫。

就是 The Book of Shaders 使用的那個 

https://github.com/patriciogonzalezvivo/glslCanvas

嵌入 fragment shader 變得很容易

我也可以先透過 vscode 的插件 [glsl-canvas](https://marketplace.visualstudio.com/items?itemName=circledev.glsl-canvas) 預覽著色器

透過資源嵌入 在網頁上載入

### 互動式內容 -

單純渲染著色器還是太單調了，如果沒辦法 和人互動的話 和放圖片沒兩樣

於是我也想辦法 添加了 可改變數值的 silder 

和改變向量的 vector picker

把參數傳遞進著色器的變數裡

然後用 css 把它們修飾的好看一點

就能讓讀者加深印象

雖然 Patricio Gonzalez Vivo 也有提供網頁編輯器的函式庫 [GlslEditor](https://github.com/patriciogonzalezvivo/glslEditor)

能夠讓讀者直接在網頁上修改程式碼 
 
但是整個編輯器還是太肥了，會讓網頁載入更耗時 

而且要合併進 hugo 的框架也

所以放棄了 沒必要用到那麼複雜的內容

### 程式框修正 -

模板提供的預設程式匡沒有標題

```
default code block
```

尤其我的文章內容可能混雜不只一種語言 怕會混亂

原本嘗試研究 hugo 的 markdown to html 編譯，或是找 css 格式有沒有半法直接添加標題

但找不到

最後只好直接修改網頁生成的模板 html

直接對生成過後的 html 原始碼修改，硬加標題上去

之前研究編譯器的時候有學到 Regex，直接找 coge tag，然後用字串分割抓出語言

然後 把 語言插入 code block 在加上一個 hr 就完成標題了

效果卓越

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

這樣閱讀起來就輕鬆多了

不用靠語法差異去猜語言

### 主頁面 -

簡單的介紹之後 推薦文章

透過文章的設置 允許

```toml
# listable: [recommand, all]
```

網站生成的時候會 找出推薦文章的資料 把資訊透過 json 打包成陣列

在頁面載入的時候就會透過 js 隨機抽出幾項

然後顯示

### 滾動條修正 -

之前的網站因為嫌滾動條很丑 所以直接用 css 隱藏了

但後來收到回饋說 沒有滾動條在閱讀長篇文章的時候 難以辨識 當前進度

而且沒辦法快速捲動 

所以這次 我決定保留滾動條，但想辦法修成好看的樣式

Firefox 和 chrome 的樣式不兼容

chrome 可以使用 overlay 的滾動條，這樣就不會讓最右側有醜醜的捲動欄位

但 firefox 不支援 overlay ，所以只能把欄位改細，顏色改淺一點而已
<!-- https://mail.google.com/mail/u/0/#search/comment/FMfcgzGkZkRcSJXXdJrMVjSMpZxSjxGg -->


### 動態背景 -

為了要更大的控制權 所以背景不是用 文內嵌入的函式庫

而是用 three.js 

使用一個覆蓋全畫面的 canvas 進行繪製

用 json 設置

然後傳遞給 js 隨機改變背景

隨機生成種子碼 輸入著色器 

找了水彩的桌布 加上色彩混合的著色器

極簡風格只需要稍微修飾就會變得很有質感了 ~~

需要花一些時間調整參數就是了

## 感謝

### 對比

https://github.dsrkafuu.net/hugo-theme-fuji/

### 待做  

google analysis

壞掉ㄌ


firebase ?

尚未製作


