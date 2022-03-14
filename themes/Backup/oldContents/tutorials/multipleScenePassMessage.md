---
title: "運用多場景機制進行資料傳遞"
date: 2021-07-25T14:29:23+08:00
lastmod: 2021-07-25T14:29:23+08:00
draft: true
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
important: 10

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: true
likecoin: false
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---

DontDestroyOnLoad 的運作原理與多場景的運用

## 前言

### DontDestroy

眾所皆知，Unity 在轉場時為了節省記憶體空間，會將舊場景中的所有物件銷毀並釋放掉，但如果我想在轉場時保留某些物件怎麼辦 ?

Unity 當然知道這點，為此在他們的 Object 中有一項函式，我們可以透過這個函式將物件設定成不會在轉場時隨著場景銷毀。

```csharp
static void DontDestroyOnLoad(Object target);
```

為什麼設置之後就不會被銷毀了呢 ?

它的原理是這樣的，當場景中有物件被設置為 dontDestroy 時，Unity 建立一個名為DontDestroyOnLoad 的場景在遊戲中，並將所被設置的物件移至該場景。

{{< pathImage "example_dontDestroy.jpg" >}}

在進行常規的轉場時，系統會自動忽略掉這個場景，只將原本的場景釋放掉並載入新場景，因而保存了這些物件，這就是 DontDestroyOnLoad 的運作原理。知道了原理之後又能做什麼 ?

只要知道原理之後我們就能夠自己製作一項系統來重現這個功能，至於要用來做什麼可以先思考一下有什麼狀況是原本我們會透過 DontDestroyOnLoad 實現的。通常會使用 dontDestroy 的情況就是希望物件不會在轉場時被銷毀(廢話)。

例如 GameManager，這應該是少數真正需要永遠存在東西了，因為直到玩家關閉遊戲前他都得持續管理整個遊戲流程。再來可能是背景音樂的撥放器，因為不想要讓音樂在轉場時被中斷，所以也將它保留。

除此之外更多人使用他是為了將訊息在場景之間傳遞，畢竟原本儲存數據的物件被銷毀就沒辦法傳遞了，將物件保留是最簡單的方法。

但是當這些物件其實在傳遞完資訊後就不需要了，又要一個一個銷毀掉，否則再次轉場時可能發會生衝突，我們將物件設置成永遠存在後，又將他銷毀顯然多此一舉。

所以這篇文章就是要教各位如何使用的不同的方法在場景間傳遞資料 ~~

### Unity 的場景機制

首先，上面的部分應該有暗示到 Unity 是允許同時存在多個場景的，你可以簡單的將資料夾中的場景拖曳到 Hierarchy 來添加複數場景。

{{< pathImage "example_multipleScene.gif" >}}

運作中的場景一共有兩種類型，活躍的 (Active) 也就是主要場景，他會在 Hierarchy 中用粗體字表示，再來是附加的 (Additive) 也就是附加上的次要場景。

{{< pathImage "example_hierarchy.jpg" >}}

這兩者的差別在於允不允許實例化(Instantiate)物件，無論調用實例化函式物件存在於哪個場景，實例化一律都只會將物件創建在 Active Scene 中，而複數場景中一定會有一個是 Active 的。

### 場景相關的函式

在進入主題以前，先簡單介紹一下轉場相關的函式。首先要調用轉場得要先引用命名空間，任何場景相關的操作都得經過 Unity 的 SceneManager。

```csharp
using UnityEngine.SceneManagement
```

場景載入的函式，雖然他擁有許多多載，但這邊先關注一個就好。

```csharp
public static void LoadScene(string sceneName, LoadSceneMode mode);
```

LoadSceneMode 為載入場景的模式，有 Single 和 Additive 兩種。Single 就是一般的載入模式，只允許單一場景存在，他會銷毀自身(和 dontdestroy)以外的所有場景。而 Additive 就是附加場景，這會將新場景用附加的形式添加入遊戲。若調用時在沒有指定模式的時候預設都是 Single。

而於 Additive 就是今天的主角了，這裡先稍微介紹過。再來是卸載場景，當有複數場景被啟用時，可以透過場景名稱將特定的場景移除。

```csharp
public static AsyncOperation UnloadSceneAsync(string sceneName);
```

## 如何運用多場景機制

