---
title: "【筆記】如何讓遊戲支援模組開發"
date: 2023-01-12
lastmod: 

draft: false

description: 這次將解釋遊戲模組的運作原理，以及如何在 Unity 中使用 IO、XML 與 Lua 進行實做。
tags: [unity, game-develop, programming, data-driven, modification]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/game-development/how-to-make-modification-games/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

前年讀設計模式就接觸到「資料驅動」這項遊戲程式的重要知識，總算讓我排出時間好好研究了。本篇筆記的課題「遊戲模組」就是他應用之一，這次將解釋遊戲模組的運作原理，以及如何在 Unity 中使用 IO、XML 與 Lua 進行實做。

<!--more-->

## 資料驅動 ++

相信在遊戲領域的各位已經相當熟悉「模組」一詞了，還是直接進入正題吧，首先：

**資料驅動 Data Driven 是什麼？**

簡單來說，這是一種 <h> 透過「輕量的資料結構」來描述「複雜行為與邏輯」的程式設計手法 </h> ，透過預先規範好的格式，將字串與整數映射到對應行為的實做上，而非用程式將設計寫死，目的在於升修改彈性與降低設計門檻。

它除了讓我們能更有效率的開發遊戲，也間接 <h> 提供玩家擴展內容的手段 </h> ，但將細節解釋完會太花時間，所以這裡就將與模組關聯的部份整理成三大重點，提供各位深入研究的起點。

<c>
註：不要和資料導向 (Data Oriented Design) 搞混了，查資料時可能會同時出現，但兩者沒有直接關係。
</c>

### 資料讀取 ++

通常在遊戲做完並輸出後，當中 <h> 使用的資源都會被引擎打包加密 </h> ，這也代表內容在此時被「固定」了，無法透過常規的手段修改。因此，模組運作的第一個前提就是：開發者必須提供方法...或更直白的說 <h> 「一個資料夾位置」，讓玩家能自由改動其中的資料。 </h>

以 Unity 為例，我們可以透過 `StreamingAssets` 達成效果，這是一個不會在輸出後被加密的資料夾，只要遊戲運行時透過 `System.IO` 手動讀取檔案，就能使用玩家們添加的更多「遊戲內容」。

{{< resources/image "streaming-asset.jpg" >}}

Steam 強大的工作坊「訂閱」功能也不是什麼神奇的黑魔法，它只是幫你把模組資料「下載」到特定位置上而已，其餘的載入與解析都是遊戲自身要完成的。

<c>
註：Steam 模組的預設資料夾在 C:\Program Files (x86)\Steam\steamapps\workshop\content\gameID，我實做時就從中找了不少參考研究，有興趣可以多去挖寶。
</c>

### 格式定義 ++

有了第一項前提也不代表隨便扔的資料都能運作，我們 <h> 必須為模組規範好要使用的「定義檔」的格式長怎樣才行 </h> 。假設我們想定義一隻怪物，首先要思考他的屬性有哪些，可能包括文字資訊、行為參數與視覺的呈現方法等。

根據需求設計出一套能包含所有必備資料的「模板」，使用能兼具修改性與易讀性的「文字文件」作為資料格式，以 txt 檔為例：

```txt.template
Name:
Descripe:

Health:
Speed:
Attack:

Sprite:
Sound:
```

有了模板之後，玩家只要把它修改成自己想要的樣子，再把檔案放入指定的位置就能為遊戲添加一筆新的怪物資料了。

```txt.zombie
Name: Zombie
Descripe: Zombie monster !!

Health: 2
Speed: 3
Attack: 1

Sprite: sprites/zombie.png
Sound: sounds/errrrr.mp3
```

而最後，遊戲要 <h> 根據我們設定的格式「解析」檔案，將文字檔轉換成遊戲真正使用的物件資料 </h>。格式的複雜度取決於需求，簡單的就像範例那樣修改參數與外觀，而複雜可能允許改變邏輯與行為。

雖然檔案類型只要 txt 就足夠了，但還是 <h> 建議用其他更容易閱讀、修改與解析的格式儲存 </h> ，例如 XML 與 Json。 

```json.zombie
"Define": 
{
    "name": "Zombie",
    "Descripe": "Zombie monster !!",
    
    "Health": 2,
    "Speed": 3,
    "Attack": 1,

    "Sprite": "sprites/zombie.png",
    "Sound": "sounds/errrrr.mp3"
}
```

### 擴展行為 ++

