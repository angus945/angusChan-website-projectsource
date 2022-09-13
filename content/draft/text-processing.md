---
title: "【日誌】文字、文本自動化處理"
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

開發了一套文字（文本）資料處理系統，能從 Google Sheet 下載文件並解析的自動化系統。並實做出一鍵下載、解析並生成本地化文件的文本更新系統，分享一下。 學習日誌

<!--more-->

## 需求判斷 -

因為山鴉專案需要有更有效率的文本管理，雖然曾經做過多語言本地化的系統，使用效果不盡人意，加上想深入研究資料驅動，所以我打算重新研究一次。

專案的多語言文本是寫在 Google 試算表 (Google Sheet) 上的，雖然直接導出 xlsx 使用，但我覺得不夠方便，所以尋找了一些自訂輸出方法的資料參考。

這篇不是筆記 所以會省略一些實做和技術細節 參考資料都會補充在底部 有興趣的可以自行深入

### GAS -

查詢了不少檔案轉換的資料，基本上所有的資料都指向 Google Apps Script 這套外掛系統。

<!-- https://www.google.com/search?client=firefox-b-d&q=google+excel+to+json -->

<!-- https://thenewstack.io/how-to-convert-google-spreadsheet-to-json-formatted-text/ -->

{{< resources/image "apps-script.jpg" >}}

這是一套能編寫腳本並在 Google Sheet 上運行的系統，能讓使用者對試算表進行讀取、寫入或是添加工具列功能功能。

除此之外，GAS 還能將函式接口發佈到網路上，讓 Unity 腳本調用進行資料傳輸。我參考這部影片進行學習，了解基本內容之後就依樣畫葫蘆，寫了一套讀取文本並打包成 json 的腳本

{{< youtube SfRXsiuzbCI >}}

```ts
function getJson(id, name)
{
  var app = SpreadsheetApp.openById(id);
  var sheet = app.getSheetByName(name);

  var datas = sheet.getDataRange();

  var table = "";
  var headers = datas.getValues()[0];
  // Logger.log(headers);    
  for(var row = 1; row < datas.getNumRows(); row++)
  {
    var items = datas.getValues()[row];
    var fields = "";

    for(var column = 0; column < datas.getNumColumns(); column++)
    {
      if(column > 0) fields += ",";
      fields += `"${headers[column]}":"${items[column]}"`;
    }

    if(row > 1) table += ",";
    table += `{${fields}}`;
  }

  // Logger.log(table);

  return `[${table}]`;
}
```

當函式運行後會得到標準的 Json 陣列資料（不過沒有換行，這是為了文章刻意改的）

{{< resources/image "standard-json.jpg" >}}

### 下載文件 -

我很愛拿 ScriptableObject 製作輔助工具，它存在於資料夾的特性以及自定義編輯器的擴展性， 所以我也根據需求把 GAS 下載弄成令牌。

建立出 Token 後，輸入 Excel ID，分頁（註1）索引，以及文件寫入的本地位置就能下載了。因為資料下載是非同步的，所以需要使用 Coroutine 執行。

```cs
public IEnumerator ParsingRoutine()
{
    WWWForm form = new WWWForm();
    form.AddField("id", excelID);
    form.AddField("index", sheetIndex);

    using (UnityWebRequest www = UnityWebRequest.Post(postURL, form))
    {
        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(www.error);
        }
        else
        {
            string data = www.downloadHandler.text;

            Debug.Log(data);
            Debug.Log("download complete!");
        }
    }
}
```

透過編輯器腳本（註2）一鍵執行 如此一來 就能直接在 Unity 下載文件了。只需要事先建立好訪問令牌，之後文件更改時只要按個按鈕就能更新資料。

{{< resources/image "gas-access-token.jpg" >}}

{{< resources/image "gas-access-token-write.jpg" >}}

只能一下載一個分頁太不方便了，所以也製作了批次下載的令牌。

{{< resources/image "gas-access-collection.jpg" >}}

註1：為了方便資料維護，Google Sheet 有多重分頁的功能，能在一個文件底下建立不同的分頁。
{{< resources/image "google-sheets.jpg" >}}


註2：正常情況下編輯器是無法執行 Coroutine 的，我使用了 `Unity.EditorCoroutines.Editor` 擴充函式庫。

## 系統重構 -

下載功能達成了，但還有本地化文件生成的需求。我希望將不同語言的內容分割進不同資料夾中， 而不是全部擠在同一份文件裏（註3）。

如果把本地化文件的解析和生成寫進去會不好維護 而且也不好重用，於是考慮後 我決定做一套更通用的文件處理系統，把原本的資料讀取拆成多個步驟完成

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