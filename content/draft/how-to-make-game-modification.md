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
</c>

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

雖然檔案類型只要 txt 就足夠了，但還是建議用其他更具修改信的格式除存，例如 XML 與 Json。 

<!-- XML 適合定義複雜資料結構，還可以自己編寫輸入提示 缺點是資料龐大 解析速度較慢
Json 適合格式固定的資料，如本地化字表文件 缺點是格式訂好就比較難擴展  -->

### 擴展行為 +

雖然以上兩者就能達成基本的模組效果，但修改範圍還是很受限制，因為遊戲程式仍然是在建置後被固定的，很難在現有框架下擴展行為與邏輯，因此我們的最後一步就是要讓玩家也能自己「寫程式」。

擴展程式可以是直譯或編譯語言，直譯的優點是易讀且方便修改，遊戲只要載入文字就能夠運行，而編譯的優點則是效能與穩定性，但需要用特殊的編譯檔進行儲存，兩者各有優缺，視你想達到的目標而定。

程式的擴展有有許多現成資源可以使用，例如直譯的 Lua 與編譯的 Dll 檔案，當然也可以手刻一個虛擬機去跑自製程式語言，但無論何者仍需要由開發者提供一個載入與調用外部程式的接口。

總結以上幾點，在排除反編譯等特殊手法以後，遊戲能否支援模組開發將取決於開發者的意願以及能力。所以接下來就進入實做環節，提供各位在 Unity 中實現效果的範例參考。

## 實作範例 +

範例中的環境為 Unity，但邏輯都是通用的，可以自行轉換適合的環境與工具使用。文章會對關鍵要素進行解釋，但不會過多深入單一部份。