鋪陳了那麼久總算要進入主題了 (X

### 進行資料傳遞

首先定義一下我們要傳遞的東西，為了方便範例所以教學這邊就先用 string 當作傳遞的資料類型。

場景的部分一共需要三種

+ 主場景 - 也就是資料的來源
+ 遊戲場景 - 要傳遞的目標
+ 傳遞場景 - 負責傳遞資料場景，我們這裡就叫他信差吧

{{< pathImage "scenes.jpg" >}}

轉場的部分，因為需要額外的訊息傳遞功能，所以我們也得寫一個自己的轉場系統來達成目的。建立一個 CustomSceneManager.cs 的腳本附在場景物件上，並進行單例設置和建立讓外部可以調用轉場功能的靜態接口。

```csharp
using UnityEngine.SceneManagement;

public class CustomSceneManager : MonoBehaviour
{
    static CustomSceneManager instance;
    void Awake()
    {
        if (instance != null) Destroy(gameObject);
        else
        {
            instance = this;

            DontDestroyOnLoad(gameObject);
        }
    }
    public static void LoadScene(string sceneName) { }
}
```

再來是實作轉場的功能，因為場景是在命令被調用的那幀結束之後載入的，所以為了配合訊息傳遞的功能，我們必須將原本的轉場流程拆成三個部分。

1. 載入信差場景，畢竟信差要先來我們才能把東西交給他
2. 將要傳遞的資料交信差，並卸載主場景，載入遊戲場景
3. 將遊戲場景設為 ActiveScene，而信差也在會在這幀將東西交給應該交給的對象，完成工作後退下

{{< pathImage "signal.jpg" >}}

建立靜態方法將轉場函式公開，並使用 Coroutine 來達成分段載入的功能。

```csharp
public static void LoadScene(string sceneName)
{
    instance.LoadingScene(sceneName);
}
public void LoadingScene(string sceneName)
{
    StartCoroutine(LoadingRoutine(sceneName));
}
IEnumerator LoadingRoutine(string sceneName)
{
    SceneManager.LoadScene("messenger", LoadSceneMode.Additive);

    yield return null;

    SceneManager.UnloadSceneAsync(activeScene);
    SceneManager.LoadScene(sceneName, LoadSceneMode.Additive);

    yield return null;

    SceneManager.SetActiveScene(SceneManager.GetSceneByName(sceneName));
    SceneManager.UnloadSceneAsync("messenger");
}
```

再來是信差的部分，建立一個 SceneMessenger.cs 並附加在信差場景中的物件上。同樣的，設置成單例以方便進行存取。

```csharp
public class SceneMessenger : MonoBehaviour
{
    public static SceneMessenger instance;

    void Awake()
    {
        instance = this;
    }
}
```

因為實際情況可能會有許多資料要傳遞，所以我們可以透過 Dictionary 來保存以避免通通混雜在一起。

實作傳遞方法，函式接收兩個字串作為輸入。第一為傳遞地址 address，用來辨識資料要傳遞給誰，也就是字典的 key。第二則是要傳遞的訊息 message。

```csharp

Dictionary<string, string> messages = new Dictionary<string, string>();

public void PassMessage(string address, string message)
{
    messages.Add(address, message);
}
public string GetMessage(string address)
{
    messages.TryGetValue(address, out string message);
    return message;
}
```

至於場景物件傳遞和取得訊息的時機，可以為我們的轉場腳本添加事件來達成。回到 CustomSceneManager.cs 進行修改，添加兩個轉場事件，當 "場景載入" 和當 "場景載入完畢" 時。

```csharp
public static Action onScenesLoadingEvent;
public static Action onScenesLoadedEvent;

IEnumerator LoadingRoutine(string sceneName)
{
    SceneManager.LoadScene("messenger", LoadSceneMode.Additive);

    yield return null;

    onScenesLoadingEvent?.Invoke();
    SceneManager.UnloadSceneAsync(activeScene);
    SceneManager.LoadScene(sceneName, LoadSceneMode.Additive);

    yield return null;

    onScenesLoadedEvent?.Invoke();
    SceneManager.SetActiveScene(SceneManager.GetSceneByName(sceneName));
    SceneManager.UnloadSceneAsync("messenger");
}

```

有了這兩個事件，我們就可以讓要傳遞訊息的腳本在轉場時將資料交給信差，並在轉場結束後讓接收對象從信差那裏接收訊息。

現在，為了測試效果我們建立一個 PlayerProperty.cs 並附在主場景中的物件上，並添加幾個簡單的屬性作為要傳遞的訊息。

```csharp
public class PlayerProperty : MonoBehaviour
{
    [SerializeField] int playerHealth = 100;
    [SerializeField] int playerDamage = 100;
    [SerializeField] int playerExprience = 100;
}
```

接下來實作出一個將玩家屬性交給信差的函式，並註冊在 onScenesLoadingEvent 上。如此一來當場景轉換時，玩家屬性的資料就會被交給信差了。

```csharp
void Start()
{
    CustomSceneManager.onScenesLoadingEvent += PassDataToMessanger;
}
void OnDestroy()
{
    CustomSceneManager.onScenesLoadingEvent -= PassDataToMessanger;
}

void PassDataToMessanger()
{
    SceneMessenger.instance.PassMessage("playerHealth", playerHealth.ToString());
    SceneMessenger.instance.PassMessage("playerDamage", playerDamage.ToString());
    SceneMessenger.instance.PassMessage("playerExprience", playerExprience.ToString());
}
```

最後，當訊息被傳出後還需要一個接收者來接收訊息，我們建立一個 Player.cs 腳本並附加在 GamePlayScene 中的物件上，他就是我們的接收者。

在 Start 中註冊一項取的資料的函式在 onScenesLoadedEvent 上，如此一來當場景傳換完畢時，玩家就能夠接收到上個場景中屬性傳遞的資料了。

```csharp
public class Player : MonoBehaviour
{
    void Start()
    {
        CustomSceneManager.onScenesLoadedEvent += LoadPlayerProterties;
    }
    void OnDestroy()
    {
        CustomSceneManager.onScenesLoadedEvent -= LoadPlayerProterties;
    }

    void LoadPlayerProterties()
    {
        string playerHealth = SceneMessenger.instance.GetMessage("playerHealth");
        string playerDamage = SceneMessenger.instance.GetMessage("playerDamage");
        string playerExprience = SceneMessenger.instance.GetMessage("playerExprience");

        Debug.Log("health: " + playerHealth);
        Debug.Log("damage: " + playerDamage);
        Debug.Log("exprience: " + playerExprience);
    }
}
```

為了測試結果我們將他用 debug.Log() 打印出來，雖然取得的資料是字串但實際使用時可以透過 int.Parse 將他轉型為整數。現在所需的一切都齊全了，讓我們回到主場景中並添加一個轉場腳本進行測試。

```csharp
public class ToNextScene : MonoBehaviour
{
    void Update()
    {
        if(Input.GetKeyDown(KeyCode.Space))
        {
            CustomSceneManager.LoadScene("GamePlayScene");
        }
    }
}
```

{{< pathImage "passMessage.gif" >}}

而當然，除了純數據資料以外這種作法也能夠傳遞 GameObject，只需要額外建立一個儲存物件的字典，以及提供傳遞的接口即可。透過設置父物件來將物件轉移到不同場景。

```csharp
Dictionary<string, GameObject> objects = new Dictionary<string, GameObject>();

public void PassObject(string address, GameObject gameObject)
{
    objects.Add(address, gameObject);
    gameObject.transform.parent = transform;
}
public GameObject GetObject(string address, Transform parent)
{
    objects.TryGetValue(address, out GameObject gameObject);
    gameObject.transform.parent = parent;
    return gameObject;
}
```

{{< pathImage "passObject.gif" >}}

以上就是透過 Unity 多場景機制進行資料傳遞基本的作法，教學中的範例相當粗糙，只是提供一種思路而已。畢竟真的要舉的話，例子也舉不完，實際還是北根據需求自己設計系統才行。

如果要更進階的也可以透過繼承介面來將整個 class 或 struct 當傳遞的訊息，不只能提高傳遞的資訊複雜度，還能夠封裝訊息的類型，補充個簡單的範例。

```csharp
public interface ISceneMessage
{
    string address { get; }
}

public struct PlayerData : ISceneMessage
{
    public string address { get => "playerData"; }

    public int playerHealth;
    public int playerDamage;
    public int playerExprience;
}
```

而信差的部分改為接收實作了抽象介面的物件。

```csharp
Dictionary<string, ISceneMessage> messages = new Dictionary<string, ISceneMessage>();
protected internal static void PassMessage(ISceneMessage message)
{
    messages.Add(message.address, message);
}
protected internal static ISceneMessage GetMessage(string address)
{
    messages.TryGetValue(address, out ISceneMessage message);
    return message;
}
```

傳遞的部分類似這樣，將數據包裝進繼承介面的結構中，如此一來就不需要每個數據都傳遞一次，而且還被限制為字串，大大提升了方便性。

```csharp
void PassDataToMessanger()
{
    PlayerData playerData = new PlayerData(playerHealth, playerDamage, playerExprience);
    SceneMessenger.instance.PassMessage(playerData);
}

void LoadPlayerProterties()
{
    ISceneMessage message = SceneMessenger.instance.GetMessage("playerExprience");

    PlayerProperty datas = message as PlayerData;
}
```

教學到這裡告一段落，感謝閱讀 ~

<!-- 感謝趴趴鼠提供建議 -->