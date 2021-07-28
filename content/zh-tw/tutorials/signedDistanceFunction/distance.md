---
title: "第二章 距離計算"
date: 2021-04-28T14:52:15+08:00
lastmod: 2021-04-28T14:52:15+08:00
draft: false
keywords: []
description: ""
tags: [SDF]
category: tutorial
author: ""
order: 2
similarpagelink: byorder
listable: true

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: true
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

## 距離場的真實意義

一開始我們有提到距離場是能夠描述空間中任意位置對於虛擬形狀最接近表面的距離的函數，聽起來有點繞口，所以直接用實例解說它的意思吧。

距離，向量的長度，如何計算向量的長度相信各位在國中就有學過了 : `a^2 + b^2 = c^2` ，其中 a 和 b 就是向量的 x y，而 c 就是我們需要的長度，首先讓我們畫出任意點距離中心的長度。

```csharp
fixed4 col = length(uv);
```

出現了一個由深到淺的圓型，從空間的中心開始長度為 0，越往外的長度越長，直到超出 1 變成完整的白色，最基本的距提場函數完成了，它描述了"任意點到空間中心的距離"。

{{< pathImage distance_1.jpg "50%" >}}

雖然看起來是圓型，但這不是圓型的距離場 - 而是一個 "點" 的，因為它沒有半徑，那我們要如何算出和圓型表面的距離 ? 答案是用減的。

```csharp
float SDF_circle(float2 uv, float radius)
{
    return length(uv) - radius;
}
```

```csharp
fixed4 col = SDF_circle(uv, 5);
```

{{< pathImage distance_2.jpg "50%" >}}

為什麼有效呢，請聽我娓娓道來~

以半徑 5 為例，原本在空間中距離為 5 的地方，它的距離值被減去 5 於是變成了 0，也就是圓型的表面，而在圓內部的距離會小於 0，圓外部則大於 0。

{{< pathImage distance_3.jpg "50%" >}}

讓我們回到一開始，距離場是能夠描述 "空間中任意位置對於虛擬形狀最接近表面的距離" 的函數，當你們消化完上面的東時，就能夠理解這段描述的意思了。

現在畫出來的圓型表面還有一段過度，這段過度是 0 到 1 之間的浮點數造成的，如果我們不想要這段過度只需要將距離值 "無條件進位"。

```csharp
fixed4 col = ceil(SDF_circle(uv, 5));
```

{{< pathImage distance_4.jpg "50%" >}}

恭喜，你的第一個距離場函數完成了
