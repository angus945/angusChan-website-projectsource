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

為了研究更高效率的自製工具開發，所以接觸到了 Unity 的 UI Toolkit 這套界面開發工具，它使用與普遍常見的 `CustomEditor` 函式庫截然不同的架構，能夠以「物件」的形式繪製與架構界面，大幅提高整體維護性與效率。這篇文章是 Unity 工具開發，視覺物件的學習筆記。

<!--more-->

## 自訂工具 +

在學習遊戲開發一段時間後，可能會開始有自製工具的需求，而 Unity 也為此提供了幾個選項供開發者選擇，筆記的開頭就帶過兩種 Unity 工具開發的主要方法。

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

視窗可以透過右鍵 > Create > UI Toolkit > Editor Window 生成預設的範例界面，或是自行建立腳本後讓類別繼承 `EditorWindow`。

{{< resources/image "create-window.jpg" "80%" >}}

{{< resources/image "create-window-panel.jpg" >}}

<p><c>
註：UXML 是用於進階的界面開發，後面會稍微帶過，這篇筆記不會對其進行深入。
</c></p>

生成完畢後資料夾就會出現預設的腳本，而界面看起來會像這樣。筆記會從頭講過一次，自行研究後可以刪除預設腳本的內容。

{{< resources/image "default-window.jpg" >}}

### 添加元素 +

如果想建立其他元素，只需要透過建構函式建立繼承自 VisualElement 的類別即可。建立完畢後若想讓元素顯示在視窗界面上，就需要將其添加至 `rootVisualElement` 當中。`CreateGUI()` 函式會在視窗「準備好」的時候調用，是比較適當的元素建立時機，但實際上可以在任何時候產生視覺物件。

```cs
public void CreateGUI()
{
    Label label = new Label("Label Element");

    rootVisualElement.Add(label);
}
```

{{< resources/image "add-label.jpg" >}}

視覺物件使用的是名為視覺樹 (Visual Tree) 的層次結構，而 `rootVisualElement` 指的是結構的最根部，也就是視窗本身。當物件被添置其中後視窗便會繪製。有許多種元素可以使用，包括一般界面的 `Label`, `Button`, `Image`, `Toggle`，與編輯器界面的 `IntegerField`, `ObjectField`，以及特殊的排版元素 verticle spiter 等。

除此之外，樹狀結構的特性也允許視覺物件也嵌套，可以透過 `new VisualElement()` 建立空的物件作為容器，利用嵌套的方式包裝其他視覺物件。

```cs
VisualElement container = new VisualElement();

container.Add(new Label());
container.Add(new Toggle());

rootVisualElement.Add(container);
```

最基本的物件建立方法如上，目前為止效果與一般的 CustomEditor 相同。

<p><h>
注意：筆記後面範例將省略 `rootVisualElement.Add()` 的步驟，請自行添加。
</h></P>

### 監聽事件 +

每個視覺物件都具有事件監聽的功能，只需要使用 `RegisterCallback<T>()` 函式進行註冊即可，任何 EventBase 下的事件類別都能進行監聽，包括 MouseMoveEvent, MouseDownEvent 等常用事件，當事件被觸發時也會回傳對應的參數進註冊函式。

```cs
Button button = new Button();
button.RegisterCallback<MouseMoveEvent>((MouseMoveEvent e) =>
{
    Debug.Log(e.mousePosition);
});
```

而具有輸入性質的編輯器元素也有對輸入參數進行監聽的事件，可以透過函式 `RegisterValueChangedCallback()` 進行註冊，當參數發生變動時便會觸發並將相關資訊傳入函式。

```cs
ObjectField objectField = new ObjectField();
objectField.objectType = typeof(UnityEngine.Object);
objectField.RegisterValueChangedCallback((ChangeEvent<UnityEngine.Object> e) =>
{
    Debug.Log(e.previousValue);
    Debug.Log(e.newValue);
});
```

<p><c>
註：用泛型註冊事件的方法我還是第一次看到，有點意思。
</c></p>

### 擴展元素 +

如果想設計自己的元素重複使用，也只需要繼承 VisualElement 即可。假設我需要一個帶有按鈕的物件輸入匡，只需要繼承 ObjectField 然後添加生成按鈕的功能即可。

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

而添加自訂元素時也與一般的視覺物件相同，透過建構函式生成。

```cs
ObjectFieldWidthButton fieldWidthButton = new ObjectFieldWidthButton();
fieldWidthButton.objectType = typeof(UnityEngine.Object);
fieldWidthButton.AddButton("Button A", () => Debug.Log("ButtonA Clicked"));
fieldWidthButton.AddButton("Button B", () => Debug.Log("ButtonB Clicked"));
```

{{< resources/image "field-width-Button.jpg" >}}

### 排版樣式 +

**程式指定**

透過程式直接指定 `visualElement.style` 中的參數調整樣式，基本的樣式表 (style sheet) 屬性都能在這邊指定，包括元素長寬、顏色與對齊方法等。

```cs
Label title = new Label("Tittle");
title.style.color = Color.red;
title.style.fontSize = 30;
title.style.alignSelf = Align.Center;
```

{{< resources/image "sytle-code-title.jpg" >}}

而樣式屬性也能一定程度的對子元素進行排版，例如改變 `FlexDirection` 讓子元素用並排的方式排列。

```cs
VisualElement container = new VisualElement();
container.style.flexDirection = FlexDirection.Row;

container.Add(new Label("Label A"));
container.Add(new Label("Label B"));
container.Add(new Label("Label C"));
container.Add(new Label("Label D"));
```