雖然有前兩者就能達成模組效果，但修改範圍仍被限制在我們提供的模板中，如果希望玩家能創造更多令人驚豔的內容，就得 <h> 提供他們自行「擴展」行為與邏輯的手段 </h> 。但如此程度的擴展就很難不接觸「程式」了，所以了遊戲的核心程式以外，我們也得 <h> 讀取並運行由玩家編寫的程式碼。 </h>

```json.smartZombie
"Define": 
{
    "name": "Smart Zombie",
    "Descripe": "Zombie monster with AI !!!!",
    
    // other perperity ...

    "Bevavior": "scripts/monsterAI.lua",
}
```

假設現在允許玩家編寫怪物移動、攻擊與死亡的行為，我們可以像定義格式那樣「規定」有哪些行為是可以修改的，並在運行時的對應時機使用。

```lua.monsterAI
function move()
	-- move behavior
end

function attack()
	-- attack behavior
end

function dead()
	-- dead behavior
end
```

當然也可以讓玩家自訂行為的觸發時機，讓擴展性再次提升，但無論如何都 <h> 需要由開發者提供一個載入與調用外部程式的接口，才能運行這些內容。 </h>

程式擴展也有許多現成資源可用，例如直譯的 Lua 語言與編譯的 .dll 檔，當然也可以手刻一個虛擬機去跑自製語言...如果你想的話。

總結以上幾點，排除反編譯等特殊手法以後，遊戲能否允許模組將取決於開發者的意願以及能力。接下來就進入實做環節，提供各位在 Unity 中實現效果的範例參考。

## 實作範例 ++

範例使用的環境為 Unity，不過邏輯都是通用的，可以自行轉換至適合的環境與工具中。文章會對使用到的關鍵要素進行解釋，但不會過多深入單一工具的用法與原理，請有興趣的人在自行研究。

