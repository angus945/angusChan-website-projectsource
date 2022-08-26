---
title: "【筆記】視覺物件與自訂工具？"
date: 
lastmod: 

draft: true

description:
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/unity/editor-visual-element/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

因為要深入研究工具的開發方法

這篇文章是自定義編輯器視窗 - 視覺物件的學習筆記

<!--more-->

## 自訂工具 -

需要有基本的 Unity Custom Editor 知識

### 即時模式 +

<!-- https://docs.unity3d.com/cn/current/Manual/GUIScriptingGuide.html -->

說到自訂編輯器，Unity 開發者最先接觸到的通常是命名空間 `UnityEditor` 底下的 `GUI` `Editor` `Layout` 系列函式，這是由一套作為開發工具使用的獨立系統，全稱為「即時模式 GUI」 (Immediate Mode GUI System)。

名稱中的「即時」直接解釋了這套系統的特性，因為他是以「一行命令，一個元素」的模式運行的。假設我希望在自訂編輯器中天加按鈕，只需要在 EditorWindow 的 `OnGUI()` 調用 `GUILayout.Button()` 即可。

```cs
private void OnGUI()
{
    if(GUILayout.Button("ClickMe"))
    {
        Debug.Log("Button Clicked");
    }
}
```

{{< resources/image "summary-imgui.jpg" "100%" >}}

除了按鈕以外還有這種界面元素，包括整數輸入、浮點滑桿、文字匡與下拉選單等，都能用一行命令完成繪製，是相當便捷且容易學習的系統。

而他的缺點也十分明顯，由於這種逐行執行命令的模式更傾向於「程序導向」(procedure-oriented) 而非「物件導向」 (object-oriented)，導致使用 IMGUI 開發的編輯工具都相當難進行、重用與擴展。

除此之外，在 IMGUI 中進行排版更是一大惡夢，若不使用自動排版就得手動計算每個元素的 Rect (Position, Size)，導致程式碼變得相當冗長，相信有嘗試使用 IMGUI 開發複雜工具的人應該很有感觸。

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
註：如果學過網頁前端的話，大概像只靠標籤屬性的絕對位置與長寬雕刻整個界面，不是不行但沒人會想這樣做。
</c></p>

### 視覺物件 +