{{< resources/image "style-code-flex.jpg" >}}

程式指定是最較簡單的排版方法，但許多細節調整還是沒那麼方便。

**樣式表指定**

第二種方式是透過 Unity 提供的樣式文件 Unity Style Sheet (USS) 進行編輯，使用方式與網頁的階層式樣式表 (CSS) 大相逕庭，包括指定元素類型的 selector 與包裝樣式的 class，能夠修改元素的大小、排列、顏色等樣式屬性。

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
```

透過 `AssetDatabase` 函式庫載入樣式文件，並添加至視覺物件的樣式列表中，樣式文件載入後便會自動使用 selector 指定的屬性，或你也可以透過 `AddToClassList()` 函式指定樣式 class，載入的樣式表也會往子元素傳遞。

```cs
StyleSheet styleSheet = AssetDatabase.LoadAssetAtPath<StyleSheet>("Assets/Editor/UIToolkitWindow.uss");
rootVisualElement.styleSheets.Add(styleSheet);

Label title = new Label("Tittle");
title.AddToClassList("align-center");
```

{{< resources/image "style-sheed.jpg" >}}

透過 USS 文件編輯樣式能更有效的架構與重用屬性，除了有更大的彈性以外也比直接在程式中寫死參數好維護，更多細節可以參考官方文檔 [Style UI with USS](https://docs.unity3d.com/Manual/UIE-USS.html)。

<!-- https://docs.unity3d.com/Manual/UIE-USS.html -->

<!-- 參考  [Unity Style Sheets - The Basics](https://www.youtube.com/watch?v=c3sSyoiekz4)   -->
<!-- https://www.youtube.com/watch?v=c3sSyoiekz4 -->

**視覺化排版**

最後也是最強大的功能便是 Unity 提供的圖像化界面編輯器 UI Builder。透過 Window > UI Toolkit > UI Builder 可以開啟編輯切面。2019.4 與 2020 版本需要透過 Packge Manager 導入，而在 2021 版開始之後為內置工具，不需要而外動作即可使用。

{{< resources/image "style-builder" "80%" "圖片引用自 Unity 教學文檔" >}}

點擊與拖曳即可添加元素、調整版面，所見即所得的開發工具能顯著降低設計難度與提高開發效率，同時還能透過 UXML (Unity XML, Unity Extensible Markup Language ) 擴展自訂標籤，讓使用者繼承 VisualElement 的自訂義元素也能在編輯器中使用。

更多細節請參考官方教學文檔 [Unity UI Builder](https://docs.unity3d.com/Packages/com.unity.ui.builder@1.0/manual/index.html)，這裡一樣點到為止。

<!-- https://docs.unity3d.com/Packages/com.unity.ui.builder@1.0/manual/index.html -->

### 參考範例 +

最後，Unity 還有提供內建的範例模板供開發者參考，只需要透過 Window > UI Toolkit > Semples 開啟範例視窗就有所有元素的列表與程式碼可以參考。

{{< resources/image "ui-toolkit-sample-a" >}}

{{< resources/image "ui-toolkit-sample-b" >}}

## 經驗總結 +

第一次嘗試製作複雜的編輯器是在山鴉行動中的裝備編輯器，為了方便編輯裝備的各種效果，我弄了一套完整的編輯介面能修改觸發條件、效果冷卻和特效之類的。

{{< resources/image "operation-raven-equip-editor.jpg" >}}

我當時還弄了一套能分割視窗範圍的函式庫，但即使如此建立在 IMGUI 的程式碼還是很難維護，還好當時完成後就沒有麼需要修改了。

這也只是各種嘗試開發的工具的其中一項而已，在接觸到 UI Toolkit 之後才發覺浪費了一堆時間在 IMGUI 上，不是說這套系統不好，而是它本身就不是為了開發複合工具使用的，所以才這樣。

### 對比差異 +

最後再做個簡單對比，比較 IMGUI 與 Visual 的優缺點與適用情況。

**IMGUI**  
+ 容易學習，適合入門 Custom Editor
+ 簡單快速，一行一個元素，但難以開發複合功能的編輯工具
+ 適合用在簡單的自定義資料結構上，可以參考 [Optional Variables - Unity Tips](https://youtu.be/uZmWgQ7cLNI)

**Visual Element**  
+ 排版難易度低，圖形界面與樣式表能顯著降低設計難度。
+ 易於擴展與維護，但系統複雜度略高，需要一點時間學習
+ 適合開發更複雜的編輯器，對建議自製工具有更高需求的人使用

<!-- Optional https://youtu.be/uZmWgQ7cLNI -->

官方也有對各種 UI 系統的對比文檔 [Comparison of UI systems in Unity](https://docs.unity3d.com/Manual/UI-system-compare.html)，當中包括了使用對象的建議。

{{< resources/image "roles-and-skill-sets.jpg" >}}

<!-- https://docs.unity3d.com/Manual/UI-system-compare.html -->


總之，希望這篇筆記能幫各位更了解 UI Toolkit 這個方便的界面工具。

{{< outpost/likecoin >}}

### 參考資料
//

[Unity UI Elements - The Basics](https://youtu.be/EfEAr0meBho)
https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEngine.UIElements.html
https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEditor.UIElements.html
https://docs.unity3d.com/Manual/UI-system-compare.html

https://youtu.be/c3sSyoiekz4?list=PL0yxB6cCkoWImQ8wa74V913mqlK_KTy3I

