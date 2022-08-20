---
title: "【筆記?】視覺物件與自訂編輯器"
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
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

<!--more-->

因為要深入研究工具的開發方法

## 自訂工具 -

### 即時模式 -

https://docs.unity3d.com/cn/current/Manual/GUIScriptingGuide.html

說到 Unity 的自訂編輯器，最普遍的是透過 GUI 系列的函式進行開發，他是由 Unity 提供的一套作為開發工具使用的獨立系統，全稱為 "即時模式 GUI" (Immediate Mode GUI System)，

他被稱作 "即時" 的原因也不難理解，因為他是以過 "一行命令，一個元素" 的方法進行繪製的。

使用者需要再在特定的函式中調用 GUI 命令，當引擎調用時就會根據命令逐個繪製出介面元素。

```cs
void OnGUI() 
{
    if (GUILayout.Button("Press Me"))
        Debug.Log("Hello!");
}
```

https://docs.unity3d.com/cn/current/uploads/Main/GUIScriptingGuideHelloExample.png

IMGUI 提供開發者們便捷的方式製作自己的編輯器界面

透過一行命令一個元素 能夠快速繪製 添加按鈕
能夠



而他的優點同時也是缺點，由於這種逐行執行命令的模式更傾向於 程序導向程式設計 而非 物件導向，導致使用 IMGUI 開發的編輯工具都相當難進行維護，更別說擴展了。

註：我也是些這篇筆記的過程才想通得 之前只覺得很難維護 單不了解原因

排版


### 視覺物件 -

https://docs.unity3d.com/Manual/UIE-VisualTree.html

為了因應 IMGUI 各項缺點，

具有層次結構的
Visual Tree

https://docs.unity3d.com/uploads/Main/VisualTreeExample.png


用 Visual Element 畫 Editor 輕鬆好多==

他能把介面元素當物件建立，不像 GUI 系列要一行行手刻繪製命令

排版能直接用物件嵌套，子物件能繼承父層的容器範圍，不像 GUI 重覆計算 Rect 然後一個個往下傳

還能直接繼承 Visual Element class 自訂元素，物件還自帶事件監聽，擴展維護甚麼都輕鬆很多

而且 Unity 自帶供圖形編輯器能排版 (UI Builder) ，物件能吃層疊式樣表

能夠在遊戲中使用 以及自訂編輯器

這篇筆記就簡單講過

## 建立視窗 -

資料夾右鍵 > Create > UIElements > EditorWindow 能夠自動生成預設編輯器

能夠繪製元素在遊戲與編輯器
using UnityEngine.UIElements;

能夠繪製元素在編輯器
using UnityEditor.UIElements;

https://docs.unity3d.com/cn/2021.1/Manual/GUIScriptingGuide.html

<!-- 註 建立時可以看到 Style Sheet ，但本篇文章先不對此深入 -->

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

官方也有使用對象的建議

用 IMGUI 做複合工具真的要命


總之 希望能幫上各位

{{< outpost/likebutton >}}

### 參考
//

[Unity UI Elements - The Basics](https://youtu.be/EfEAr0meBho)
https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEngine.UIElements.html
https://docs.unity3d.com/Packages/com.unity.ui@1.0/api/UnityEditor.UIElements.html
https://docs.unity3d.com/Manual/UI-system-compare.html

https://youtu.be/c3sSyoiekz4?list=PL0yxB6cCkoWImQ8wa74V913mqlK_KTy3I

