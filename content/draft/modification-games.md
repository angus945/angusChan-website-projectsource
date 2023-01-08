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

還記得去年閱讀 Game Programming Patterns 時就接觸到「資料驅動」這項遊戲程式的關鍵知識，但還是拖了好一陣子才開始深入研究。而本篇筆記的課題「遊戲模組」就是他的一個應用。

這次的內容是關於遊戲模組的運作原理，以及如何在 Unity 中使用 IO、XML 與 Lua 進行實做。

<!--more-->

## 資料驅動 -

相信接觸遊戲領域的各位已經相當熟悉「遊戲模組」一詞了，所以我就不再贅述，直接進入正題吧，首先：

**資料驅動 Data Driven Programming 是什麼？**

簡單來說，這是一種透過「輕量的資料結構」來實做一系列「複雜行為與邏輯」的程式設計手法。

，使用字串與整數建構並驅動遊戲運作，而不是透過程式將設計寫死，目的在於升修改彈性與降低設計門檻。

而它與遊戲模組的關聯便在 還間接提供了玩家擴展內容的手段。

但要完全解釋內容會花太多時間，所以這裡就將與模組關聯的內容整理成三大重點，提供各位進一步研究的起點。

<c>
註：不要和資料導向 (Data Oriented Design) 搞混了，查資料時可能會同時出現，但兩者沒有直接關係。
</c>

### 資料讀取 +

通常遊戲在製作完成並建置後，當中所使用的資源便會被引擎打包加密，而內容也在此時被「固定」了，常規的手段無法再對其進行修改。而若我們希望玩家開發模組，就應該讓他們有更好的方法修改遊戲內容。

因此模組運作的第一個前提是，開發者必須提供一個方法...或簡單點的說：一個資料夾位置，讓玩家能在其中自由改動資料。Unity 引擎中可以透過 Streaming Assets 與 System.IO 來達成效果，只要玩家將模組內容放特定進資料夾，遊戲在運行時就能讀取並將內容添加至遊戲裡面。

<!-- TODO 插入示意圖 -->

Steam 強大的工作坊其實也不是甚麼黑魔法，它只是幫你把模組資料「下載」到特定位置上而已，其餘的載入、解析等工作都是遊戲自身要完成的。

<c>
註：Steam 模組的預設資料夾在 C:\Program Files (x86)\Steam\steamapps\workshop\content\gameID 當中，我實做時就從中找了不少參考研究。
</C>

### 格式定義 +

即使有了第一項前提，也不代表玩家隨便扔資料進去都能運作，我們必須為模組規範好要使用的「資料格式」長怎樣才行。假設我們想定義一個怪物，首先要思考他的屬性有哪些，可能包括文字資訊、行為參數與視覺的呈現方法等。

在釐清需求以後，就要設計出一套能包含所有必須資料的「模板」，建議以能兼具修改性與易讀性的文字文件作為資料格式，例如 txt 檔：

```monster.txt
Name: Monster
Descripe: a example Monster !!

Health: 10
Speed: 1
Attack: 2

Sprite: sprites/monster.png
Sound: sounds/monster.mp3
```

文字文件的好處就是任何工具都能開啟，如此一來玩家只要根據這套模板，修改成自己想要的樣子後，放入特定資料夾就能為遊戲添加一個新的怪物資料了。

```zombie.txt
Name: Zombie
Descripe: Zombie monster !!

Health: 2
Speed: 3
Attack: 1

Sprite: sprites/zombie.png
Sound: sounds/errrrr.mp3
```

而遊戲則要根據設定的格式解析檔案，將它轉換成遊戲中所使用的物件資料。資料格式可簡單可複雜，簡單就像上面的範例，能夠改變參數與外觀，而複雜的則允許修改邏輯與行為，取決與你的需求與技術許可。

雖然檔案類型只要是 txt 就足夠了，但還是建議用其他更具修改信的格式除存，例如 XML 與 Json。 

<!-- XML 適合定義複雜資料結構，還可以自己編寫輸入提示 缺點是資料龐大 解析速度較慢
Json 適合格式固定的資料，如本地化字表文件 缺點是格式訂好就比較難擴展  -->

### 擴展行為 -

雖然只要前兩者就能達成基本的模組效果，但

達成模組的效果，但第三項能夠讓修的層度飛躍性提升

雖然能透過定義命令集來擴展行為

雖然只要 有動態載入和格式定義 就能修改相當多內容了
但有個致命的缺點是 難以擴展行為 就算有自訂命令集 還是會被開發者提供的方法侷限

因此，最後一步就是需要提供讓玩家能擴展行為的手段，簡單來說就是讓他們能自己「寫程式」。

**直譯**

<!-- 例如常用在遊戲中的 Lua -->
TypeScript, JavaScript, Python, Lua 等等

**編譯**

DLL 檔案



有許多現成的資源 例如直譯的 Lua 與編譯的 C# Dll
當然也可以手刻一個虛擬機去跑你的自訂程式
無論何者都需要由開發者提供 接口調用

總結以上
在排除反編譯等特殊手法以後，遊戲能否
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

正規表示式 (Regular expression)

http://gameprogrammingpatterns.com/prototype.html

how to make game moddable

### 參考資料

https://www.turiyaware.com/blog/creating-a-moddable-unity-game

https://docs.unity3d.com/Manual/StreamingAssets.html

https://docs.unity3d.com/ScriptReference/ImageConversion.html
