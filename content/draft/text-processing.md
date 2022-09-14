---
title: "【日誌】文本、資料自動化處理"
date: 2022-09-09T08:42:11+08:00
lastmod: 2022-09-09T08:42:11+08:00

draft: true

description:
tags: [unity, dataDriven]

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

分享一下自己研究的資料處理系統，能在 Unity 中一鍵下載 Google 試算表資料並解析、生成多語言文件。

<!--more-->

## 需求判斷 -

為了讓山鴉專案更有效的管理文本，

又研究了新的多語言系統，


，雖然曾經做過多語言本地化的系統，使用效果不盡人意，加上想深入研究資料驅動，所以我打算重新研究一次。

專案的多語言文本是寫在 Google 試算表上的，

雖然直接導出 xlsx 使用，

但我覺得不夠方便，

所以尋找了一些自訂輸出方法的資料參考。

這篇不是筆記 所以會省略一些實做和技術細節 參考資料都會補充在底部 有興趣的可以自行深入

### 外掛系統 +

我查了不少檔案轉換的資料，基本上所有方向都指引我找到 Google Apps Script 這套外掛系統。

<!-- https://www.google.com/search?client=firefox-b-d&q=google+excel+to+json -->

<!-- https://thenewstack.io/how-to-convert-google-spreadsheet-to-json-formatted-text/ -->

{{< resources/image "apps-script.jpg" >}}

這是一套能編寫腳本並在 Google Sheet 上運行的系統，能讓使用者讀取、寫入試算表資料或添加工具列功能，更重要的是 GAS 還能將函式接口發佈到網路上，讓 Unity 腳本調用。

總之，在了解基本內容之後就寫了一套讀取文本並打包成 json 的腳本，能夠讀取試算表資料並建立 key value table 的 Json 陣列資料（不過沒有換行，這是為了文章刻意改的）。

{{< resources/image "standard-json.jpg" >}}

<!-- {{< resources/assets "GASTableDownload.gs" "點我觀看資料下載腳本" >}} -->

<!-- {{< youtube SfRXsiuzbCI >}}   -->

### 下載文件 +

我很愛拿 ScriptableObject 製作輔助工具，存在於資料夾的特性真的很方便，所以我把它當作資料下載的接口使用。只要建立物件、輸入 Excel ID、分頁索引與檔案寫入的位置就完成了一個 Unity 與 GoogleSheet 的資料下載接口。

{{< resources/image "gas-access-token.jpg" >}}

現在只要從資料夾物件按個按鈕，就能從 GoogleSheet 下載並更新本地文件了。

<p><c>
註：因為資料下載是非同步的，所以得由 Ienumerator 函式執行，但編輯器無法執行 Coroutine ，所以我使用了 EditorCoroutines 插件進行輔助。
</c></p>

## 系統重構 +

資料下載的功能完成了，但還有本地化文件的需求，我不想讓所有語言的內容擠在同一份文件裏，所以想要將它們分割進各自的資料夾中存放。

雖然可以直接修改下載街口，讓它用不同的方法生成文件，但為了維護與重用性我重構成一套更通用的資料處理系統，把原本的資料讀取拆成多個步驟完成。

### 系統框架 -

使用處理節點的概念，用不同的節點組合出

透過抽象類別建立框架，建立出資料處裡的接口，接收原始資料並在處理完畢後回傳。由於處裡過程可能是非同步的，所以使用 Ienumerator 與 CallBack 作為抽像函式的框架。

```cs
public abstract class TextProcessNode : ScriptableObject
{
    public abstract IEnumerator ProcessingRoutine(ProcessingData[] input, Action<ProcessingData[]> onFinishedCallback);
}
```

透過多個處理節點，一步一步從原始資料加工

```cs
public class DataProcessList : ScriptableObject
{
    [SerializeField] TextProcessNode[] processNodes;

    public IEnumerator ParsingRoutine(Action<ProcessingData[]> onFinishedCallback)
    {
        ProcessingData[] parsingDatas = new ProcessingData[0];

        for (int i = 0; i < processNodes.Length; i++)
        {
            yield return processNodes[i].ProcessingRoutine(parsingDatas, (datas) =>
            {
                parsingDatas = datas;
            });
        }

        onFinishedCallback?.Invoke(parsingDatas);
    }
}
```

### 資料下載 -

一樣是 GAS 的資料下載，不過這次只會下載標準 json 後就直接傳出

{{< resources/image "node-gas-access.jpg" >}}

### 文本解析

根據傳入的資訊，分割出表格標題與內容，並產生出不同語言的多國字表檔案輸出。

{{< resources/image "node-localization.jpg" >}}

### 文本生成 -

最後，只要使用 IO 將文本寫入資料夾，就完成多語言檔案的生成了。

{{< resources/image "node-file-write.jpg" >}}

{{< resources/image "progess-list.jpg" >}}

{{< resources/image "localization-files.jpg" >}}

註3：為了方便外部擴充，我放在不加密的 StreamingAssets，原理和多語言 mod 相同

## 感謝閱讀

只是一個簡單的學習日誌，分享

### 參考資料

<!-- https://www.youtube.com/watch?v=SfRXsiuzbCI -->

Unity.EditorCoroutines.Editor;