---
title: "第七章 形狀組合"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: false
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
order: 7
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

## 距離場組合

目前為止我們都只用到一個距離場，為了讓事情更有趣我們可以多加一個距離場? 不，我們能做到的可遠遠不止，教學現在帶你們接觸距離場的第二個特性 - 組合

但首先回到圓形開始，為了方便測試我們在著色器中添加一項滑鼠座標的變數。

```csharp
//shaderlab
float2 _MousePosition;
```

接著我們用滑鼠位置建立一個圓形距離場，記得要經過標準化空間的換算。

```csharp
//shaderlab
float2 mousePos = _MousePosition * 10 * 2;
uv = translate(uv, mousePos);
float distance = SDF_circle(uv, 3);
```

最後，為了取得滑鼠位置我們需要 C# 腳本，取得位置後傳入著色器。

```csharp
//C#
void Update()
{
    Vector4 mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
    material.SetVector("_MousePosition", mousePos);
}
```

{{< pathImage "mouse.gif" >}}

這部分設置後面會使用 "游標距離場" 省略。

### 疊加

第一個問題是，要怎麼畫出一個以上的距離場 ? 讓我們複習一下距離和形狀的相對意義，在形狀內部時，距離會小於 0 ，反之外部會大於 0。

現在假設我們有兩個距離場，那麼各部份的距離會像這樣。

{{< pathImage "add_0.jpg" "50%" >}}

若我們要畫出兩個圖形，只要判斷點是不是在其中一個距離場內，也就是其中一個距離小於 0 時就對像素進行著色。一樣先使用判斷式來達成效果。

```csharp
float combina_add(float a, float b)
{
    if(a < 0 || b < 0) return 0;
    else return 1;
}
```

```csharp
float distance = combina_add(SDF_circle(uv, 3, mousePos), SDF_Rect(uv, 2, 1 , 0));
return distance;
```

{{< pathImage "add_1.gif" "50%" >}}

雖然判斷式能達到效果，但在著色器的世界中我們有更優美的作法。繪製距離場持，不必真的判斷是不是 "在任意距離場內"，因為距離是一個數值，所以我們只要取距離值小的那個來用就好。

取小值可以透過 min 函數來達成。

```csharp
float combina_add(float a, float b)
{
    return min(a, b);
}
```

{{< pathImage "add_2.gif" "50%" >}}

### 交界

如果說疊加是 or，那麼取交界是甚麼呢 ? 沒錯就是 and。而 and 的效果可以透過函數 max 來達成，因為當兩個距離都小於 0 時，max 的結果才會小於 0。

```csharp
float combina_mask(float a, float b)
{
    return max(a, b);
}
```

{{< pathImage "junction.gif" "50%" >}}

### 剔除

or 和 and 都有了，最後我們要 !and，也就是將距離場 A 剔除掉距離場 B 的重疊部分，而剔除換句話來說就是與距離場 "之外" 的部分取交界，我們可以將距離反轉來打成目的。

首先將距離場內外反轉，再用 max 取交界就能達到剔除效果。我們可以透過將距離乘以 -1 來反轉內外。

```csharp
float combina_cull(float a, float cull)
{
    return max(a, -cull);
}
```

{{< pathImage "cull.gif" "50%" >}}

### 過度

距離場是個回傳一為數值函數，所以也可以透過差值讓兩個距離場產生過度。

```csharp
float combina_transition(float a, float b, float w)
{
    return lerp(a, b, w);
}
```

{{< pathImage "transfor.jpg" "50%" >}}

### 融合

和疊加差不多，但是透過 smooth min 函數來做出邊界融合的效果。

{{< pathImage "melt_0.jpg" "50%" >}}

計算式如下，但由於過於原理複雜我其實也沒搞很懂...參考資料補充在下方，總之有效 :D

```csharp
float combina_fusion(float a, float b, float k)
{
    k = saturate(k);
    float h = max(k - abs(a- b), 0) / k;
    return min(a, b) - pow(h, 3) * 1 / 6;
}
```

{{< pathImage "melt_1.gif" "50%" >}}

有了這些基礎的組合工具，我們就能繪製出更多形狀了，例如圓環。

```csharp
float SDF_Ring(float2 uv, float radius, float thickness)
{
    float thick = thickness * 0.5;
    float outside = SDF_circle(uv, radius + thick);
    float inSide = SDF_circle(uv, radius - thick);
    return combina_cull(outside, inSide);
}
```

{{< pathImage "ring.jpg" "50%" >}}

當然組合的數量並不局限於兩個，可以有多個不同距離場進行組合，但要注意組合是透過疊加上去的，而疊加順序將影響最終結果。

舉個簡單的例子 - 方形加大圓最後再替除小圓

```csharp
float distance = SDF_Rect(uv, 1, 2, 30);
distance = combina_add(distance, SDF_circle(uv, 2, float2(1, 0)));
distance = combina_cull(distance, SDF_circle(uv, 1, float2(3, 1.5)));
```

{{< pathImage "order_0.jpg" "50%" >}}

方形先剃除小圓再加上大圓

```csharp
float distance = SDF_Rect(uv, 1, 2, 30);
distance = combina_cull(distance, SDF_circle(uv, 1, float2(3, 1.5)));
distance = combina_add(distance, SDF_circle(uv, 2, float2(1, 0)));
```

{{< pathImage "order_1.jpg" "50%" >}}

如果你想隔離疊加效果就得用不同變數儲存距離值，這部分就不作範例了。

### 章節題目

請用此篇教到的部分，組合出類似圖形，可以先用兩個以上變數儲存距離，最後再組合。

提示 : 圓形加矩形總共用到九個距離場

{{< pathImage "quest.jpg" "50%" >}}

### 參考資料

[Soft maximum for convex optimization](http://www.johndcook.com/blog/2010/01/13/soft-maximum/)
