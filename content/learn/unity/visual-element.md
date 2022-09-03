---
title: "【筆記】視覺物件與工具開發"
date: 2022-09-03
lastmod: 

draft: false

description:
tags: [unity, customEditor]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/unity/visual-element/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

為了提升工具開發的效率，我研究了 Unity 引擎中的另一套介面系統 - UI Toolkit。它的運作方式與 `CustomEditor` 函式庫截然不同，能夠以「物件」的形式繪製出界面元素，大幅提高整體維護性與效率。這次的筆記內容是關於 Visual Element 的各項基礎。

<!--more-->

## 自訂工具

開發者使用 Unity 引擎一段時間後可能會遇到「自製工具」的需求，無論是更簡潔的自定義界面，還是集合式的資料編輯器，都能有效的輔助我們開發遊戲。而 Unity 當然也針對需求提供了幾項選擇，筆記的開頭就先帶過兩種工具開發的主要方法。

### 即時模式

說到自定義編輯器，開發者們最先接觸到的通常是命名空間 `UnityEditor` 底下的 `GUI` `Editor` `Layout` 系列函式，這是由一套用於工具開發的獨立系統，全稱為「即時模式 GUI」 (Immediate Mode GUI System)。

名稱中的「即時」直接解釋了這套系統的特性，因為他是以 <h> 「一行命令，一個元素」 </h> 的模式運行的。假設我希望在編輯視窗中添加按鈕，只需要在 `OnGUI()` 函式中調用 `GUILayout.Button()` 即可，當函式被執行時界面就會自動產生對應元素。

```cs
void OnGUI()
{
    if(GUILayout.Button("ClickMe"))
    {
        Debug.Log("Button Clicked");
    }
}
```

{{< resources/image "summary-imgui.jpg" "100%" >}}

除了按鈕以外還有各種元素，包括整數輸入、浮點滑桿、文字匡與下拉選單等，都能用一行命令完成，是相當便捷且容易學習的系統。

而他的缺點也十分明顯，由於這種線性執行命令的模式更傾向於「程序導向」(procedure-oriented) 而非「物件導向」 (object-oriented)， <h> 導致使用 IMGUI 開發的工具都相當難維護、重用與擴展。 </h>

除此之外，在 IMGUI 中進行排版更是一大惡夢，若不用自動排版就得親自計算每個元素的 Rect，導致程式碼變得冗長又難讀，嘗試使用 IMGUI 開發過複雜工具的人應該會很有感觸。

```cs
Rect buttonRect = new Rect(10, 10, 50, 20);
if(GUI.Button(buttonRect, "Button"))
{
    Debug.Log("Inspector Button Clicked");
}

Rect labelRect = new Rect(60, 10, 50, 10);
GUI.Label(labelRect, "Label");

int input = 0;
Rect inputRect = new Rect(60, 20, 50, 10);
input = EditorGUI.IntField(inputRect, input);
```

<p><c>
註：如果學過網頁前端的話，大概像只靠標籤屬性的絕對位置與長寬雕刻整個界面，不是不行，但沒人會想這樣做。
</c></p>

### 視覺物件

