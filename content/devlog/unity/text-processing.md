---
title: "【日誌】文字、文本自動化處理"
date: 2022-09-09T08:42:11+08:00
lastmod: 2022-09-09T08:42:11+08:00

draft: true

description:
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /devlog/unity/text-processing/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

開發了一套文字（文本）資料處理系統，能從 Google Sheet 下載文件並解析的自動化系統。並實做出一鍵下載、解析並生成本地化文件的文本更新系統，分享一下。 學習日誌

<!--more-->

## 需求判斷

因為專案山鴉需要 多語言本地化

加上想深入研究資料驅動

文本是寫在 Google 試算表 (Google Sheet) 上

雖然能夠直接導出 xlsl 檔，但沒辦法直接看到內容有點麻煩

所以 尋找了一些 導出成 Json 的資料

這篇不是筆記 所以會省略一些實做和技術細節 參考資料都會補充在底部 有興趣的可以自行深入

### GAS

查詢了不少檔案轉換的資料，基本上所有的資料都指向 Google Apps Script 這套外掛系統

<!-- https://www.google.com/search?client=firefox-b-d&q=google+excel+to+json -->

<!-- https://thenewstack.io/how-to-convert-google-spreadsheet-to-json-formatted-text/ -->

{{< resources/image "apps-script.jpg" >}}

這是一套能編寫腳本並在 Google Sheet 上運行的外掛，能讓使用者對試算表進行讀取寫入或是添加擴充功能

這些都是其次 竟然能從 Unity 直接連結 Google Sheet

文章有時會省略基本內容 完全沒有基礎的人建議從影片開始 因此我也先跟著這部教學 學了基本的部份

{{< youtube SfRXsiuzbCI >}}

了解基本內容之後就依樣畫葫蘆，寫了一套讀取文本並打包成 json 的腳本

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

運行後會得到 標準的 Json 陣列資料（不過沒有換行，這是為了文章刻意改的）

{{< resources/image "standard-json.jpg" >}}

### 下載文件

我很愛拿 ScriptableObject 當作令牌化的（Token）輔助工具用，所以我也根據需求把 GAS 下載弄成這樣

建立出 Token 後，輸入 Excel ID，分頁（註1）索引，以及文件寫入的本地位置

因為資料下載是非同步的，所以需要使用 Coroutine 執行

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

透過編輯器腳本（註2）一鍵執行 如此一來 就能直接在 Unity 下載文件了 只需要事先建立好訪問令牌

{{< resources/image "gas-access-token.jpg" >}}

{{< resources/image "gas-access-token-write.jpg" >}}

只能一下載一個分頁太不方便了，所以也製作了批次下載的令牌

{{< resources/image "gas-access-collection.jpg" >}}

註1：為了方便資料維護，Google Sheet 有多重分頁的功能，能在一個文件底下建立不同的分頁。
{{< resources/image "google-sheets.jpg" >}}


註2：正常情況下編輯器是無法執行 Coroutine 的，我使用了 `Unity.EditorCoroutines.Editor` 擴充函式庫。

## 系統重構

下載功能達成了 但還有本地化文件生成的需求

我希望將不同語言的內容分割進不同資料夾中 而不是全部擠在同一份文件（註3）

如果把本地化文件的解析和生成寫進去會不好維護 而且也不好重用

於是考慮後 我把流程拆成三個獨立步驟，

文本處裡系統

下載
解析
寫入

### 多語言

{{< resources/image "progess-list.jpg" >}}

{{< resources/image "localization-files.jpg" >}}

註3：為了方便外部擴充，我放在不加密的 StreamingAssets，原理和多語言 mod 相同

<!-- https://www.youtube.com/watch?v=SfRXsiuzbCI -->

Unity.EditorCoroutines.Editor;