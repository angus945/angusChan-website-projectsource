---
title: "第五章 更多形狀"
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
order: 5
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

標準化空間，大小為 10、距離場上色、距離環

## 矩形和線段

從開始到現在我們只有畫出圓形，為了讓事情有趣起來我們需要更多形狀。

### 線段

如果我們想畫出由兩個點連接而成的線段，情況就開始複雜了，要如何計算點到線段的距離 ?

首先我們可以將一條線段拆解為三個部分，線頭、線段、線尾，並判斷點最靠近的是線條的哪個部分。只要透過點積 dot product 進行投影，就能取的需要的數值。

透過兩點相減，取的線段指向的向量後，將要計算的位置投影至線段上。如此一來，我們就能透過投影結果，判斷出位置最接近的是線段的哪一部分。

{{< pathImage "projection_0.jpg" "50%" >}}

首先我們取得線段朝向的方向以及它的長度，用來後續計算。

```csharp
float SDF_line(float2 uv, float2 pointA, float2 pointB, float thickness)
{
    float2 lineDirection = normalize(pointB - pointA);
    float lineLength = length(pointB - pointA);           
}
```

再來將輸入的點投影至方向的向量上就能夠取得長度參考。

```csharp
float projectionToLine = dot(uv - pointA, lineDirection);
```

最後我們使用判斷式檢查長度，如果小於 0 就代表點離起點最近，反之大於線段長度就代表離線尾最近。距離線兩端的距離就和圓形計算一樣，記得要減去厚度。

```csharp
if(projectionToLine < 0)
{
    return length(uv - pointA) - thickness;
}
else if(projectionToLine > lineLength)
{
    return length(uv - pointB) - thickness;
}
else return 0;
```

{{< pathImage "line_0.jpg" "50%" >}}

線的兩端有了，接者我們需要將它連接起來，所以得計算黑色範圍的距離。點到線中段的距離計算也很簡單，同樣只需要使用投影的方法，但這次是投影到線段的法向量上。

{{< pathImage "projection_1.jpg" "50%" >}}

使用外積 corss 函數取得線段朝向的法向量，並將點投影至法向量上的結果就是我們要的距離。不過這裡要注意的是，線段另一邊的投影結果會是負的，但我們不需要負的距離所以得進行絕對值。最後減去線段厚度就大功告成了。

```csharp
else 
{
    float2 lineNormal = cross(float3(lineDirection.xy, 0), float3(0, 0, 1));
    return abs(dot(uv - pointA, lineNormal)) - thickness;
}
```

{{< pathImage "line_1.jpg" "50%" >}}

線段還要注意的是，線頭線尾如果在同一點上的話，會導致無法預料的錯誤 (除以 0)，我這裡沒有添加防呆計算，所以使用時要注意。

### 矩形

矩形的距離場，如果你們有做出初步理解的題目的話，那作法大概是 uv.x > -size.x * 0.5 &&...，進行四次判斷檢查位置是不是在矩形內部。

而教學這裡即將讓你們接觸的就是距離場的第一個特性 - 空間操作性，一個落在空間中心的矩形，他會被四等分並平均分佈在四個象限中，意思是矩形完全對稱於座標軸。

距離場中我們不在乎點的真實位置，只在乎它相對於形狀最接近表面的距離，這代表我們不必真的在四個象限中進行計算，什麼意思呢 ? 請看下面的示意圖

{{< pathImage "abs.jpg" "50%" >}}

我們可以使用絕對值將落在其他三個象限的位置全部映射到第一象限，這樣一來我們只需要在第一象限計算距離就好。

使用 abs 函數將輸入絕對值，並減去矩形大小，但兩個邊各自的的長度不同，所以最後要再使用 max 函數取得最近邊的距離。

```csharp
float SDF_Rect(float2 uv, float2 size)
{
    float2 dist = abs(uv) - size;
    return max(dist.x, dist.y);                
}
```

{{< pathImage "rect_0.jpg" "50%" >}}

於是矩形的距離場也大功告成 ?

不對，聰明的你們應該能看出問題，雖然矩形本身沒問題，但距離環告訴我們斜角的距離計算有誤。

{{< pathImage "rect_1.jpg" "50%" >}}

### 章節題目

請試寫出正確的矩形距離場，提示 : 和線段一樣分成三等份。

{{< pathImage "rect_2.jpg" "50%" >}}