為了應對 IMGUI 的各項缺點，Unity 提供了另一套更完善的介面工具 - [UI Toolkit](https://docs.unity3d.com/Manual/UIElements.html)。與線性的 IMGUI 不同，UI Toolket 會使用「視覺物件」(Visual Element) 建立出樹狀的界面結構「視覺樹」(Visual Tree)， <h> 透過一個個獨立物件的形式構建出整個界面 </h> 。

{{< resources/image "summary-visualtree.jpg" "80%" "引用自 Unity 文檔示意圖" >}}

視覺物件的函式在命名空間 `UnityEngine.UIElements` 與 `UnityEditor.UIElements` 底下，如果要建立新的元素，只要透過建構函式建立繼承自 `VisualElement` 的物件，並添加至編輯器的 `rootVisualElement` 即可。

```cs
Label label = new Label("Label Element");
Button button = new Button() { text = "Button Element" };

rootVisualElement.Add(label);
rootVisualElement.Add(button);
```

{{< resources/image "summary-visualelement.jpg" >}}

視覺物件是以「物件」的形式存在的，因此只要添加一次就能自動繪製，直至使用者將其移除。而它的好處也相當明顯，由於 <h> 物件能將屬性封裝在其中 </h> ，使其維護性大大提昇。樹狀的結構也能在一定程度上 <h> 讓子元素繼承屬性 </h> ，利用「容器」的性質進行排版，省去繁瑣的調整工作。

```cs
VisualElement container = new VisualElement();
container.style.width = 100;
container.style.height = 100;

Label label = new Label("Label Element");

container.Add(label);
```

除此之外還能透過繼承、泛型等方法提昇擴展與重用性，比起 IMGUI 更適合開發複合工具。

## 建立視窗

CustomEditor 已經有相當充足的學習資源了，因此這篇筆記會把重點放在更冷門的視覺物件上，逐步解析各項使用重點。首先，建立一個編輯器視窗，可以透過資料夾右鍵 > Create > UI Toolkit > Editor Window 生成預設的範例界面，或是自行建立腳本後讓類別繼承 `EditorWindow`。

{{< resources/image "create-window.jpg" "80%" >}}

{{< resources/image "create-window-panel.jpg" >}}

<p><c>
註：UXML 可以用於進階的界面開發，但超出筆記的範圍所以只在後面帶過。
</c></p>

生成完畢後就會有預設的腳本和視窗出現，看起來會像這樣。筆記會從頭講過一次，自行研究後可以刪除預設腳本的內容。

{{< resources/image "default-window.jpg" >}}

### 添加元素

由於視覺物件是「物件」，所以需要先實例化才能進行操作。`CreateGUI()` 函式會在視窗「準備好」的時候調用，是比較適當的元素建立時機，但實際上隨時建立都能達到目的。

```cs
public void CreateGUI()
{
    Label label = new Label("Label Element");
}
```

視覺物件使用名為視覺樹 (Visual Tree) 的層次結構，而 `rootVisualElement` 指的是 <h> 結構的最根部 </h> ，也就是「視窗」本身。元素若想被繪製就得成為視窗的「樹」的一部分，只要透過 `Add()` 函式加入即可。

```cs
public void CreateGUI()
{
    Label label = new Label("Label Element");

    rootVisualElement.Add(label);
}
```

{{< resources/image "add-label.jpg" >}}

只要是繼承自 `VisualElement` 的物件都能用相同的方法建立，包括一般界面的 `Label`, `Button`, `Image`, `Toggle`，與編輯器界面的 `IntegerField`, `ObjectField` 等等。


除此之外，樹狀結構的特性也允許物件嵌套。可以透過 `new VisualElement()` 建立空的物件作為容器，讓它包裝多個物件在其中。

```cs
VisualElement container = new VisualElement();

container.Add(new Label());
container.Add(new Toggle());

rootVisualElement.Add(container);
```

目前為止的效果與 IMGUI 相同，但這只是最基本的使用方法而已，隨後便為各位講解視覺物件的強大之處。

<p><h>
注意：後面的範例將省略 rootVisualElement.Add() 這一步驟，請自行添加。
</h></P>

### 監聽事件

事件監聽，或者說「觀察者模式」(Observer Pattern) 是物件導向中最重要的模式之一，它能夠大幅降低程式碼耦合，用單向連接的方式提高維護性。視覺物件當然也有相關功能可以使用，只要調用 `RegisterCallback<T>()` 函式進行註冊即可。

```cs
Button button = new Button();
button.RegisterCallback<MouseMoveEvent>((MouseMoveEvent e) =>
{
    Debug.Log(e.mousePosition);
});
```

任何 `EventBase` 下的事件類別都能進行監聽，包括 `MouseMoveEvent`, `MouseDownEvent` 等常用事件，事件被觸發時便會傳遞相對應的參數。

<p><c>
註：用泛型註冊事件的方法我還是第一次看到，有點意思。
</c></p>

而具有輸入性質的元素也有對應的監聽方法，可以透過函式 `RegisterValueChangedCallback()` 進行註冊，當參數發生變動時便會觸發。

```cs
ObjectField objectField = new ObjectField();
objectField.objectType = typeof(UnityEngine.Object);
objectField.RegisterValueChangedCallback((ChangeEvent<UnityEngine.Object> e) =>
{
    Debug.Log(e.previousValue);
    Debug.Log(e.newValue);
});
```

透過事件監聽就能免去一堆條件判斷，讓程式碼簡潔許多。

### 擴展元素

如果想設計自己的通用元素，只需要 <h> 繼承 `VisualElement` 後進行擴展 </h> 即可。假設我想要一個帶有按鈕的物件輸入框，只要繼承 `ObjectField` 並添加生成按鈕的功能就好。

```cs
public class ObjectFieldWidthButton : ObjectField
{
    public void AddButton(string text, Action onClick)
    {
        Button button = new Button(onClick);
        button.text = text;

        base.Add(button);
    }
}
```

至於自訂元素的繪製方法也與一般物件相同，需要透過建構函式生成。

```cs
ObjectFieldWidthButton fieldWidthButton = new ObjectFieldWidthButton();
fieldWidthButton.objectType = typeof(UnityEngine.Object);
fieldWidthButton.AddButton("Button A", () => Debug.Log("ButtonA Clicked"));
fieldWidthButton.AddButton("Button B", () => Debug.Log("ButtonB Clicked"));
```

{{< resources/image "field-width-Button.jpg" >}}

### 排版樣式

排版也是自製工具中重要的一環，好的界面能快速有效的呈現訊息，並對使用者操作做出回饋。UI Toolkit 大致有三種排版方法可以選擇。

**_程式碼指定_**

透過程式修改 `visualElement.style` 中的參數，基本的樣式表屬性 (style sheet) 都能在這邊指定，包括長寬、顏色與對齊方法等。而這些屬性也能一定程度的影響子元素，例如改變 `FlexDirection` 讓就能讓子原素並排。

```cs
VisualElement container = new VisualElement();
container.style.flexDirection = FlexDirection.Row;

container.Add(new Label("Label A"));
container.Add(new Label("Label B"));
container.Add(new Label("Label C"));
container.Add(new Label("Label D"));
```

{{< resources/image "style-code-flex.jpg" >}}

程式指定是最簡單的排版方法，但對複雜的版面設計來說相當低效。

**_樣式表指定_**

第二種方式是透過 Unity 提供的樣式文件 Unity Style Sheet (USS) 進行編輯，使用上與網頁的階層式樣式表 (CSS) 相似，能夠透過 selector 指定元素或用 class 包裝複數屬性，讓我們修改元素的大小、排列、顏色等樣式。

```css
Label 
{
    font-size: 20px;
    -unity-font-style: bold;
    color: rgb(68, 138, 255);
}
.align-center 
{
    -unity-text-align: upper-center;
}
//註：範例程式匡沒辦法上色 USS，所以使用 CSS 當標題
```

只要透過 `AssetDatabase` 函式載入文件並添加至樣式列表就有效果了，selector 會自動分配屬性參數，也可以透過 `AddToClassList()` 函式指定 class。載入的樣式表也會往子元素傳遞。

```cs
StyleSheet styleSheet = AssetDatabase.LoadAssetAtPath<StyleSheet>("Assets/Editor/UIToolkitWindow.uss");
rootVisualElement.styleSheets.Add(styleSheet);

Label title = new Label("Tittle");
title.AddToClassList("align-center");
```

{{< resources/image "style-sheed.jpg" >}}

透過 USS 文件編輯能更有效的架構與重用屬性，除了彈性大以外也不需要重複編譯程序，大幅提高設計界面的效率。更多細節可以參考官方文檔 [Style UI with USS](https://docs.unity3d.com/Manual/UIE-USS.html)。

**_視覺化排版_**

最強大的排版工具 - UI Builder。點擊與拖曳即可添加元素、調整版面，所見即所得的工具能顯著提高設計與開發效率，還能透過 UXML (Unity XML, Unity Extensible Markup Language ) 擴展標籤，讓使用者在 UI Builder 中使用自訂義元素。

{{< resources/image "style-builder.jpg" "80%" "圖片引用自 Unity 教學文檔" >}}

透過 Window > UI Toolkit > UI Builder 可以開啟編輯視窗。2019.4 與 2020 版本需要透過 Packge Manager 導入，而在 2021 版開始之後為內置工具，不需要而外動作即可使用。

詳細教學請參考官方文檔 [Unity UI Builder](https://docs.unity3d.com/Packages/com.unity.ui.builder@1.0/manual/index.html)，他的功能太多放不進筆記，所以就先點到為止。


### 搜索元素

UI Toolkit 也有提供方便的元素搜索功能 - UQuery，能夠讓使用者透過名子或其他條件，在視覺樹中快速尋找目標元素。透過函式 `Query<T>()` 即可搜索元素，用泛型輸入指定元素類別。透過搜索的方式就不需要在函式之間傳遞元素，對於將排版和邏輯分離的架構有相當大的幫助。

```cs
UQueryBuilder<Label> labels = rootVisualElement.Query<Label>();
labels.ForEach(n => n.text = "query loop");
```

### 參考範例

最後，Unity 還有提供內建的範例模板給我們參考，只需要透過 Window > UI Toolkit > Semples 就能找到所有元素的列表與範例程式。如果你不知道自己需要什麼，或是不知道元素怎麼使用的時候就可以翻翻看。

{{< resources/image "ui-toolkit-sample-b.jpg" >}}

{{< resources/image "ui-toolkit-sample-a.jpg" >}}

## 經驗總結

第一次製作複合編輯器是在專案《山鴉行動》中，當時為了方便編輯裝備的效果，我製作出一套系統能快速修改觸發條件、效果冷卻和特效之類的內容。

{{< resources/image "operation-raven-equip-editor.jpg" >}}

雖然這套系統的功能還算完善，但建立在 IMGUI 框架下的程式碼還是相當難維護，在這之後我嘗試開發的許多工具也有相同的困擾。還好現在注意到 UI Toolkit 這套系統了，能夠以物件的方式繪製界面真的是很方便的事，相見恨晚阿。

### 對比差異

雖然以現在的需求來看 UI Toolkit 是更好的系統，但也不代表 IMGUI 一無是處，畢竟他們本然就是根據不同需求開發的。所以最後再做個簡單對比，列出 IMGUI 與 UI Toolkit 的優缺點與適用情況。

**IMGUI**  
+ 容易學習， <h> 適合入門 Custom Editor </h>
+ 簡單快速，一行一個元素，但難以開發複合功能的編輯工具
+ 適合用在簡單的自定義資料結構上，可以參考 [Optional Variables - Unity Tips](https://youtu.be/uZmWgQ7cLNI)

**Visual Element**  
+ 排版難易度低，圖形界面與樣式表能顯著降低設計難度
+ 易於擴展與維護，但系統複雜度略高，需要一點時間學習
+ 適合開發更複雜的編輯器， <h> 建議對自製工具有更高要求的人使用 </h>


官方也有各種 UI 系統的對比文檔 [Comparison of UI systems in Unity](https://docs.unity3d.com/Manual/UI-system-compare.html)，當中包括了使用對象的建議，可以根據內容評斷自己適合何者。

{{< resources/image "roles-and-skill-sets.jpg" >}}

總之，希望這篇筆記能幫各位更了解 UI Toolkit 的各項重點，感謝各位的閱讀。

{{< outpost/likecoin >}}

### 參考資料

[Immediate Mode GUI (IMGUI)](https://docs.unity3d.com/2021.3/Documentation/Manual/GUIScriptingGuide.html)

[The Visual Tree](https://docs.unity3d.com/Manual/UIE-VisualTree.html)

[Unity UI Elements - The Basics](https://youtu.be/EfEAr0meBho)

[UnityEngine.UIElements](https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEngine.UIElements.html)

[UnityEditor.UIElements](https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEditor.UIElements.html)

[Style UI with USS](https://docs.unity3d.com/Manual/UIE-USS.html)

[Unity Style Sheets - The Basics](https://www.youtube.com/watch?v=c3sSyoiekz4)  

[UI Builder](https://docs.unity3d.com/Packages/com.unity.ui.builder@1.0/manual/index.html)

[UQuery](https://docs.unity3d.com/Manual/UIE-UQuery.html)

[Optional Variables - Unity Tips 2020.1](https://youtu.be/uZmWgQ7cLNI)

[Comparison of UI systems in Unity](https://docs.unity3d.com/Manual/UI-system-compare.html)



