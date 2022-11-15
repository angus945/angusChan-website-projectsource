---
title: "【筆記】如何讓遊戲支援模組開發"
date: 
lastmod: 

draft: true

description:
tags: [unity, game-develop, programming, data-driven, modification]

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

## 概括 -

遊戲模組是什麼 以及他是如何運作的 怎麼讓遊戲支援模組開發

遊戲模組 是一種能讓玩家對遊戲內容進行擴展的 手段

改變角色外觀 添加道具 甚至

Minecraft 就是相當經典的案例

文章的環境為 Unity，但概念基本上是通用的 

## 資料驅動 Data Driven -

嘗試查詢的話 大多資訊都會指向這個

簡單來說資料驅動是一種程式設計法，其核心思想在於透過簡單的資料結構定義出一系列"邏輯"或者"行為"，例如字串和整數，並使用資料為底驅動整個遊戲，而不是透過程式將設計寫死

這種作法除了能大幅提升修改彈性，更能讓玩家方便的開發遊戲模組的前提

這裡整理成 三大重點 
+ 動態讀取
+ 資料格式
+ 行為擴展

不會有太深入 提供一個觀點

### 動態資料 streaming load -

通常遊戲在建置後，使用的資源會被引擎打包

除了引擎自帶的資料打包以外
遊戲必須主動去抓特定路徑下的資料 

在 unity 引擎中，可以透過 Streaming Assets 資料夾與 System.IO
開發者必須提供管道 符合條件才能抓取動態資料
否則是無效的

Steam 工作坊其實不是甚麼黑魔法 只是幫你下載到 模組資料夾 而已
主要還是遊戲本身去抓路徑 讀取

可以在找到模組資料夾
C:\Program Files (x86)\Steam\steamapps\workshop\content\gameID

### 資料格式 format -

定義資料格式 

定一一個資料需要有甚麼
例如一個怪物
血量
速度
攻擊力
圖片
用一個文字 (或其他輕量資料格式) 文件定義

玩家只要複製這個文件，把內容修改成自己像要的樣子
就添加了一個新的怪物進遊戲

資料可簡易可複雜
簡單的就是 向上面的範例 修改參數與外觀
複雜的可能能改變邏輯與行為甚至規則本身 指定一套命令表格，解析定義文件時抓取

基本上只要文字文件 txt 就足夠了，但還是建議使用 
較推薦使用 XML Extensible Markup Language 與 Json

XML 適合定義複雜資料結構，還可以自己編寫輸入提示 缺點是資料龐大 解析速度較慢
Json 適合格式固定的資料，如本地化字表文件 缺點是格式訂好就比較難擴展 

### 擴展行為 Lua, Dll -

雖然只要 有動態載入和格式定義 就能修改相當多內容了
但有個致命的缺點是 難以擴展行為 就算有自訂命令集 還是會被開發者提供的方法侷限

因此，最後一步就是需要提供自訂行為 或者說讓玩家編寫 自己的程式碼
程式語言 要和電腦溝通
就和不同國家的人一樣，

+ 直譯語言
而直譯便是在閱讀的同時進行翻譯，


+ 編譯語言
編譯就像一口氣將整篇文章翻譯完畢再閱讀

有許多現成的資源 例如直譯的 Lua 與編譯的 C# Dll
當然也可以手刻一個虛擬機去跑你的自訂程式
無論何者都需要由開發者提供 接口調用

總結以上
排除特殊手法以外 (反編譯等等)
能否支援模組開發 直接取決於開發者 (程式的能力)

## 實作範例 -
用 System.IO 與 System.XML 和 MoonSharp
不細部解釋內容 只提供一個簡單的方向

動態載入資料
`string[] streamingFolders = Directory.GetDirectories(Application.streamingAssetsPath);`
`string content = File.ReadAllText();`
`byte[] data = File.ReadAllByte();`

使用 XML 定義
XMLSerializer
https://www.notion.so/XML-0c1dd25445e04bd49ae9ce763f66374b

泛型序列化
```cs
public static T ConvertNode<T>(XmlNode node) where T : class
{
    MemoryStream stm = new MemoryStream();

    StreamWriter stw = new StreamWriter(stm);
    stw.Write(node.OuterXml);
    stw.Flush();

    stm.Position = 0;

    XmlSerializer ser = new XmlSerializer(typeof(T));
    T result = (ser.Deserialize(stm) as T);

    return result;
}
```

並用 Lua 附加行為
new Script()
script.DoString(code);
https://www.notion.so/Lua-3d1dc05ae4fd4affa7f4c139691c7e6f

---

## 結語 -

https://ecampusontario.pressbooks.pub/gamedesigndevelopmenttextbook/chapter/game-modifications-player-communities/
https://www.techopedia.com/definition/3841/modification-mod

提供一個方向

### 更進一步 -

原型模式 Prototype

類型物件 Type Object

位元組碼 Bytecode

正規語言 Formal Language

正規表示式 (Regular expression)

http://gameprogrammingpatterns.com/prototype.html

