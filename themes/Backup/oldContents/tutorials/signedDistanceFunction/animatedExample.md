---
title: "十二章 動畫範例"
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
order: 12
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

## 動畫範例

上一章教學教了兩種播放動畫的方法，在這章中我們將實際製作幾項不同的動態效果。

### 旋轉動畫

圓環是個很好舉例的形狀，就讓我們從圓環開始吧。

```csharp
float distance = SDF_Ring(uv, 8, .2);
```

{{< pathImage "rotate_0.jpg" "50%" >}}

首先回到以前的弧度計算，我們使用他製作一個弧度過濾器。

```csharp
float filter_round(float2 uv, float filter)
{
    uv = normalize(uv);
    float radian = atan2(uv.y, uv.x);
    radian = lerp(radian, PI2 + radian, step(radian, 0));

    return (radian / PI2) - lerp(-0.05, 1.05, filter);
}
```

{{< pathImage "rotate_1.gif" "50%" >}}

只需要將他作為遮罩套用在圖形上，就能夠完成讓圓環逐漸出現的動畫。

```csharp
float distance = SDF_Ring(uv, 8, .2);
distance = combina_mask(distance, filter_round(uv, _Anim));
distance = ceil(distance);
```

{{< pathImage "rotate_2.gif" "50%" >}}

當然，一個距離場也不被限制只有一種動態，我們可以在出現的時候也添加旋轉動態。

```csharp
uv = rotate(uv, lerp(682, 0, _Anim));
float distance = SDF_Ring(uv, 8, .2);
distance = combina_mask(distance, filter_round(uv, _Anim));
```

{{< pathImage "rotate_3.gif" "50%" >}}

### 位移動畫

透過動畫改變距離場的位置，可以搭配貝茲曲線做出弧形位移。

```csharp
uv = translate(uv, lerp
(
    lerp(float2(3, -4), float2(-8, 1), _Anim), 
    lerp(float2(-8, 1), float2(3, 4), _Anim), 
    _Anim)
);
float distance = SDF_circle(uv, 1);
```

{{< pathImage "moving.gif" "50%" >}}

### 參數動畫

修改距離場參數的動畫，上個章節最後有提到我們實際上能夠用動畫控制任何距離場使用到的參數，這裡舉幾個例子，首先是矩形的高度。

```csharp
float distance = SDF_Rect(uv, float2(2, lerp(0, 4, _Anim)));
```

{{< pathImage "value_0.gif" "50%" >}}

或是扇形的弧度也行。

```csharp
float distance = SDF_Sector(uv, 5, lerp(0, 60, _Anim));
```

{{< pathImage "value_1.gif" "50%" >}}

### 漸變動畫

或是透過組合的漸變函數，來達成不同形狀轉換動畫。

```csharp
float distance = combina_transition(SDF_circle(uv, 3), SDF_Rect(uv, 4), _Anim);
```

{{< pathImage "transition.gif" "50%" >}}

### 空間操作

透過動畫修改距離場參數就很了不起了嗎 ? 不，我們能夠做到的還更多，動畫當然也可以套用在空間操作上，無論是隔離給特定距離場的操作，抑或是全局有效的效果。

我們以放射平鋪為例，透過動畫改變分割數量。

```csharp
uv = rotate(uv, lerp(60, 0, _Anim));
uv = radialRadius(uv, lerp(3, 20, _Anim), 8);
float distance = SDF_circle(uv, .1);
```

{{< pathImage "spaceManipulation_0.gif" "50%" >}}

```csharp
uv = scale(uv, lerp(0, 1, _Anim));
```

如果在全局縮放添加動畫的話，可以讓圖形有放大的出場效果。

{{< pathImage "spaceManipulation_1.gif" "50%" >}}

### 震盪動畫

也可以使用被動動畫來操控距離場參數，透過簡單的 sin 波達成來回的震盪旋轉，就能有不同的視覺感受。

```csharp
uv = rotate(uv, sin(_Time.y * 0.5) * 30);
uv = radialRadius(uv, 30, 8);
float distance = SDF_Rect(uv, float2(.1, .5));
```

{{< pathImage "wave.gif" "50%" >}}

以上簡單的提供了幾種動畫的範例，請各位運用這些思路自由發揮吧 :D
