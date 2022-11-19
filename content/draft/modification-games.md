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
resources: /learn/modification-games/

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

## 資料驅動 -

Data Driven

嘗試查詢的話 大多資訊都會指向這個

簡單來說資料驅動是一種程式設計法，其核心思想在於透過簡單的資料結構定義出一系列"邏輯"或者"行為"，例如字串和整數，並使用資料為底驅動整個遊戲，而不是透過程式將設計寫死

這種作法除了能大幅提升修改彈性 讓開發過程更順暢

還能讓玩家方便的開發遊戲模組

住: 不要和資料導向 data oriented design 搞混了，兩者沒有直接關係

要真正深入的話需要不少時間 不過這裡 整理成 三大重點 
+ 動態讀取
+ 資料格式
+ 行為擴展

不會有太深入 提供一個觀點

### 動態資料 streaming load -

通常遊戲在建置後，使用的資源會被引擎打包

除了引擎自帶的資料打包以外
遊戲必須主動去抓特定路徑下的資料 

在 unity 引擎中，可以透過 Streaming Assets 資料夾與 System.IO
第一個前提是 開發者必須提供管道 符合條件才能抓取動態資料
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
 
包括 資料夾結構

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

環境為 Unity，但邏輯基本上通用 

使用資源 https://0x72.itch.io/dungeontileset-ii
MoonSharp 

### 定義實體 -

定義一個簡單的實體，具有辨識 ID，使用圖像以及腳本（行為）

類別需要有 `[System.Serializable]` 與 `[XmlType]` 讓 XML 序列化正確運作
當中的變數也需要 `[XmlAttribute]` 或 `[XmlElement]` 來正確解析

```cs
[System.Serializable][XmlType("Entity")]
public class EntityDefine
{
    [XmlAttribute]
    public string id;

    [XmlElement("Sprite")]
    public string sprite;

    [XmlElement("Script")]
    public string script;
}

```

在 XML 中的格式如下，根節點下面定義實體

```xml
<Entities>
    <Entity id="entityID">
        <Sprite>UseSpriteName.jpg</Sprite>
        <Script>UseScriptName.lua</Script>
    </Entity>
</Entities>
```

將
透過 unity 的 StreamingAssets 資料夾 用 IO 載入資料，轉換成字串後在建立 XML 物件

```cs
string path = $"{Application.streamingAssetsPath}\\entities.xml";
byte[] entitiesData = File.ReadAllBytes(path);
string dataText = System.Text.Encoding.UTF8.GetString(entitiesData);

XmlDocument dataXML = new XmlDocument();
dataXML.LoadXml(dataText);
```

注意：正斜線和反斜線的差異可能會造成影響，建議在訪問路徑前先用 replace 統一

遍歷自節點，透過 `XmlSerializer` 建立解析資料

```cs
public List<EntityDefine> defines;

XmlNode root = dataXML.DocumentElement;
for (int i = 0; i < root.ChildNodes.Count; i++)
{
    XmlNode node = root.ChildNodes[i];
    Debug.Log(node.Name);

    EntityDefine entity = ConvertNode<EntityDefine>(node);
    defines.Add(entity);
}
```

{{< resources/image "example-entities.jpg" >}}

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

### 載入資源 -

載入圖片 圖片放在子資料夾中 
透過 Directory.GetFiles 取得所有資料

```cs
string directoryPath = $"{Application.streamingAssetsPath}\\Sprites";
string[] files = Directory.GetFiles(directoryPath);
```

string.EndsWith() 檢測資料格式是不是正確
透過 Unity ImageConversion 將 byte 轉換為圖片
存入資源庫中，檔案名稱作為 ID

```cs
public Dictionary<string, Texture> textures;

for (int i = 0; i < files.Length; i++)
{
    string path = files[i];

    if (path.EndsWith(".png"))
    {
        byte[] data = File.ReadAllBytes(path);

        Texture2D image = new Texture2D(2, 2);
        image.filterMode = FilterMode.Point;
        image.LoadImage(data);

        string name = path.Replace(directoryPath + "\\", "");
        textures.Add(name, image);
    }
}
```

載入腳本 相同

```cs
string directoryPath = $"{Application.streamingAssetsPath}\\Scripts";
string[] files = Directory.GetFiles(directoryPath);
```

檢測格式、建立資源物件，存入資源庫

```cs
for (int i = 0; i < files.Length; i++)
{
    string path = files[i];
    if (path.EndsWith(".lua"))
    {
        byte[] data = File.ReadAllBytes(path);
        string code = System.Text.Encoding.UTF8.GetString(data);

        Script script = new Script();
        script.DoString(code);

        string name = path.Replace(directoryPath + "\\", "");
        scripts.Add(name, script);
    }
}
```

兩個範例腳本

```lua
-- scriptA
function awake()
	print("hello from script a");
end
```

```lua
-- scriptB
function awake()
	print("hello from script b");
end
```

### 實例物件 -

有了資料後 就可以實際產生物件

```cs
public class GameEntity : MonoBehaviour
{
    DynValue function;

    void Start()
    {
        if (function != null)
        {
            function.Function.Call();
        }
    }
    public void SetEntity(string id, Sprite sprite, DynValue awakeFunction)
    {
        this.name = id;
        GetComponent<SpriteRenderer>().sprite = sprite;
        this.function = awakeFunction;
    }        
}

```

生成 根據定義資料載入資源
```cs
GameEntity entity = Instantiate(entityPrefab);

Texture2D texture = textures[define.sprite];
Sprite sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f), 16);

Script script = scripts[define.script];
DynValue function = script.Globals.Get("awake");
entity.SetEntity(define.id, sprite, function);
```

如此一來 就

https://youtu.be/cmzLll_4mws

概念不算複雜 但實作上 會需要一定程度的程式能力
這裡只提供最簡單的範例而已

## 感謝閱讀 -

https://ecampusontario.pressbooks.pub/gamedesigndevelopmenttextbook/chapter/game-modifications-player-communities/
https://www.techopedia.com/definition/3841/modification-mod

提供一個方向

即使不讓玩家擴充 也是

### 更進一步 -

原型模式 Prototype

類型物件 Type Object

位元組碼 Bytecode

正規語言 Formal Language

正規表示式 (Regular expression)

http://gameprogrammingpatterns.com/prototype.html

how to make game moddable

### 參考資料

https://www.turiyaware.com/blog/creating-a-moddable-unity-game

https://docs.unity3d.com/Manual/StreamingAssets.html

https://docs.unity3d.com/ScriptReference/ImageConversion.html