接下來將使用 [System.IO](https://learn.microsoft.com/zh-tw/dotnet/api/system.io?view=net-7.0) 與 [StreamingAssets](https://docs.unity3d.com/Manual/StreamingAssets.html) 進行資料載入，透過 [System.XML](https://learn.microsoft.com/zh-tw/dotnet/api/system.xml?view=net-7.0) 與 [XML](https://en.wikipedia.org/wiki/XML) 設計資料定義的格式，和 [MoonSharp](https://www.moonsharp.org/) 插件與 [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)) 達成行為擴展方法。

範例使用的美術資源為 [0x72_DungeonTilesetII_v](https://0x72.itch.io/dungeontileset-ii)

### 定義實體 +

首先我們要定義一個遊戲實體，它可以是怪物、道具或場景物件，但這邊先以通用物件做範例，它的屬性有辨識 ID、使用圖像以及使用的行為腳本。

建立一個類別，宣告對應的變數並添加序列化標籤 `[System.Serializable]` 與 XML 的解析標籤 `[XmlType]`、`[XmlAttribute]` 與 `[XmlElement]`。 

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

而上面程式定義出的 XML 格式長這樣，我們可以在 `<Entity>` 標籤中設置實體的相關參數與資源。建立一個文件並編寫實體的設計內容。

```xml
<Entities>
    <Entity id="entityID">
        <Sprite>UseSpriteName.jpg</Sprite>
        <Script>UseScriptName.lua</Script>
    </Entity>
</Entities>
```

有了設計文件後，便需要將資料載入遊戲。透過 `Application.streamingAssetsPath` 取得資料夾位置，並用 IO 讀取資料，將檔案轉換成文字後建立 Xml 物件。

```cs
string path = $"{Application.streamingAssetsPath}\\entities.xml";
byte[] entitiesData = File.ReadAllBytes(path);
string dataText = System.Text.Encoding.UTF8.GetString(entitiesData);

XmlDocument dataXML = new XmlDocument();
dataXML.LoadXml(dataText);
```

<p><r>
注意：正斜線和反斜線的差異可能會造成影響，建議在訪問路徑前先用 replace 統一
</r></p>

因為 XML 不像 Json 有 Unity 內建的函式庫可以解析，所以找了一段序列化泛型函式來協助，原理我也不清楚，總之有效 :P

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

最後就是遍歷 XML 物件的子節點，找出文件中定義的所有 `<Entity>` 資料，透過序列化轉換成物件使用。

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

### 載入資源 +

實體本身的資料已經能正常載入，但我們也得保存其他由玩家添加的遊戲資源，包括圖片以及腳本文件。最好還是在初始化階段將資源載入完畢，並用 Directory 儲存，如此一來運行時就能快速的找倒資源使用。

我們將「規定」遊戲資源的存放位置，要求玩家將同類資源放在指定資料夾底下，除了保持模組檔案整齊，也讓我們能更方便的載入資料。透過 `Directory.GetFiles()` 能取的特定資料夾下的所有檔案。

```cs
string directoryPath = $"{Application.streamingAssetsPath}\\Sprites";
string[] files = Directory.GetFiles(directoryPath);
```

{{< resources/image "assets-folder.jpg" >}}

我們可以用 `string.EndsWith()` 檢測資料格式是不是正確，並透過 Unity ImageConversion 將 `byte[]` 轉換為圖片，並以檔案名稱作為 ID 存入資源庫。

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

行為腳本的內容視需求而定，範例先只用一個 Awake 函式，代表會在實體初始化時會被調用，當然也可以是 Update, OnCollision 或其他自訂的行為，但我們還是先保持簡單。

```lua
function awake()
	print("hello from script a");
end
```

你們可以自行添加資源進資料夾中，或是參考筆記中使用的資源。

{{< resources/assets "example/streaming-assets" "> 點我看範例資源 <" >}}

### 實例物件 +

現在前置作業都完成了，我們能夠根據實體的定義檔實例化物件，將他引用的資源附加上去。建立一個實體的物件類別，並宣告儲存屬性變數，並提供設定屬性的函式。

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

於是們就能透過載入的實體定義檔，將實體進行實例化，把外觀圖像與行為附加進物件中。這裡透過 moonSharp 的 `script.Globals.Get("awake");` 將 lua 的行為函式保存進 DynValue 當中，並進行傳遞，這裡就是上部份最後提到的「調用外部程式的接口」了。

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

最後讓物件使用輸入的資料初始化，並調用從 lua 腳本中取得的 awake 函式。

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

### 難題思考 -

大功告成！

現在遊戲即使輸出、打包後仍能透過 StreamingAssets 修改部份的內容，也達成遊戲模組的最基本效果了。建置後的資料夾位置在 `Build/Project_Data/StreamingAssets`。

{{< resources/image "example-result.gif" >}}

核心概念並不複雜，但這樣就真能的「應用」在遊戲上嗎？當然不行，因為範例省略了許多應用層面需要考量的問題，也不可能逐個深入，這篇筆記的目的是提供各位深入研究的起點，而不是從頭到尾的教學，最後的應用問題就留給各位研究吧，我就丟幾個研究時遇到的難題給各位思考思考 :P

**資料管理**

這裡指的是模組資料的管理方法，在實際應用上不會像範中把所有資料放在一起，通常會是以資料夾為單位隔離不同模組的檔案，因此要怎麼管理大量的模組資料夾就是第一個思考點。

接著，資料夾中的結構也需要思考的問題，設計時是要根據「用途」分類資源，讓地圖、角色、怪物、道具各自使用的內容獨立存放？還是基於「類型」分類資料，將定義文件、圖片資源與腳本存放於不同位置？

模組資料夾的層次結構與命名規範是我們首先要思考的問題。

<!-- TODO 資料夾示意圖 -->

**定義格式**

除了大範圍的資料存放以外，也要思考小範圍的資料定義格式，在範例中我們使用「實體」作為定義物件的最小單位，雖然裡面只有三項屬性，但實際應用時可能會需要儲存大量資料，文本、參數、行為、邏輯、視覺與聽覺資料等，如何格式設計更好，讓定義文件容易閱讀和修改？或是重用資料以避免大量的重複內容？

定義文件的規範與格式也是一個要思考的問題。

<!-- TODO XML 示意圖 -->

**衝突應對**

在範例中我們使用 ID 保存模組載入的資料，倘若不同模組嘗試對相同 ID 進行註冊該怎麼辦？該怎麼隔離不同模組的資料，如果又希望不同模組之間能相互引用又該怎麼處裡？或最可怕的，載入時沒有遇到問題，但運行時發生了衝突該怎麼辦...或者說要怎麼找出衝突？

如果社群為你創作了豐富的模組內容，卻因為大量衝突而無法加入遊戲是會相當遺憾，所以模組之間的衝突應對可能也是製作時要考量的一點。

**開發工具**

「有辦法」開發模組並不代表遊戲就「容易」開發模組，如果想鼓勵玩家創作的話，為他們提供協助是必須的，就像遊戲引擎協助我們開發遊戲一樣。

檔案管理器、資料檢視器、報錯系統與開發者模式等等，分析引擎是怎麼幫助我們製作遊戲的，並開發輔助玩家創作的工具，減低模組開發時會受到的阻礙。

**效能優化**

我們製作遊戲時會因為效能考量對使用資源進行限制，

雖然可以限制資源的規格，但還是無法直接管控模組

如何盡可能的提升模組載入與運行效率

要如何優化大量的模組資料，載入與釋放資源

**目標為何**

最後也是最重要的就是，思考你究竟「想做什麼」

讓遊戲支援模組開發的用意為何？希望玩家能分享創作，促進社群交流？還是想讓他們給遊戲添加更多道具、角色，提升內容豐富度？又或者你想打造一個像 Rimworld 與 Minecraft 這種趨近瘋狂，能對整個遊戲機制進行修改沙盒世界？

無論如何最後都得回到需求上，並思考你願意付出多少成本完成這項偉大工作。

## 感謝閱讀 -

提供一個方向

即使不讓玩家擴充 也是

### 更進一步 -

提供一些關鍵字，讓各位能更進一步研究與學習。

+ 資料驅動 Data Driven

+ 原型模式 Prototype

+ 類型物件 Type Object

+ 位元組碼 Bytecode

+ 正規表示式 (Regular expression)


### 參考資料 -

[Game modifications](https://ecampusontario.pressbooks.pub/gamedesigndevelopmenttextbook/chapter/game-modifications-player-communities/)

[Modification](https://www.techopedia.com/definition/3841/modification-mod)

[Creating A Moddable Unity Game](https://www.turiyaware.com/blog/creating-a-moddable-unity-game)

[Streaming Assets](https://docs.unity3d.com/Manual/StreamingAssets.html)

[ImageConversion](https://docs.unity3d.com/ScriptReference/ImageConversion.html)
