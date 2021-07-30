---
title: "十三章 動畫緩動"
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
order: 13
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

標準化空間，大小為 10、距離場上色

## 緩動動畫

目前為止我們已經能夠播放距離場動畫了，但播放起來種覺得還少什麼 ? 阿，物理慣性 !

由於整個播放的速度都是線性的，導致動畫看起來相當機械而不自然，為了讓動畫看起來更絲滑順暢，我們可以為播放的曲線添加緩動 Easing。

### easeOutCubic

{{< pathImage "easeOutCubic_0.jpg" >}}

緩動有相當多種類型，我們先從 easeOutCubic 開始，這是一種快進放緩的曲線類性。

```csharp
float ease_easeOutCubic(float t, float power)
{
    return 1 - pow(1 - t, power);
}
```

回到之前的旋轉圓環，將原本線性的動畫進度輸入進去，變成有緩動效果的數值。

```csharp
float t = ease_easeOutCubic(_Anim, 3);

uv = rotate(uv, lerp(682, 0, t));
float distance = SDF_Ring(uv, 8, .2);
distance = combina_mask(distance, filter_round(uv, t));
```

兩者花費相同的時間播放玩動畫，左側是添加緩動後的，而右側是原本的線性播放，放在一起對照就能明顯感覺出差異了，整個動畫的質感提升許多。

{{< pathImage "easeOutCubic_1.gif" "50%" >}}

### easeOutBack

接下來使用另一種曲線函數 easeOutBack，效果是快進後會稍微超出範圍在恢復。

{{< pathImage "easeOutBack_0.jpg" >}}

```csharp
float ease_esaeOutBack(float t, float power)
{
    const float c1 = 1.70158;
    const float c2 = 2.70158;

    return 1 + c2 * pow(t - 1, power) + c1 * pow(t - 1, 2);                
}
```

同樣對輸入的動畫進度進行修改，這次則是用在距離場縮放上。

```csharp
float t = ease_esaeOutBack(_Anim, 3);
uv = scale(uv, lerp(0, 1, t));
float distance = SDF_Ring(uv, 8, .2);
```

{{< pathImage "easeOutBack_1.gif" "50%" >}}

當然動畫的緩動也不只侷限於使用一種，可以在不同動畫間添加各自的緩動來增加層次感。

```csharp
uv = scale(uv, lerp(0, 1, ease_esaeOutBack(_Anim, 3)));

float ringT = ease_easeOutCubic(_Anim, 3);
float2 ringUV = rotate(uv, lerp(-360, 60, ringT));
float distance = SDF_Ring(ringUV, 8, .2);
distance = combina_mask(distance, filter_round(ringUV, ringT));

float angle = lerp(-60, 60, ease_esaeOutBack(_Anim, 3));
float degree = lerp(0, 30, ease_easeOutCubic(_Anim, 3));
distance = combina_add(distance, SDF_RingSector(uv, 8, 1, degree, angle));
```

{{< pathImage "example.gif" "50%" >}}

此章節提供了讓動畫更流暢的方法，如果想要嘗試搭配更多種緩動算法可以到 [easings.net](https://easings.net/) 找參考。
