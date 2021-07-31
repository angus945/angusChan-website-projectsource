---
title: "十六章 進階繪圖"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: true
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
order: 16
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

## 進階繪圖

更進階的圖形繪製方法，透過距離場邊緣的過度範圍來作出修改。

### 光暈

畫出了精美的圖形和富有層次感的動畫之後，我們還能做什麼讓距離場看起來更酷 ? 還用說，當然是添加一個發光效果啊 !

而且距離場的繪製特性讓我們能很方便的給圖形添加光暈效果，不需要複雜的額外計算，為了解說其原理讓我們先回到一開始的矩形，但這次不將距離值無條件進位。

```csharp
float distance = SDF_Rect(uv, float2(4, 2));
return 1 - distance;
```

可以看到在圖形的外圍有一個短暫的過度，那是距離在 0 ~ 1 時所產生的。

{{< pathImage "halo_0.jpg" "50%" >}}

我們可以利用這段過度的漸層，只要將他的強度弱化看起來就會像微微散發的光暈。

首先我們將要做為光暈的部分獨立出來，可以使用剃除的算法來達到，將完整的距離值剃除掉進行進位後距離值，就可以取的邊緣過度的部分了。

```csharp
float halo = max(distance, 1 - ceil(distance)); 
return 1 - halo;
```

{{< pathImage "halo_1.jpg" "50%" >}}

接下來我們要將這段光暈的強度減弱，為了做出非線性的弱化需要使用 pow 函數。

```csharp
float halo = max(distance, 1 - ceil(distance)); 
**halo = pow(halo, 0.1);**
return 1 - halo;
```

{{< pathImage "halo_2.jpg" "50%" >}}

最後只需要將他添加回原本的距離場上，進行上色就完成了。

```csharp
float halo = max(distance, 1 - ceil(distance)); 
halo = pow(halo, 0.1);

**distance = ceil(distance);**
**distance = min(distance, halo);**
**fixed4 color = colorDistance(distance);**
**return color;**
```

{{< pathImage "halo_3.jpg" "50%" >}}

### 膨脹

目前為止的多邊形距離場都是菱角分明的，如果想要讓形狀的頂點別那麼尖銳怎麼辦 ? 同樣，距離場特性能夠簡單的幫助我們做到。

再次回到一開始的形狀，我們能夠明顯的看到在原本形狀之外，因為距離計算的原因過度部分的頂點是個圓角。

{{< pathImage "swell_0.jpg" "50%" >}}

只是過渡的部分會被後續無條件進位給剃除掉，所以我們在最終圖形中看不到，如果要將這部分也加入圖案的話，我們可以讓形狀膨脹。

只要在單個形狀計算完成後，再次減去膨脹值就可以做到了。

```csharp
float distance = SDF_Rect(uv, float2(4, 2)) - 1;
```

{{< pathImage "swell_1.jpg" "50%" >}}

可以看到中間的主形狀因此獲得圓角了，只要再進行進位剃除後就大功告成。

```csharp
distance = ceil(distance);
```

{{< pathImage "swell_2.jpg" "50%" >}}

### 輪廓線

最後的進階繪圖，為圖形添加輪廓線條，這部份將透過閥值函數來達成，首先添加外輪廓顏色和厚度的屬性。

```csharp
_OutLineColor("OutLineColor", Color) = (0,0,0,0)
_OutLineThickness("OutThickness", Range(0, 0.5)) = 0.2
```

```csharp
fixed4 _OutLineColor;
float _OutLineThickness;
```

回到一開始的地方，但是這次使用 step 將過度變為硬邊。

```csharp
float distance = SDF_Rect(uv, float2(4, 2));

float outline = max(distance, 1 - ceil(distance)); 
outline = step(_OutLineThickness, outline);

return 1 - outline;
```

{{< pathImage "outline_0.jpg" "50%" >}}

最後我們將外輪廓上色後，添加回原本的形狀就有不同顏色的輪廓線了。

```csharp
fixed4 color = colorDistance(ceil(distance));
color = lerp(color, _OutLineColor, 1 - outline);
return color;
```

{{< pathImage "outline_1.jpg" "50%" >}}

以上就是透過形狀邊緣的過度進行操作的教學，不過使用這種作法時有幾個點要注意。

+ 我們是透過距離場邊緣的漸變來做出操作，所以效果的大小不受圖形本身的大小引響，而是固定的距離。因此一個大小為零的 "點" 也會產生效果。如果距離場有動畫的話，會需要搭配動畫開關或減弱這些修改，比免出現多餘的色點。

+ 反鋸齒的算法因為回傳距離值經過修改，所以會導致操作無效，所以進行這類操作以前要先將數值隔離。