為了應對 IMGUI 的各項缺點，Unity 提供了另一套更完善的介面工具 - [UI Toolkit](https://docs.unity3d.com/Manual/UIElements.html)。與線性的 IMGUI 元素不同，UI Toolket 會透過不同「視覺物件」(Visual Element) 建立出樹狀的界面結構「視覺樹」(Visual Tree)。

{{< resources/image "summary-visualtree.jpg" "80%" "引用自 Unity 文檔示意圖" >}}

視覺物件的函式庫在命名空間 `UnityEngine.UIElements` 與 `UnityEditor.UIElements` 底下，如果要建立新的元素，要透過建構函式建立繼承自 `class VisualElement` 的物件，並添加至編輯器的 `rootVisualElement` 即可。

```cs
Label label = new Label("Label Element");
Button button = new Button() { text = "Button Element" };

rootVisualElement.Add(label);
rootVisualElement.Add(button);
```

{{< resources/image "summary-visualelement.jpg" >}}

由於視覺物件是以「物件」的形式存在的，因此只要添加一次後就會自動繪製，直至使用者將其移除。而它的好處也相當明顯，由於物件能將屬性封裝在其中，使其維護性大大提昇，並且並且樹狀的視覺樹也能在一定程度上讓子元素繼承屬性，利用「容器」的性質進行排版，省去繁瑣的調整工作。

```cs
VisualElement container = new VisualElement();
container.style.width = 100;
container.style.height = 100;

Label label = new Label("Label Element");

container.Add(label);
```

除此之外還能透過繼承、泛型等方法提昇擴展與重用性，因此與 IMGUI 相比，視覺物件還是更適合用於工具開發。

<p><c>
註：說實話我也是寫這篇筆記的過程才意識到 IMGUI 是程序導向，畢竟物件導向真的太「理所當然」了，我都忘記程序導向是多不方便的程式設計方法。
</p></c>

<!-- https://docs.unity3d.com/Manual/UIE-VisualTree.html -->

## 建立視窗 +

透過右鍵 > Create > UI Toolkit > Editor Window 生成預設的範例界面。

{{< resources/image "create-window.jpg" "80%" >}}

{{< resources/image "create-window-panel.jpg" >}}

<p><c>
註：UXML 是用於進階的界面開發，後面會稍微帶過，這篇筆記不會對其進行深入。
</c></p>

生成完畢後資料夾就會出現預設的腳本，而界面看起來會像這樣。筆記會從頭講過一次，自行研究後可以刪除預設腳本的內容。

{{< resources/image "default-window.jpg" >}}

### 添加元素 -

所有繼承自 VisualElement 的元素都能透建構函式建立

VisualElement container = new VisualElement();

所有元素都得加入 rootVisualElement 才能正確繪製

除此之外元素也能夠嵌套

Add
直接加入元素在最後

Insert
在指定位置插入元素

有許多種

Label, Button, Image, Toggle

IntegerField, ObjectField

### 監聽事件 -

Visual Element 能夠進行事件監聽

```cs
public void RegisterCallback<TEventType>(EventCallback<TEventType> callback, TrickleDown useTrickleDown = TrickleDown.NoTrickleDown) where TEventType : EventBase<TEventType>, new();
```

任何 EventBase 下的事件類別都能進行監聽，包括 MouseMoveEvent, MouseDownEvent

```
visualElement.RegisterCallback<MouseMoveEvent>()
visualElement.RegisterCallback<MouseDownEvent>()
```

註：這種用泛型類別註冊事件的方法有點意思，找時間也可以研究下


對於具有輸入性質的 也有特殊的事件

```cs
ObjectField objectField = new ObjectField();
objectField.RegisterValueChangedCallback((ChangeEvent<UnityEngine.Object> e) =>
{
    Debug.Log(e.previousValue);
    Debug.Log(e.newValue);
});
```

### 擴展功能 -

能夠輕易定義自己的元素

繼承 visual element

例如帶有按鈕的物件欄位

```cs
public class ButtonObjectView : ObjectField
{
    public ButtonObjectView(string label) : base(label) { }
    public void AddButton(string text, Action onClick)
    {
        Button button = new Button(onClick);
        button.text = text;

        base.Add(button);
    }
}
```

TODO 圖

### 排版樣式 -

**程式指定**

visualElement.style

比較侷限 有些樣式不知道怎麼改

```
Label title = new Label("Tittle");
title.style.color = Color.red;
```

透過 flex 並排子元素

```
style.flexDirection
```


**樣式表指定**

相當強大的功能

載入樣式表

Unity Style Sheet (USS)

```uss
.title-text 
{
    font-size: 20px;
    -unity-text-align: upper-center;
    -unity-font-style: bold;
    color: rgb(255, 0, 0);
}
```

```cs
StyleSheet styleSheet = AssetDatabase.LoadAssetAtPath<StyleSheet>("Assets/Research/VisualTree/Editor/UIElementsStyle.uss");
rootVisualElement.styleSheets.Add(styleSheet);
```

```cs
Label title = new Label("Tittle");
title.AddToClassList("title-text");
```

點到為止
參考  Unity Style Sheets - The Basics  
https://www.youtube.com/watch?v=c3sSyoiekz4

**編輯器排版**

UI Builder 

Window > UI > UI Builder 

2019.4 與 2020 版本需要透過 Packge Manager 導入
2021 開始為內建工具

https://docs.unity3d.com/Packages/com.unity.ui.builder@1.0/manual/images/UIBuilderAnnotatedMainWindow.png
引用

集合了大量編輯工具

更多細節請參考官方教學文檔

https://docs.unity3d.com/Packages/com.unity.ui.builder@1.0/manual/index.html

UXML 自訂標籤

(Unity Extensible Markup Language)


### 參考範例 -

Unity 還有提供內建的範例模板供開發者參考

Window > UI > UIElements Semple


## 總結 -

第一次嘗試 

從山鴉的編輯器

裝備編輯器 敵人編輯器



總覺的浪費了大半輩子在 IMGUI 上

### 對比 -

IMGUI  
+ 簡單快速，一行一個元素，但難以擴展和維護
+ 適合用在簡單的自訂工具，快速添加按鈕，

Visual Element  
+ 易於擴展與排版
+ 建立複合功能編輯器視窗與自訂工具
+ 如果只是要簡單的功能 就殺雞用牛刀了
<!-- Optional https://youtu.be/uZmWgQ7cLNI -->

官方也有使用對象的建議

用 IMGUI 做複合工具真的要命


總之 希望能幫上各位

{{< outpost/likecoin >}}

### 參考
//

[Unity UI Elements - The Basics](https://youtu.be/EfEAr0meBho)
https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEngine.UIElements.html
https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEditor.UIElements.html
https://docs.unity3d.com/Manual/UI-system-compare.html

https://youtu.be/c3sSyoiekz4?list=PL0yxB6cCkoWImQ8wa74V913mqlK_KTy3I

