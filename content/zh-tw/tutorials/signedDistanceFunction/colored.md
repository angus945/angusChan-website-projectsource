---
title: "第三章 距離著色"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: true
keywords: []
description: ""
tags: [SDF]
category: ""
author: "angus chan"
featured_image: ""
listable: true
order: 3
similarpagelink: byorder
listable: true

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

標準化空間，大小為 10

## 內外顏色

原本的黑白太單調了，我們可以為它們上不同顏色 !

建立顏色屬性以及相對應的變數，為了方便區分形狀內外，所以我們用兩種顏色為距離場上色，要用什麼顏色就由你決定吧，記得到屬性面板上調整，教學這裡會使用紅色以及綠色。

```csharp
_ShapeColor ("ShapeColor", Color) = (1,0,0,0)
_BackgroundColor ("BackgroundColor", Color) = (0,1,0,0)
```

```csharp
fixed4 _ShapeColor;
fixed4 _BackgroundColor;
```

顏色和距離可以很直觀想到上色的方法，只需要簡單的判斷距離大於還是小於 0 ，判斷像素是在形狀的內部側還是外側，以此來選擇顏色。我們可以透過簡單的插值函數來達到目的，只需要將距離作為插值的權重來選擇顏色。

```csharp
fixed4 colorDistance(float distance)
{
    return lerp(_ShapeColor, _BackgroundColor, distance);
}
```

```csharp
float distance = SDF_circle(uv, 5);
distance = ceil(distance);

fixed4 color = colorDistance(distance);
return color;
```

{{< pathImage "colored_0.jpg" "50%" >}}

呈現這種奇怪結果的原因是我們直接將距離作為 lerp 的權重值，由於距離值的範圍會超出 0 和 1 之間，再加上無條件進位而導致插值計算出奇怪的結果

所以我們只需要將權重限制在合理的範圍內即可，可以使用限制函數 saturate 將範圍限制在 0 ~ 1 之間

```csharp
return lerp(_ShapeColor, _BackgroundColor, saturate(distance));
```

{{< pathImage "colored_1.jpg" "50%" >}}

這篇是基本的上色方法，後面將不再重複
