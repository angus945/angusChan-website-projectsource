---
title: "第一章 初步理解"
date: 2021-04-27T21:34:48+08:00
lastmod: 2021-04-27T21:34:48+08:00
draft: false
keywords: []
description: ""
tags: [SDF]
category: tutorial
author: ""
order: 1
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

標準化空間，大小為 1

## 對距離場原理的初步理解

在第一次接觸距離場時，可以先理解成一個 "判斷空間中任意位置在不在虛擬形狀內" 的函數。

我們從一個圓形開始，點和中心的距離如果小於圓的半徑代表在圓內，很好理解吧。

```csharp
float inCircle(float2 uv, float radius)
{
    if (length(uv) < radius) return 0;
    else return 1;
}
fixed4 frag (v2f i) : SV_Target
{
    float2 uv = spaceNormalize(i.uv, 1);
    
    fixed4 col = inCircle(uv, 1);
    return col;
}
```

結果如下，當距離小於半徑時畫黑色，反之白色

{{< pathImage preliminary_0.jpg "50%" >}}

### 小題目

請試著用相同的方法，寫出一個判斷任意點在不在矩形內部的函數

```csharp
float inSquare(float2 uv, float2 size);
fixed4 col = inSquare(uv, float2(1, 1.5));
```

{{< pathImage preliminary_1.jpg "50%" >}}

初步理解就到這裡，接下來會帶你們了解距離場的真正意義
