---
title: "【日誌】資料驅動 - 多語言文本生成"
date: 2022-09-17
lastmod: 2022-09-17

draft: false

description: 分享一下自己做的資料處理系統，能從 Unity 一鍵下載 Google 試算表內容並解析、生成多語言文件

tags: [unity, data-driven]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/unity/text-processing/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

分享一下自己做的資料處理系統，能從 Unity 一鍵下載 Google 試算表資料並解析、生成多語言文件。

<!--more-->

## 需求判斷

為了讓山鴉專案的文本管理更有效率，我又研究了新的資料處理系統。山鴉的多語言文件是寫在 Google 試算表上的，雖然能直接導出 xlsx 使用，但我覺得這樣不夠方便，所以找了一些自訂輸出方法的資料參考。

本篇文章不是筆記所以將省略實做細節，有興趣深入的人可以參考文章底部的資料。

### 外掛系統

我查了不少檔案轉換的資料，幾乎所有內容都將我指引到 Google Apps Script (GAS) 這套外掛系統。

{{< resources/image "apps-script.jpg" >}}

這是一套能 <h> 編寫腳本並在 Google Sheet 上運行 </h> 的系統，讓使用者透過程式讀取、寫入表格資料或添加工具列功能，更重要的是 GAS 還能 <h> 將函式接口發佈到網路上，讓 Unity 腳本調用 </h> 。

總之，在了解基本內容之後就試寫了一套打包表格資料的腳本，能夠建立 key-value table 的 Json 陣列資料（不過沒有換行，這是為了文章刻意改的）。

{{< resources/image "standard-json.jpg" >}}

### 下載文件

我很愛拿 ScriptableObject 製作輔助工具，因為它存在於資料夾的特性相當方便。我將它製作成資料下載的接口使用，只要建立物件、輸入 Excel ID、分頁索引與檔案寫入的位置，就能直接從 Unity 將 GoogleSheet 的資料下載至本地。

{{< resources/image "gas-access-token.jpg" >}}

如此一來，在企劃修改文本後我只要按個按鈕就能就能同步本地文件了。

<p><c>
註：因為資料下載是非同步的，所以得由 Ienumerator 函式執行，我使用了 EditorCoroutines 插件讓它能在編輯器中運行。
</c></p>

## 系統重構

資料下載的功能完成了，但我不希望所有語言的內容擠在同一份文件裏，所以想將它們分割進各自的資料夾中存放。為了增加維護與重用性，我將它重構成一套更通用的資料處理系統，把原本的資料下載與寫入拆成多個步驟完成。

<p><c>
註：因為分別存放的方法比較適合讓玩家擴充內容（開發模組），這也是我研究資料驅動的目的之一。
</c></p>

### 系統框架

透過抽象類別建立接口框架，輸入資料並在處理完畢後傳出回調， <h> 將複雜的處理過程交由一個個「節點」完成 </h> 。

```cs
public abstract class TextProcessNode : ScriptableObject
{
    public abstract IEnumerator ProcessingRoutine(ProcessingData[] input, Action<ProcessingData[]> onFinishedCallback);
}
```

### 資料下載

下載節點，一個使用 GAS 下載資料並傳出的節點，不會對其進行任何加工。

{{< resources/image "node-gas-access.jpg" >}}

### 文本解析

解析節點，將傳入的表格分割出標題與內容，並輸出不同語言的獨立字表。

{{< resources/image "node-localization.jpg" >}}

### 文本生成

生成節點，將輸入的資料使用 IO 寫入資料夾。

{{< resources/image "node-file-write.jpg" >}}

### 組合節點

只要將以上三個節點組合，就能自動生成與更新多語言文件了。

{{< resources/image "process-list.jpg" >}}

{{< resources/image "localization-files.jpg" >}}

## 感謝閱讀

就醬，只是一個簡單的學習日誌，這套系統的用途應該很廣泛，只要改變幾個節點就能自動處裡不同類型的資料了。

{{< resources/assets "source-codes" "想看的原始碼可以點我" >}}

{{< outpost/likecoin >}}

### 參考資料

[Google Apps Script](https://developers.google.com/apps-script)

[How to Convert a Google Spreadsheet to JSON-Formatted Text](https://thenewstack.io/how-to-convert-google-spreadsheet-to-json-formatted-text/)

[【阿空】用Google試算表建立資料庫！？](https://www.youtube.com/watch?v=SfRXsiuzbCI)

[Unity.EditorCoroutines.Editor](https://docs.unity3d.com/Packages/com.unity.editorcoroutines@0.0/api/Unity.EditorCoroutines.Editor.EditorCoroutineUtility.html)