+ 使用 [System.IO](https://learn.microsoft.com/zh-tw/dotnet/api/system.io?view=net-7.0) 讀取 [StreamingAssets](https://docs.unity3d.com/Manual/StreamingAssets.html) 達成資料載入

+ 使用  [System.XML](https://learn.microsoft.com/zh-tw/dotnet/api/system.xml?view=net-7.0) 解析使用 [XML](https://en.wikipedia.org/wiki/XML) 儲存的定義檔

+ 使用 [MoonSharp](https://www.moonsharp.org/) 插件運行 [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)) 達成擴展行為

範例使用的美術資源為 [0x72_DungeonTilesetII_v](https://0x72.itch.io/dungeontileset-ii)

### 定義實體 ++

首先我們要定義一個遊戲實體，它可以是怪物、道具或場景物件，但這邊先以通用物件做範例，它的屬性有辨識 ID、外觀圖像與要使用的行為腳本。

建立一個類別並宣告對應變數，為了使用 `XMLSerializer` 解析資料，我們必須給類別和變數添加序列化標籤 `[System.Serializable]` 與 XML 的元素標籤 `[XmlType]` `[XmlAttribute]` `[XmlElement]`。

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

建立定義文件，並根據設計的模板填充實體屬性，完成第一個遊戲實體設計。當然要多放幾個或是改變內容都是允許的，但範例就先保持簡單。

```xml.enemies
<Entities>
    <Entity id="entityID">
        <Sprite>UseSpriteName.jpg</Sprite>
        <Script>UseScriptName.lua</Script>
    </Entity>
</Entities>
```

接著，我們需要將定義文件讀取進遊戲才能使用。透過 `Application.streamingAssetsPath` 取得資料夾位置，並用 IO 將文件內容讀取出來，轉換成 Xml 物件以便後續解析。

```cs
string path = $"{Application.streamingAssetsPath}\\entities.xml";

byte[] entitiesData = File.ReadAllBytes(path);
string dataText = System.Text.Encoding.UTF8.GetString(entitiesData);

XmlDocument dataXML = new XmlDocument();
dataXML.LoadXml(dataText);
```

<p><r>
注意：正反斜線的差異可能會造成影響，建議在訪問路徑前先用 replace 統一。
</r></p>

因為 XML 不像 Json 有 JsonUtility 可以使用，所以我找了一段泛型序列化函式協助，原理我也不清楚，總之有效 :P

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

最後就是遍歷 XML 子節點，找出文件定義的所有 `<Entity>` 資料，把內容換成物件儲存。

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

### 載入資源 ++

現在已經能讀取實體的定義資料了，但實例化前還得找出他要使用的資源才行，也就是實體的圖片與行為腳本。除了定義格式以外，我們也 <h> 需要「規定」遊戲資源的存放位置，要求玩家遵守某些資源擺放與命名規則 </h> ，這樣除了能更方便的載入資料，也能有效保持模組檔案整潔。

將圖片放置的位置限定在 StreamingAssets 的 Sprites 資料夾中，並透過 `Directory.GetFiles()` 取得其下所有檔案的路徑。

```cs
string folderName = "Sprites";
string directoryPath = $"{Application.streamingAssetsPath}\\{folderName}";
string[] files = Directory.GetFiles(directoryPath);
```

{{< resources/image "assets-folder.jpg" >}}

最後，我們遍歷所有資源的路徑，透過 `string.EndsWith()` 檢測資料格式正不正確，並用 Unity ImageConversion 將 `byte[]` 轉換為圖片儲存，以便後續使用。

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

載入 lua 腳本的方式也相同，尋找資料夾、抓取資料、檢測格式、建立物件並存入資源庫。

```cs
string directoryPath = $"{Application.streamingAssetsPath}\\Scripts";
string[] files = Directory.GetFiles(directoryPath);

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

腳本內容視需求而定，這裡先只用一個 awake 函式，代表會在實體初始化時會被調用。

```lua.behavior
function awake()
	print("hello from script a");
end
```

### 實例物件 ++

現在解析與載入的工作都完成，終於能生成遊戲實體了。建立一個類別，它代表了實體在遊戲場景中的實例化物件，會儲存部份資料並將外在樣貌顯示出來。

```cs
public class GameEntity : MonoBehaviour
{
    [SerializeField] string id;
    [SerializeField] Sprite sprite;
    public DynValue function;

    public void SetEntity(string id, Sprite sprite, DynValue awakeFunction)
    {
        this.id = id;
        this.sprite = sprite;
        this.function = awakeFunction;
    }
}
```

實例化物件時只要根據定義檔的資料，生成並把使用資源傳入進去即可。這裡透過 moonSharp 的 `Globals.Get();` 找出 awake 函式，並保存進 DynValue 中進行傳遞。

```cs
void GenerateEntity(EntityDefine define)
{
    GameEntity entity = Instantiate(entityPrefab);

    Texture2D texture = textures[define.sprite];
    Sprite sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f), 16);

    Script script = scripts[define.script];
    DynValue function = script.Globals.Get("awake");

    entity.SetEntity(define.id, sprite, function);
}
```

最後，讓實體的物件初始化，調用從 lua 腳本中取得的 awake 函式！搭啦～原本只靠文字描述的實體就出在在場景中了，還帶著自己的圖片與行為。

```cs
public class GameEntity : MonoBehaviour
{
    // codes...

    void Start()
    {
        Initial();
    }
    void Initial()
    {
        gameObject.name = id;
        GetComponent<SpriteRenderer>().sprite = sprite;

        if (function != null)
        {
            function.Function.Call();
        }
    }
}

```

### 難題思考 ++

大功告成！

現在遊戲在建置後仍能從 StreamingAssets 添加與修改遊戲內容，也達成遊戲模組的最基本效果了。

{{< resources/image "example-result.gif" >}}

<p><c>
註：建置後的資料夾位置在 Build/Project_Data/StreamingAssets
</c></p>

核心概念其實不複雜，就像上面拆解的而已，但這樣就真能的「應用」在遊戲上嗎？

當然不行，因為範例省略了許多應用層面需要考量的問題，也不可能逐個深入解釋。畢竟本篇筆記的目的只是提供深入研究的起點，所以最後就丟幾個研究時遇到的難題給各位思考吧 :P

**層次結構**

這裡是指模組資料的存放規則，我們在範例使用的結構很簡單，只有一個文件 (entities.xml) 與兩個資源資料夾 (Sprite, Script) 而已，但實際應用時可能有各種不同類型的資料要存放。

要怎麼規範才符合需求呢？是要根據「用途」分類資源，讓地圖、角色、怪物與道具使用的內容各自存放？還是基於「類型」分類資料，將定義文件、圖片資源與腳本獨立管理？

模組資料夾中的層次結構與命名規範是我們首先要思考的問題。

{{< resources/image "thinking-folder.jpg" "80%" "Noita, One Step from Eden 與 Rimworld 的模組資料夾結構" >}}

**定義格式**

除了大範圍的層次結構，我們也要思考小範圍的資料定義格式，在範例中我們使用 xml 來定義一個實體，雖然裡面只有三項屬性，但實際應用時不會那麼簡單。

我們可能需要儲存大量的文本、參數、行為、邏輯、視覺與聽覺資料，如何設計更好的資料格式，讓定義文件容易閱讀和修改？或是重用資料以避免大量的重複內容？

定義文件的規範與格式也是一個要思考的問題。

{{< resources/image "thinking-define.jpg" "80%" "One Step from Eden 中的各種定義檔、角色、動畫與道具" >}}

**資料衝突**

範例中我們透過 ID 作為實體的辨識標籤，雖然自己能避免命名衝突，但情況放到不同的模組創作者之間就不同了。該怎麼隔離不同模組的資料？如果希望不同模組之間能相互引用又該怎麼處裡？

或是更可怕的，不是定義衝突而是運行時的行為與邏輯發生衝突該怎麼辦？

如果社群為你創作了豐富的模組內容，卻因為大量衝突而無法加入遊戲會相當遺憾，所以模組之間的衝突應對也是製作時要考量的一點。

**開發工具**

「有辦法」開發模組不代表「容易」開發模組，如果想鼓勵玩家創作的話，為他們提供協助是必須的，就像遊戲引擎協助我們開發遊戲一樣。

檔案管理器、資料檢視器、報錯系統與開發者模式等等，分析引擎是怎麼幫助我們製作遊戲的，並開發輔助玩家創作的工具，減低模組開發時會受到的阻礙。

{{< resources/image "thinking-devtool.jpg" "80%" "Rimworld 的報錯視窗" >}}

**效能優化**

我們製作遊戲時會因為效能考量對使用資源進行限制，但情況放到模組上就沒那麼簡單了，雖然還是能限制資源的規格，但仍無法直接管控模組使用的資源。

如何管理大量資源，提升模組載入與運行效率？避免記憶體被未用資源佔滿，或是運行時的各種 GC 問題導致效能低落？

效能也是一個需要考量的地方，除非你的遊戲像 Rimworld 一樣吸引人，不然玩家不會想花十幾分鐘等模組載入的。

**目的為何**

最後也是最重要的問題：你究竟想做什麼

讓遊戲支援模組開發的目的為何？是希望玩家能分享創作，促進社群交流？還是想讓他們給遊戲添加更多道具、角色，提升內容豐富度？又或者你想打造一個像 Rimworld 與 Minecraft 這種趨近瘋狂，能對整個遊戲機制進行修改沙盒世界？

無論如何最後都得回到需求上，實做前必須謹慎思考你的目標，並評估你願意付出多少成本完成這項偉大工作。

## 感謝閱讀 ++

雖然這篇筆記的重點是模組開發，但當中的知識不會被用法侷限，即使不讓玩家改動內容，資料驅動也是相當重要的開發技能，它除了讓企劃人員能更方便的改動設計，也是發布後擴充 DLC 與進行熱更新的好方法。

幾個月前就該完成的筆記，拖到現在不好意思了，入學讀書真的是很花時間的事。總之，希望這次的內容也能讓各位有所啟發，感謝閱讀 :D

{{< resources/assets "example" "> 範例中的完整腳本，與範例的模組資料都在這 <" >}}

{{< outpost/likecoin >}}

### 學習資料 ++

[Game Programming Patterns - Prototype](http://gameprogrammingpatterns.com/prototype.html)  

[Game Programming Patterns - Type Object](http://gameprogrammingpatterns.com/type-object.html)  

[Game Programming Patterns - Bytecode](http://gameprogrammingpatterns.com/bytecode.html)  

[Open Library - Game modifications](https://ecampusontario.pressbooks.pub/gamedesigndevelopmenttextbook/chapter/game-modifications-player-communities/)

[Techopedia - Modification](https://www.techopedia.com/definition/3841/modification-mod)

[Turiyaware - Creating A Moddable Unity Game](https://www.turiyaware.com/blog/creating-a-moddable-unity-game)

[Unity Manual - Streaming Assets](https://docs.unity3d.com/Manual/StreamingAssets.html)

[Unity Manual - ImageConversion](https://docs.unity3d.com/ScriptReference/ImageConversion.html)

[Microsoft Docs - XmlType](https://learn.microsoft.com/zh-tw/dotnet/api/system.xml.serialization.xmlattributes.xmltype?view=net-7.0)

[Microsoft Docs - XmlElement](https://learn.microsoft.com/zh-tw/dotnet/api/system.xml.xmlelement?view=net-7.0)

[Microsoft Docs - XmlAttribute](https://learn.microsoft.com/zh-tw/dotnet/api/system.xml.serialization.xmlattributes.xmlattribute?view=net-7.0)

[Microsoft Docs - .Net Regular Expressions](https://learn.microsoft.com/zh-tw/dotnet/standard/base-types/regular-expressions)

[MoonSharp - Getting Started](https://www.moonsharp.org/getting_started.html)